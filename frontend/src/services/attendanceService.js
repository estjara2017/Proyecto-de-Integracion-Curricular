import { apiRequest } from './apiClient';

export const fetchPalabraDelDia = async () => {
  const data = await apiRequest('/asistencias/palabra-dia');
  return data.palabra;
};

export const registrarAsistenciaCliente = async (palabraIngresada) => {
  return apiRequest('/asistencias/auto-registro', {
    method: 'POST',
    body: JSON.stringify({ palabraIngresada })
  });
};
