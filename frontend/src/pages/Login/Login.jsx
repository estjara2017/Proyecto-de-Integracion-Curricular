import { useState, useEffect } from 'react'
import styles from './Login.module.css'
import Button from '../../components/Button/Button'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo1.png' 
import Navbar from '../../components/Navbar/Navbar'
import { useAuth } from '../../context/AuthContext' // <-- Hook del contexto
import { usuarioService } from '../../services/usuarioService' // <-- Peticiones API

function Login({ embedded = false }) {
  const navigate = useNavigate()
  const { loginContext } = useAuth() // <-- Extraemos la función global del contexto
  
  const [paso, setPaso] = useState(1) 
  const [mostrarAlerta, setMostrarAlerta] = useState(false)
  const [correo, setCorreo] = useState('') // <-- Guardamos el correo para el Paso 2
  const [inputValue, setInputValue] = useState('') // Código OTP o Correo temporalmente

  useEffect(() => {
    if (mostrarAlerta) {
      const timer = setTimeout(() => {
        setMostrarAlerta(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [mostrarAlerta])

  // Lógica de Envío Real integrada con el Backend y el Contexto
  // Dentro de tu Login.jsx actual, cambia solo la función manejarEnvio:

const manejarEnvio = async (e) => {
  e.preventDefault();
  if (paso === 1) {
    try {
      await usuarioService.solicitarOtp(inputValue); // Petición real al backend
      setCorreo(inputValue);
      setMostrarAlerta(true);
      setPaso(2);
      setInputValue(''); 
    } catch (error) {
      alert(error.message || 'Error al enviar el código');
    }
  } else {
    try {
      // Petición real para verificar el código OTP
      const respuesta = await usuarioService.verificarOtp(correo, inputValue);
      
      // Guardamos la información real en el contexto global
      loginContext(respuesta.usuario, respuesta.token);
      
      // Redirección a tus rutas exactas basadas en el rol del negocio
      if (respuesta.usuario.rol === 'admin') {
        navigate('/dashboardAdmin');
      } else {
        navigate('/dashboardClient'); // Tu ruta del panel de cliente
      }
    } catch (error) {
      alert(error.message || 'Código incorrecto');
    }
  }
}

  const manejarBotonSecundario = () => {
    if (paso === 2) {
      setPaso(1)
      setMostrarAlerta(false)
      setInputValue(correo) // Le devolvemos el correo que digitó originalmente por comodidad
    } else {
      navigate('/')
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {!embedded && <Navbar />}

      <div className={styles.container}>
        {mostrarAlerta && (
          <div className={styles.alertContainer}>
            <div className={styles.alert}>
              Se ha enviado un código OTP al correo para verificar. Por favor, ingréselo.
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
            <h2>{paso === 1 ? 'Iniciar Sesión' : 'Ingresa el código'}</h2>

            {paso === 1 ? (
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className={styles.input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required 
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
                title="Por favor, ingresa un correo válido"
              />
            ) : (
              <input 
                type="text" 
                placeholder="Código OTP" 
                className={styles.input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
  )
}

export default Login