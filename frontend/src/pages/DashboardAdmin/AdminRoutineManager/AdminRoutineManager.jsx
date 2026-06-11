import { useEffect, useState } from 'react';
import styles from './AdminRoutineManager.module.css';
import { adminService } from '../../../services/adminService';
import rutina1 from '../../../assets/Rutinas1.jpeg';
import rutina2 from '../../../assets/Rutinas2.jpeg';
import rutina3 from '../../../assets/Rutinas3.jpeg';
import rutina4 from '../../../assets/Rutinas4.jpeg';
import rutina5 from '../../../assets/Rutinas5.jpeg';
import rutina6 from '../../../assets/Rutinas6.jpeg';
import rutina7 from '../../../assets/Rutinas7.jpeg';
import rutina8 from '../../../assets/Rutinas8.jpeg';

const bloqueVacio = { tipo: 'Warm-up', ejerciciosTexto: '' };

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

const normalizarRutina = (rutina) => ({
  ...rutina,
  bloques: (rutina.bloques || []).map((bloque) => ({
    tipo: bloque.tipo,
    ejerciciosTexto: (bloque.ejercicios || []).join('\n')
  }))
});

export default function AdminRoutineManager() {
  const [rutinas, setRutinas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({
    id: null,
    titulo: '',
    descripcion: '',
    bloques: [
      { tipo: 'Warm-up', ejerciciosTexto: '' },
      { tipo: 'Fuerza / Weightlifting', ejerciciosTexto: '' },
      { tipo: 'Skill / Metcon', ejerciciosTexto: '' }
    ]
  });

  const cargarDatos = async () => {
    const [rutinasData, recursosData] = await Promise.all([
      adminService.listarRutinasAdmin(),
      adminService.listarRecursosPorNivel()
    ]);
    setRutinas(rutinasData);
    setRecursos(recursosData);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarDatos().catch((error) => console.error(error));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleBloqueChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      bloques: prev.bloques.map((bloque, idx) => (
        idx === index ? { ...bloque, [field]: value } : bloque
      ))
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      id: form.id,
      titulo: form.titulo,
      descripcion: form.descripcion,
      bloques: form.bloques.map((bloque) => ({
        tipo: bloque.tipo,
        ejercicios: bloque.ejerciciosTexto.split('\n').map((linea) => linea.trim()).filter(Boolean)
      }))
    };

    const saved = await adminService.guardarRutinaAdmin(payload);
    setRutinas((prev) => {
      const exists = prev.some((item) => item.id === saved.id);
      return exists ? prev.map((item) => item.id === saved.id ? saved : item) : [saved, ...prev];
    });
    setForm({ id: null, titulo: '', descripcion: '', bloques: [{ ...bloqueVacio }] });
  };

  const usarPlantilla = (template) => {
    setForm((prev) => ({
      ...prev,
      id: null,
      titulo: template.title,
      descripcion: `Rutina creada usando ${template.title} como referencia visual.`
    }));
  };

  return (
    <div className={styles.managerGrid}>
      <section className={styles.formPanel}>
        <h4>{form.id ? 'Editar rutina general' : 'Crear rutina general'}</h4>
        <form onSubmit={handleSubmit}>
          <input
            value={form.titulo}
            onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
            placeholder="Titulo de la rutina"
            required
          />
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Descripcion o enfoque del dia"
            rows={2}
          />

          <div className={styles.blocksList}>
            {form.bloques.map((bloque, index) => (
              <div key={index} className={styles.blockEditor}>
                <input
                  value={bloque.tipo}
                  onChange={(e) => handleBloqueChange(index, 'tipo', e.target.value)}
                  placeholder="Bloque"
                />
                <textarea
                  value={bloque.ejerciciosTexto}
                  onChange={(e) => handleBloqueChange(index, 'ejerciciosTexto', e.target.value)}
                  placeholder="Un ejercicio por linea"
                  rows={4}
                />
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, bloques: [...prev.bloques, { ...bloqueVacio }] }))}>
              Agregar bloque
            </button>
            <button type="submit">Guardar rutina</button>
          </div>
        </form>
      </section>

      <section className={styles.listPanel}>
        <h4>Plantillas visuales</h4>
        <div className={styles.templateGallery}>
          {routineTemplates.map((template) => (
            <article key={template.id} className={styles.templateCard}>
              <button
                type="button"
                className={styles.templateImageFrame}
                onClick={() => setSelectedTemplate(template)}
                aria-label={`Ver ${template.title} ampliada`}
              >
                <img src={template.image} alt={template.title} />
              </button>
              <div className={styles.templateMeta}>
                <strong>{template.title}</strong>
                <button type="button" onClick={() => usarPlantilla(template)}>
                  Usar referencia
                </button>
              </div>
            </article>
          ))}
        </div>

        <h4 className={styles.savedTitle}>Plantillas guardadas</h4>
        <div className={styles.scrollList}>
          {rutinas.length ? (
            rutinas.map((rutina) => (
              <article key={rutina.id} className={styles.routineCard}>
                <div>
                  <strong>{rutina.titulo}</strong>
                  <p>{rutina.descripcion}</p>
                </div>
                <button type="button" onClick={() => setForm(normalizarRutina(rutina))}>Editar</button>
              </article>
            ))
          ) : (
            <p className={styles.emptyText}>Aun no hay rutinas guardadas en la base de datos.</p>
          )}
        </div>
      </section>

      <section className={styles.resourcePanel}>
        <h4>Enlaces por nivel</h4>
        <div className={styles.levelGrid}>
          {recursos.length ? (
            recursos.map((nivel) => (
              <article key={nivel.id} className={styles.levelCard}>
                <strong>{nivel.nombre}</strong>
                {(nivel.LevelResources || []).map((resource) => (
                  <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
                    {resource.titulo}
                  </a>
                ))}
              </article>
            ))
          ) : (
            <p className={styles.emptyText}>Aun no hay enlaces de YouTube registrados para los niveles.</p>
          )}
        </div>
      </section>

      {selectedTemplate && (
        <div className={styles.imageModalOverlay} onClick={() => setSelectedTemplate(null)}>
          <div className={styles.imageModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.imageModalHeader}>
              <h3>{selectedTemplate.title}</h3>
              <button type="button" onClick={() => setSelectedTemplate(null)} aria-label="Cerrar imagen">
                X
              </button>
            </div>
            <div className={styles.imageModalBody}>
              <img src={selectedTemplate.image} alt={selectedTemplate.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
