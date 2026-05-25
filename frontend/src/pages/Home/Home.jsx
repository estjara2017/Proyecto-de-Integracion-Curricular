import styles from './Home.module.css'
import logo from '../../assets/logo1.png'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import Navbar from '../../components/Navbar/Navbar'

function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      
      {/* Navbar arriba y centrado */}
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>

      {/* Contenido Central */}
      <div className={styles.content}>
        
        {/* LOGO (480px) */}
        <img src={logo} alt="Logo" className={styles.logo} />

        {/* BOTONES */}
        <div className={styles.buttons}>
          <Button 
            variant="primary"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </Button>

          <Button 
            variant="secondary"
            onClick={() => navigate('/register')}
          >
            Registrate
          </Button>
        </div>

      </div>
    </div>
  )
}

export default Home