import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import HomeOrganizador from './pages/HomeOrganizador'
import HomeAdmin from './pages/HomeAdmin'
import RutaProtegida from './components/ProtectedRoute'
import GestionUsuarios from './pages/GestionUsuarios'
import GestionCategorias from './pages/GestionCategorias'
import GestionDirecciones from './pages/GestionDirecciones'
import PendingPage from './pages/pagos/PendingPage'
import FailurePage from './pages/pagos/FailurePage'
import SuccessPage from './pages/pagos/SuccessPage'
import MisEventos from './pages/MisEventos'
import MisEntradas from './pages/misEntradas'

function App() {
  return (
    <>      
      <Routes>
        <Route path="/" element={<Home />} />      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/organizador" element={<RutaProtegida tiposPermitidos={['organizador']}><HomeOrganizador /></RutaProtegida>} />
        <Route path="/administrador" element={<RutaProtegida tiposPermitidos={['administrador']}><HomeAdmin /></RutaProtegida>} />
        <Route path="/gestionUsuarios" element={<RutaProtegida tiposPermitidos={['administrador']}><GestionUsuarios /></RutaProtegida>} />
        <Route path="/gestionCategorias" element={<RutaProtegida tiposPermitidos={['administrador']}><GestionCategorias /></RutaProtegida>} />
        <Route path="/gestionDirecciones" element={<RutaProtegida tiposPermitidos={['administrador']}><GestionDirecciones /></RutaProtegida>} />
        <Route path="/misEventos" element={<RutaProtegida tiposPermitidos={['organizador']}><MisEventos /></RutaProtegida>} />
        <Route path="/misEntradas" element={<RutaProtegida tiposPermitidos={['cliente']}><MisEntradas /></RutaProtegida>} />
      </Routes>
    </>
  )
}

export default App