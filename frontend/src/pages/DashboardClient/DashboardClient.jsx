import { useState } from 'react'
import styles from './DashboardClient.module.css'
import Profile from './Profile/Profile'
import Leaderboard from './Leaderboard/Leaderboard'
import Header2 from '../../components/Header/Header2' 
import PlanSelector from './PlanSelector/PlanSelector' 
import Button from '../../components/Button/Button'
import { useAuth } from '../../context/AuthContext' // 🚀 Conectamos al contexto unificado

const AVATARES = [
  '/images/avatars/agua.png',
  '/images/avatars/fuego.png',
  '/images/avatars/aire.png',
  '/images/avatars/tierra.png'
] 

function DashboardClient() {
  // 🚀 Traemos directamente el "atleta" ya formateado desde el contexto
  const { atleta } = useAuth() 

  // Estado local que maneja exclusivamente UI (el modal y la persistencia visual del cambio)
  const [localAvatarIndex, setLocalAvatarIndex] = useState(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  // Combinamos el objeto global con la selección temporal del avatar
  const dbUser = {
    ...atleta,
    avatarIndex: localAvatarIndex !== null ? localAvatarIndex : atleta.avatarIndex
  }

  const handleSelectAvatar = (index) => {
    setLocalAvatarIndex(index)
    setShowAvatarModal(false)
    // Aquí meterías a futuro tu: await usuarioService.actualizarAvatar(dbUser.id, index)
  }

  return (
    <div className={styles.dashboardContainer}>
      <Header2 />
      
      <Profile 
        dbUser={dbUser} 
        avatares={AVATARES} 
        onCambiarAvatar={() => setShowAvatarModal(true)} 
      />
      
      <Leaderboard dbUser={dbUser} />
      
      <PlanSelector />

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