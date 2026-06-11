import { createContext, useState, useContext, useCallback } from 'react';
import { authService } from '../services/authServices';

const AuthContext = createContext(null);

const avatarIndexMap = {
  agua: 0,
  fuego: 1,
  aire: 2,
  tierra: 3
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 30;
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1;
  return edad;
};

export function AuthProvider({ children }) {
  const usuarioInicial = authService.estaAutenticado() ? authService.obtenerUsuario() : null;
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [rol, setRol] = useState(usuarioInicial ? authService.obtenerRol() : null);
  const [autenticado, setAutenticado] = useState(Boolean(usuarioInicial));
  const [cargando] = useState(false);

  const loginContext = useCallback((datosUsuario, token) => {
    localStorage.setItem('token_elemental', token);
    localStorage.setItem('rol_elemental', datosUsuario.rol);
    localStorage.setItem('user_data', JSON.stringify(datosUsuario));

    setUsuario(datosUsuario);
    setRol(datosUsuario.rol);
    setAutenticado(true);
  }, []);

  const actualizarUsuarioContext = useCallback((datosUsuario) => {
    localStorage.setItem('user_data', JSON.stringify(datosUsuario));
    localStorage.setItem('rol_elemental', datosUsuario.rol);
    setUsuario(datosUsuario);
    setRol(datosUsuario.rol);
  }, []);

  const logoutContext = useCallback(() => {
    authService.logout();
    setUsuario(null);
    setRol(null);
    setAutenticado(false);
  }, []);

  const atleta = {
    id: usuario?.id || 'user_05',
    nombre: usuario ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() : 'Cargando atleta...',
    edad: usuario?.edad || calcularEdad(usuario?.fechaNacimiento),
    nivel: usuario?.nivel || 'Principiante',
    posicion: usuario?.posicion || 'N° --',
    pesoCorporal: usuario?.peso || 0,
    estatura: usuario?.estatura || 0,
    pesoLevantamiento: usuario?.pesoLevantamientoKg || 0,
    pesoMaxPromedio: usuario?.pesoMaxPromedioKg || 0,
    pesoTeoricoMax: usuario?.pesoTeoricoMaxKg || 100,
    porcentajeProgreso: usuario?.porcentajeProgreso || 0,
    estado: usuario?.estado || 'inactivo',
    horarioEntrenamiento: usuario?.horarioEntrenamiento || '',
    avatarIndex: avatarIndexMap[usuario?.avatar] ?? 0
  };

  const valorContexto = {
    usuario,
    atleta,
    rol,
    autenticado,
    cargando,
    loginContext,
    logoutContext,
    actualizarUsuarioContext
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
