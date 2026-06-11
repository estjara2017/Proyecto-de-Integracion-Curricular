import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authServices';

export default function ProtectedRoute({ children, roles = [] }) {
  if (!authService.estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }

  const rol = authService.obtenerRol();
  if (roles.length > 0 && !roles.includes(rol)) {
    return <Navigate to={rol === 'admin' ? '/dashboardAdmin' : '/dashboardClient'} replace />;
  }

  return children;
}
