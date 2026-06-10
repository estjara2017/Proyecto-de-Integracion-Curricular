import { useCallback, useEffect, useState } from 'react';
import Header2 from '../../components/Header/Header2';
import styles from './AdminAttendance.module.css';
import { adminService } from '../../services/adminService';

const HORARIOS = ['', '05:00', '06:00', '07:00', '16:00', '17:00', '18:00', '19:00', 'Sabado 07:00', 'Sabado 08:00'];
const RANGOS = ['', '12-18', '18-30', '30-50', '50+'];
const GENEROS = ['', 'masculino', 'femenino'];

export default function AdminAttendance() {
  const [filters, setFilters] = useState({ horario: '', genero: '', rangoEdad: '' });
  const [clientes, setClientes] = useState([]);
  const [message, setMessage] = useState('');

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
    } catch (error) {
      setMessage(error.message || 'No se pudo registrar la asistencia.');
    }
  };

  return (
    <div className={styles.page}>
      <Header2 />
      <main className={styles.container}>
        <section className={styles.headerBlock}>
          <h1>Registro Manual de Asistencia</h1>
          <p>Filtra por horario, genero o rango de edad para registrar asistencia de apoyo.</p>
        </section>

        <section className={styles.filters}>
          <select value={filters.horario} onChange={(e) => setFilters((prev) => ({ ...prev, horario: e.target.value }))}>
            {HORARIOS.map((item) => <option key={item || 'all'} value={item}>{item || 'Todos los horarios'}</option>)}
          </select>
          <select value={filters.genero} onChange={(e) => setFilters((prev) => ({ ...prev, genero: e.target.value }))}>
            {GENEROS.map((item) => <option key={item || 'all'} value={item}>{item || 'Todos los generos'}</option>)}
          </select>
          <select value={filters.rangoEdad} onChange={(e) => setFilters((prev) => ({ ...prev, rangoEdad: e.target.value }))}>
            {RANGOS.map((item) => <option key={item || 'all'} value={item}>{item || 'Todos los rangos'}</option>)}
          </select>
        </section>

        {message && <p className={styles.message}>{message}</p>}

        <section className={styles.tablePanel}>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Horario</th>
                <th>Genero</th>
                <th>Edad</th>
                <th>Nivel</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.horarioEntrenamiento || '--'}</td>
                  <td>{cliente.genero || '--'}</td>
                  <td>{cliente.edad} ({cliente.rangoEdad})</td>
                  <td>{cliente.nivel}</td>
                  <td>
                    <button type="button" onClick={() => registrar(cliente.id, cliente.nombre)}>
                      Registrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
