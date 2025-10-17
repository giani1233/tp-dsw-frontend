import './headerAdministrador.css'
import { Link } from 'react-router-dom'

function HeaderAdministrador() {

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        window.location.href = '/'
    }

    return (
        <>
            <div className='HeaderAdministrador'>                
                <nav className='navigationAdministrador'>
                    <Link to="/administrador" title="Home" className="logo">
                        <img src="src/images/mainlogo.png" alt="Logo" width="200"/>
                    </Link>
                    <ul className='menu-admin'>  
                        <li><Link to="/administrador">Eventos</Link></li>
                        <li><Link to="/gestionUsuarios">Usuarios</Link></li>
                        <li><Link to="/gestionCategorias">Categorías</Link></li>
                        <li><Link to="/gestionDirecciones">Ubicaciones</Link></li>
                    </ul>
                    <button onClick={cerrarSesion} className='btn-cerrar-sesion'>Cerrar sesión</button>
                </nav>
            </div>
        </>
    )
}

export default HeaderAdministrador