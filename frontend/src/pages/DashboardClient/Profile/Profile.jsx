import { useNavigate } from 'react-router-dom'
import styles from './Profile.module.css'
import Button from '../../../components/Button/Button'
import { useAuth } from '../../../context/AuthContext'

function Profile({ dbUser, avatares = [], onCambiarAvatar, onRegistrarAsistencia }) {
  const navigate = useNavigate()
  const { logoutContext } = useAuth() // 🚀 Extraído correctamente

  const porcentajeProgreso = Math.min(Math.round(dbUser.porcentajeProgreso || 0), 100)

  const srcAvatar = (avatares && avatares[dbUser.avatarIndex]) 
    ? avatares[dbUser.avatarIndex] 
    : '/images/avatars/agua.png';

  // Función manejadora para limpiar sesión y redirigir
  const handleLogout = () => {
    logoutContext(); // 🚀 Borra LocalStorage y limpia el estado global de React
    navigate('/');   // Redirige al inicio/login limpito
  }

  return (
    <section className={styles.profileCard}>
      <div className={styles.mainContentWrapper}>
        {/* Columna Izquierda: Avatar y Acciones */}
        <div className={styles.avatarZone}>
          <div className={styles.avatarWrapper}>
            <img
              src={srcAvatar} 
              alt="Avatar de perfil"
              className={styles.avatarImg}
              onError={(e) => { e.target.src = '/images/avatars/agua.png' }}
            />
          </div>

          <Button variant="dark" onClick={onCambiarAvatar}>
            Cambiar Avatar
          </Button>

          <Button variant="primary" onClick={onRegistrarAsistencia}>
            Asistencia
          </Button>
        </div>

        {/* Columna Derecha: Datos Informativos */}
        <div className={styles.infoGrid}>
          <div className={styles.infoGroup}>
            <div className={styles.labelContainer}>
              <span className={styles.label}>NOMBRE</span>
            </div>
            <p className={styles.value}>{dbUser.nombre}</p>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.labelContainer}>
              <span className={styles.label}>NIVEL ACTUAL</span>
            </div>
            <p className={styles.value}>{dbUser.nivel}</p>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.labelContainer}>
              <span className={styles.label}>EDAD</span>
            </div>
            <p className={styles.value}>{dbUser.edad} años</p>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.labelContainer}>
              <span className={styles.label}>POSICIÓN RANKING</span>
            </div>
            <p className={styles.value}>{dbUser.posicion}</p>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.labelContainer}>
              <span className={styles.label}>PESO DE LEVANTAMIENTO</span>
            </div>
            <p className={styles.value}>{dbUser.pesoLevantamiento} kg</p>
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.labelContainer}>
              <span className={styles.label}>PESO MÁX PROMEDIO ACTUAL</span>
            </div>
            <p className={styles.value}>{dbUser.pesoMaxPromedio} kg</p>
          </div>

          {/* BARRA DE PROGRESO DE POTENCIAL DE CARGA */}
          <div className={`${styles.infoGroup} ${styles.fullWidth}`}>
            <div className={styles.labelContainer}>
              <span className={styles.label}>
                PROGRESO DE FUERZA TEÓRICO ({porcentajeProgreso}%)
              </span>
            </div>
            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${porcentajeProgreso}%` }}
              ></div>
            </div>
            <small className={styles.progressSub}>
              Cargas {dbUser.pesoMaxPromedio} kg de un máximo estimado de{' '}
              {dbUser.pesoTeoricoMax} kg para tu estructura.
            </small>
          </div>
        </div>
      </div>

      {/* Zona Inferior de Navegación */}
      <div className={styles.navigationZone}>
        <div className={styles.navButtonsGroup}>
          {/* Botón 1: Variante dark y abre en nueva pestaña */}
          <Button 
            variant="dark" 
            type="button" 
            onClick={() => window.open('/', '_blank')}
          >
            Inicio
          </Button>

          {/* Botón 2: Variante primary */}
          <Button 
            variant="primary" 
            type="button" 
            onClick={() => navigate('/contacts')}
          >
            Contactos
          </Button>

          {/* Botón 3: Variante secondary */}
          <Button 
            variant="secondary" 
            type="button" 
            onClick={handleLogout} // 🚀 Vinculado al cierre de sesión real
          >
            Salir
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Profile
