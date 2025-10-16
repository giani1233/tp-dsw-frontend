import './header.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Category {
    id: number;
    nombre: string;
}

interface HeaderProps {
    onCategoryChange: (categoria: string) => void;
    onSearch: (busqueda: string) => void;
}

function Header({ onCategoryChange, onSearch }: HeaderProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [option, setOption] = useState('');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/eventos/clases')
        .then((res) => res.json())
        .then((resData) => {
            setCategories(resData.data)
        })
        .catch((err) => console.error("Error al cargar las categorías:", err))
    }, [])

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setOption(value)
        onCategoryChange(value)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setBusqueda(value)
        onSearch(value)
    }

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(busqueda);
    }

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        window.location.href = '/'
    }

    const usuario = localStorage.getItem('usuario')

    return (
        <>
            <div className='Header'>                
                <nav className='navigation'>
                    <Link to="/" title="Home" className="logo">
                        <img src="src/images/mainlogo.png" alt="Logo" width="45"/>
                    </Link>               
                    <div className='search-acc'>
                        <label htmlFor="select-categories" className="label-categories">
                            Categorías:
                        </label>
                        <select className="select-categories" name="select-categories" value={option} onChange={handleCategoryChange}>
                            <option value="">Todas</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.nombre}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        <form onSubmit={handleSearchSubmit} className="form-busqueda"> 
                            <input type="search" name="search" placeholder="Buscar" value={busqueda} onChange={handleSearchChange} />
                            <input type="submit" value="Ir" />
                        </form>
                        {usuario ? (
                            <button onClick={cerrarSesion} className='btn-cerrar-sesion'>Cerrar sesión</button>
                        ) :
                        (
                            <Link to="/login" id="btnAcceder">Acceder</Link>
                        )}
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Header