import { useState, useMemo } from 'react'
import styles from './Leaderboard.module.css'

const BACKEND_USERS_MOCK = [
  { id: "u1", nombre: 'Carlos Mendoza', nivel: 'Avanzado', edad: 25, asistencia: 98, puntos: 1200 },
  { id: "u2", nombre: 'Diana Paredes', nivel: 'Principiante', edad: 22, asistencia: 95, puntos: 1050 },
  { id: "u3", nombre: 'Christian Ruiz', nivel: 'Principiante', edad: 31, asistencia: 92, puntos: 980 },
  { id: "u4", nombre: 'Ana María Silva', nivel: 'Principiante', edad: 48, asistencia: 96, puntos: 890 },
  { id: "u5", nombre: 'Esteban Jara', nivel: 'Principiante', edad: 30, asistencia: 90, puntos: 750, esUsuarioActual: true },
  { id: "u6", nombre: 'Jorge Loor', nivel: 'Principiante', edad: 34, asistencia: 85, puntos: 610 },
  { id: "u7", nombre: 'Alejandra Vélez', nivel: 'Principiante', edad: 52, asistencia: 90, puntos: 910 },
  { id: "u8", nombre: 'Roberto Gómez', nivel: 'Principiante', edad: 29, asistencia: 50, puntos: 1100 }
]

function Leaderboard({ dbUser = { nivel: 'Principiante', edad: 30, id: 'user_05' } }) {
  const [filtrarPorNivel, setFiltrarPorNivel] = useState(true)
  const [filtrarPorEdad, setFiltrarPorEdad] = useState(true)

  const obtenerRangoEdad = (edad) => {
    if (edad >= 15 && edad < 25) return '15-25'
    if (edad >= 25 && edad < 40) return '25-40'
    if (edad >= 40 && edad <= 70) return '40-70'
    return '70+'
  }

  const rangoUsuarioActual = obtenerRangoEdad(dbUser.edad)

  // LOGICA PRE-BACKEND: Simula el cálculo de las posiciones de la BD
  const tablaProcesada = useMemo(() => {
    
    // PASO 1: Calcular Ranking Global Fijo (Tal como vendría desde tu Base de Datos SQL/NoSQL)
    const baseConPuntajeGlobal = BACKEND_USERS_MOCK.map(atleta => {
      const factorAsistencia = atleta.asistencia / 100
      const scoreFinal = Math.round(atleta.puntos * factorAsistencia)
      return { ...atleta, scoreFinal }
    })
    // Ordenar de manera absoluta a todos
    .sort((a, b) => b.scoreFinal - a.scoreFinal)
    // Asignar su puesto general definitivo
    .map((atleta, index) => ({ ...atleta, posicionGlobal: index + 1 }))


    // PASO 2: Aplicar los filtros interactivos solicitados por el cliente
    let filtrados = baseConPuntajeGlobal.filter(atleta => {
      if (filtrarPorNivel && atleta.nivel !== dbUser.nivel) return false
      if (filtrarPorEdad && obtenerRangoEdad(atleta.edad) !== rangoUsuarioActual) return false
      return true
    })

    // PASO 3: Calcular la posición relativa en base al sub-grupo filtrado
    const ordenadosConFiltrada = filtrados.map((atleta, index) => ({
      ...atleta,
      posicionFiltrada: index + 1
    }))

    // PASO 4: Algoritmo de espejo e inyección de elipsis (...) para listas largas
    const indexUsuario = ordenadosConFiltrada.findIndex(a => a.esUsuarioActual || a.id === dbUser.id)

    if (ordenadosConFiltrada.length <= 7 || indexUsuario === -1) {
      return ordenadosConFiltrada
    }

    const listaTruncada = []
    ordenadosConFiltrada.forEach((atleta, index) => {
      // El top 3 de los filtrados se mantiene visible
      if (atleta.posicionFiltrada <= 3) {
        listaTruncada.push(atleta)
        return
      }

      // El usuario actual y sus 3 puestos inmediatos superiores en este filtro
      if (index <= indexUsuario && index >= indexUsuario - 3) {
        if (atleta.posicionFiltrada !== 4 && !listaTruncada.some(item => item.isDivider)) {
          listaTruncada.push({ isDivider: true, id: 'div-ellipsis' })
        }
        listaTruncada.push(atleta)
      }
    })

    return listaTruncada
  }, [filtrarPorNivel, filtrarPorEdad, dbUser.nivel, dbUser.id, rangoUsuarioActual])

  return (
    <section className={styles.leaderboardSection}>
      <div className={styles.sectionHeader}>
        <h2>TABLA DE POSICIONES INTERNA</h2>
        <span className={styles.subHeader}>Clasificación Basada en Rendimiento y Constancia</span>
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
            {tablaProcesada.length > 0 ? (
              tablaProcesada.map((atleta) => {
                if (atleta.isDivider) {
                  return (
                    <tr key={atleta.id} className={styles.dividerRow}>
                      <td colSpan="5" className={styles.dividerCell}>
                        •••• Omitiendo atletas intermedios ••••
                      </td>
                    </tr>
                  )
                }

                const posFilt = atleta.posicionFiltrada
                let medallaFilt = `${posFilt}`
                if (posFilt === 1) medallaFilt = '🥇 1'
                if (posFilt === 2) medallaFilt = '🥈 2'
                if (posFilt === 3) medallaFilt = '🥉 3'

                const esTuFila = atleta.esUsuarioActual || atleta.id === dbUser.id

                return (
                  <tr 
                    key={atleta.id} 
                    className={esTuFila ? styles.rowHighlight : ''}
                  >
                    {/* Nueva columna: Ranking Global Inalterable */}
                    <td className={`${styles.rankCell} ${styles.globalCell} ${styles.centerText}`}>
                      N° {atleta.posicionGlobal}
                    </td>
                    {/* Columna: Ranking Filtrado de la Vista */}
                    <td className={`${styles.rankCell} ${styles.centerText}`}>{medallaFilt}</td>
                    <td>
                      {atleta.nombre} 
                      {esTuFila && <span className={styles.youBadge}> (Tú)</span>}
                    </td>
                    <td><span className={styles.nivelBadge}>{atleta.nivel}</span></td>
                    <td><strong>{atleta.scoreFinal} pts</strong></td>
                  </tr>
                )
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
  )
}

export default Leaderboard