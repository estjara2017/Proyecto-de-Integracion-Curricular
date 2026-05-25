import { useState, useEffect } from 'react'
import styles from './Login.module.css'
import Button from '../../components/Button/Button'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo1.png' 

function Login() {
  const navigate = useNavigate()
  
  // Controla el paso actual: 1 para Correo, 2 para Código OTP
  const [paso, setPaso] = useState(1) 
  // Controla la visibilidad de la alerta superior
  const [mostrarAlerta, setMostrarAlerta] = useState(false)

  // Oculta automáticamente la alerta a los 6 segundos
  useEffect(() => {
    if (mostrarAlerta) {
      const timer = setTimeout(() => {
        setMostrarAlerta(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [mostrarAlerta])

  const manejarEnvio = (e) => {
    e.preventDefault()

    if (paso === 1) {
      setMostrarAlerta(true)
      setPaso(2)
    } else {
      // Envío del código OTP -> Redirige directamente al dashboard
      navigate('/dashboard')
    }
  }

  // Maneja la acción del botón Cancelar / Regresar
  const manejarBotonSecundario = () => {
    if (paso === 2) {
      // Si está en el OTP, regresa al paso de ingresar correo
      setPaso(1)
      setMostrarAlerta(false) // Limpia la alerta al regresar si seguía activa
    } else {
      // Si está en el paso 1, cancela y va a la raíz
      navigate('/')
    }
  }

  return (
    <div className={styles.container}>
      
      {/* ALERTA: Estructurada para centrarse en la parte superior */}
      {mostrarAlerta && (
        <div className={styles.alertContainer}>
          <div className={styles.alert}>
            Se ha enviado un código OTP al correo para verificar. Por favor, ingréselo.
          </div>
        </div>
      )}
      
      {/* Lado izquierdo: Logotipo */}
      <div className={styles.left}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>

      {/* Lado derecho: Tarjeta de Formulario */}
      <div className={styles.right}>
        <form className={styles.formCard} onSubmit={manejarEnvio}>
          
          <h2>{paso === 1 ? 'Iniciar Sesión' : 'Ingresa el código'}</h2>

          {/* El input cambia y se valida según el paso actual */}
          {paso === 1 ? (
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              className={styles.input}
              required // Obliga a llenar el campo
              
              // REGLA DE VALIDACIÓN REFORZADA:
              // [a-z0-9._%+-]+ -> Nombre de usuario antes del @
              // @[a-z0-9.-]+ -> El símbolo @ seguido del nombre del servidor (ej: gmail, yahoo)
              // \.[a-z]{2,} -> Obliga a poner un punto '.' y al menos 2 letras al final (ej: .com, .ec)
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
              
              // Mensaje personalizado que le saldrá al usuario si olvida poner el .com
              title="Por favor, ingresa un correo válido que incluya una extensión de dominio (ejemplo: usuario@yahoo.com o usuario@gmail.com)"
            />
          ) : (
            <input 
              type="text" 
              placeholder="Código OTP" 
              className={styles.input}
              maxLength={6}
              required
            />
          )}

          {/* Botones Interactivos */}
          <div className={styles.buttons}>
            <Button 
              variant="primary"
              type="submit"
            >
              Ingresar
            </Button>

            <Button 
              variant="secondary"
              onClick={manejarBotonSecundario}
              type="button"
            >
              {paso === 1 ? 'Cancelar' : 'Regresar'}
            </Button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default Login