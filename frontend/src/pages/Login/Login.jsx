import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../../components/Button/Button';
import logo from '../../assets/logo1.png';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { usuarioService } from '../../services/usuarioService';

const OTP_PENDING_STORAGE_KEY = 'elemental_otp_pending';
const OTP_VALIDITY_MS = 5 * 60 * 1000;

const obtenerOtpPendiente = () => {
  try {
    const valorGuardado = sessionStorage.getItem(OTP_PENDING_STORAGE_KEY);
    if (!valorGuardado) return null;

    const otpPendiente = JSON.parse(valorGuardado);
    const esValido = typeof otpPendiente?.correo === 'string'
      && otpPendiente.correo.trim()
      && Number.isFinite(otpPendiente.expiraEn)
      && otpPendiente.expiraEn > Date.now();

    if (esValido) return otpPendiente;

    sessionStorage.removeItem(OTP_PENDING_STORAGE_KEY);
  } catch {
    try {
      sessionStorage.removeItem(OTP_PENDING_STORAGE_KEY);
    } catch {
      // El login sigue funcionando aunque el navegador bloquee sessionStorage.
    }
  }

  return null;
};

const guardarOtpPendiente = (correo, expiraEn) => {
  try {
    sessionStorage.setItem(OTP_PENDING_STORAGE_KEY, JSON.stringify({ correo, expiraEn }));
  } catch {
    // El estado de React mantiene operativo el flujo mientras la pagina siga abierta.
  }
};

const eliminarOtpPendiente = () => {
  try {
    sessionStorage.removeItem(OTP_PENDING_STORAGE_KEY);
  } catch {
    // No es necesario interrumpir el flujo si el almacenamiento no esta disponible.
  }
};

function Login({ embedded = false }) {
  const navigate = useNavigate();
  const { loginContext } = useAuth();
  const [otpInicial] = useState(obtenerOtpPendiente);

  const [paso, setPaso] = useState(otpInicial ? 2 : 1);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [correo, setCorreo] = useState(otpInicial?.correo || '');
  const [inputValue, setInputValue] = useState('');
  const [otpExpiraEn, setOtpExpiraEn] = useState(otpInicial?.expiraEn || null);

  useEffect(() => {
    if (!mostrarAlerta) return undefined;

    const timer = setTimeout(() => {
      setMostrarAlerta(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [mostrarAlerta]);

  useEffect(() => {
    if (paso !== 2 || !otpExpiraEn) return undefined;

    const tiempoRestante = otpExpiraEn - Date.now();
    const reiniciarFlujo = () => {
      eliminarOtpPendiente();
      setPaso(1);
      setCorreo('');
      setInputValue('');
      setOtpExpiraEn(null);
      setMostrarAlerta(false);
    };

    if (tiempoRestante <= 0) {
      reiniciarFlujo();
      return undefined;
    }

    const timer = setTimeout(reiniciarFlujo, tiempoRestante);
    return () => clearTimeout(timer);
  }, [otpExpiraEn, paso]);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (paso === 1) {
      try {
        await usuarioService.solicitarOtp(inputValue);
        const correoNormalizado = inputValue.trim().toLowerCase();
        const expiraEn = Date.now() + OTP_VALIDITY_MS;

        guardarOtpPendiente(correoNormalizado, expiraEn);
        setCorreo(correoNormalizado);
        setOtpExpiraEn(expiraEn);
        setMostrarAlerta(true);
        setPaso(2);
        setInputValue('');
      } catch (error) {
        alert(error.message || 'Error al enviar el codigo');
      }

      return;
    }

    try {
      const respuesta = await usuarioService.verificarOtp(correo, inputValue);
      eliminarOtpPendiente();
      loginContext(respuesta.usuario, respuesta.token);

      const dashboardPath = respuesta.usuario.rol === 'admin' ? '/dashboardAdmin' : '/dashboardClient';
      navigate(dashboardPath, { replace: true });
    } catch (error) {
      alert(error.message || 'Codigo incorrecto');
    }
  };

  const manejarBotonSecundario = () => {
    if (paso === 2) {
      eliminarOtpPendiente();
      setPaso(1);
      setMostrarAlerta(false);
      setInputValue(correo);
      setOtpExpiraEn(null);
    } else {
      navigate('/');
    }
  };

  return (
    <div className={`${styles.pageWrapper} ${embedded ? styles.embeddedWrapper : ''}`}>
      {!embedded && <Navbar />}

      <div className={`${styles.container} ${embedded ? styles.embeddedContainer : ''}`}>
        {mostrarAlerta && (
          <div className={styles.alertContainer}>
            <div className={styles.alert}>
              Se ha enviado un codigo OTP al correo para verificar. Por favor, ingreselo.
            </div>
          </div>
        )}

        {!embedded && (
          <div className={styles.left}>
            <img src={logo} alt="Logo" className={styles.logo} />
          </div>
        )}

        <div className={styles.right || styles.formCard}>
          <form className={styles.formCard} onSubmit={manejarEnvio}>
            <h2>{paso === 1 ? 'Iniciar Sesion' : 'Ingresa el codigo'}</h2>

            {paso === 1 ? (
              <input
                type="email"
                placeholder="Correo electronico"
                className={styles.input}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
                title="Por favor, ingresa un correo valido"
              />
            ) : (
              <input
                type="text"
                placeholder="Codigo OTP"
                className={styles.input}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                maxLength={6}
                required
              />
            )}

            <div className={styles.buttons}>
              <Button variant="primary" type="submit">
                Ingresar
              </Button>
              <Button variant="secondary" onClick={manejarBotonSecundario} type="button">
                {paso === 1 ? 'Cancelar' : 'Regresar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
