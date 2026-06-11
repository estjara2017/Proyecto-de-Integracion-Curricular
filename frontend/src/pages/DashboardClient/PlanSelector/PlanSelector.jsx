import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlanSelector.module.css';
import { paymentService } from '../../../services/paymentService';

const FALLBACK_PLANS = [
  { id: 'fallback-diario', nombre: 'Plan Diario', precio: 4.5, diasPorSemana: 1, duracionDias: 1, isFallback: true },
  { id: 'fallback-semanal', nombre: 'Plan Semanal', precio: 40, diasPorSemana: 5, duracionDias: 12, isFallback: true },
  { id: 'fallback-mensual', nombre: 'Plan Mensual', precio: 50, diasPorSemana: 5, duracionDias: 30, isFallback: true },
  { id: 'fallback-trimestral', nombre: 'Plan Trimestral', precio: 135, diasPorSemana: 5, duracionDias: 90, isFallback: true },
  { id: 'fallback-semestral', nombre: 'Plan Semestral', precio: 240, diasPorSemana: 5, duracionDias: 180, isFallback: true },
  { id: 'fallback-anual', nombre: 'Plan Anual', precio: 450, diasPorSemana: 5, duracionDias: 365, isFallback: true }
];

function PlanSelector() {
  const [isOpen, setIsOpen] = useState(true);
  const [listadoPlanes, setListadoPlanes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        const planes = await paymentService.listarPlanes();
        setListadoPlanes(planes.length ? planes : FALLBACK_PLANS);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los planes');
        setListadoPlanes(FALLBACK_PLANS);
      }
    };

    cargarPlanes();
  }, []);

  const getDescripcion = (plan) => {
    if (plan.nombre.includes('Diario')) return 'Acceso por un dia completo de entrenamiento.';
    if (plan.nombre.includes('Semanal')) return 'Acceso ilimitado por 12 dias consecutivos.';
    if (plan.nombre.includes('Mensual')) return 'Ideal para mantener la constancia mes a mes.';
    if (plan.nombre.includes('Trimestral')) return 'Incluye obsequio de bienvenida institucional.';
    if (plan.nombre.includes('Semestral')) return 'Optimiza tu constancia a mediano plazo.';
    return 'Acceso total premium por todo un ano.';
  };

  const handleSeleccionarPlan = (plan) => {
    if (plan.isFallback) {
      alert('Los planes reales no se pudieron cargar desde el backend. Cuando la API responda, podras continuar al pago.');
      return;
    }

    navigate('/payment', {
      state: {
        planId: plan.id,
        planNombre: plan.nombre,
        planPrecio: Number(plan.precio),
        trainingDaysPerWeek: plan.diasPorSemana,
        durationDays: plan.duracionDias
      }
    });
  };

  return (
    <div className={styles.accordionContainer}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Planes</span>
        <span className={styles.icon}>{isOpen ? '-' : '+'}</span>
      </button>

      <div className={`${styles.accordionContent} ${isOpen ? styles.show : ''}`}>
        <p className={styles.hintText}>
          Selecciona el plan ideal para tus objetivos. Haz clic en cualquier tarjeta para ser redirigido de forma segura al componente de pagos.
        </p>

        {error && <p className={styles.hintText}>{error}</p>}

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
              <p className={styles.precio}>${Number(plan.precio).toFixed(2)}</p>
              <p className={styles.descripcion}>{getDescripcion(plan)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlanSelector;
