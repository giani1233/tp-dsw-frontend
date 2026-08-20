import './gestionCategorias.css'
import HeaderAdministrador from '../components/HeaderAdministrador'
import { useState, useEffect } from 'react'
import { ClaseEvento } from '../types/claseEvento';
import CategoryCard from '../components/CategoryCard';
import AddCategoryCard from '../components/AddCategoryCard';
import Footer from '../components/Footer';
import { fetchConToken } from '../utils/fetchConToken';

function GestionCategorias() {
    const [categorias, setCategorias] = useState<ClaseEvento[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<ClaseEvento | null>(null);
    const [mostrarAgregar, setMostrarAgregar] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState<number | null>(null);
    const [modal, setModal] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null);
    const [confirmacion, setConfirmacion] = useState<{mensaje: string, onConfirmar: () => void} | null>(null);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);

    const fetchCategorias = () => {
        setErrorCarga(null);
        return fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/eventos/clases')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                return res.json();
            })
            .then((data) => { setCategorias(data.data)})
            .catch((err) => {
                console.error(err)
                setErrorCarga('Error al cargar las categorías');
            });
    }

    useEffect(() => {
        setCargando(true);
        fetchCategorias().finally(() => setCargando(false));
    }, []);

    const handleEliminar = (categoria: ClaseEvento) => {
        setConfirmacion({
            mensaje: `Está seguro de que desea eliminar la categoría "${categoria.nombre}"?`,
            onConfirmar: () => {
                setConfirmacion(null);
                setProcesando(categoria.id);
                fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/clases/${categoria.id}`, {
                    method: 'DELETE',
                })
                .then((res) => {
                    if (res.ok) {
                        fetchCategorias();
                        setModal({mensaje: "Categoría eliminada correctamente", tipo: 'exito'});
                    } else {
                        setModal({mensaje: "Error al eliminar la categoría", tipo: 'error'});
                    }
                })
                .catch(() => setModal({mensaje: "Error al eliminar la categoría", tipo: 'error'}))
                .finally(() => setProcesando(null));
            }
        })
    }

    const handleFiltro = (filtro: string) => {
        const url = filtro.trim() === ''
        ? 'https://tp-dsw-backend-yjx3.onrender.com/api/eventos/clases'
        : `https://tp-dsw-backend-yjx3.onrender.com/api/eventos/clases/filtro?busqueda=${encodeURIComponent(filtro)}`;
        setCargando(true);
        setErrorCarga(null);
        fetchConToken(url)
            .then(res => {
                    if (!res.ok) throw new Error('Error al filtrar')
                    return res.json()
                })
            .then(resData => setCategorias(resData.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('Error al filtrar las categorías')
            })
            .finally(() => setCargando(false));
    };

    const handleGuardar = (id:number, nuevoNombre:string) => {
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/clases/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre }),
        })
            .then((res) => res.json())
            .then(() => {
                fetchCategorias();
                setCategoriaSeleccionada(null);
                setModal({mensaje: "Categoría modificada correctamente", tipo: 'exito'});
            })
            .catch(() => setModal({mensaje: "Error al modificar la categoría", tipo: 'error'}));
    }

    const handleAgregar = (nuevoNombre: string) => {
        fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/eventos/clases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre }),
        })
        .then((res) => res.json())
        .then(() => {
            fetchCategorias()
            setMostrarAgregar(false)
            setModal({mensaje: "Categoría agregada correctamente", tipo: 'exito'});
        })
        .catch(() => setModal({mensaje: "Error al agregar la categoría", tipo: 'error'}));
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
                {cargando ? (
                    <p className="loading-msg">Cargando categorías...</p>
                ) : errorCarga? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{errorCarga}.</p>
                ) : (
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
                                        <button onClick={() => handleEliminar(categoria)} id="eliminar-categoria" disabled={procesando === categoria.id}>{procesando === categoria.id ? "Eliminando..." : "Eliminar"}</button>
                                    </td>
                                    <td>
                                        <button onClick={() => setCategoriaSeleccionada(categoria)} id="modificar-categoria" disabled={procesando === categoria.id}>Modificar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
            {categoriaSeleccionada && (
                <div className="overlay">
                    <CategoryCard
                        categoria={categoriaSeleccionada}
                        onClose={() => { setCategoriaSeleccionada(null); fetchCategorias(); }}
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
            {modal && (
                <div className="overlay">
                    <div className="modal-feedback">
                        <p className={modal.tipo === 'exito' ? 'modal-exito' : 'modal-error'}>
                            {modal.tipo === 'exito' ? '✔️' : '❌'} {modal.mensaje}
                        </p>
                        <button onClick={() => setModal(null)}>Cerrar</button>
                    </div>
                </div>
            )}
            {confirmacion && (
                <div className="overlay">
                    <div className="modal-feedback">
                        <p>{confirmacion.mensaje}</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={confirmacion.onConfirmar} id="aceptar-evento">Confirmar</button>
                            <button onClick={() => setConfirmacion(null)} id="rechazar-evento">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}  
            <Footer />
        </>
    );
}

export default GestionCategorias;