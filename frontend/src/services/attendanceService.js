import { apiRequest } from './apiClient';

export const fetchQrActivo = async () => {
  return apiRequest('/asistencias/qr-activo');
};

export const generarNuevoQrActivo = async () => {
  return apiRequest('/asistencias/qr-activo/generar', {
    method: 'POST'
  });
};

export const fetchPalabraDelDia = async (qrToken) => {
  const query = qrToken ? `?qr=${encodeURIComponent(qrToken)}` : '';
  const data = await apiRequest(`/asistencias/palabra-dia${query}`);
  return data.palabra;
};

export const registrarAsistenciaCliente = async (palabraIngresada, qrToken) => {
  return apiRequest('/asistencias/auto-registro', {
    method: 'POST',
    body: JSON.stringify({ palabraIngresada, qrToken })
  });
};
