import { useState } from 'react';
import styles from './RoutinePanel.module.css';

const fallbackVideos = [
  {
    id: 'video-demo-1',
    titulo: 'Tecnica de levantamiento',
    subtitulo: 'Clase demostrativa',
    descripcion: 'Referencia visual hasta registrar el enlace real de YouTube o un video local.',
    url: 'https://www.youtube.com/results?search_query=weightlifting+technique+crossfit'
  },
  {
    id: 'video-demo-2',
    titulo: 'Movilidad y calentamiento',
    subtitulo: 'Preparacion de clase',
    descripcion: 'Busqueda temporal relacionada con movilidad para entrenamiento.',
    url: 'https://www.youtube.com/results?search_query=crossfit+mobility+warm+up'
  },
  {
    id: 'video-demo-3',
    titulo: 'Metcon y acondicionamiento',
    subtitulo: 'Tecnica y ritmo',
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

const isLocalVideo = (url = '') => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

const rotateDaysByDate = (days = []) => {
  if (!days.length) return [];
  const today = new Date();
  const start = Math.floor(today.getTime() / 86400000) % days.length;
  return [...days.slice(start), ...days.slice(0, start)];
};

function RoutinePanel({ nivel = 'Principiante', rutinas = [], recursos = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [routineOpen, setRoutineOpen] = useState(true);
  const [videosOpen, setVideosOpen] = useState(true);
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
            <button
              type="button"
              className={styles.columnTitle}
              onClick={() => setRoutineOpen((prev) => !prev)}
            >
              <span>Rutinas y ejercicios</span>
              <span className={styles.columnIcon}>{routineOpen ? '-' : '+'}</span>
            </button>

            {routineOpen && !rutina ? (
              <p className={styles.emptyText}>Aun no hay rutinas asignadas para este nivel.</p>
            ) : routineOpen ? (
              <>
                <div className={styles.summaryGrid}>
                  <div>
                    <span className={styles.label}>Objetivo</span>
                    <p>{rutina.objetivo}</p>
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
            ) : null}
          </section>

          <section className={styles.videoColumn}>
            <button
              type="button"
              className={styles.columnTitle}
              onClick={() => setVideosOpen((prev) => !prev)}
            >
              <span>Videos y enlaces</span>
              <span className={styles.columnIcon}>{videosOpen ? '-' : '+'}</span>
            </button>

            {videosOpen && (
            <div className={styles.videoList}>
              {videos.map((recurso) => {
                const embedUrl = getYoutubeEmbedUrl(recurso.url);
                const isPlaceholder = recurso.url === '#';
                const localVideo = isLocalVideo(recurso.url);
                const Tag = isPlaceholder || embedUrl || localVideo ? 'div' : 'a';
                return (
                  <Tag
                    key={recurso.id}
                    href={isPlaceholder || embedUrl || localVideo ? undefined : recurso.url}
                    target={isPlaceholder || embedUrl || localVideo ? undefined : '_blank'}
                    rel={isPlaceholder || embedUrl || localVideo ? undefined : 'noreferrer'}
                    className={`${styles.videoCard} ${isPlaceholder ? styles.placeholderVideo : ''}`}
                  >
                    {localVideo ? (
                      <video
                        className={styles.videoFrame}
                        src={recurso.url}
                        controls
                        preload="metadata"
                      />
                    ) : embedUrl ? (
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
                    {(recurso.subtitulo || recurso.tipo) && (
                      <small className={styles.videoSubtitle}>
                        {recurso.subtitulo || recurso.tipo}
                      </small>
                    )}
                    <strong>{recurso.titulo}</strong>
                    <span>{recurso.descripcion}</span>
                    {embedUrl ? (
                      <a className={styles.videoLink} href={recurso.url} target="_blank" rel="noreferrer">
                        Abrir en YouTube
                      </a>
                    ) : !isPlaceholder && !localVideo ? (
                      <em className={styles.videoHint}>Abrir recurso</em>
                    ) : localVideo ? (
                      <em className={styles.videoHint}>Video cargado desde la plataforma</em>
                    ) : null}
                  </Tag>
                );
              })}
            </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default RoutinePanel;
