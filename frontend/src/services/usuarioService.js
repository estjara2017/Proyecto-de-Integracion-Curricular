// frontend/src/services/usuarioService.js
const API_URL = 'http://localhost:3000/api/usuarios';

export const usuarioService = {
  // 1. Registrar un nuevo atleta en Elemental Cross Training
  registrar: async (datosUsuario) => {
    try {
      const response = await fetch(`${API_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en el registro');
      return data;
    } catch (error) {
      console.error('Error en usuarioService.registrar:', error); 
      throw error;
    }
  },

  // 2. Paso 1 del Login: Envía el correo para generar el código diario OTP
  solicitarOtp: async (correo) => {
    try {
      const response = await fetch(`${API_URL}/login/solicitar-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al enviar el código');
      return data;
    } catch (error) {
      console.error('Error en usuarioService.solicitarOtp:', error);
      throw error;
    }
  },

  // 3. Paso 2 del Login: Valida el código y guarda las credenciales iniciales
  verificarOtp: async (correo, codigoOtp) => {
    try {
      const response = await fetch(`${API_URL}/login/verificar-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, codigoOtp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Código OTP inválido o expirado');
      
      // Guardamos de inmediato la sesión mediante la respuesta del backend
      if (data.token && data.usuario) {
        localStorage.setItem('token_elemental', data.token);
        localStorage.setItem('rol_elemental', data.usuario.rol);
        localStorage.setItem('user_data', JSON.stringify(data.usuario));
      }
      
      return data;
    } catch (error) {
      console.error('Error en usuarioService.verificarOtp:', error);
      throw error;
    }
  }
};