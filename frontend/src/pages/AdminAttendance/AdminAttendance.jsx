import { useCallback, useEffect, useState } from 'react';
import Header2 from '../../components/Header/Header2';
import styles from './AdminAttendance.module.css';
import { adminService } from '../../services/adminService';
import AttendanceQr from '../DashboardAdmin/AttendanceQr/AttendanceQr';
import { toPascalCaseText } from '../../utils/displayFormatters';

const HORARIOS = ['', '05:00', '06:00', '07:00', '16:00', '17:00', '18:00', '19:00', 'Sabado 07:00', 'Sabado 08:00'];
const RANGOS = ['', '12-18', '18-30', '30-50', '50+'];
const GENEROS = ['', 'masculino', 'femenino'];
const NIVELES = ['', 'Principiante', 'Novato', 'Intermedio', 'Avanzado', 'Elite'];

export default function AdminAttendance() {
  const [filters, setFilters] = useState({ horario: '', genero: '', rangoEdad: '', nivel: '' });
  const [clientes, setClientes] = useState([]);
  const [message, setMessage] = useState('');
  const [showQrPanel, setShowQrPanel] = useState(false);

  const cargarClientes = useCallback(async () => {
    const data = await adminService.listarClientesParaAsistencia(filters);
    setClientes(data);
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarClientes().catch((error) => setMessage(error.message));
    }, 0);
    return () => clearTimeout(timer);
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
          <div className={styles.headerBlock}>
            <h1>Registro Manual de Asistencia</h1>
            <p>Filtra por horario, genero, rango de edad o nivel para registrar asistencia de apoyo.</p>
          </div>

          <div className={styles.filters}>
            <select value={filters.horario} onChange={(e) => setFilters((prev) => ({ ...prev, horario: e.target.value }))}>
              {HORARIOS.map((item) => <option key={item || 'all'} value={item}>{item || 'Todos los horarios'}</option>)}
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
                  <th>Estado</th>
                  <th>Nivel</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{toPascalCaseText(cliente.nombre)}</td>
                    <td>{cliente.horarioEntrenamiento || '--'}</td>
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
    </div>
  );
}
