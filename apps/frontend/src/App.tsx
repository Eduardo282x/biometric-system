import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Login } from './pages/auth/Login'
import { Users } from './pages/users/Users'
import { Payment } from './pages/payment/Payment'
import { Access } from './pages/access/Access'
import { Layout } from './layout/Layout'
import { Clients } from './pages/clients/Clients'
import { Notification } from './pages/notification/Notification'
import { Plan } from './pages/plan/Plan'

function App() {

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/usuarios" element={<Users />} />
            <Route path="/pagos" element={<Payment />} />
            <Route path="/acceso" element={<Access />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/planes" element={<Plan />} />
            <Route path="/recordatorios" element={<Notification />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
