import { useState } from 'react';
import styles from './DashboardAdmin.module.css';
import Header2 from '../../components/Header/Header2'; 
import AdminProfile from './AdminProfile/AdminProfile'; 
import ClientTable from './ClientTable/ClientTable'; // 👥 Re-importado
import PlanVerificationTable from './PlanVerificationTable/PlanVerificationTable'; 
import AdminLeaderboard from './AdminLeaderboard/AdminLeaderboard';
import Button from '../../components/Button/Button';

const MOCK_ADMIN_DB = {
  nombre: "Esteban Jara",
  nivel: "Coach / Certificado",
  edad: 30,
  posicion: "N° 1 (Staff)",
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
  
  // 🔄 Ponemos 'clientes' como la pestaña activa por defecto al cargar la vista
  const [activeTab, setActiveTab] = useState('clientes');

  const handleSelectAvatar = (index) => {
    setAdminUser(prev => ({ ...prev, avatarIndex: index }));
    setShowAvatarModal(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header2 />

      <main className={styles.mainContent}>
        {/* Fila Superior: Perfil Administrador */}
        <section className={styles.profileSection}>
          <AdminProfile 
            dbUser={adminUser} 
            avatares={AVATARES} 
            onCambiarAvatar={() => setShowAvatarModal(true)} 
          />
        </section>

        {/* 🎛️ PANEL DE NAVEGACIÓN POR PESTAÑAS (TABS) */}
        <section className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'clientes' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('clientes')}
            >
              👥 Control General
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'pagos' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('pagos')}
            >
              💰 Verificación de Pagos
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'ranking' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('ranking')}
            >
              🏆 Posiciones y Niveles
            </button>
          </div>

          {/* 📦 RENDERIZADO CONDICIONAL DE TABS INTERNAS */}
          <div className={styles.tabViewContent}>
            
            {/* 👥 Pestaña de Control General (ClientTable) integrada aquí mismo */}
            {activeTab === 'clientes' && (
              <div className={styles.viewFadeIn}>
                <div className={styles.viewDescription}>
                  <h3>Panel de Control General</h3>
                  <p>Gestión activa de atletas de la escuela, actualización de información de contacto y membresías.</p>
                </div>
                <ClientTable />
              </div>
            )}

            {activeTab === 'pagos' && (
              <div className={styles.viewFadeIn}>
                <div className={styles.viewDescription}>
                  <h3>Verificación de Planes y Transferencias</h3>
                  <p>Revisa los comprobantes, montos cargados y aprueba de forma inmediata el acceso a la app del cliente.</p>
                </div>
                <PlanVerificationTable />
              </div>
            )}

            {activeTab === 'ranking' && (
              <div className={styles.viewFadeIn}>
                <div className={styles.viewDescription}>
                  <h3>Tabla de Posiciones Interna</h3>
                  <p>Monitoreo en tiempo real del progreso de fuerza teórica y administración de ascensos reglamentarios.</p>
                </div>
                <AdminLeaderboard />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL SELECCIÓN DE AVATAR */}
      {showAvatarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Selecciona tu nuevo Avatar de Administrador</h3>
            <div className={styles.avatarOptionsGrid}>
              {AVATARES.map((avatarImg, idx) => (
                <img 
                  key={idx}
                  src={avatarImg} 
                  alt={`Opción ${idx + 1}`} 
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