import './header.css'
import { useState } from 'react'

function Header() {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuClick = () => {
        setMenuVisible((prev) => !prev);
    };

    return (
        <>
            <div className='Header'>                
                <nav className='navigation'>
                    <a href="http://localhost:5173/" title="Home" className="logo"> <img src="src/images/mainlogo.png" alt="Logo" width="45"/> </a>                    
                    <span className='menu-icon' onClick={handleMenuClick}>Ver Menú</span>
                    <ul className={menuVisible ? 'show' : ''}>
                        <li><a href="#">Ciudad</a></li>
                        <li><a href="#">Categorías</a></li>
                        <li><a href="#">Iniciar Sesión</a></li>
                        <li><a href="#">Registrarse</a></li>
                    </ul>
                    <form> {/* Sin funcionalidad */}
                        <input type="search" name="query" placeholder="Buscar"/>
                        <input type="submit" value="Ir"/>
                    </form>
                </nav>
            </div>
        </>
    )
}

export default Header