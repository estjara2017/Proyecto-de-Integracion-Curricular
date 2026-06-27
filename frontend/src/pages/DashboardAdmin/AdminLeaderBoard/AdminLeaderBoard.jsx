import { useEffect, useMemo, useState } from 'react';
import styles from '../AdminLeaderBoard/AdminLeaderBoard.module.css';
import Button from '../../../components/Button/Button';
import { adminService } from '../../../services/adminService';
import { toPascalCaseText } from '../../../utils/displayFormatters';

export default function AdminLeaderboard() {
  const [atletas, setAtletas] = useState([]);
  const [error, setError] = useState('');
  const [filtrarNivel, setFiltrarNivel] = useState(false);
  const [filtrarEdad, setFiltrarEdad] = useState(false);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('Principiante');
  const [rangoSeleccionado, setRangoSeleccionado] = useState('25-40');

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

  const handleDescenderNivel = async (id, nombre) => {
    const confirmar = window.confirm(`Deseas descender a ${nombre} al nivel anterior?`);
    if (!confirmar) return;

    try {
      await adminService.descenderCliente(id);
      alert(`Atleta ${nombre} descendido exitosamente.`);
      await cargarRanking();
    } catch (err) {
      alert(err.message || 'No se pudo descender al atleta');
    }
  };

  const renderMedal = (pos) => {
    if (pos === 1) return <span>1</span>;
    if (pos === 2) return <span>2</span>;
    if (pos === 3) return <span>3</span>;
    return pos;
  };

  const obtenerRangoEdad = (edad) => {
    if (edad >= 12 && edad < 18) return '12-18';
    if (edad >= 18 && edad < 25) return '18-25';
    if (edad >= 25 && edad < 40) return '25-40';
    if (edad >= 40 && edad < 50) return '40-50';
    return '50+';
  };

  const nivelesDisponibles = useMemo(() => (
    [...new Set(atletas.map((atleta) => atleta.nivel).filter(Boolean))]
  ), [atletas]);

  const atletasFiltrados = useMemo(() => {
    const filtrados = atletas.filter((atleta) => {
      if (filtrarNivel && atleta.nivel !== nivelSeleccionado) return false;
      if (filtrarEdad && obtenerRangoEdad(atleta.edad) !== rangoSeleccionado) return false;
      return true;
    });

    return filtrados.map((atleta, index) => ({
      ...atleta,
      posicionFiltrada: index + 1
    }));
  }, [atletas, filtrarNivel, filtrarEdad, nivelSeleccionado, rangoSeleccionado]);

  return (
    <div className={styles.leaderboardCard}>
      <div className={styles.cardHeader}>
        <h3>TABLA DE POSICIONES INTERNA</h3>
        <p>Clasificacion Basada en Rendimiento y Constancia</p>
      </div>

      <div className={styles.filterBar}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filtrarNivel}
            onChange={(event) => setFiltrarNivel(event.target.checked)}
          />
          <span>Filtrar nivel:</span>
          <select
            value={nivelSeleccionado}
            onChange={(event) => setNivelSeleccionado(event.target.value)}
            disabled={!filtrarNivel}
          >
            {nivelesDisponibles.map((nivel) => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filtrarEdad}
            onChange={(event) => setFiltrarEdad(event.target.checked)}
          />
          <span>Filtrar rango de edad:</span>
          <select
            value={rangoSeleccionado}
            onChange={(event) => setRangoSeleccionado(event.target.value)}
            disabled={!filtrarEdad}
          >
            {['12-18', '18-25', '25-40', '40-50', '50+'].map((rango) => (
              <option key={rango} value={rango}>{rango}</option>
            ))}
          </select>
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
            ) : atletasFiltrados.length === 0 ? (
              <tr><td colSpan="6" className={styles.normalBadge}>No hay atletas para los filtros seleccionados.</td></tr>
            ) : atletasFiltrados.map((atl) => (
              <tr key={atl.id}>
                <td className={styles.posGblText}>N° {atl.posicionGlobal}</td>
                <td className={styles.medalCell}>{renderMedal(atl.posicionFiltrada)}</td>
                <td className={styles.atletaName}>{toPascalCaseText(atl.atleta)}</td>
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
                  ) : atl.listoParaDescenso ? (
                    <div className={styles.actionGroup}>
                      <span className={styles.warningBadge}>
                        Bajo minimo: {atl.puntosMinimosNivelActual} pts
                      </span>
                      <Button variant="secondary" onClick={() => handleDescenderNivel(atl.id, atl.atleta)}>
                        Descender
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
