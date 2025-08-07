import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import { Login } from './pages/auth/Login'
import { Users } from './pages/users/Users'
import { Payment } from './pages/payment/Payment'
import { Access } from './pages/access/Access'
import { Layout } from './layout/Layout'
import { Clients } from './pages/clients/Clients'
import { Notification } from './pages/notification/Notification'
import { useAxiosInterceptor } from './services/Interceptor'
import { Toaster } from 'react-hot-toast'
import "react-datepicker/dist/react-datepicker.css";
import AccessTest from './pages/access/AccessTest'
import { Profile } from './pages/profile/Profile'

function App() {
  useAxiosInterceptor();
  return (
    <div >
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/usuarios" element={<Users />} />
            <Route path="/pagos" element={<Payment />} />
            <Route path="/acceso" element={<Access />} />
            <Route path="/acceso-test" element={<AccessTest />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/recordatorios" element={<Notification />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
