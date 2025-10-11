import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import HomeOrganizador from './pages/HomeOrganizador'
import HomeAdmin from './pages/HomeAdmin'
import RutaProtegida from './components/ProtectedRoute'
import GestionUsuarios from './pages/GestionUsuarios'
import GestionCategorias from './pages/GestionCategorias'

function App() {
  return (
    <>      
      <Routes>
        <Route path="/" element={<Home />} />      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/organizador" element={<RutaProtegida tiposPermitidos={['organizador']}><HomeOrganizador /></RutaProtegida>} />
        <Route path="/administrador" element={<RutaProtegida tiposPermitidos={['administrador']}><HomeAdmin /></RutaProtegida>} />
        <Route path="/gestionUsuarios" element={<RutaProtegida tiposPermitidos={['administrador']}><GestionUsuarios /></RutaProtegida>} />
        <Route path="/gestionCategorias" element={<RutaProtegida tiposPermitidos={['administrador']}><GestionCategorias /></RutaProtegida>} />
      </Routes>
    </>
  )
}

export default App