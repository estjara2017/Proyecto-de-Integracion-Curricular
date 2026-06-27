import { useEffect, useMemo, useState } from 'react';
import styles from './Leaderboard.module.css';
import { profileService } from '../../../services/profileService';
import { toPascalCaseText } from '../../../utils/displayFormatters';

function Leaderboard({ dbUser = { nivel: 'Principiante', edad: 30, id: 'user_05' } }) {
  const [filtrarPorNivel, setFiltrarPorNivel] = useState(true);
  const [filtrarPorEdad, setFiltrarPorEdad] = useState(true);
  const [atletas, setAtletas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarRanking = async () => {
      try {
        const ranking = await profileService.obtenerRanking();
        setAtletas(ranking);
      } catch (err) {
        setError(err.message || 'No se pudo cargar el ranking');
      }
    };

    cargarRanking();
  }, []);

  const obtenerRangoEdad = (edad) => {
    if (edad >= 12 && edad < 18) return '12-18';
    if (edad >= 18 && edad < 30) return '18-30';
    if (edad >= 30 && edad < 50) return '30-50';
    return '50+';
  };

  const rangoUsuarioActual = obtenerRangoEdad(dbUser.edad);

  const tablaProcesada = useMemo(() => {
    const baseConPuntajeGlobal = atletas
      .map((atleta) => ({ ...atleta, scoreFinal: atleta.scoreFinal ?? atleta.puntos ?? 0 }))
      .sort((a, b) => b.scoreFinal - a.scoreFinal)
      .map((atleta, index) => ({ ...atleta, posicionGlobal: atleta.posicionGlobal || index + 1 }));

    const filtrados = baseConPuntajeGlobal.filter((atleta) => {
      if (filtrarPorNivel && atleta.nivel !== dbUser.nivel) return false;
      if (filtrarPorEdad && obtenerRangoEdad(atleta.edad) !== rangoUsuarioActual) return false;
      return true;
    });

    const ordenadosConFiltrada = filtrados.map((atleta, index) => ({
      ...atleta,
      posicionFiltrada: index + 1
    }));

    const indexUsuario = ordenadosConFiltrada.findIndex((atleta) => atleta.id === dbUser.id);

    if (ordenadosConFiltrada.length <= 7 || indexUsuario === -1) {
      return ordenadosConFiltrada;
    }

    const listaTruncada = [];
    ordenadosConFiltrada.forEach((atleta, index) => {
      if (atleta.posicionFiltrada <= 3) {
        listaTruncada.push(atleta);
        return;
      }

      if (index <= indexUsuario && index >= indexUsuario - 3) {
        if (atleta.posicionFiltrada !== 4 && !listaTruncada.some((item) => item.isDivider)) {
          listaTruncada.push({ isDivider: true, id: 'div-ellipsis' });
        }
        listaTruncada.push(atleta);
      }
    });

    return listaTruncada;
  }, [atletas, filtrarPorNivel, filtrarPorEdad, dbUser.nivel, dbUser.id, rangoUsuarioActual]);

  return (
    <section className={styles.leaderboardSection}>
      <div className={styles.sectionHeader}>
        <h2>TABLA DE POSICIONES INTERNA</h2>
        <span className={styles.subHeader}>Clasificacion Basada en Rendimiento y Constancia</span>
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={filtrarPorNivel}
              onChange={(e) => setFiltrarPorNivel(e.target.checked)}
            />
            <span className={styles.customCheck}></span>
            Filtrar mi nivel: <strong>{dbUser.nivel}</strong>
          </label>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={filtrarPorEdad}
              onChange={(e) => setFiltrarPorEdad(e.target.checked)}
            />
            <span className={styles.customCheck}></span>
            Filtrar mi rango de edad: <strong>{rangoUsuarioActual}</strong>
          </label>
        </div>
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.rankTable}>
          <thead>
            <tr>
              <th className={styles.centerText}>Pos. Gbl</th>
              <th className={styles.centerText}>Pos. Filt</th>
              <th>Atleta</th>
              <th>Nivel</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr><td colSpan="5" className={styles.noData}>{error}</td></tr>
            ) : tablaProcesada.length > 0 ? (
              tablaProcesada.map((atleta) => {
                if (atleta.isDivider) {
                  return (
                    <tr key={atleta.id} className={styles.dividerRow}>
                      <td colSpan="5" className={styles.dividerCell}>
                        Omitiendo atletas intermedios
                      </td>
                    </tr>
                  );
                }

                const posFilt = atleta.posicionFiltrada;
                let medallaFilt = `${posFilt}`;
                if (posFilt === 1) medallaFilt = '1';
                if (posFilt === 2) medallaFilt = '2';
                if (posFilt === 3) medallaFilt = '3';

                const esTuFila = atleta.id === dbUser.id;

                return (
                  <tr key={atleta.id} className={esTuFila ? styles.rowHighlight : ''}>
                    <td className={`${styles.rankCell} ${styles.globalCell} ${styles.centerText}`}>
                      N° {atleta.posicionGlobal}
                    </td>
                    <td className={`${styles.rankCell} ${styles.centerText}`}>{medallaFilt}</td>
                    <td>
                      {toPascalCaseText(atleta.nombre)}
                      {esTuFila && <span className={styles.youBadge}> (Tu)</span>}
                    </td>
                    <td><span className={styles.nivelBadge}>{atleta.nivel}</span></td>
                    <td><strong>{atleta.scoreFinal} pts</strong></td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className={styles.noData}>
                  No se encontraron atletas en este rango de filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Leaderboard;
