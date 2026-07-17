import { useEffect, useState } from 'react';
import styles from './AdminRoutineManager.module.css';
import { adminService } from '../../../services/adminService';
import { formatFullName } from '../../../utils/displayFormatters';
import rutina1 from '../../../assets/Rutinas1.jpeg';
import rutina2 from '../../../assets/Rutinas2.jpeg';
import rutina3 from '../../../assets/Rutinas3.jpeg';
import rutina4 from '../../../assets/Rutinas4.jpeg';
import rutina5 from '../../../assets/Rutinas5.jpeg';
import rutina6 from '../../../assets/Rutinas6.jpeg';
import rutina7 from '../../../assets/Rutinas7.jpeg';
import rutina8 from '../../../assets/Rutinas8.jpeg';

const WEEK_DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
const NIVELES = ['Principiante', 'Novato', 'Intermedio', 'Avanzado', 'Elite'];
const DEFAULT_BLOCKS = ['Warm-up', 'Weightlifting', 'Gymnastic Strength', 'Metcon', 'Accesorios / Movilidad'];

const routineTemplates = [
  { id: 'rutina-1', title: 'Rutina 1', image: rutina1 },
  { id: 'rutina-2', title: 'Rutina 2', image: rutina2 },
  { id: 'rutina-3', title: 'Rutina 3', image: rutina3 },
  { id: 'rutina-4', title: 'Rutina 4', image: rutina4 },
  { id: 'rutina-5', title: 'Rutina 5', image: rutina5 },
  { id: 'rutina-6', title: 'Rutina 6', image: rutina6 },
  { id: 'rutina-7', title: 'Rutina 7', image: rutina7 },
  { id: 'rutina-8', title: 'Rutina 8', image: rutina8 }
];

const crearDiaVacio = (dia) => ({
  dia,
  bloques: DEFAULT_BLOCKS.map((tipo) => ({ tipo, ejerciciosTexto: '' }))
});

const crearFormVacio = () => ({
  id: null,
  titulo: '',
  etiqueta: '',
  descripcion: '',
  objetivo: '',
  tipoAsignacion: 'nivel',
  niveles: [],
  usuarioIds: [],
  lesionObjetivo: '',
  diasSemana: WEEK_DAYS.map(crearDiaVacio)
});

const crearRecursoVacio = () => ({
  id: null,
  levelId: '',
  titulo: '',
  subtitulo: '',
  descripcion: '',
  url: '',
  canalUrl: '',
  orden: 1,
  tipo: 'video'
});

const normalizarRutina = (rutina) => ({
  id: rutina.id,
  titulo: rutina.titulo || '',
  etiqueta: rutina.etiqueta || '',
  descripcion: rutina.descripcion || '',
  objetivo: rutina.objetivo || '',
  tipoAsignacion: rutina.tipoAsignacion || 'nivel',
  niveles: rutina.niveles || [],
  usuarioIds: (rutina.usuarioIds || []).map(String),
  lesionObjetivo: rutina.lesionObjetivo || '',
  diasSemana: WEEK_DAYS.map((day, index) => {
    const dia = (rutina.diasSemana || []).find((item) => item.dia === day)
      || rutina.diasSemana?.[index]
      || { dia: day, bloques: rutina.bloques || [] };
    return {
      dia: day,
      bloques: (dia.bloques?.length ? dia.bloques : DEFAULT_BLOCKS.map((tipo) => ({ tipo, ejercicios: [] }))).slice(0, 5).map((bloque) => ({
        tipo: bloque.tipo || '',
        ejerciciosTexto: (bloque.ejercicios || []).join('\n')
      }))
    };
  })
});

const toPayload = (form) => ({
  id: form.id,
  titulo: form.titulo,
  etiqueta: form.etiqueta,
  descripcion: form.descripcion,
  objetivo: form.objetivo,
  tipoAsignacion: form.tipoAsignacion,
  niveles: form.tipoAsignacion === 'cliente' ? [] : form.niveles,
  usuarioIds: form.tipoAsignacion === 'nivel' ? [] : form.usuarioIds.map(Number),
  lesionObjetivo: form.lesionObjetivo,
  diasSemana: form.diasSemana.map((dia) => ({
    dia: dia.dia,
    bloques: dia.bloques.map((bloque) => ({
      tipo: bloque.tipo,
      ejercicios: bloque.ejerciciosTexto.split('\n').map((linea) => linea.trim()).filter(Boolean)
    })).filter((bloque) => bloque.tipo || bloque.ejercicios.length)
  }))
});

