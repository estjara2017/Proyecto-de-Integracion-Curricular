import styles from './Header2.module.css'

function Header2() {
  return (
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
  )
}

export default Header2