import { useState } from 'react';
import styles from './ScheduleSelector.module.css';

const GRUPOS_HORARIOS = [
  {
    label: 'Manana: 05:00 - 09:00',
    options: [
      { value: '05:00', label: '05:00 - 06:00' },
      { value: '06:00', label: '06:00 - 07:00' },
      { value: '07:00', label: '07:00 - 08:00' },
      { value: '08:00', label: '08:00 - 09:00' }
    ]
  },
  {
    label: 'Tarde: 16:00 - 20:00',
    options: [
      { value: '16:00', label: '16:00 - 17:00' },
      { value: '17:00', label: '17:00 - 18:00' },
      { value: '18:00', label: '18:00 - 19:00' },
      { value: '19:00', label: '19:00 - 20:00' }
    ]
  }
];
const HORARIOS = GRUPOS_HORARIOS.flatMap((grupo) => grupo.options.map((option) => option.value));
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
        {GRUPOS_HORARIOS.map((grupo) => (
          <optgroup key={grupo.label} label={grupo.label}>
            {grupo.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className={styles.saturdayNotice}>Sabados: atendemos solo de 07:00 a 09:00, sin seleccionar turno.</p>
      <button type="submit" disabled={guardando || disabled}>
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
      {mensaje && <small className={styles.message}>{mensaje}</small>}
    </form>
  );
}

export default ScheduleSelector;
