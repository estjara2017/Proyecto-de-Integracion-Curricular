import { useState } from 'react'
import styles from './DashboardClient.module.css'
import Profile from './Profile/Profile'
import Leaderboard from './Leaderboard/Leaderboard'
import Button from '../../components/Button/Button'
import Header2 from '../../components/Header/Header2' // 🚀 Importamos el nuevo encabezado
import PlanSelector from './PlanSelector/PlanSelector' // 🚀 Importamos el selector de planes

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
      
      {/* HIJO 1: Encabezado Global de la aplicación */}
      <Header2 />

      {/* HIJO 2: Tarjeta de Perfil del Atleta */}
      <Profile 
        dbUser={dbUser} 
        avatares={AVATARES} 
        onCambiarAvatar={() => setShowAvatarModal(true)} 
      />

      {/* HIJO 3: Tabla de Posiciones Interna */}
      <Leaderboard dbUser={dbUser} />

      {/* HIJO 4: Desplegable de suscripción (Ocupa el 100% inferior) */}
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