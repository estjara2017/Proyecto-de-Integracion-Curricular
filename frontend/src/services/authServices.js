export const authService = {
  obtenerToken: () => {
    return localStorage.getItem('token_elemental');
  },

  obtenerRol: () => {
    return localStorage.getItem('rol_elemental');
  },

  obtenerUsuario: () => {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },

  tokenExpirado: () => {
    const token = localStorage.getItem('token_elemental');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 <= Date.now() : false;
    } catch {
      return true;
    }
  },

  estaAutenticado: () => {
    const token = localStorage.getItem('token_elemental');
    if (!token || authService.tokenExpirado()) {
      authService.logout(false);
      return false;
    }

    return true;
  },

  logout: (redirect = true) => {
    localStorage.removeItem('token_elemental');
    localStorage.removeItem('rol_elemental');
    localStorage.removeItem('user_data');
    if (redirect) window.location.href = '/';
  }
};
