import styles from './Button.module.css'

function Button({ children, variant = 'primary', onClick, type = 'button', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
