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
                <nav className='navigation'>
                    <Link to="/administrador" title="Home" className="logo">
                        <img src="src/images/mainlogo.png" alt="Logo" width="45"/>
                    </Link>               
                    <div>
                        Este es el header del admin
                    </div>
                    <button onClick={cerrarSesion} className='btn-cerrar-sesion'>Cerrar sesión</button>
                </nav>
            </div>
        </>
    )
}

export default HeaderAdministrador