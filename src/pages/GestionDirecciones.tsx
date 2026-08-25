import './gestionDirecciones.css'
import HeaderAdministrador from '../components/HeaderAdministrador'
import { useState, useEffect, use } from 'react'
import { Direccion } from '../types/direccion'
import { Localidad } from '../types/localidad'
import { Provincia } from '../types/provincia'
import ProvinciaCard from '../components/ProvinciaCard'
import LocalidadCard from '../components/LocalidadCard'
import DireccionCard from '../components/DireccionCard'
import AddProvinciaCard from '../components/AddProvinciaCard'
import AddLocalidadCard from '../components/AddLocalidadCard'
import AddDireccionCard from '../components/AddDireccionCard'
import Footer from '../components/Footer'
import { fetchConToken } from '../utils/fetchConToken'


function GestionDirecciones() {
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Provincia | null>(null);
    const [localidadSeleccionada, setLocalidadSeleccionada] = useState<Localidad | null>(null);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<Direccion | null>(null);
    const [mostrarAgregarProvincia, setMostrarAgregarProvincia] = useState(false);
    const [mostrarAgregarLocalidad, setMostrarAgregarLocalidad] = useState(false);
    const [mostrarAgregarDireccion, setMostrarAgregarDireccion] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [filtrando, setFiltrando] = useState(false);
    const [procesando, setProcesando] = useState<number | null>(null);
    const [modal, setModal] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null);
    const [confirmacion, setConfirmacion] = useState<{mensaje: string, onConfirmar: () => void} | null>(null);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);

    const fetchProvincias = () => {
        setErrorCarga(null);
        return fetch('https://tp-dsw-backend-yjx3.onrender.com/api/provincias')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las provincias')
                return res.json()
            })
            .then(data => setProvincias(data.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('Error al cargar las provincias')
            })
    }
    
    const fetchLocalidades = () => {
        setErrorCarga(null);
        return fetch('https://tp-dsw-backend-yjx3.onrender.com/api/localidades')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las localidades')
                return res.json()
            })
            .then(data => setLocalidades(data.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('Error al cargar las localidades')
            });
    }
    
    const fetchDirecciones = () => {
        setErrorCarga(null); 
        return fetch('https://tp-dsw-backend-yjx3.onrender.com/api/direcciones')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las direcciones')
                return res.json()
            })
            .then(data => setDirecciones(data.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('Error al cargar las direcciones')
            });
    }

    useEffect(() => {
        setCargando(true);
        Promise.all([fetchProvincias(), fetchLocalidades(), fetchDirecciones()])
            .finally(() => setCargando(false));
    }, []);

    const handleEliminarProvincia = (provincia: Provincia) => {
        setConfirmacion({
            mensaje: `Está seguro de que desea eliminar la provincia "${provincia.nombre}"?`,
            onConfirmar: () => {
                setConfirmacion(null);
                setProcesando(provincia.id);
                fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/provincias/${provincia.id}`, {
                    method: 'DELETE',
                })
                .then((res) => {
                    if (res.ok) {
                        fetchProvincias();
                        setModal({mensaje: "Provincia eliminada correctamente", tipo: 'exito'});
                    } else {
                        setModal({mensaje: "Error al eliminar la provincia", tipo: 'error'});
                    }
                })
                .catch(() => setModal({mensaje: "Error al eliminar la provincia", tipo: 'error'}))
                .finally(() => setProcesando(null));
            }
        });
    };

    const handleEliminarLocalidad = (localidad: Localidad) => {
        setConfirmacion({
            mensaje: `Está seguro de que desea eliminar la localidad "${localidad.nombre}"?`,
            onConfirmar: () => {
                setConfirmacion(null);
                setProcesando(localidad.id);
                fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/localidades/${localidad.id}`, {
                    method: 'DELETE',
                })
                .then((res) => {
                    if (res.ok) {
                        fetchLocalidades();
                        setModal({mensaje: "Localidad eliminada correctamente", tipo: 'exito'});
                    } else {
                        setModal({mensaje: "Error al eliminar la localidad", tipo: 'error'});
                    }
                })
                .catch(() => setModal({mensaje: "Error al eliminar la localidad", tipo: 'error'}))
                .finally(() => setProcesando(null));
            }
        });
    };

    const handleEliminarDireccion = (direccion: Direccion) => {
        setConfirmacion({
            mensaje: `Está seguro de que desea eliminar la dirección "${direccion.calle} ${direccion.altura}"?`,
            onConfirmar: () => {
                setConfirmacion(null);
                setProcesando(direccion.id);
                fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/direcciones/${direccion.id}`, {
                    method: 'DELETE',
                })
                .then((res) => {
                    if (res.ok) {
                        fetchDirecciones();
                        setModal({mensaje: "Dirección eliminada correctamente", tipo: 'exito'});
                    } else {
                        setModal({mensaje: "Error al eliminar la dirección", tipo: 'error'});
                    }
                })
                .catch(() => setModal({mensaje: "Error al eliminar la dirección", tipo: 'error'}))
                .finally(() => setProcesando(null));
            }
        });
    };

    const handleFiltroProvincias = (filtro: string) => {
        const url = filtro.trim() === ''
        ? 'https://tp-dsw-backend-yjx3.onrender.com/api/provincias'
        : `https://tp-dsw-backend-yjx3.onrender.com/api/provincias/filtro?busqueda=${encodeURIComponent(filtro)}`;
        setFiltrando(true);
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las provincias')
                return res.json()
            })
            .then(resData => setProvincias(resData.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('Error al cargar las provincias')
            })
            .finally(() => setFiltrando(false));
    };

    const handleFiltroLocalidades = (filtro: string) => {
        const url = filtro.trim() === ''
        ? 'https://tp-dsw-backend-yjx3.onrender.com/api/localidades'
        : `https://tp-dsw-backend-yjx3.onrender.com/api/localidades/filtro?busqueda=${encodeURIComponent(filtro)}`;
        setFiltrando(true);
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las localidades')
                return res.json()
            })
            .then(resData => setLocalidades(resData.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('Error al cargar las localidades')
            })
            .finally(() => setFiltrando(false));
    };

    const handleFiltroDirecciones = (filtro: string) => {
        const url = filtro.trim() === ''
        ? 'https://tp-dsw-backend-yjx3.onrender.com/api/direcciones'
        : `https://tp-dsw-backend-yjx3.onrender.com/api/direcciones/filtro?busqueda=${encodeURIComponent(filtro)}`;
        setFiltrando(true);
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las direcciones')
                return res.json()
            })
            .then(resData => setDirecciones(resData.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('Error al cargar las direcciones')
            })
            .finally(() => setFiltrando(false));
    };

    const handleGuardarProvincia = (id:number, nuevoNombre:string, nuevoCodigo:string) => {
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/provincias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre, codigo: nuevoCodigo }),
        })
            .then(() => {
                fetchProvincias();
                setProvinciaSeleccionada(null);
                setModal({mensaje: "Provincia modificada correctamente", tipo: 'exito'});
            })
            .catch(() => setModal({mensaje: "Error al modificar la provincia", tipo: 'error'}));
    }

    const handleGuardarLocalidad = (id:number, nuevoNombre:string, nuevoCodigoPostal:string) => {
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/localidades/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre, codigoPostal: nuevoCodigoPostal }),
        })
            .then(() => {
                fetchLocalidades();
                setLocalidadSeleccionada(null);
                setModal({mensaje: "Localidad modificada correctamente", tipo: 'exito'});
            })
            .catch(() => setModal({mensaje: "Error al modificar la localidad", tipo: 'error'}));
    }

    const handleGuardarDireccion = (id:number, nuevaCalle:string, nuevaAltura:number, nuevosDetalles:string, lat:number, lng: number) => {
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/direcciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ calle: nuevaCalle, altura: nuevaAltura, detalles: nuevosDetalles, lat, lng }),
        })
            .then(() => {
                fetchDirecciones();
                setDireccionSeleccionada(null);
                setModal({mensaje: "Dirección modificada correctamente", tipo: 'exito'});
            })
            .catch(() => setModal({mensaje: "Error al modificar la dirección", tipo: 'error'}));
    }

    const handleAgregarProvincia = (nuevoNombre: string, nuevoCodigo: number) => {
        fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/provincias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, codigo: String(nuevoCodigo) }),
        })
        .then(() => {
            fetchProvincias()
            setMostrarAgregarProvincia(false)
            setModal({mensaje: "Provincia agregada correctamente", tipo: 'exito'});
        })
        .catch((err) => setModal({mensaje: "Error al agregar la provincia", tipo: 'error'}));
    }

    const handleAgregarLocalidad = (nuevoNombre: string, nuevoCodigoPostal: number, provinciaId: number) => {
        fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/localidades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, codigoPostal: nuevoCodigoPostal, provincia: provinciaId }),
        })
        .then((res) => res.json())
        .then(() => {
            fetchLocalidades()
            setMostrarAgregarLocalidad(false)
            setModal({mensaje: "Localidad agregada correctamente", tipo: 'exito'});
        })
        .catch((err) => setModal({mensaje: "Error al agregar la localidad", tipo: 'error'}));
    }

    const handleAgregarDireccion = (nuevoCalle: string, nuevoAltura: number, nuevosDetalles: string, localidadId: number, lat: number, lng: number) => {
        fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/direcciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calle: nuevoCalle, altura: nuevoAltura, detalles: nuevosDetalles, localidad: localidadId, lat, lng }),
        })
        .then((res) => res.json())
        .then(() => {
            fetchDirecciones()
            setMostrarAgregarDireccion(false)
            setModal({mensaje: "Dirección agregada correctamente", tipo: 'exito'});
        })
        .catch((err) => setModal({mensaje: "Error al agregar la dirección", tipo: 'error'}));
    }

    return (
        <>
            <HeaderAdministrador />

            {cargando ? (
                <p className="loading-msg">Cargando datos...</p>
            ) : errorCarga ? (
                <p style={{ color: 'red', textAlign: 'center' }}>{errorCarga}</p>
            ) : (
                <>
                    <div className="GestionUbicaciones">
                        <h1>Provincias</h1>
                        <input type="text" placeholder="Buscar provincia..." className="busqueda-ubicaciones" onChange={(e) => handleFiltroProvincias(e.target.value)} />
                        <button className="btn-agregar-ubicacion" onClick={() => setMostrarAgregarProvincia(true)}>Añadir Provincia</button>
                        <div className="contenedor-tabla-ubicaciones">
                            <table className="tabla-ubicaciones" id="tabla-provincias">
                                <thead>
                                    <tr><th>Provincia</th><th>Código</th><th></th><th></th></tr>
                                </thead>
                                <tbody>
                                    {provincias.map((provincia) => (
                                        <tr key={provincia.id}>
                                            <td>{provincia.nombre}</td>
                                            <td>{provincia.codigo}</td>
                                            <td>
                                                <button onClick={() => handleEliminarProvincia(provincia)} className="eliminar-ubicacion" disabled={procesando === provincia.id}> {procesando === provincia.id ? 'Eliminando...' : 'Eliminar'} </button>
                                            </td>
                                            <td>
                                                <button onClick={() => setProvinciaSeleccionada(provincia)} className="modificar-ubicacion">Modificar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="GestionUbicaciones">
                        <h1>Localidades</h1>
                        <input type="text" placeholder="Buscar localidad..." className="busqueda-ubicaciones" onChange={(e) => handleFiltroLocalidades(e.target.value)} />
                        <button className="btn-agregar-ubicacion" onClick={() => setMostrarAgregarLocalidad(true)}>Añadir Localidad</button>
                        <div className="contenedor-tabla-ubicaciones">
                            <table className="tabla-ubicaciones" id="tabla-localidades">
                                <thead>
                                    <tr><th>Localidad</th><th>Código Postal</th><th>Provincia</th><th></th><th></th></tr>
                                </thead>
                                <tbody>
                                    {localidades.map((localidad) => (
                                        <tr key={localidad.id}>
                                            <td>{localidad.nombre}</td>
                                            <td>{localidad.codigoPostal}</td>
                                            <td>{localidad.provincia.nombre}</td>
                                            <td>
                                                <button onClick={() => handleEliminarLocalidad(localidad)} className="eliminar-ubicacion" disabled={procesando === localidad.id} > {procesando === localidad.id ? 'Eliminando...' : 'Eliminar'} </button>
                                            </td>
                                            <td>
                                                <button onClick={() => setLocalidadSeleccionada(localidad)} className="modificar-ubicacion">Modificar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="GestionUbicaciones">
                        <h1>Direcciones</h1>
                        <input type="text" placeholder="Buscar dirección..." className="busqueda-ubicaciones" onChange={(e) => handleFiltroDirecciones(e.target.value)} />
                        <button className="btn-agregar-ubicacion" onClick={() => setMostrarAgregarDireccion(true)}>Añadir Dirección</button>
                        <div className="contenedor-tabla-ubicaciones">
                            <table className="tabla-ubicaciones" id="tabla-direcciones">
                                <thead>
                                    <tr><th>Calle</th><th>Altura</th><th>Detalles</th><th>Localidad</th><th></th><th></th></tr>
                                </thead>
                                <tbody>
                                    {direcciones.map((direccion) => (
                                        <tr key={direccion.id}>
                                            <td>{direccion.calle}</td>
                                            <td>{direccion.altura}</td>
                                            <td>{direccion.detalles}</td>
                                            <td>{direccion.localidad.nombre}</td>
                                            <td>
                                                <button onClick={() => handleEliminarDireccion(direccion)} className="eliminar-ubicacion" disabled={procesando === direccion.id}> {procesando === direccion.id ? 'Eliminando...' : 'Eliminar'} </button>
                                            </td>
                                            <td>
                                                <button onClick={() => setDireccionSeleccionada(direccion)} className="modificar-ubicacion">Modificar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            {provinciaSeleccionada && (
                <div className="overlay">
                    <ProvinciaCard 
                        provincia={provinciaSeleccionada} 
                        onClose={() => { setProvinciaSeleccionada(null); fetchProvincias(); }} 
                        onGuardar={handleGuardarProvincia} 
                    />
                </div>
            )}
            {localidadSeleccionada && (
                <div className="overlay">
                    <LocalidadCard 
                        localidad={localidadSeleccionada} 
                        onClose={() => { setLocalidadSeleccionada(null); fetchLocalidades(); }} 
                        onGuardar={handleGuardarLocalidad} 
                    />
                </div>
            )}
            {direccionSeleccionada && (
                <div className="overlay">
                    <DireccionCard 
                        direccion={direccionSeleccionada} 
                        onClose={() => { setDireccionSeleccionada(null); fetchDirecciones(); }} 
                        onGuardar={handleGuardarDireccion} 
                    />
                </div>
            )}
            {mostrarAgregarProvincia && (
                <div className="overlay">
                    <AddProvinciaCard onClose={() => setMostrarAgregarProvincia(false)} onGuardar={handleAgregarProvincia} />
                </div>
            )}
            {mostrarAgregarLocalidad && (
                <div className="overlay">
                    <AddLocalidadCard onClose={() => setMostrarAgregarLocalidad(false)} onGuardar={handleAgregarLocalidad} />
                </div>
            )}
            {mostrarAgregarDireccion && (
                <div className="overlay">
                    <AddDireccionCard onClose={() => setMostrarAgregarDireccion(false)} onGuardar={handleAgregarDireccion} />
                </div>
            )}
            {modal && (
                <div className="overlay">
                    <div className="modal-feedback">
                        <p className={modal.tipo === 'exito' ? 'modal-exito' : 'modal-error'}>
                            {modal.tipo === 'exito' ? '✅' : '❌'} {modal.mensaje}
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

export default GestionDirecciones;