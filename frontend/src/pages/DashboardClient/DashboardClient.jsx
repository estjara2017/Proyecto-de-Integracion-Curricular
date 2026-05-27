import { useState } from 'react'
import styles from './DashboardClient.module.css'
import logo from '/logo.png' 
import Profile from '../DashboardClient/Profile/Profile'
import Leaderboard from '../../components/Leaderboard/Leaderboard'
import Button from '../../components/Button/Button'

import avatar1 from '../../assets/agua.png'
import avatar2 from '../../assets/fuego.png'
import avatar3 from '../../assets/aire.png'
import avatar4 from '../../assets/tierra.png'

const AVATARES = [avatar1, avatar2, avatar3, avatar4]

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
      
      {/* HIJO 1: ENCABEZADO (Ocupa el 100% de ancho) */}
      <header className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </header>

      {/* HIJO 2: Tarjeta de Perfil (Recibe flex: 1.2 automáticamente) */}
      <Profile 
        dbUser={dbUser} 
        avatares={AVATARES} 
        onCambiarAvatar={() => setShowAvatarModal(true)} 
      />

      {/* HIJO 3: Tabla de Posiciones (Recibe flex: 0.9 automáticamente) */}
      <Leaderboard dbUser={dbUser} />

      {/* MODAL SELECCIÓN DE AVATAR (Fuera del flujo gracias a position: fixed) */}
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