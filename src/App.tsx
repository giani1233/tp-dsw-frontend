import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import HomeOrganizador from './pages/HomeOrganizador'
import HomeAdmin from './pages/HomeAdmin'
import RutaProtegida from './components/ProtectedRoute'

function App() {
  return (
    <>      
      <Routes>
        <Route path="/" element={<Home />} />      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/organizador" element={<RutaProtegida tiposPermitidos={['organizador']}><HomeOrganizador /></RutaProtegida>} />
        <Route path="/administrador" element={<RutaProtegida tiposPermitidos={['administrador']}><HomeAdmin /></RutaProtegida>} />
      </Routes>
    </>
  )
}

export default App