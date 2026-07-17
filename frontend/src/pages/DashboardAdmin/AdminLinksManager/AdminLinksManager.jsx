import AdminRoutineManager from '../AdminRoutineManager/AdminRoutineManager';

// Punto de entrada independiente para la administracion de enlaces.
// Mantiene aislado el acordeon de YouTube de la ventana de rutinas.
export default function AdminLinksManager() {
  return <AdminRoutineManager mode="resources" />;
}
