import { apiRequest } from './apiClient';

export const profileService = {
  obtenerPerfil: async () => {
    return apiRequest('/usuarios/me');
  },

  actualizarAvatar: async (avatar) => {
    const response = await apiRequest('/usuarios/me/avatar', {
      method: 'PATCH',
      body: JSON.stringify({ avatar })
    });
    return response.usuario;
  },

  actualizarHorario: async (horarioEntrenamiento) => {
    const response = await apiRequest('/usuarios/me/horario', {
      method: 'PATCH',
      body: JSON.stringify({ horarioEntrenamiento })
    });
    return response.usuario;
  },

  obtenerRanking: async () => {
    const response = await apiRequest('/usuarios/ranking');
    return response.data || [];
  },

  obtenerRutinas: async () => {
    return apiRequest('/usuarios/me/rutinas');
  }
};
