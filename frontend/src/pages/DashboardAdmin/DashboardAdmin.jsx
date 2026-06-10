import { useState } from 'react';
import styles from './DashboardAdmin.module.css';
import Header2 from '../../components/Header/Header2';
import AdminProfile from './AdminProfile/AdminProfile';
import ClientTable from './ClientTable/ClientTable';
import PlanVerificationTable from './PlanVerificationTable/PlanVerificationTable';
import AdminLeaderboard from './AdminLeaderBoard/AdminLeaderBoard';
import AdminRoutineManager from './AdminRoutineManager/AdminRoutineManager';
import Button from '../../components/Button/Button';

const MOCK_ADMIN_DB = {
  nombre: 'Esteban Jara',
  nivel: 'Coach / Certificado',
  edad: 30,
  posicion: 'N° 1 (Staff)',
  pesoLevantamiento: 85,
  pesoMaxPromedio: 95,
  pesoTeoricoMax: 120,
  avatarIndex: 0
};

const AVATARES = [
  '/images/avatars/agua.png',
  '/images/avatars/fuego.png',
  '/images/avatars/aire.png',
  '/images/avatars/tierra.png'
];

export default function DashboardAdmin() {
  const [adminUser, setAdminUser] = useState(MOCK_ADMIN_DB);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activeTab, setActiveTab] = useState('clientes');

  const handleSelectAvatar = (index) => {
    setAdminUser((prev) => ({ ...prev, avatarIndex: index }));
    setShowAvatarModal(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header2 />

      <main className={styles.mainContent}>
        <section className={styles.profileSection}>
          <AdminProfile
            dbUser={adminUser}
            avatares={AVATARES}
            onCambiarAvatar={() => setShowAvatarModal(true)}
          />
        </section>

        <section className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <button
              className={`${styles.tabButton} ${activeTab === 'clientes' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('clientes')}
            >
              Control General
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'pagos' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('pagos')}
            >
              Verificacion de Pagos
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'ranking' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('ranking')}
            >
              Posiciones y Niveles
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'rutinas' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('rutinas')}
            >
              Rutinas y Enlaces
            </button>
          </div>

          <div className={styles.tabViewContent}>
            {activeTab === 'clientes' && (
              <div className={styles.viewFadeIn}>
                <div className={styles.viewDescription}>
                  <h3>Panel de Control General</h3>
                  <p>Gestion activa de atletas de la escuela, informacion de contacto y membresias.</p>
                </div>
                <ClientTable />
              </div>
            )}

            {activeTab === 'pagos' && (
              <div className={styles.viewFadeIn}>
                <div className={styles.viewDescription}>
                  <h3>Verificacion de Planes y Transferencias</h3>
                  <p>Revisa los pagos pendientes y aprueba el acceso del cliente.</p>
                </div>
                <PlanVerificationTable />
              </div>
            )}

            {activeTab === 'ranking' && (
              <div className={styles.viewFadeIn}>
                <div className={styles.viewDescription}>
                  <h3>Tabla de Posiciones Interna</h3>
                  <p>Monitoreo de progreso, puntos y administracion de ascensos.</p>
                </div>
                <AdminLeaderboard />
              </div>
            )}

            {activeTab === 'rutinas' && (
              <div className={styles.viewFadeIn}>
                <div className={styles.viewDescription}>
                  <h3>Plantillas de Rutinas y Enlaces</h3>
                  <p>Planifica rutinas generales reutilizables y consulta material complementario por nivel.</p>
                </div>
                <AdminRoutineManager />
              </div>
            )}
          </div>
        </section>
      </main>

      {showAvatarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Selecciona tu nuevo Avatar de Administrador</h3>
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
    </div>
  );
}
