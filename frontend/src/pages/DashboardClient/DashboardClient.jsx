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
import { paymentService } from '../../services/paymentService';

const AVATARES = [
  '/images/avatars/agua.png',
  '/images/avatars/fuego.png',
  '/images/avatars/aire.png',
  '/images/avatars/tierra.png'
];

const AVATAR_KEYS = ['agua', 'fuego', 'aire', 'tierra'];
const ATTENDANCE_HELP_TEXT = 'Por favor escanea el QR del local e ingresa la palabra clave.';

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
  const [membresia, setMembresia] = useState(null);

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
        const estadoMembresia = await paymentService.obtenerMiMembresia();
        setMembresia(estadoMembresia);
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

  const membershipTitle = (() => {
    if (!membresia) return 'Membresia';
    if (membresia.estado === 'activo' || membresia.estado === 'por_vencer' || membresia.estado === 'pocos_dias') {
      const duracion = membresia.suscripcion?.Plan?.duracionDias || membresia.plan?.duracionDias;
      const restantes = membresia.diasRestantes ?? 0;
      return `Tu plan es de ${duracion || '--'} dias - dias restantes ${restantes}`;
    }
    return membresia.plan?.nombre || 'Membresia';
  })();

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
      const qrToken = localStorage.getItem('elemental_attendance_qr_token');
      const response = await registrarAsistenciaCliente(palabraIngresada, qrToken);
      setAttendanceMessage(response.message || 'Asistencia registrada.');
      setPalabraIngresada('');
    } catch (error) {
      setAttendanceMessage(error.message || 'No se pudo registrar la asistencia.');
    } finally {
      setIsRegisteringAttendance(false);
    }
  };

  const handleOpenAttendance = () => {
    setAttendanceMessage('');
    setShowAttendanceModal(true);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header2 />

      <section className={styles.dashboardTopGrid}>
        <div className={styles.leftColumn}>
          <Profile
            dbUser={dbUser}
            avatares={AVATARES}
            onCambiarAvatar={() => setShowAvatarModal(true)}
            onRegistrarAsistencia={handleOpenAttendance}
          />

          <section className={`${styles.membershipCard} ${styles[membresia?.estado] || ''}`}>
            <strong>{membershipTitle}</strong>
            <span>{membresia?.mensaje || 'Selecciona un plan para activar tu membresia.'}</span>
            {membresia?.diasDisponibles !== undefined && (
              <small>{membresia.diasDisponibles} asistencia(s) disponibles.</small>
            )}
          </section>

          <ScheduleSelector
            visible
            disabled={dbUser.estado !== 'activo'}
            horarioActual={dbUser.horarioEntrenamiento}
            onGuardar={async (horario) => {
              const usuarioActualizado = await profileService.actualizarHorario(horario);
              actualizarUsuarioContext(usuarioActualizado);
            }}
          />
        </div>

        <div className={styles.rightColumn}>
          <Leaderboard dbUser={dbUser} />
        </div>
      </section>

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
            <p className={styles.attendanceHelp}>{ATTENDANCE_HELP_TEXT}</p>
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
