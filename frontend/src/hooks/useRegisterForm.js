import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function useRegisterForm() {
  const navigate = useNavigate()
  const location = useLocation()

  const alertMessage = location.state?.message
  const [showAlert, setShowAlert] = useState(!!alertMessage)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [idCard, setIdCard] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [address, setAddress] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('masculino') 
  const [tieneLesion, setTieneLesion] = useState('no')
  const [descripcionLesion, setDescripcionLesion] = useState('')

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showAlert])

  const handleLesionChange = (e) => {
    const value = e.target.value
    setTieneLesion(value)
    if (value === 'no') {
      setDescripcionLesion('') 
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const userData = {
      firstName,
      lastName,
      idCard,
      phone,
      email,
      weight: weight || null,
      height: height || null,
      address,
      birthDate,
      gender,
      tieneLesion,
      descripcionLesion
    }
    console.log('Formulario enviado con éxito', userData)
    navigate('/login')
  }

  // ... (Todo el cuerpo del hook que creamos antes)

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
    descripcionLesion, setDescripcionLesion, // 👈 Verifica que esté aquí en el return
    handleLesionChange,
    handleRegister,
    navigate
  }
}
