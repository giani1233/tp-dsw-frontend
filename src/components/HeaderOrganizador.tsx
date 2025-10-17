import './headerOrganizador.css'
import { Link } from 'react-router-dom'

function HeaderOrganizador() {

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        window.location.href = '/'
    }

    return (
        <>
            <div className='HeaderOrganizador'>                
                <nav className='navigationOrganizador'>
                    <Link to="/misEventos" title="Home" className="logo">
                        <img src="src/images/mainlogo.png" alt="Logo" width="200"/>
                    </Link>               
                    <ul className='menu-organizador'>  
                        <li><Link to="/misEventos">Mis Eventos</Link></li>
                        <li><Link to="/organizador">Crear Evento</Link></li>
                    </ul>
                    <button onClick={cerrarSesion} className='btn-cerrar-sesion'>Cerrar sesión</button>
                </nav>
            </div>
        </>
    )
}

export default HeaderOrganizador