// src/services/attendanceService.js
const API_URL = 'http://localhost:4000/api/asistencias';

/**
 * Obtiene la palabra clave crossfitera registrada para el día actual.
 */
export const fetchPalabraDelDia = async () => {
  try {
    const response = await fetch(`${API_URL}/palabra-dia`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener la palabra del día');
    }
    return data.palabra; // Retorna ej: 'BURPEE'
  } catch (error) {
    console.error('Error en fetchPalabraDelDia:', error);
    throw error;
  }
};

/**
 * Envía la palabra clave desde la alerta flotante del panel para validar la asistencia.
 * @param {string} palabraIngresada - La palabra que escribió el atleta
 * @param {string} token - El Token JWT de sesión almacenado del usuario
 */
export const registrarAsistenciaCliente = async (palabraIngresada, token) => {
  try {
    const response = await fetch(`${API_URL}/auto-registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ palabraIngresada })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en registrarAsistenciaCliente:', error);
    throw error;
  }
};