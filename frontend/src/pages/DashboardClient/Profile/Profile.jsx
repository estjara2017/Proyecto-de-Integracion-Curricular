import { useNavigate } from 'react-router-dom'
import styles from './Profile.module.css'
import Button from '../../../components/Button/Button' // Tu componente nativo original

function Profile({ dbUser, avatares, onCambiarAvatar }) {
  const navigate = useNavigate()

  const porcentajeProgreso = Math.min(
    Math.round((dbUser.pesoMaxPromedio / dbUser.pesoTeoricoMax) * 100),
    100
  )

  return (
    <section className={styles.profileCard}>
      <div className={styles.mainContentWrapper}>
        {/* Columna Izquierda: Avatar y Acciones */}
        <div className={styles.avatarZone}>
          <div className={styles.avatarWrapper}>
            <img
              src={avatares[dbUser.avatarIndex]}
              alt="Avatar de perfil"
              className={styles.avatarImg}
            />
          </div>

          {/* Variante oscura para cambiar avatar */}
          <Button variant="dark" onClick={onCambiarAvatar}>
            Cambiar Avatar
          </Button>

          {/* Variante principal morada para asistencia */}
          <Button variant="primary">
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

      {/* SECCIÓN INFERIOR: Envoltura correcta para evitar deformaciones */}
      <div className={styles.navigationZone}>
        <div className={styles.navButtonsGroup}>
          <Button 
            variant="primary" 
            type="button" 
            onClick={() => navigate('/contacts')}
          >
            Contactos
          </Button>

          <Button 
            variant="secondary" 
            type="button" 
            onClick={() => navigate('/')}
          >
            Salir
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Profile