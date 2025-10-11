import './gestionCategorias.css'
import HeaderAdministrador from '../components/HeaderAdministrador'
import { useState, useEffect, use } from 'react'
import { ClaseEvento } from '../types/claseEvento';
import CategoryCard from '../components/CategoryCard';
import AddCategoryCard from '../components/AddCategoryCard';

function GestionCategorias() {
    const [categorias, setCategorias] = useState<ClaseEvento[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<ClaseEvento | null>(null);
    const [mostrarAgregar, setMostrarAgregar] = useState(false);

    const fetchCategorias = () => {
        fetch('http://localhost:3000/api/eventos/clases')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCategorias(data.data);
            })
            .catch((error) => console.error('Error al cargar las categorías:', error));
    }

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleEliminar = (categoria: ClaseEvento) => {
            fetch(`http://localhost:3000/api/eventos/clases/${categoria.id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.ok) {
                        console.log("Categoría eliminada con éxito");
                        fetchCategorias();
                    } else {
                        console.error("Error al eliminar la categoría");
                    }
                })
                .catch((err) => console.error("Error al eliminar la categoría:", err));
        };

    const handleFiltro = (filtro: string) => {
        if (filtro.trim() === '') {
            fetchCategorias();
        } else {
            fetch(`http://localhost:3000/api/eventos/clases/filtro?busqueda=${encodeURIComponent(filtro)}`)
                .then((res) => res.json())
                .then((resData) => {
                    setCategorias(resData.data);
                })
                .catch((err) => console.error("Error al filtrar las categorías:", err));
        }
    };

    const handleModificar = (categoria: ClaseEvento) => {
        setCategoriaSeleccionada(categoria);
    }

    const handleCerrar = () => {
        setCategoriaSeleccionada(null)
        fetchCategorias()
    }

    const handleGuardar = (id:number, nuevoNombre:string) => {
        fetch(`http://localhost:3000/api/eventos/clases/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre }),
        })
            .then((res) => res.json())
            .then((resData) => {
                console.log("Categoría modificada con éxito");
                fetchCategorias();
                handleCerrar();
            })
            .catch((err) => console.error("Error al modificar la categoría:", err));
    }

    const handleAgregar = (nuevoNombre: string) => {
        fetch('http://localhost:3000/api/eventos/clases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre }),
        })
        .then((res) => res.json())
        .then(() => {
            fetchCategorias()
            setMostrarAgregar(false)
        })
        .catch((err) => console.error("Error al agregar la categoría:", err));
    }

    return (
        <>
            <HeaderAdministrador />
            <div className="GestionCategorias">
                <h1>Gestión de Categorías</h1>
                <input
                    type="text"
                    placeholder="Buscar categoría..."
                    className="busqueda-categorias"
                    onChange={(e) => handleFiltro(e.target.value)}
                />
                <button 
                    className="btn-agregar-categoria"
                    onClick={() => setMostrarAgregar(true)}
                >
                    Añadir Categoría
                </button>
                <div className="contenedor-tabla-categorias">
                    <table className="tabla-categorias">
                        <thead>
                            <tr>
                                <th>Categoría</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((categoria) => (
                                <tr key={categoria.id}>
                                    <td>{categoria.nombre}</td>
                                    <td>
                                        <button onClick={() => handleEliminar(categoria)} id="eliminar-categoria">Eliminar</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleModificar(categoria)} id="modificar-categoria">Modificar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {categoriaSeleccionada && (
                <div className="overlay">
                    <CategoryCard
                        categoria={categoriaSeleccionada}
                        onClose={handleCerrar}
                        onGuardar={handleGuardar}
                    />
                </div>
            )}
            {mostrarAgregar && (
                <div className="overlay">
                    <AddCategoryCard
                        onClose={() => setMostrarAgregar(false)}
                        onGuardar={handleAgregar}
                    />
                </div>
            )}
        </>
    );
}

export default GestionCategorias;