import { useEffect, useState } from 'react';
import styles from './PlanVerificationTable.module.css';
import Button from '../../../components/Button/Button';
import { adminService } from '../../../services/adminService';
import { formatFullName } from '../../../utils/displayFormatters';

const mapPago = (pago) => {
  const suscripcion = pago.Suscripcion || {};
  const usuario = suscripcion.Usuario || {};
  const plan = suscripcion.Plan || {};

  return {
    id: pago.id,
    atleta: formatFullName(usuario.nombre, usuario.apellido),
    plan: plan.nombre || 'Plan solicitado',
    precio: `$${Number(pago.monto || 0).toFixed(2)}`,
    fecha: pago.fechaNotificacion ? pago.fechaNotificacion.slice(0, 10) : '',
    hora: pago.fechaNotificacion ? new Date(pago.fechaNotificacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
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
    const confirmar = window.confirm(`Vas a activar la membresia de ${atleta}. Confirma que el pago fue verificado correctamente.`);
    if (!confirmar) return;

    try {
      await adminService.aprobarPago(id);
      alert(`Plan verificado con exito. El atleta ${atleta} ahora tiene su membresia ACTIVA.`);
      setSolicitudes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'No se pudo aprobar el pago');
    }
  };

  const handleRechazar = async (id, atleta) => {
    const confirmar = window.confirm(`Quieres rechazar esta solicitud de ${atleta}? El cliente podra enviar una nueva solicitud de plan.`);
    if (!confirmar) return;

    try {
      await adminService.rechazarPago(id);
      alert('Solicitud rechazada. Ya no aparecera como pago pendiente.');
      setSolicitudes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'No se pudo rechazar la solicitud');
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
                <td className={styles.dateText}>{sol.fecha}{sol.hora ? ` ${sol.hora}` : ''}</td>
                <td className={styles.methodText}>{sol.metodo}</td>
                <td className={styles.actionCell}>
                  <div className={styles.actionGroup}>
                    <Button variant="primary" onClick={() => handleActivar(sol.id, sol.atleta)}>
                      Verificar y Activar
                    </Button>
                    <button
                      type="button"
                      className={styles.rejectButton}
                      onClick={() => handleRechazar(sol.id, sol.atleta)}
                    >
                      Rechazar solicitud
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
