// frontend/src/services/authServices.js

export const authService = {
  // Obtener el token JWT actual para adjuntarlo en peticiones protegidas (como asistencia)
  obtenerToken: () => {
    return localStorage.getItem('token_elemental');
  },

  // Obtener el rol del usuario ('admin' o 'cliente') para control de vistas de navegación
  obtenerRol: () => {
    return localStorage.getItem('rol_elemental');
  },

  // Obtener el objeto completo del usuario autenticado (nombre, correo, etc.)
  obtenerUsuario: () => {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },

  // Saber si hay una sesión activa en el navegador
  estaAutenticado: () => {
    const token = localStorage.getItem('token_elemental');
    // Retorna true si el token existe y no está vacío
    return !!token;
  },

  // Cerrar sesión de Elemental Cross Training de forma limpia
  logout: () => {
    localStorage.removeItem('token_elemental');
    localStorage.removeItem('rol_elemental');
    localStorage.removeItem('user_data');
    // Opcional: Forzar una redirección a la página principal de presentación
    window.location.href = '/';
  }
};