const getYoutubeVideoId = (url = '') => {
  try {
    const parsed = new URL(String(url).trim());
    const host = parsed.hostname.replace(/^www\./, '');
    let id = '';

    if (host === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname.startsWith('/watch')) id = parsed.searchParams.get('v') || '';
      if (parsed.pathname.startsWith('/embed/')) id = parsed.pathname.split('/').filter(Boolean)[1] || '';
      if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/').filter(Boolean)[1] || '';
      if (parsed.pathname.startsWith('/live/')) id = parsed.pathname.split('/').filter(Boolean)[1] || '';
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
  } catch {
    return '';
  }
};

const isHttpUrl = (url = '') => {
  if (!url) return true;
  try {
    const parsed = new URL(String(url).trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export default function AdminRoutineManager({ mode = 'all' }) {
  const showRoutines = mode === 'all' || mode === 'routines';
  const showResources = mode === 'all' || mode === 'resources';
  const [rutinas, setRutinas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [form, setForm] = useState(crearFormVacio);
  const [resourceForm, setResourceForm] = useState(crearRecursoVacio);
  const [resourceError, setResourceError] = useState('');
  const [previewRoutine, setPreviewRoutine] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      Promise.all([
        showRoutines ? adminService.listarRutinasAdmin() : Promise.resolve([]),
        showResources ? adminService.listarRecursosPorNivel() : Promise.resolve([]),
        showRoutines ? adminService.listarClientes() : Promise.resolve([])
      ]).then(([rutinasData, recursosData, clientesData]) => {
        if (showRoutines) {
          setRutinas(rutinasData);
          setClientes(clientesData);
        }
        if (showResources) setRecursos(recursosData);
      }).catch((error) => console.error(error));
    }, 0);
    return () => clearTimeout(timer);
  }, [showResources, showRoutines]);

  const updateDayBlock = (dayIndex, blockIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.map((dia, idx) => (
        idx === dayIndex
          ? {
              ...dia,
              bloques: dia.bloques.map((bloque, bIdx) => (
                bIdx === blockIndex ? { ...bloque, [field]: value } : bloque
              ))
            }
          : dia
      ))
    }));
  };

  const toggleNivel = (nivel) => {
    setForm((prev) => ({
      ...prev,
      niveles: prev.niveles.includes(nivel)
        ? prev.niveles.filter((item) => item !== nivel)
        : [...prev.niveles, nivel]
    }));
  };

  const toggleCliente = (id) => {
    const value = String(id);
    setForm((prev) => {
      const nextIds = prev.usuarioIds.includes(value)
        ? prev.usuarioIds.filter((item) => item !== value)
        : [...prev.usuarioIds, value];
      const detalles = nextIds
        .map((clienteId) => clientes.find((cliente) => String(cliente.id) === clienteId))
        .filter(Boolean)
        .map((cliente) => `${formatFullName(cliente.nombre, cliente.apellido)}: ${cliente.detalleLesion || 'Sin descripcion'}`);
      return {
        ...prev,
        usuarioIds: nextIds,
        lesionObjetivo: detalles.join('\n')
      };
    });
  };

  const addDayBlock = () => {
    setForm((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.map((dia, index) => (
        index === activeDay && dia.bloques.length < 5
          ? { ...dia, bloques: [...dia.bloques, { tipo: '', ejerciciosTexto: '' }] }
          : dia
      ))
    }));
  };

  const removeDayBlock = (blockIndex) => {
    setForm((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.map((dia, index) => (
        index === activeDay && dia.bloques.length > 1
          ? { ...dia, bloques: dia.bloques.filter((_, itemIndex) => itemIndex !== blockIndex) }
          : dia
      ))
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const saved = await adminService.guardarRutinaAdmin(toPayload(form));
    setRutinas((prev) => {
      const exists = prev.some((item) => item.id === saved.id);
      return exists ? prev.map((item) => item.id === saved.id ? saved : item) : [saved, ...prev];
    });
    setForm(crearFormVacio());
    setActiveDay(0);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm('Deseas eliminar esta rutina asignable?');
    if (!confirmar) return;
    await adminService.eliminarRutinaAdmin(id);
    setRutinas((prev) => prev.filter((rutina) => rutina.id !== id));
    if (form.id === id) setForm(crearFormVacio());
  };

  const handleResourceSubmit = async (event) => {
    event.preventDefault();
    if (!getYoutubeVideoId(resourceForm.url)) {
      setResourceError('Ingresa un enlace valido de YouTube. Si el ID del video esta incompleto o alterado, no se guardara.');
      return;
    }
    if (resourceForm.canalUrl && !isHttpUrl(resourceForm.canalUrl)) {
      setResourceError('La URL del canal o pagina debe iniciar con http:// o https://.');
      return;
    }

    try {
      const saved = await adminService.guardarRecursoNivel(resourceForm);
      setRecursos((prev) => prev.map((nivel) => (
        nivel.id === Number(saved.levelId)
          ? {
              ...nivel,
              LevelResources: [
                saved,
                ...(nivel.LevelResources || []).filter((resource) => resource.id !== saved.id)
              ].sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
            }
          : nivel
      )));
      setResourceForm(crearRecursoVacio());
      setResourceError('');
    } catch (error) {
      setResourceError(error.message || 'No se pudo guardar el enlace.');
    }
  };

  const handleResourceEdit = (resource, levelId) => {
    setResourceForm({
      id: resource.id,
      levelId,
      titulo: resource.titulo || '',
      subtitulo: resource.subtitulo || '',
      descripcion: resource.descripcion || '',
      url: resource.url || '',
      canalUrl: resource.canalUrl || '',
      orden: resource.orden || 1,
      tipo: resource.tipo || 'video'
    });
  };

  const handleResourceDelete = async (id, levelId) => {
    const confirmar = window.confirm('Deseas eliminar este enlace de video?');
    if (!confirmar) return;
    await adminService.eliminarRecursoNivel(id);
    setRecursos((prev) => prev.map((nivel) => (
      nivel.id === levelId
        ? { ...nivel, LevelResources: (nivel.LevelResources || []).filter((resource) => resource.id !== id) }
        : nivel
    )));
    if (resourceForm.id === id) setResourceForm(crearRecursoVacio());
  };

  const usarPlantilla = (template) => {
    setForm((prev) => ({
      ...prev,
      id: null,
      titulo: template.title,
      etiqueta: 'Referencia visual',
      descripcion: `Rutina creada usando ${template.title} como referencia visual.`
    }));
  };

  const activeDayData = form.diasSemana[activeDay];
  const clientesConLesion = clientes.filter((cliente) => (
    String(cliente.poseeLesion || '').trim().toUpperCase() === 'SI'
  ));
  const youtubeVideoId = getYoutubeVideoId(resourceForm.url);
  const youtubePreviewUrl = youtubeVideoId ? `https://www.youtube.com/embed/${youtubeVideoId}` : '';

  return (
    <div className={`${styles.managerGrid} ${mode !== 'all' ? styles.singleMode : ''}`}>
      {showRoutines && (
        <>
      <section className={styles.formPanel}>
        <h4>{form.id ? 'Editar rutina asignable' : 'Crear rutina asignable'}</h4>
        <form onSubmit={handleSubmit}>
          <input value={form.titulo} onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))} placeholder="Titulo: Rutina avanzado semana 1-4" required />
          <input value={form.etiqueta} onChange={(e) => setForm((prev) => ({ ...prev, etiqueta: e.target.value }))} placeholder="Etiqueta: Avanzado / lesion hombro / fuerza baja" />
          <textarea value={form.descripcion} onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))} placeholder="Descripcion general" rows={2} />
          <textarea value={form.objetivo} onChange={(e) => setForm((prev) => ({ ...prev, objetivo: e.target.value }))} placeholder="Objetivo que vera el cliente" rows={2} />

          <div className={styles.assignmentPanel}>
            <label>
              <input type="radio" name="tipoAsignacion" value="nivel" checked={form.tipoAsignacion === 'nivel'} onChange={(e) => setForm((prev) => ({ ...prev, tipoAsignacion: e.target.value }))} />
              Asignar por nivel
            </label>
            <label>
              <input type="radio" name="tipoAsignacion" value="cliente" checked={form.tipoAsignacion === 'cliente'} onChange={(e) => setForm((prev) => ({ ...prev, tipoAsignacion: e.target.value }))} />
              Asignar a clientes especificos
            </label>
          </div>

          {form.tipoAsignacion !== 'cliente' && (
            <div className={styles.checkGrid}>
              {NIVELES.map((nivel) => (
                <label key={nivel}>
                  <input type="checkbox" checked={form.niveles.includes(nivel)} onChange={() => toggleNivel(nivel)} />
                  {nivel}
                </label>
              ))}
            </div>
          )}

          {form.tipoAsignacion !== 'nivel' && (
            <>
              <textarea value={form.lesionObjetivo} onChange={(e) => setForm((prev) => ({ ...prev, lesionObjetivo: e.target.value }))} placeholder="Notas de lesion o limitacion: brazos, movilidad reducida, bajo peso..." rows={2} />
              <div className={styles.clientPicker}>
                {clientesConLesion.map((cliente) => (
                  <label key={cliente.id}>
                    <input type="checkbox" checked={form.usuarioIds.includes(String(cliente.id))} onChange={() => toggleCliente(cliente.id)} />
                    {formatFullName(cliente.nombre, cliente.apellido)} - {cliente.nivel}
                  </label>
                ))}
                {!clientesConLesion.length && (
                  <p className={styles.emptyText}>No hay clientes registrados con lesion o discapacidad.</p>
                )}
              </div>
            </>
          )}

          <div className={styles.dayTabs}>
            {form.diasSemana.map((dia, index) => (
              <button key={dia.dia} type="button" className={activeDay === index ? styles.activeDayTab : ''} onClick={() => setActiveDay(index)}>
                {dia.dia}
              </button>
            ))}
          </div>
          <p className={styles.saturdayNotice}>Sabado: escoge la rutina que prefieras.</p>

          <div className={styles.blocksList}>
            {activeDayData.bloques.map((bloque, index) => (
              <div key={`${activeDayData.dia}-${index}`} className={styles.blockEditor}>
                <input value={bloque.tipo} onChange={(e) => updateDayBlock(activeDay, index, 'tipo', e.target.value)} placeholder="Bloque" />
                <textarea value={bloque.ejerciciosTexto} onChange={(e) => updateDayBlock(activeDay, index, 'ejerciciosTexto', e.target.value)} placeholder="Un ejercicio por linea" rows={4} />
                <button type="button" className={styles.removeBlockButton} onClick={() => removeDayBlock(index)} disabled={activeDayData.bloques.length <= 1}>
                  Eliminar seccion
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={styles.addBlockButton}
            onClick={addDayBlock}
            disabled={activeDayData.bloques.length >= 5}
          >
            Agregar seccion ({activeDayData.bloques.length}/5)
          </button>

          <div className={styles.formActions}>
            <button type="button" onClick={() => setForm(crearFormVacio())}>Limpiar</button>
            <button type="submit">Guardar rutina</button>
          </div>
        </form>
      </section>

      <section className={styles.listPanel}>
        <h4>Plantillas visuales</h4>
        <div className={styles.templateGallery}>
          {routineTemplates.map((template) => (
            <article key={template.id} className={styles.templateCard}>
              <button type="button" className={styles.templateImageFrame} onClick={() => setSelectedTemplate(template)} aria-label={`Ver ${template.title} ampliada`}>
                <img src={template.image} alt={template.title} />
              </button>
              <div className={styles.templateMeta}>
                <strong>{template.title}</strong>
                <button type="button" onClick={() => usarPlantilla(template)}>Usar referencia</button>
              </div>
            </article>
          ))}
        </div>

        <h4 className={styles.savedTitle}>Rutinas asignables guardadas</h4>
        <div className={styles.scrollList}>
          {rutinas.length ? (
            rutinas.map((rutina) => (
              <article key={rutina.id} className={styles.routineCard}>
                <div>
                  <strong>{rutina.titulo}</strong>
                  <p>{rutina.etiqueta || rutina.descripcion}</p>
                  <small>
                    {rutina.usuarioIds?.length ? `Clientes: ${rutina.usuarioIds.length}` : `Niveles: ${(rutina.niveles || []).join(', ') || 'Sin asignar'}`}
                  </small>
                </div>
                <div className={styles.routineActions}>
                  <button type="button" onClick={() => setPreviewRoutine(rutina)}>Ver</button>
                  <button type="button" onClick={() => { setForm(normalizarRutina(rutina)); setActiveDay(0); }}>Editar</button>
                  <button type="button" onClick={() => handleDelete(rutina.id)}>Borrar</button>
                </div>
              </article>
            ))
          ) : (
            <p className={styles.emptyText}>Aun no hay rutinas asignables guardadas en la base de datos.</p>
          )}
        </div>
      </section>
        </>
      )}

      {showResources && (
      <section className={styles.resourcePanel}>
        <h4>Enlaces por nivel</h4>
        <form className={styles.resourceForm} onSubmit={handleResourceSubmit}>
          <select value={resourceForm.levelId} onChange={(e) => setResourceForm((prev) => ({ ...prev, levelId: e.target.value }))} required>
            <option value="">Selecciona nivel</option>
            {recursos.map((nivel) => (
              <option key={nivel.id} value={nivel.id}>{nivel.nombre}</option>
            ))}
          </select>
          <input value={resourceForm.titulo} onChange={(e) => setResourceForm((prev) => ({ ...prev, titulo: e.target.value }))} placeholder="Titulo del video" required />
          <input value={resourceForm.subtitulo} onChange={(e) => setResourceForm((prev) => ({ ...prev, subtitulo: e.target.value }))} placeholder="Subtitulo / categoria" />
          <input value={resourceForm.url} onChange={(e) => { setResourceForm((prev) => ({ ...prev, url: e.target.value })); setResourceError(''); }} placeholder="URL de YouTube" required />
          <input value={resourceForm.canalUrl} onChange={(e) => { setResourceForm((prev) => ({ ...prev, canalUrl: e.target.value })); setResourceError(''); }} placeholder="URL del canal o pagina del negocio" />
          <label className={styles.fieldWithLabel}>
            <span>Posicion del video en el nivel</span>
            <select value={resourceForm.orden} onChange={(e) => setResourceForm((prev) => ({ ...prev, orden: e.target.value }))}>
              <option value="1">1 - Primer video</option>
              <option value="2">2 - Segundo video</option>
              <option value="3">3 - Tercer video</option>
            </select>
          </label>
          <textarea value={resourceForm.descripcion} onChange={(e) => setResourceForm((prev) => ({ ...prev, descripcion: e.target.value }))} placeholder="Descripcion visible para clientes" rows={2} />
          {(resourceError || youtubePreviewUrl) && (
            <div className={resourceError ? styles.resourceError : styles.resourcePreview}>
              {resourceError ? (
                resourceError
              ) : (
                <>
                  Enlace valido. ID detectado: <strong>{youtubeVideoId}</strong>
                  <a href={youtubePreviewUrl} target="_blank" rel="noreferrer">Probar video</a>
                </>
              )}
            </div>
          )}
          <div className={styles.resourceActions}>
            <button type="button" onClick={() => setResourceForm(crearRecursoVacio())}>Limpiar enlace</button>
            <button type="submit">{resourceForm.id ? 'Actualizar enlace' : 'Guardar enlace'}</button>
          </div>
        </form>
        <div className={styles.levelGrid}>
          {recursos.length ? (
            recursos.map((nivel) => (
              <article key={nivel.id} className={styles.levelCard}>
                <strong>{nivel.nombre}</strong>
                {(nivel.LevelResources || []).map((resource) => (
                  <div key={resource.id} className={styles.resourceItem}>
                    <a href={resource.url} target="_blank" rel="noreferrer">{resource.titulo}</a>
                    <span>{resource.subtitulo || 'Video'}</span>
                    <div>
                      <button type="button" onClick={() => handleResourceEdit(resource, nivel.id)}>Editar</button>
                      <button type="button" onClick={() => handleResourceDelete(resource.id, nivel.id)}>Borrar</button>
                    </div>
                  </div>
                ))}
              </article>
            ))
          ) : (
            <p className={styles.emptyText}>Aun no hay enlaces de YouTube registrados para los niveles.</p>
          )}
        </div>
      </section>
      )}

      {selectedTemplate && (
        <div className={styles.imageModalOverlay} onClick={() => setSelectedTemplate(null)}>
          <div className={styles.imageModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.imageModalHeader}>
              <h3>{selectedTemplate.title}</h3>
              <button type="button" onClick={() => setSelectedTemplate(null)} aria-label="Cerrar imagen">X</button>
            </div>
            <div className={styles.imageModalBody}>
              <img src={selectedTemplate.image} alt={selectedTemplate.title} />
            </div>
          </div>
        </div>
      )}

      {previewRoutine && (
        <div className={styles.imageModalOverlay} onClick={() => setPreviewRoutine(null)}>
          <div className={styles.routinePreviewModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.imageModalHeader}>
              <h3>Vista del cliente: {previewRoutine.titulo}</h3>
              <button type="button" onClick={() => setPreviewRoutine(null)} aria-label="Cerrar vista previa">X</button>
            </div>
            <div className={styles.routinePreviewBody}>
              <div className={styles.previewSummary}>
                <strong>Objetivo</strong>
                <p>{previewRoutine.objetivo || previewRoutine.descripcion || 'Sin objetivo registrado.'}</p>
              </div>
              {(previewRoutine.diasSemana || []).filter((dia) => WEEK_DAYS.includes(dia.dia)).map((dia) => (
                <article key={dia.dia} className={styles.previewDay}>
                  <h3>{dia.dia}</h3>
                  {(dia.bloques || []).map((bloque, index) => (
                    <section key={`${dia.dia}-${index}`}>
                      <h4>{bloque.tipo || `Seccion ${index + 1}`}</h4>
                      <ul>
                        {(bloque.ejercicios || []).map((ejercicio) => <li key={ejercicio}>{ejercicio}</li>)}
                      </ul>
                    </section>
                  ))}
                </article>
              ))}
              <p className={styles.saturdayNotice}>Sabados: tu escoges tu rutina.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
