import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Home from '../pages/Home/Home'
import Register from '../pages/Register/Register'
import Contacts from '../pages/Contacts/Contacts'
import AboutUs from '../pages/AboutUs/AboutUs'
import Services from '../pages/Services/Services'
import Plans from '../pages/Plans/Plans'
import DashboardClient from '../pages/DashboardClient/DashboardClient'
import DashboardAdmin from '../pages/DashboardAdmin/DashboardAdmin'
import PaymentCheckout from '../pages/PaymentCheckout/PaymentCheckout'
import Attendance from '../pages/Attendance/Attendance'
import AdminAttendance from '../pages/AdminAttendance/AdminAttendance'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contacts" element={<Contacts/>} />
      <Route path="/about" element={<AboutUs/>} />
      <Route path="/services" element={<Services/>} />
      <Route path="/plans" element={<Plans/>} />
      <Route path="/dashboardClient" element={<ProtectedRoute roles={['cliente']}><DashboardClient/></ProtectedRoute>}/>
      <Route path="/dashboardAdmin" element={<ProtectedRoute roles={['admin']}><DashboardAdmin/></ProtectedRoute>}/>
      <Route path="/payment" element={<ProtectedRoute roles={['cliente']}><PaymentCheckout/></ProtectedRoute>}/>
      <Route path="/attendance" element={<Attendance/>}/>
      <Route path="/adminAttendance" element={<ProtectedRoute roles={['admin']}><AdminAttendance/></ProtectedRoute>}/>
    </Routes>
  )
}

export default AppRoutes
