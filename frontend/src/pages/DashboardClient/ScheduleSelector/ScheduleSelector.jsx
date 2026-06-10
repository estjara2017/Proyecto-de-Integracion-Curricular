import { useState } from 'react';
import styles from './ScheduleSelector.module.css';

const HORARIOS = ['05:00', '06:00', '07:00', '16:00', '17:00', '18:00', '19:00', 'Sabado 07:00', 'Sabado 08:00'];

function ScheduleSelector({ visible, horarioActual, onGuardar }) {
  const [horario, setHorario] = useState(horarioActual || '');
  const [guardando, setGuardando] = useState(false);

  if (!visible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);
    try {
      await onGuardar(horario);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className={styles.schedulePanel} onSubmit={handleSubmit}>
      <div>
        <span>Horario de entrenamiento</span>
        <p>Lunes a viernes 5:00-8:00 / 16:00-20:00. Sabados 7:00-9:00.</p>
      </div>
      <select value={horario} onChange={(e) => setHorario(e.target.value)} required>
        <option value="">Selecciona horario</option>
        {HORARIOS.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}

export default ScheduleSelector;
