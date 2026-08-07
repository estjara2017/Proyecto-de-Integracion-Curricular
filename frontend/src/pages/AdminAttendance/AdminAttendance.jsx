import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../components/Header/Header2';
import styles from './AdminAttendance.module.css';
import { adminService } from '../../services/adminService';
import AttendanceQr from '../DashboardAdmin/AttendanceQr/AttendanceQr';
import { toPascalCaseText } from '../../utils/displayFormatters';

const GRUPOS_HORARIOS = [
  {
    label: 'Manana',
    options: [
      ['05:00', '05:00 - 06:00'],
      ['06:00', '06:00 - 07:00'],
      ['07:00', '07:00 - 08:00'],
      ['08:00', '08:00 - 09:00']
    ]
  },
  {
    label: 'Tarde',
    options: [
      ['16:00', '16:00 - 17:00'],
      ['17:00', '17:00 - 18:00'],
      ['18:00', '18:00 - 19:00'],
      ['19:00', '19:00 - 20:00']
    ]
  }
];
const ETIQUETAS_HORARIOS = Object.fromEntries(GRUPOS_HORARIOS.flatMap((grupo) => grupo.options));
const RANGOS = ['', '12-18', '18-30', '30-50', '50+'];
const GENEROS = ['', 'masculino', 'femenino'];
const NIVELES = ['', 'Principiante', 'Novato', 'Intermedio', 'Avanzado', 'Elite'];

export default function AdminAttendance() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ horario: '', genero: '', rangoEdad: '', nivel: '' });
  const [clientes, setClientes] = useState([]);
  const [message, setMessage] = useState('');
  const [showQrPanel, setShowQrPanel] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const cargarClientes = useCallback(async ({ mostrarCarga = false } = {}) => {
    if (mostrarCarga) setActualizando(true);
    try {
      const data = await adminService.listarClientesParaAsistencia(filters);
      setClientes(data);
      setUltimaActualizacion(new Date());
    } finally {
      if (mostrarCarga) setActualizando(false);
    }
  }, [filters]);

  useEffect(() => {
    const cargaInicial = setTimeout(() => {
      cargarClientes().catch((error) => setMessage(error.message));
    }, 0);

    const actualizarEstados = () => {
      cargarClientes().catch(() => {});
    };
    const intervalo = window.setInterval(actualizarEstados, 15000);
    const actualizarAlVolver = () => {
      if (document.visibilityState === 'visible') actualizarEstados();
    };

    window.addEventListener('focus', actualizarEstados);
    document.addEventListener('visibilitychange', actualizarAlVolver);

    return () => {
      clearTimeout(cargaInicial);
      clearInterval(intervalo);
      window.removeEventListener('focus', actualizarEstados);
      document.removeEventListener('visibilitychange', actualizarAlVolver);
    };
  }, [cargarClientes]);

  const registrar = async (usuarioId, nombre) => {
    try {
      await adminService.registrarAsistenciaManual({ usuarioId });
      setMessage(`Asistencia registrada para ${nombre}.`);
      setClientes((prev) => prev.map((cliente) => (
        cliente.id === usuarioId ? { ...cliente, asistenciaRegistrada: true } : cliente
      )));
    } catch (error) {
      setMessage(error.message || 'No se pudo registrar la asistencia.');
    }
  };

  return (
    <div className={styles.page}>
      <Header2 />
      <main className={styles.container}>
        <section className={styles.qrAccordion}>
          <button
            type="button"
            className={styles.qrAccordionHeader}
            onClick={() => setShowQrPanel((prev) => !prev)}
          >
            <span>QR Asistencia</span>
            <span>{showQrPanel ? '-' : '+'}</span>
          </button>
          <div className={`${styles.qrAccordionContent} ${showQrPanel ? styles.qrAccordionOpen : ''}`}>
            <AttendanceQr />
          </div>
        </section>

        <section className={styles.manualPanel}>
          <div className={styles.headerRow}>
            <div className={styles.headerBlock}>
              <h1>Control de Asistencia de Hoy</h1>
              <p>El estado se actualiza automáticamente cuando un cliente registra su asistencia.</p>
              {ultimaActualizacion && (
                <small>Última actualización: {ultimaActualizacion.toLocaleTimeString('es-EC')}</small>
              )}
            </div>
            <button
              type="button"
              className={styles.refreshButton}
              disabled={actualizando}
              onClick={() => cargarClientes({ mostrarCarga: true }).catch((error) => setMessage(error.message))}
            >
              {actualizando ? 'Actualizando...' : 'Actualizar estados'}
            </button>
          </div>

          <div className={styles.filters}>
            <select value={filters.horario} onChange={(e) => setFilters((prev) => ({ ...prev, horario: e.target.value }))}>
              <option value="">Todos los horarios</option>
              {GRUPOS_HORARIOS.map((grupo) => (
                <optgroup key={grupo.label} label={grupo.label}>
                  {grupo.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </optgroup>
              ))}
            </select>
            <select value={filters.genero} onChange={(e) => setFilters((prev) => ({ ...prev, genero: e.target.value }))}>
              {GENEROS.map((item) => <option key={item || 'all'} value={item}>{item || 'Todos los generos'}</option>)}
            </select>
            <select value={filters.rangoEdad} onChange={(e) => setFilters((prev) => ({ ...prev, rangoEdad: e.target.value }))}>
              {RANGOS.map((item) => <option key={item || 'all'} value={item}>{item || 'Todos los rangos'}</option>)}
            </select>
            <select value={filters.nivel} onChange={(e) => setFilters((prev) => ({ ...prev, nivel: e.target.value }))}>
              {NIVELES.map((item) => <option key={item || 'all'} value={item}>{item || 'Todos los niveles'}</option>)}
            </select>
          </div>

          {message && <p className={styles.message}>{message}</p>}

          <div className={styles.tablePanel}>
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Horario</th>
                  <th>Genero</th>
                  <th>Asistencia de hoy</th>
                  <th>Nivel</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{toPascalCaseText(cliente.nombre)}</td>
                    <td>{ETIQUETAS_HORARIOS[cliente.horarioEntrenamiento] || cliente.horarioEntrenamiento || '--'}</td>
                    <td>{toPascalCaseText(cliente.genero) || '--'}</td>
                    <td>
                      <span
                        className={`${styles.attendanceStatus} ${cliente.asistenciaRegistrada ? styles.registered : styles.notRegistered}`}
                        title={cliente.asistenciaRegistrada ? 'Registrado' : 'No registrado'}
                        aria-label={cliente.asistenciaRegistrada ? 'Registrado' : 'No registrado'}
                      >
                        {cliente.asistenciaRegistrada ? '✓' : '✕'}
                      </span>
                    </td>
                    <td>{cliente.nivel}</td>
                    <td>
                      <button type="button" disabled={cliente.asistenciaRegistrada} onClick={() => registrar(cliente.id, toPascalCaseText(cliente.nombre))}>
                        {cliente.asistenciaRegistrada ? 'Registrado' : 'Registrar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <button
        type="button"
        className={styles.dashboardButton}
        onClick={() => navigate('/dashboardAdmin')}
      >
        Panel de control
      </button>
    </div>
  );
}
