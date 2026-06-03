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
      <Route path="/dashboardClient" element={<DashboardClient/>}/>
      <Route path="/dashboardAdmin" element={<DashboardAdmin/>}/>
      <Route path="/payment" element={<PaymentCheckout/>}/>
    </Routes>
  )
}

export default AppRoutes