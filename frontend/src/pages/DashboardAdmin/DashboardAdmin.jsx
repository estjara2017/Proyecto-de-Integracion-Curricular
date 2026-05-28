import { useState, useEffect } from 'react';
import styles from './DashboardAdmin.module.css';
import AdminProfile from '../DashboardAdmin/AdminProfile/AdminProfile'; // Ajusta la ruta según tus carpetas
import ClientTable from '../../components/ClientTable/ClientTable'; // Tu componente de tabla de clientes
import Button from '../../components/Button/Button';

// Simulación de los datos del Administrador desde la Base de Datos
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

// Definición de rutas absolutas apuntando a la carpeta public (Mismo formato que en Cliente)
const AVATARES = [
  '/images/avatars/agua.png',
  '/images/avatars/fuego.png',
  '/images/avatars/aire.png',
  '/images/avatars/tierra.png'
];

export default function DashboardAdmin() {
  const [adminUser, setAdminUser] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAdminUser(MOCK_ADMIN_DB);
    }, 50); // Un retraso mínimo de 50ms para simular asincronía asíncrona limpia

    return () => clearTimeout(timer);
  }, []);

  const handleSelectAvatar = (index) => {
    setAdminUser(prev => ({
      ...prev,
      avatarIndex: index
    }));
    setShowAvatarModal(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Banner Superior decorativo de la marca con Logotipo horizontal */}
      <header className={styles.brandBanner}>
        <div className={styles.logoPlaceholder}>
          <img 
            src="/logo.png" /* Usamos exactamente el mismo archivo que en el de clientes */ 
            alt="Logo Elemental Cross Training" 
            className={styles.logoImg}
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <span className={styles.logoText}>ELEMENTAL CROSS TRAINING</span>
        </div>
      </header>

      {/* Zona Central / Contenido Principal */}
      <main className={styles.mainContent}>
        
        {/* Fila Superior: Perfil del Administrador centrado */}
        <section className={styles.profileSection}>
          <AdminProfile 
            dbUser={adminUser} 
            avatares={AVATARES} /* CORREGIDO: Se cambió MOCK_AVATARES por AVATARES */
            onCambiarAvatar={() => setShowAvatarModal(true)} 
          />
        </section>

        {/* Fila Inferior: Espacio modular para otros paneles del Administrador */}
        <section className={styles.managementSection}>
          <div className={styles.sectionHeader}>
            <h3>Panel de Control General</h3>
            <p>Gestión de atletas, asistencias y membresías activas.</p>
          </div>
          
          {/* Renderizado de otros componentes de administración */}
          <div className={styles.gridModules}>
            <div className={styles.moduleCard}>
              <ClientTable />
            </div>
          </div>
        </section>

      </main>

      {/* MODAL SELECCIÓN DE AVATAR (Lógica idéntica y funcional移植 de DashboardClient) */}
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