import './header.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Category {
    id: number;
    nombre: string;
}

function Header() {
    const [categories, setCategories] = useState<Category[]>([])
    const [option, setOption] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/eventos/clases')
        .then((res) => res.json())
        .then((resData) => {
            setCategories(resData.data)
        })
        .catch((err) => console.error("Error al cargar las categorías:", err))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOption(e.target.value)
    }

    return (
        <>
            <div className='Header'>                
                <nav className='navigation'>
                    <Link to="/" title="Home" className="logo">
                        <img src="src/images/mainlogo.png" alt="Logo" width="45"/>
                    </Link>               
                    <div className='search-acc'>
                        <label htmlFor="select-categories" className="label-categories">
                            categorías
                        </label>
                        <select className="select-categories" name="select-categories" value={option} onChange={handleChange}>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.nombre}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        <form> 
                            <input type="search" name="search" placeholder="Buscar"/>
                            <input type="submit" value="Ir"/>
                        </form>
                        <Link to="/login" id="btnAcceder">
                            Acceder
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Header