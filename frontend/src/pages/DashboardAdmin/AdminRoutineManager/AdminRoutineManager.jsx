import { useEffect, useState } from 'react';
import styles from './AdminRoutineManager.module.css';
import { adminService } from '../../../services/adminService';

const bloqueVacio = { tipo: 'Warm-up', ejerciciosTexto: '' };

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
        <h4>Plantillas guardadas</h4>
        <div className={styles.scrollList}>
          {rutinas.map((rutina) => (
            <article key={rutina.id} className={styles.routineCard}>
              <div>
                <strong>{rutina.titulo}</strong>
                <p>{rutina.descripcion}</p>
              </div>
              <button type="button" onClick={() => setForm(normalizarRutina(rutina))}>Editar</button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.resourcePanel}>
        <h4>Enlaces por nivel</h4>
        <div className={styles.levelGrid}>
          {recursos.map((nivel) => (
            <article key={nivel.id} className={styles.levelCard}>
              <strong>{nivel.nombre}</strong>
              {(nivel.LevelResources || []).map((resource) => (
                <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
                  {resource.titulo}
                </a>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
