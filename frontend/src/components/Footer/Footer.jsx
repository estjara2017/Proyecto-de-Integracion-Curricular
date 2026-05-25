
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footerBar}>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Elemental Cross Training - by: Esteban Jara.
      </p>
    </footer>
  );
};

export default Footer;