import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authServices';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = () => {
      if (authService.estaAutenticado()) {
        setUsuario(authService.obtenerUsuario());
        setRol(authService.obtenerRol());
        setAutenticado(true);
      }
      setCargando(false);
    };
    verificarSesion();
  }, []);

  const loginContext = (datosUsuario, token) => {
    localStorage.setItem('token_elemental', token);
    localStorage.setItem('rol_elemental', datosUsuario.rol);
    localStorage.setItem('user_data', JSON.stringify(datosUsuario));

    setUsuario(datosUsuario);
    setRol(datosUsuario.rol);
    setAutenticado(true);
  };

  const logoutContext = () => {
    authService.logout();
    setUsuario(null);
    setRol(null);
    setAutenticado(false);
  };

  // 🚀 LOGICA CENTRALIZADA Y REUTILIZABLE:
  // Construimos el "atleta" perfectamente formateado aquí dentro para toda la app.
  // Si en el futuro cambian los nombres de la base de datos, solo los corriges aquí una vez.
  const atleta = {
    id: usuario?.id || "user_05",
    nombre: usuario?.nombre || 'Cargando atleta...',
    edad: usuario?.edad || 30,
    nivel: usuario?.nivel || 'Principiante',
    posicion: usuario?.posicion || 'N° --',
    pesoLevantamiento: usuario?.peso_levantamiento || 0, 
    pesoMaxPromedio: usuario?.peso_max_promedio || 0,   
    pesoTeoricoMax: usuario?.peso_teorico_max || 100,
    avatarIndex: usuario?.avatar_index || 0
  };

  const valorContexto = {
    usuario,       // El objeto crudo por si acaso
    atleta,        // 🚀 El objeto formateado y limpio para tus componentes
    rol,
    autenticado,
    cargando,
    loginContext,
    logoutContext
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