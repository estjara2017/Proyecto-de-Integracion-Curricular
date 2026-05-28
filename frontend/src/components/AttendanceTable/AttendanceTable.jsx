import { useState } from 'react';
import styles from './AttendanceTable.module.css';
import Button from '../../components/Button/Button'; // Importación modular de tu botón base

const AttendanceTable = () => {
  // Datos simulados de clientes con sus respectivos planes y estados de asistencia de hoy
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: "Carlos Mendoza",
      tipoPlan: "Semestral",
      diasTotalesPlan: 144,
      diasAsistidos: 48,
      asistioHoy: true,
    },
    {
      id: 2,
      nombre: "Ana María Silva",
      tipoPlan: "Mensual",
      diasTotalesPlan: 24,
      diasAsistidos: 18,
      asistioHoy: false,
    },
    {
      id: 3,
      nombre: "Juan Diego Pérez",
      tipoPlan: "Trimestral",
      diasTotalesPlan: 72,
      diasAsistidos: 36,
      asistioHoy: false,
    },
    {
      id: 4,
      nombre: "Lorena Jaramillo",
      tipoPlan: "Semestral",
      diasTotalesPlan: 144,
      diasAsistidos: 115,
      asistioHoy: true,
    },
  ]);

  // Función para registrar de manera manual la asistencia del día por parte del Administrador
  const registrarPresenciaManual = (id) => {
    setClientes((prevClientes) =>
      prevClientes.map((cliente) => {
        if (cliente.id === id) {
          return {
            ...cliente,
            asistioHoy: true,
            // Incrementamos también su contador acumulado para actualizar el porcentaje en tiempo real
            diasAsistidos: cliente.asistioHoy ? cliente.diasAsistidos : cliente.diasAsistidos + 1,
          };
        }
        return cliente;
      })
    );
  };

  // Calcular el porcentaje individual de cada uno
  const calcularPorcentaje = (asistidos, totales) => {
    return ((asistidos / totales) * 100).toFixed(1);
  };

  // Ordenar la lista para que funcione como una "tabla de posiciones" (Rankeado de mayor a menor porcentaje)
  const clientesOrdenados = [...clientes].sort((a, b) => {
    const porcA = a.diasAsistidos / a.diasTotalesPlan;
    const porcB = b.diasAsistidos / b.diasTotalesPlan;
    return porcB - porcA;
  });

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Tabla de Rendimiento y Asistencias</h2>
      
      <div className={styles.responsiveTable}>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th className={styles.textCenter}>Posición</th>
              <th>Cliente</th>
              <th>Plan Contratado</th>
              <th className={styles.textCenter}>Asistencias / Totales</th>
              <th className={styles.textCenter}>Porcentaje Real</th>
              <th className={styles.textCenter}>Estado Hoy</th>
              <th className={styles.textCenter}>Acción Admin</th>
            </tr>
          </thead>
          <tbody>
            {clientesOrdenados.map((cliente, index) => {
              const porcentaje = calcularPorcentaje(cliente.diasAsistidos, cliente.diasTotalesPlan);
              
              return (
                <tr key={cliente.id} className={cliente.asistioHoy ? styles.rowPresent : ''}>
                  <td className={`${styles.textCenter} ${styles.rankCell}`}>
                    {index + 1}º
                  </td>
                  <td className={styles.nameCell}>{cliente.nombre}</td>
                  <td>
                    <span className={`${styles.badgePlan} ${styles[cliente.tipoPlan.toLowerCase()]}`}>
                      {cliente.tipoPlan}
                    </span>
                  </td>
                  <td className={styles.textCenter}>
                    {cliente.diasAsistidos} / {cliente.diasTotalesPlan}
                  </td>
                  <td className={`${styles.textCenter} ${styles.percentageCell}`}>
                    {porcentaje}%
                  </td>
                  <td className={styles.textCenter}>
                    {cliente.asistioHoy ? (
                      <span className={`${styles.statusBadge} ${styles.statusPresent}`}>Presente</span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusAbsent}`}>Ausente</span>
                    )}
                  </td>
                  <td className={styles.textCenter}>
                    <Button
                      variant={cliente.asistioHoy ? "secondary" : "primary"}
                      onClick={() => registrarPresenciaManual(cliente.id)}
                      disabled={cliente.asistioHoy}
                    >
                      {cliente.asistioHoy ? "Registrado" : "Registrar Presencia"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;