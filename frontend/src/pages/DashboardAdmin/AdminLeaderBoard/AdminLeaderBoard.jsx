import { useState } from 'react';
import styles from '../AdminLeaderBoard/AdminLeaderBoard.module.css';
import Button from '../../../components/Button/Button';

const MOCK_LEADERBOARD_DATA = [
  { id: 101, posGbl: "N° 3", posFilt: 1, atleta: "Christian Ruiz", nivel: "Principiante", puntos: "902 pts", requiereAscenso: true },
  { id: 102, posGbl: "N° 6", posFilt: 2, atleta: "Esteban Jara", nivel: "Principiante", puntos: "675 pts", requiereAscenso: true },
  { id: 103, posGbl: "N° 7", posFilt: 3, atleta: "Roberto Gómez", nivel: "Intermedio", puntos: "550 pts", requiereAscenso: false },
  { id: 104, posGbl: "N° 8", posFilt: 4, atleta: "Jorge Loor", nivel: "Principiante", puntos: "519 pts", requiereAscenso: false }
];

export default function AdminLeaderboard() {
  const [atletas, setAtletas] = useState(MOCK_LEADERBOARD_DATA);

  const handlePromoverNivel = (id, nombre, nivelActual) => {
    const siguienteNivel = nivelActual === "Principiante" ? "Intermedio" : "Avanzado / RX";
    alert(`¡Atleta ${nombre} promovido exitosamente a nivel ${siguienteNivel}!`);
    setAtletas(prev => prev.map(atl => 
      atl.id === id ? { ...atl, nivel: siguienteNivel, requiereAscenso: false } : atl
    ));
  };

  // Función para renderizar las medallas exactas de la imagen
  const renderMedal = (pos) => {
    if (pos === 1) return <span>🥇 1</span>;
    if (pos === 2) return <span>🥈 2</span>;
    if (pos === 3) return <span>🥉 3</span>;
    return pos;
  };

  return (
    <div className={styles.leaderboardCard}>
      
      {/* Encabezado Vinotinto exacto a la imagen del cliente */}
      <div className={styles.cardHeader}>
        <h3>TABLA DE POSICIONES INTERNA</h3>
        <p>Clasificación Basada en Rendimiento y Constancia</p>
      </div>

      {/* Barra de Filtros decorativa superior */}
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

      {/* Contenedor de la Tabla */}
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
            {atletas.map((atl) => (
              <tr key={atl.id}>
                <td className={styles.posGblText}>{atl.posGbl}</td>
                <td className={styles.medalCell}>{renderMedal(atl.posFilt)}</td>
                <td className={styles.atletaName}>{atl.atleta}</td>
                <td>
                  <span className={`${styles.nivelBadge} ${styles[atl.nivel.toLowerCase().split(' ')[0]]}`}>
                    {atl.nivel}
                  </span>
                </td>
                <td className={styles.pointsText}>{atl.puntos}</td>
                <td className={styles.actionsCell}>
                  {atl.requiereAscenso ? (
                    <div className={styles.actionGroup}>
                      <span className={styles.alertBadge}>⚡ Listo para Ascenso</span>
                      <Button variant="dark" onClick={() => handlePromoverNivel(atl.id, atl.atleta, atl.nivel)}>
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