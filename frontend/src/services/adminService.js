import { apiRequest } from './apiClient';

export const adminService = {
  listarClientes: async () => {
    const response = await apiRequest('/admin/clientes');
    return response.data || [];
  },

  listarClientesParaAsistencia: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString();
    const response = await apiRequest(`/admin/clientes/asistencia${query ? `?${query}` : ''}`);
    return response.data || [];
  },

  actualizarCliente: async (id, cambios) => {
    const response = await apiRequest(`/admin/clientes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cambios)
    });
    return response.data;
  },

  desactivarCliente: async (id) => {
    return apiRequest(`/admin/clientes/${id}`, { method: 'DELETE' });
  },

  asignarAdminPorCorreo: async (correo) => {
    const response = await apiRequest('/admin/usuarios/rol-admin', {
      method: 'PATCH',
      body: JSON.stringify({ correo })
    });
    return response.data;
  },

  listarPagosPendientes: async () => {
    const response = await apiRequest('/admin/pagos/pendientes');
    return response.data || [];
  },

  aprobarPago: async (pagoId) => {
    return apiRequest('/admin/pagos/aprobar', {
      method: 'PATCH',
      body: JSON.stringify({ pagoId })
    });
  },

  rechazarPago: async (pagoId) => {
    return apiRequest('/admin/pagos/rechazar', {
      method: 'PATCH',
      body: JSON.stringify({ pagoId })
    });
  },

  obtenerRanking: async () => {
    const response = await apiRequest('/admin/ranking');
    return response.data || [];
  },

  promoverCliente: async (id, nivelDestino = null) => {
    return apiRequest(`/admin/clientes/${id}/promover`, {
      method: 'PATCH',
      body: JSON.stringify(nivelDestino ? { nivelDestino } : {})
    });
  },

  descenderCliente: async (id, nivelDestino = null) => {
    return apiRequest(`/admin/clientes/${id}/descender`, {
      method: 'PATCH',
      body: JSON.stringify(nivelDestino ? { nivelDestino } : {})
    });
  },

  registrarAsistenciaManual: async ({ usuarioId, fechaAsistencia }) => {
    return apiRequest('/asistencias/registro-manual', {
      method: 'POST',
      body: JSON.stringify({ usuarioId, fechaAsistencia })
    });
  },

  listarRutinasAdmin: async () => {
    const response = await apiRequest('/admin/rutinas');
    return response.data || [];
  },

  guardarRutinaAdmin: async (rutina) => {
    const response = await apiRequest('/admin/rutinas', {
      method: 'POST',
      body: JSON.stringify(rutina)
    });
    return response.data;
  },

  eliminarRutinaAdmin: async (id) => {
    return apiRequest(`/admin/rutinas/${id}`, { method: 'DELETE' });
  },

  listarRecursosPorNivel: async () => {
    const response = await apiRequest('/admin/recursos-nivel');
    return response.data || [];
  },

  guardarRecursoNivel: async (recurso) => {
    const response = await apiRequest('/admin/recursos-nivel', {
      method: 'POST',
      body: JSON.stringify(recurso)
    });
    return response.data;
  },

  eliminarRecursoNivel: async (id) => {
    return apiRequest(`/admin/recursos-nivel/${id}`, { method: 'DELETE' });
  }
};
