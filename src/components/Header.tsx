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
                    <a href="/" title="Home" className="logo"> <img src="src/images/mainlogo.png" alt="Logo" width="45"/> </a>                    
                    <span className='menu-icon' onClick={handleMenuClick}>Ver Menú</span>
                    <ul className={menuVisible ? 'show' : ''}>
                        <li>
                            <select>
                                <option value="noCity">Ciudad</option>
                                <option value="city1">Córdoba</option>
                                <option value="city2">La Plata</option>
                                <option value="city3">Mendoza</option>
                                <option value="city4">Rosario</option>
                                <option value="city5">San Juan</option>
                                <option value="city6">Santa Fe</option>
                            </select></li> {/* Menu Dropdown */}
                        <li>
                            <select>
                                <option value="noCategory">Categorías</option>
                                <option value="cat1">Categoría 1</option>
                                <option value="cat2">Categoría 2</option>
                                <option value="cat3">Categoría 3</option>
                                <option value="cat4">Categoría 4</option>
                                <option value="cat5">Categoría 5</option>
                                <option value="cat6">Categoría 6</option>
                            </select></li> {/* Menu Dropdown */}
                        <li><a href="/login">Iniciar Sesión</a></li>
                        <li><a href="/register">Registrarse</a></li>
                    </ul>
                    <form> 
                        <input type="search" name="query" placeholder="Buscar"/>
                        <input type="submit" value="Ir"/>
                    </form>
                </nav>
            </div>
        </>
    )
}

export default Header