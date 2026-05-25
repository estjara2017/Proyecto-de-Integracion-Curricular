import { useState, useEffect } from 'react'
import styles from './Register.module.css'
import Button from '../../components/Button/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/logo1.png'

function FormRegister() {
  const navigate = useNavigate()
  const location = useLocation()

  const alertMessage = location.state?.message
  const [showAlert, setShowAlert] = useState(!!alertMessage)
  
  const [tieneLesion, setTieneLesion] = useState('no')
  const [descripcionLesion, setDescripcionLesion] = useState('')

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showAlert])

  const handleLesionChange = (e) => {
    const value = e.target.value
    setTieneLesion(value)
    if (value === 'no') {
      setDescripcionLesion('') 
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    console.log('Formulario enviado con éxito')
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      
      {showAlert && (
        <div className={styles.planAlert}>
          <span className={styles.alertIcon}>⚠️</span>
          <p>{alertMessage}</p>
        </div>
      )}

      <form className={styles.formCard} onSubmit={handleRegister}>
        <h2>Crear Cuenta</h2>

        <div className={styles.gridFields}>
          
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Nombre completo" 
              className={styles.input}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Cédula / Identificación" 
              className={styles.input}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="tel" 
              placeholder="Teléfono de contacto" 
              className={styles.input}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              className={styles.input}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="number" 
              step="0.1"
              placeholder="Peso actual (kg) - Opcional" 
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="number" 
              step="0.01"
              placeholder="Estatura (m) - Opcional" 
              className={styles.input}
            />
          </div>

          {/* Dirección Principal: Ahora es un campo normal alineado a la izquierda */}
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Dirección principal" 
              className={styles.input}
              required 
            />
          </div>

          {/* Selección Lesiones: Alineado a la derecha junto a la dirección */}
          <div className={styles.inputGroup}>
            <select 
              className={styles.select} 
              value={tieneLesion} 
              onChange={handleLesionChange}
              required
            >
              <option value="no">¿Posee alguna lesión / discapacidad? NO</option>
              <option value="si">¿Posee alguna lesión / discapacidad? SÍ</option>
            </select>
          </div>

          {/* Descripción: Ocupa las dos columnas inferiores de forma limpia */}
          <div className={`${styles.inputGroup} ${styles.fullWidthField}`}>
            <input 
              type="text" 
              placeholder={tieneLesion === 'si' ? "Describa detalladamente la lesión o discapacidad" : "Campo bloqueado (No registra lesión)"} 
              className={`${styles.input} ${tieneLesion === 'no' ? styles.disabledInput : ''}`}
              value={descripcionLesion}
              onChange={(e) => setDescripcionLesion(e.target.value)}
              disabled={tieneLesion === 'no'}
              required={tieneLesion === 'si'} 
            />
          </div>

        </div>

        <div className={styles.buttons}>
          <div className={styles.btnWrapper}>
            <Button 
              variant="secondary" 
              type="button"
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
          </div>
          
          <div className={styles.btnWrapper}>
            <Button 
              variant="primary" 
              type="submit"
            >
              Registrar
            </Button>
          </div>
        </div>
      </form>

      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo Institutional" className={styles.logo} />
      </div>

    </div>
  )
}

export default FormRegister