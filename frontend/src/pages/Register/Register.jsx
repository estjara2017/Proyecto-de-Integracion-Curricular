import styles from './Register.module.css'
import Button from '../../components/Button/Button'
import logo from '../../assets/logo1.png'
import { useRegisterForm } from '../../hooks/useRegisterForm' // Comprueba que la ruta apunte bien a src/hooks

function Register() {
  // 🚀 Asegúrate de incluir setDescripcionLesion aquí en la destructuración:
  const {
    alertMessage,
    showAlert,
    firstName, setFirstName,
    lastName, setLastName,
    idCard, setIdCard,
    phone, setPhone,
    email, setEmail,
    weight, setWeight,
    height, setHeight,
    address, setAddress,
    birthDate, setBirthDate,
    gender, setGender,
    tieneLesion,
    descripcionLesion, setDescripcionLesion, // 👈 ¡Esta era la que faltaba declarar aquí!
    handleLesionChange,
    handleRegister,
    navigate
  } = useRegisterForm()

  return (
    
    <div className={styles.container}>
      
      {/* Lado Izquierdo: Solo el Formulario */}
      <div className={styles.leftSection}>
        <form className={styles.formCard} onSubmit={handleRegister}>
          <h2>Crear Cuenta</h2>

          <div className={styles.gridFields}>
            
            {/* Fila 1 - Columna 1 */}
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Nombre" 
                className={styles.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
            </div>

            {/* Fila 1 - Columna 2 */}
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Apellido" 
                className={styles.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Cédula / Identificación" 
                className={styles.input}
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="tel" 
                placeholder="Teléfono de contacto" 
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="number" 
                step="0.1"
                placeholder="Peso actual (kg) - Opcional" 
                className={styles.input}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="number" 
                step="0.01"
                placeholder="Estatura (m) - Opcional" 
                className={styles.input}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Dirección principal" 
                className={styles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="date" 
                className={styles.input}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.sectionLabel}>Género</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="masculino"
                    checked={gender === 'masculino'}
                    onChange={(e) => setGender(e.target.value)}
                    className={styles.radioInput}
                  />
                  <span className={styles.customRadio}></span>
                  Masculino
                </label>

                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="femenino"
                    checked={gender === 'femenino'}
                    onChange={(e) => setGender(e.target.value)}
                    className={styles.radioInput}
                  />
                  <span className={styles.customRadio}></span>
                  Femenino
                </label>
              </div>
            </div>

            <div className={styles.selectGroup}>
              <label className={styles.sectionLabel}>Condición Física</label>
              <select 
                className={styles.select} 
                value={tieneLesion} 
                onChange={handleLesionChange}
                required
              >
                <option value="no">¿Posee lesión / discapacidad? NO</option>
                <option value="si">¿Posee lesión / discapacidad? SÍ</option>
              </select>
            </div>

            {/* Tu bloque de código que fallaba (Líneas 183-191): */}
            <div className={`${styles.inputGroup} ${styles.fullWidthField}`}>
              <input 
                type="text" 
                placeholder={tieneLesion === 'si' ? "Describa detalladamente la lesión o discapacidad" : "Campo bloqueado (No registra lesión)"} 
                className={`${styles.input} ${tieneLesion === 'no' ? styles.disabledInput : ''}`}
                value={descripcionLesion}
                onChange={(e) => setDescripcionLesion(e.target.value)} // 👈 Ahora compilará perfectamente
                disabled={tieneLesion === 'no'}
                required={tieneLesion === 'si'} 
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <div className={styles.btnWrapper}>
              <Button variant="secondary" type="button" onClick={() => navigate('/')}>
                Cancelar
              </Button>
            </div>
            
            <div className={styles.btnWrapper}>
              <Button variant="primary" type="submit">
                Registrar
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Lado Derecho */}
      <div className={styles.logoContainer}>
        {showAlert && (
          <div className={styles.planAlert}>
            <span className={styles.alertIcon}>⚠️</span>
            <p>{alertMessage}</p>
          </div>
        )}
        <img src={logo} alt="Logo Institutional" className={styles.logo} />
      </div>

    </div>
  )
}

export default Register // Exportación limpia como Register