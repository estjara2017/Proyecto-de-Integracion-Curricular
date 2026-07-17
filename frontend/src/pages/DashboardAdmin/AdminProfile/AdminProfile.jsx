import { useNavigate } from 'react-router-dom';
import styles from './AdminProfile.module.css';
import Button from '../../../components/Button/Button';

function AdminProfile({ dbUser, avatares = [], onCambiarAvatar, onAbrirRutinas }) {
  const navigate = useNavigate();

  // Prevenir fallos si dbUser no ha cargado desde la base de datos
  if (!dbUser) return null;

  const porcentajeProgreso = Math.min(
    Math.round((dbUser.pesoMaxPromedio / dbUser.pesoTeoricoMax) * 100),
    100
  );

  const srcAvatar = (avatares && avatares[dbUser.avatarIndex]) 
    ? avatares[dbUser.avatarIndex] 
    : '/images/avatars/agua.png';

  // NUEVA FUNCIÓN: Abre la raíz de la plataforma en otra pestaña
  const handleAbrirInicioNuevaPestana = () => {
    window.open('/', '_blank');
  };

  return (
    <section className={styles.profileCard}>
      
      {/* NUEVA FILA SUPERIOR: Indicador exclusivo para Administrador */}
      <div className={styles.adminHeaderRow}>
        <span className={styles.adminBadge}>ADMINISTRADOR</span>
      </div>

      {/* Todo lo demás se mantiene idéntico y alineado debajo */}
      <div className={styles.mainContentWrapper}>
        {/* Columna Izquierda: Avatar y Acciones */}
        <div className={styles.avatarZone}>
          <div className={styles.avatarWrapper}>
            <img
              src={srcAvatar} 
              alt="Avatar de perfil de administrador"
              className={styles.avatarImg}
              onError={(e) => { e.target.src = '/images/avatars/agua.png' }}
            />
          </div>

          <Button variant="dark" onClick={onCambiarAvatar}>
            Cambiar Avatar
          </Button>

          <Button variant="primary" onClick={() => window.open('/adminAttendance', '_blank')}>
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

      <div className={styles.navigationZone}>
        <div className={styles.navButtonsGroup}>
          {/* MODIFICADO: Ahora ejecuta la función con window.open */}
          <Button 
            variant="primary" 
            type="button" 
            onClick={handleAbrirInicioNuevaPestana}
          >
            Inicio
          </Button>

          <Button
            variant="dark"
            type="button"
            onClick={onAbrirRutinas}
          >
            Rutinas
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
  );
}

export default AdminProfile;
