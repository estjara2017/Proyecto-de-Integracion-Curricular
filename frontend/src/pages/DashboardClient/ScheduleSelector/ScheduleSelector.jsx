import { useState } from 'react';
import styles from './ScheduleSelector.module.css';

const HORARIOS = ['05:00', '06:00', '07:00', '16:00', '17:00', '18:00', '19:00'];
const getHorarioSeleccionable = (horario) => (HORARIOS.includes(horario) ? horario : '');

function ScheduleSelector({ visible, disabled = false, horarioActual, onGuardar }) {
  const [horario, setHorario] = useState(getHorarioSeleccionable(horarioActual));
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  if (!visible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje('');
    try {
      if (!disabled) {
        await onGuardar(horario);
        setMensaje('Horario guardado.');
      }
    } catch (error) {
      setMensaje(error.message || 'No se pudo guardar el horario.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className={styles.schedulePanel} onSubmit={handleSubmit}>
      <div>
        <span>Selecciona tu horario</span>
        <p>{disabled ? 'Activa un plan para poder escoger horario.' : 'Elige o edita tu horario de entrenamiento.'}</p>
      </div>
      <select value={horario} onChange={(e) => setHorario(e.target.value)} required disabled={disabled}>
        <option value="">Selecciona horario</option>
        {HORARIOS.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      <p className={styles.saturdayNotice}>Sabados: atendemos de 07:00 a 09:00 sin seleccionar turno.</p>
      <button type="submit" disabled={guardando || disabled}>
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
      {mensaje && <small className={styles.message}>{mensaje}</small>}
    </form>
  );
}

export default ScheduleSelector;
