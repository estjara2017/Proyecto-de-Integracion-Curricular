import Header2 from '../../components/Header/Header2';
import AdminRoutineManager from '../DashboardAdmin/AdminRoutineManager/AdminRoutineManager';
import styles from './AdminRoutines.module.css';

export default function AdminRoutines() {
  return (
    <div className={styles.page}>
      <Header2 />
      <main className={styles.workspace}>
        <section className={styles.card}>
          <header className={styles.cardHeader}>
            <h1>Administracion de rutinas</h1>
            <p>Crea, edita, asigna y revisa las rutinas disponibles para clientes y niveles.</p>
          </header>
          <div className={styles.cardBody}>
            <AdminRoutineManager mode="routines" />
          </div>
        </section>
      </main>
    </div>
  );
}
