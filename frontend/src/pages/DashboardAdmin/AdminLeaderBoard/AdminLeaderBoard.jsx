import { useEffect, useState } from 'react';
import styles from '../AdminLeaderBoard/AdminLeaderBoard.module.css';
import Button from '../../../components/Button/Button';
import { adminService } from '../../../services/adminService';

export default function AdminLeaderboard() {
  const [atletas, setAtletas] = useState([]);
  const [error, setError] = useState('');

  const cargarRanking = async () => {
    try {
      const data = await adminService.obtenerRanking();
      setAtletas(data);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el ranking');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarRanking();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handlePromoverNivel = async (id, nombre) => {
    try {
      await adminService.promoverCliente(id);
      alert(`Atleta ${nombre} promovido exitosamente.`);
      await cargarRanking();
    } catch (err) {
      alert(err.message || 'No se pudo promover al atleta');
    }
  };

  const renderMedal = (pos) => {
    if (pos === 1) return <span>1</span>;
    if (pos === 2) return <span>2</span>;
    if (pos === 3) return <span>3</span>;
    return pos;
  };

  return (
    <div className={styles.leaderboardCard}>
      <div className={styles.cardHeader}>
        <h3>TABLA DE POSICIONES INTERNA</h3>
        <p>Clasificacion Basada en Rendimiento y Constancia</p>
      </div>

      <div className={styles.filterBar}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" defaultChecked disabled />
          <span>Filtrar mi nivel: <strong>Principiante</strong></span>
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" defaultChecked disabled />
          <span>Filtrar mi rango de edad: <strong>25-40</strong></span>
        </label>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>POS. GBL</th>
              <th>POS. FILT</th>
              <th>ATLETA</th>
              <th>NIVEL</th>
              <th>PUNTOS</th>
              <th className={styles.centerText}>ACCIONES ADMINISTRADOR</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr><td colSpan="6" className={styles.normalBadge}>{error}</td></tr>
            ) : atletas.map((atl, index) => (
              <tr key={atl.id}>
                <td className={styles.posGblText}>N° {atl.posicionGlobal}</td>
                <td className={styles.medalCell}>{renderMedal(index + 1)}</td>
                <td className={styles.atletaName}>{atl.atleta}</td>
                <td>
                  <span className={`${styles.nivelBadge} ${styles[atl.nivel.toLowerCase().split(' ')[0]] || ''}`}>
                    {atl.nivel}
                  </span>
                </td>
                <td className={styles.pointsText}>{atl.puntos} pts</td>
                <td className={styles.actionsCell}>
                  {atl.listoParaAscenso ? (
                    <div className={styles.actionGroup}>
                      <span className={styles.alertBadge}>Listo para Ascenso</span>
                      <Button variant="dark" onClick={() => handlePromoverNivel(atl.id, atl.atleta)}>
                        Promover
                      </Button>
                    </div>
                  ) : (
                    <span className={styles.normalBadge}>Rango Estable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
