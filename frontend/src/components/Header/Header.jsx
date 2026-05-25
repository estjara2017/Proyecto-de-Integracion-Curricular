
import Navbar from '../Navbar/Navbar'; // Revisa que la ruta apunte correctamente a tu Navbar
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarContainer}>
        <div className={styles.logoWrapper}>
          <img src="/logo.png" alt="Logo Institucional" className={styles.logo} />
        </div>

        <nav className={styles.navWrapper}>
          <Navbar />
        </nav>
      </div>
    </header>
  );
};

export default Header;