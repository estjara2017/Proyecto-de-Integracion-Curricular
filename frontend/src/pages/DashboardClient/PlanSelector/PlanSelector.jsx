import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './PlanSelector.module.css'

function PlanSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const listadoPlanes = [
    { id: 'diario', nombre: 'Plan Diario', precio: '$4.50', descripcion: 'Acceso por un día completo de entrenamiento.' },
    { id: 'semanal', nombre: 'Plan Semanal', precio: '$40.00', descripcion: 'Acceso ilimitado por 12 días consecutivos.' },
    { id: 'mensual', nombre: 'Plan Mensual', precio: '$50.00', descripcion: 'Ideal para mantener la constancia mes a mes.' },
    { id: 'trimestral', nombre: 'Plan Trimestral', precio: '$135.00', descripcion: 'Incluye obsequio de bienvenida institucional.' },
    { id: 'semestral', nombre: 'Plan Semestral', precio: '$240.00', descripcion: 'Optimiza tu constancia a mediano plazo.' },
    { id: 'anual', nombre: 'Plan Anual', precio: '$450.00', descripcion: 'Acceso total premium por todo un año.' },
  ]

  const handleSeleccionarPlan = (plan) => {
    navigate('/payment', { 
      state: { 
        planId: plan.id,
        planNombre: plan.nombre,
        planPrecio: plan.precio
      } 
    })
  }

  return (
    <div className={styles.accordionContainer}>
      <button 
        type="button" 
        className={styles.accordionHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Planes</span>
        <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
      </button>

      <div className={`${styles.accordionContent} ${isOpen ? styles['show'] : ''}`}>
        <p className={styles.hintText}>
          Selecciona el plan ideal para tus objetivos. Haz clic en cualquier tarjeta para ser redirigido de forma segura al componente de pagos.
        </p>
        
        <div className={styles.planesGrid}>
          {listadoPlanes.map((plan) => (
            <div 
              key={plan.id} 
              className={styles.planCard}
              onClick={() => handleSeleccionarPlan(plan)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSeleccionarPlan(plan); }}
            >
              <h3>{plan.nombre}</h3>
              <p className={styles.precio}>{plan.precio}</p>
              <p className={styles.descripcion}>{plan.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlanSelector