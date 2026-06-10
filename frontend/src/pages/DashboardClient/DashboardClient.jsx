import { useEffect, useState } from 'react';
import styles from './DashboardClient.module.css';
import Profile from './Profile/Profile';
import Leaderboard from './Leaderboard/Leaderboard';
import Header2 from '../../components/Header/Header2';
import PlanSelector from './PlanSelector/PlanSelector';
import RoutinePanel from './RoutinePanel/RoutinePanel';
import ScheduleSelector from './ScheduleSelector/ScheduleSelector';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { registrarAsistenciaCliente } from '../../services/attendanceService';

const AVATARES = [
  '/images/avatars/agua.png',
  '/images/avatars/fuego.png',
  '/images/avatars/aire.png',
  '/images/avatars/tierra.png'
];

const AVATAR_KEYS = ['agua', 'fuego', 'aire', 'tierra'];

function DashboardClient() {
  const { atleta, actualizarUsuarioContext } = useAuth();

  const [localAvatarIndex, setLocalAvatarIndex] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [palabraIngresada, setPalabraIngresada] = useState('');
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [isRegisteringAttendance, setIsRegisteringAttendance] = useState(false);
  const [rutinasNivel, setRutinasNivel] = useState([]);
  const [recursosNivel, setRecursosNivel] = useState([]);
  const [nombreNivelRutina, setNombreNivelRutina] = useState(atleta.nivel);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const response = await profileService.obtenerPerfil();
        actualizarUsuarioContext({
          ...response.usuario,
          pesoTeoricoMaxKg: response.metricas?.pesoTeoricoMaxKg,
          porcentajeProgreso: response.metricas?.porcentajeProgreso ?? response.usuario.porcentajeProgreso
        });
        setRutinasNivel(response.nivel?.RoutineTemplates || []);
        setRecursosNivel(response.nivel?.LevelResources || []);
        setNombreNivelRutina(response.nivel?.nombre || response.usuario.nivel);
      } catch (error) {
        console.error('No se pudo actualizar el perfil:', error);
      }
    };

    cargarPerfil();
  }, [actualizarUsuarioContext]);

  const dbUser = {
    ...atleta,
    avatarIndex: localAvatarIndex !== null ? localAvatarIndex : atleta.avatarIndex
  };

  const handleSelectAvatar = async (index) => {
    try {
      const usuarioActualizado = await profileService.actualizarAvatar(AVATAR_KEYS[index]);
      actualizarUsuarioContext(usuarioActualizado);
      setLocalAvatarIndex(index);
      setShowAvatarModal(false);
    } catch (error) {
      alert(error.message || 'No se pudo actualizar el avatar');
    }
  };

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();
    setIsRegisteringAttendance(true);
    setAttendanceMessage('');

    try {
      const response = await registrarAsistenciaCliente(palabraIngresada);
      setAttendanceMessage(response.message || 'Asistencia registrada.');
      setPalabraIngresada('');
    } catch (error) {
      setAttendanceMessage(error.message || 'No se pudo registrar la asistencia.');
    } finally {
      setIsRegisteringAttendance(false);
    }
  };

  const handleOpenAttendance = () => {
    const scanDate = localStorage.getItem('elemental_qr_scan_date');
    const today = new Date().toISOString().slice(0, 10);

    if (scanDate !== today) {
      setAttendanceMessage('Primero escanea el QR del local. Se abrira la pagina de asistencia en otra pestana.');
      setShowAttendanceModal(true);
      window.open('/attendance', '_blank');
      return;
    }

    setAttendanceMessage('');
    setShowAttendanceModal(true);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header2 />

      <Profile
        dbUser={dbUser}
        avatares={AVATARES}
        onCambiarAvatar={() => setShowAvatarModal(true)}
        onRegistrarAsistencia={handleOpenAttendance}
      />

      <Leaderboard dbUser={dbUser} />

      <ScheduleSelector
        visible={dbUser.estado === 'activo'}
        horarioActual={dbUser.horarioEntrenamiento}
        onGuardar={async (horario) => {
          const usuarioActualizado = await profileService.actualizarHorario(horario);
          actualizarUsuarioContext(usuarioActualizado);
        }}
      />

      <PlanSelector />

      <RoutinePanel
        nivel={nombreNivelRutina}
        rutinas={rutinasNivel}
        recursos={recursosNivel}
      />

      {showAvatarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Selecciona tu nuevo Avatar</h3>
            <div className={styles.avatarOptionsGrid}>
              {AVATARES.map((avatarImg, idx) => (
                <img
                  key={avatarImg}
                  src={avatarImg}
                  alt={`Opcion ${idx + 1}`}
                  className={styles.modalAvatarOpt}
                  onClick={() => handleSelectAvatar(idx)}
                />
              ))}
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setShowAvatarModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAttendanceModal && (
        <div className={styles.modalOverlay}>
          <form className={styles.modalContent} onSubmit={handleAttendanceSubmit}>
            <h3>Registrar Asistencia</h3>
            <input
              className={styles.attendanceInput}
              type="text"
              placeholder="Palabra clave del dia"
              value={palabraIngresada}
              onChange={(e) => setPalabraIngresada(e.target.value)}
              required
            />
            {attendanceMessage && <p className={styles.modalMessage}>{attendanceMessage}</p>}
            <div className={styles.modalActions}>
              <Button variant="primary" type="submit" disabled={isRegisteringAttendance}>
                {isRegisteringAttendance ? 'Registrando...' : 'Registrar'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => setShowAttendanceModal(false)}>
                Cerrar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DashboardClient;
