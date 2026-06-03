import { useState } from 'react';
import styles from './PlanVerificationTable.module.css';
import Button from '../../../components/Button/Button';

const MOCK_PENDING_PLANS = [
  { id: 1, atleta: "Christian Ruiz", plan: "Mensual Inicial", precio: "$35.00", fecha: "2026-06-01", metodo: "Transferencia Banco Pichincha" },
  { id: 2, atleta: "Jorge Loor", plan: "Trimestral Pro", precio: "$90.00", fecha: "2026-06-02", metodo: "Transferencia Produbanco" }
];

export default function PlanVerificationTable() {
  const [solicitudes, setSolicitudes] = useState(MOCK_PENDING_PLANS);

  const handleActivar = (id, atleta) => {
    alert(`Plan verificado con éxito. El atleta ${atleta} ahora tiene su membresía ACTIVA.`);
    setSolicitudes(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={styles.tableWrapper}>
      {solicitudes.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyMessage}>🎉 No hay pagos pendientes por verificar. ¡Todo al día!</p>
        </div>
      ) : (
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>Atleta</th>
              <th>Plan Solicitado</th>
              <th>Monto</th>
              <th>Fecha Solicitud</th>
              <th>Método de Pago</th>
              <th className={styles.centerText}>Acción</th>
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