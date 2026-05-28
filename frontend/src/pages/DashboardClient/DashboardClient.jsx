import { useState } from 'react'
import styles from './DashboardClient.module.css'
import Profile from '../DashboardClient/Profile/Profile'
import Leaderboard from '../../components/Leaderboard/Leaderboard'
import Button from '../../components/Button/Button'

const AVATARES = [
  '/images/avatars/agua.png',
  '/images/avatars/fuego.png',
  '/images/avatars/aire.png',
  '/images/avatars/tierra.png'
] 

function DashboardClient() {
  const [dbUser, setDbUser] = useState({
    id: "user_05",
    nombre: 'Esteban Jara',
    edad: 30,
    nivel: 'Principiante',
    posicion: 'N° 5',
    pesoLevantamiento: 10, 
    pesoMaxPromedio: 50,   
    pesoTeoricoMax: 80,
    avatarIndex: 0 
  })

  const [showAvatarModal, setShowAvatarModal] = useState(false)

  const handleSelectAvatar = (index) => {
    setDbUser(prev => ({
      ...prev,
      avatarIndex: index
    }))
    setShowAvatarModal(false)
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* HIJO 1: ENCABEZADO IDÉNTICO AL DE ADMIN (Ocupa el 100% de ancho) */}
      <header className={styles.brandBanner}>
        <div className={styles.logoPlaceholder}>
          <img 
            src="/logo.png" 
            alt="Logo Elemental Cross Training" 
            className={styles.logoImg}
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <span className={styles.logoText}>ELEMENTAL CROSS TRAINING</span>
        </div>
      </header>

      {/* HIJO 2: Tarjeta de Perfil */}
      <Profile 
        dbUser={dbUser} 
        avatares={AVATARES} 
        onCambiarAvatar={() => setShowAvatarModal(true)} 
      />

      {/* HIJO 3: Tabla de Posiciones */}
      <Leaderboard dbUser={dbUser} />

      {/* MODAL SELECCIÓN DE AVATAR */}
      {showAvatarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Selecciona tu nuevo Avatar</h3>
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
  )
}

export default DashboardClient