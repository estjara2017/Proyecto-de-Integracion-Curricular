import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../../components/Button/Button';
import logo from '../../assets/logo1.png';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { usuarioService } from '../../services/usuarioService';

function Login({ embedded = false }) {
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const [paso, setPaso] = useState(1);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [correo, setCorreo] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!mostrarAlerta) return undefined;

    const timer = setTimeout(() => {
      setMostrarAlerta(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [mostrarAlerta]);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (paso === 1) {
      try {
        await usuarioService.solicitarOtp(inputValue);
        setCorreo(inputValue);
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
      loginContext(respuesta.usuario, respuesta.token);

      const dashboardPath = respuesta.usuario.rol === 'admin' ? '/dashboardAdmin' : '/dashboardClient';
      navigate(dashboardPath, { replace: true });
    } catch (error) {
      alert(error.message || 'Codigo incorrecto');
    }
  };

  const manejarBotonSecundario = () => {
    if (paso === 2) {
      setPaso(1);
      setMostrarAlerta(false);
      setInputValue(correo);
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
