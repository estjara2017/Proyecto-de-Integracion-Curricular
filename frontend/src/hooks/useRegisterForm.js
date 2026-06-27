import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import { normalizeUserPayload } from '../utils/inputNormalization';

export function useRegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const alertMessage = location.state?.message;
  const [showAlert, setShowAlert] = useState(!!alertMessage);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('masculino');
  const [tieneLesion, setTieneLesion] = useState('no');
  const [descripcionLesion, setDescripcionLesion] = useState('');

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleLesionChange = (e) => {
    const value = e.target.value;
    setTieneLesion(value);
    if (value === 'no') setDescripcionLesion('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = normalizeUserPayload({
      nombre: firstName,
      apellido: lastName,
      cedula: idCard,
      telefono: phone,
      correo: email,
      peso: weight || null,
      estatura: height || null,
      direccion: address,
      fechaNacimiento: birthDate,
      genero: gender,
      poseeLesion: tieneLesion === 'si' ? 'SI' : 'NO',
      detalleLesion: descripcionLesion
    });

    try {
      await usuarioService.registrar(userData);
      navigate('/login');
    } catch (error) {
      alert(error.message || 'No se pudo registrar el usuario');
    }
  };

  return {
    alertMessage,
    showAlert,
    firstName, setFirstName,
    lastName, setLastName,
    idCard, setIdCard,
    phone, setPhone,
    email, setEmail,
    weight, setWeight,
    height, setHeight,
    address, setAddress,
    birthDate, setBirthDate,
    gender, setGender,
    tieneLesion,
    descripcionLesion, setDescripcionLesion,
    handleLesionChange,
    handleRegister,
    navigate
  };
}
