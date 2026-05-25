
import { Link } from 'react-router-dom'; // 1. Importamos Link
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>

        <li className={styles.navItem}>
          {/* 2. Reemplazamos <a> por <Link> y usamos "to" en lugar de onClick */}
          <Link to="/" className={styles.navLink}>
            Inicio
          </Link>
        </li>
        
        <li className={styles.navItem}>
          {/* 2. Reemplazamos <a> por <Link> y usamos "to" en lugar de onClick */}
          <Link to="/about" className={styles.navLink}>
            Sobre Nosotros
          </Link>
        </li>
        
        <li className={styles.navItem}>
          <Link to="/services" className={styles.navLink}>
            Servicios
          </Link>
        </li>
        
        <li className={styles.navItem}>
          <Link to="/plans" className={styles.navLink}>
            Planes
          </Link>
        </li>
        
        <li className={styles.navItem}>
          <Link to="/contacts" className={styles.navLink}>
            Contáctanos
          </Link>
        </li>

      </ul>
    </nav>
  );
}

export default Navbar;