import { useState } from 'react';
import styles from './RoutinePanel.module.css';

const fallbackVideos = [
  {
    id: 'video-demo-1',
    titulo: 'Tecnica de levantamiento',
    descripcion: 'Referencia visual hasta registrar el enlace real de YouTube.',
    url: 'https://www.youtube.com/results?search_query=weightlifting+technique+crossfit'
  },
  {
    id: 'video-demo-2',
    titulo: 'Movilidad y calentamiento',
    descripcion: 'Busqueda temporal relacionada con movilidad para entrenamiento.',
    url: 'https://www.youtube.com/results?search_query=crossfit+mobility+warm+up'
  },
  {
    id: 'video-demo-3',
    titulo: 'Metcon y acondicionamiento',
    descripcion: 'Busqueda temporal hasta cargar videos oficiales del gimnasio.',
    url: 'https://www.youtube.com/results?search_query=crossfit+metcon+workout'
  }
];

const getYoutubeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname.startsWith('/embed/')) return url;
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }
  } catch {
    return '';
  }

  return '';
};

const rotateDaysByDate = (days = []) => {
  if (!days.length) return [];
  const today = new Date();
  const start = Math.floor(today.getTime() / 86400000) % days.length;
  return [...days.slice(start), ...days.slice(0, start)];
};

function RoutinePanel({ nivel = 'Principiante', rutinas = [], recursos = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const rutina = rutinas[0];
  const days = rotateDaysByDate(rutina?.diasSemana || []);
  const videos = recursos.length ? recursos : fallbackVideos;

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
        <div className={styles.routineWorkspace}>
          <section className={styles.routineColumn}>
            <div className={styles.columnTitle}>
              <span>Rutinas y ejercicios</span>
              <button type="button" aria-label="Agregar rutina">+</button>
            </div>

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
                    <span className={styles.label}>Ciclo automatico</span>
                    <p>Los dias se intercalan segun la fecha si no hay cambios del administrador.</p>
                  </div>
                </div>

                <div className={styles.daysList}>
                  {days.map((dia) => (
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
              </>
            )}
          </section>

          <section className={styles.videoColumn}>
            <div className={styles.columnTitle}>
              <span>Enlaces</span>
              <button type="button" aria-label="Agregar enlace">+</button>
            </div>

            <div className={styles.videoList}>
              {videos.map((recurso) => {
                const embedUrl = getYoutubeEmbedUrl(recurso.url);
                const isPlaceholder = recurso.url === '#';
                const Tag = isPlaceholder || embedUrl ? 'div' : 'a';
                return (
                  <Tag
                    key={recurso.id}
                    href={isPlaceholder || embedUrl ? undefined : recurso.url}
                    target={isPlaceholder || embedUrl ? undefined : '_blank'}
                    rel={isPlaceholder || embedUrl ? undefined : 'noreferrer'}
                    className={`${styles.videoCard} ${isPlaceholder ? styles.placeholderVideo : ''}`}
                  >
                    {embedUrl ? (
                      <iframe
                        className={styles.videoFrame}
                        src={embedUrl}
                        title={recurso.titulo}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className={styles.videoPreview}>
                        <span />
                      </div>
                    )}
                    <strong>{recurso.titulo}</strong>
                    <span>{recurso.descripcion}</span>
                  </Tag>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RoutinePanel;
