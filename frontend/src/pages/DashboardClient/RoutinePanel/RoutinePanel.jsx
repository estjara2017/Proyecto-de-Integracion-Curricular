import { useState } from 'react';
import styles from './RoutinePanel.module.css';

function RoutinePanel({ nivel = 'Principiante', rutinas = [], recursos = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const rutina = rutinas[0];

  return (
    <div className={styles.accordionContainer}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Rutinas y videos - {nivel}</span>
        <span className={styles.icon}>{isOpen ? '-' : '+'}</span>
      </button>

      <div className={`${styles.accordionContent} ${isOpen ? styles.show : ''}`}>
        {!rutina ? (
          <p className={styles.emptyText}>Aun no hay rutinas asignadas para este nivel.</p>
        ) : (
          <>
            <div className={styles.summaryGrid}>
              <div>
                <span className={styles.label}>Objetivo</span>
                <p>{rutina.objetivo}</p>
              </div>
              <div>
                <span className={styles.label}>Escala de peso</span>
                <p>{rutina.escalaPeso?.porcentajeBase} - {rutina.escalaPeso?.referencia}</p>
              </div>
            </div>

            <div className={styles.daysGrid}>
              {(rutina.diasSemana || []).map((dia) => (
                <article key={dia.dia} className={styles.dayCard}>
                  <h3>{dia.dia}</h3>
                  {(dia.bloques || []).map((bloque) => (
                    <div key={`${dia.dia}-${bloque.tipo}`} className={styles.block}>
                      <h4>{bloque.tipo}</h4>
                      <ul>
                        {(bloque.ejercicios || []).map((ejercicio) => (
                          <li key={ejercicio}>{ejercicio}</li>
                        ))}
                      </ul>
                      {bloque.formato && <small>{bloque.formato}</small>}
                    </div>
                  ))}
                </article>
              ))}
            </div>

            <div className={styles.videoSection}>
              <h3>Videos explicativos</h3>
              <div className={styles.videoGrid}>
                {recursos.map((recurso) => (
                  <a
                    key={recurso.id}
                    href={recurso.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.videoCard}
                  >
                    <strong>{recurso.titulo}</strong>
                    <span>{recurso.descripcion}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RoutinePanel;
