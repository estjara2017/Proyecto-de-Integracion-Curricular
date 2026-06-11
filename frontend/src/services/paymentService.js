import { apiRequest } from './apiClient';

export const paymentService = {
  listarPlanes: async () => {
    const response = await apiRequest('/pagos/planes');
    return response.data || [];
  },

  obtenerResumenPlan: async (planId) => {
    const response = await apiRequest(`/pagos/planes/${planId}/resumen`);
    return response.data;
  },

  obtenerMiMembresia: async () => {
    const response = await apiRequest('/pagos/mi-membresia');
    return response.data;
  },

  notificarPago: async ({ planId, metodoPago }) => {
    return apiRequest('/pagos/notificar', {
      method: 'POST',
      body: JSON.stringify({ planId, metodoPago })
    });
  }
};
