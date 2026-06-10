import { useEffect, useState } from 'react';
import styles from './PlanVerificationTable.module.css';
import Button from '../../../components/Button/Button';
import { adminService } from '../../../services/adminService';

const mapPago = (pago) => {
  const suscripcion = pago.Suscripcion || {};
  const usuario = suscripcion.Usuario || {};
  const plan = suscripcion.Plan || {};

  return {
    id: pago.id,
    atleta: `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim(),
    plan: plan.nombre || 'Plan solicitado',
    precio: `$${Number(pago.monto || 0).toFixed(2)}`,
    fecha: pago.fechaNotificacion ? pago.fechaNotificacion.slice(0, 10) : '',
    metodo: pago.metodoPago || 'Transferencia'
  };
};

export default function PlanVerificationTable() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPagos = async () => {
      try {
        const data = await adminService.listarPagosPendientes();
        setSolicitudes(data.map(mapPago));
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los pagos pendientes');
      }
    };

    cargarPagos();
  }, []);

  const handleActivar = async (id, atleta) => {
    try {
      await adminService.aprobarPago(id);
      alert(`Plan verificado con exito. El atleta ${atleta} ahora tiene su membresia ACTIVA.`);
      setSolicitudes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'No se pudo aprobar el pago');
    }
  };

  return (
    <div className={styles.tableWrapper}>
      {error ? (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyMessage}>{error}</p>
        </div>
      ) : solicitudes.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyMessage}>No hay pagos pendientes por verificar. Todo al dia.</p>
        </div>
      ) : (
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>Atleta</th>
              <th>Plan Solicitado</th>
              <th>Monto</th>
              <th>Fecha Solicitud</th>
              <th>Metodo de Pago</th>
              <th className={styles.centerText}>Accion</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((sol) => (
              <tr key={sol.id}>
                <td className={styles.boldText}>{sol.atleta}</td>
                <td><span className={styles.planBadge}>{sol.plan}</span></td>
                <td className={styles.priceText}>{sol.precio}</td>
                <td className={styles.dateText}>{sol.fecha}</td>
                <td className={styles.methodText}>{sol.metodo}</td>
                <td className={styles.actionCell}>
                  <Button variant="primary" onClick={() => handleActivar(sol.id, sol.atleta)}>
                    Verificar y Activar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
