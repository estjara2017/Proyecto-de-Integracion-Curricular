import styles from './Button.module.css'

function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button