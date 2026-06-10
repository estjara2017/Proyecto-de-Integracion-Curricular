import { apiRequest } from './apiClient';

export const usuarioService = {
  registrar: async (datosUsuario) => {
    return apiRequest('/usuarios/registrar', {
      method: 'POST',
      body: JSON.stringify(datosUsuario)
    });
  },

  solicitarOtp: async (correo) => {
    return apiRequest('/usuarios/login/solicitar-otp', {
      method: 'POST',
      body: JSON.stringify({ correo })
    });
  },

  verificarOtp: async (correo, codigoOtp) => {
    const data = await apiRequest('/usuarios/login/verificar-otp', {
      method: 'POST',
      body: JSON.stringify({ correo, codigoOtp })
    });

    if (data.token && data.usuario) {
      localStorage.setItem('token_elemental', data.token);
      localStorage.setItem('rol_elemental', data.usuario.rol);
      localStorage.setItem('user_data', JSON.stringify(data.usuario));
    }

    return data;
  }
};
