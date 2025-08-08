import './header.css'

function Header() {
    return (
        <>
            <div className='Header'>                
                <nav className='navigation'>
                    <a href="http://localhost:5173/" title="Home" className="logo"> <img src="src/images/mainlogo.png" alt="Logo" width="45"/> </a>
                    <ul> {/* Sin funcionalidad */}
                        <li><a href="#">Ciudad</a></li> {/* Menu dropdown supongo */}
                        <li><a href="#">Categorias</a></li>
                        <li><a href="#">Iniciar Sesion</a></li>
                        <li><a href="#">Registrarse</a></li>
                    </ul>
                    <form> {/* Sin funcionalidad */}
                        <input type="search" name="query" placeholder="Search"/>
                        <input type="submit" value="Go!"/>
                    </form>
                </nav>
            </div>
        </>
    )
}

export default Header