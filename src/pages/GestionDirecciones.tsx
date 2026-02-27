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

    const fetchProvincias = () => {
        fetch('http://localhost:3000/api/provincias')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setProvincias(data.data);
            })
            .catch((error) => console.error('Error al cargar las provincias:', error));
    }
    
    const fetchLocalidades = () => {
        fetch('http://localhost:3000/api/localidades')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setLocalidades(data.data);
            })
            .catch((error) => console.error('Error al cargar las localidades:', error));
    }
    
    const fetchDirecciones = () => {
        fetch('http://localhost:3000/api/direcciones')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setDirecciones(data.data);
            })
            .catch((error) => console.error('Error al cargar las direcciones:', error));
    }

    useEffect(() => {
        fetchProvincias();
        fetchLocalidades();
        fetchDirecciones();
    }, []);

    const handleEliminarProvincia = (provincia: Provincia) => {
            fetch(`http://localhost:3000/api/provincias/${provincia.id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.ok) {
                        console.log("Provincia eliminada con éxito");
                        fetchProvincias();
                    } else {
                        console.error("Error al eliminar la provincia");
                    }
                })
                .catch((err) => console.error("Error al eliminar la provincia:", err));
    };

    const handleEliminarLocalidad = (localidad: Localidad) => {
            fetch(`http://localhost:3000/api/localidades/${localidad.id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.ok) {
                        console.log("Localidad eliminada con éxito");
                        fetchLocalidades();
                    } else {
                        console.error("Error al eliminar la localidad");
                    }
                })
                .catch((err) => console.error("Error al eliminar la localidad:", err));
    };

    const handleEliminarDireccion = (direccion: Direccion) => {
            fetch(`http://localhost:3000/api/direcciones/${direccion.id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.ok) {
                        console.log("Dirección eliminada con éxito");
                        fetchDirecciones();
                    } else {
                        console.error("Error al eliminar la dirección");
                    }
                })
                .catch((err) => console.error("Error al eliminar la dirección:", err));
    };

    const handleFiltroProvincias = (filtro: string) => {
        if (filtro.trim() === '') {
            fetchProvincias();
        } else {
            fetch(`http://localhost:3000/api/provincias/filtro?busqueda=${encodeURIComponent(filtro)}`)
                .then((res) => res.json())
                .then((resData) => {
                    setProvincias(resData.data);
                })
                .catch((err) => console.error("Error al filtrar las provincias:", err));
        }
    };

    const handleFiltroLocalidades = (filtro: string) => {
        if (filtro.trim() === '') {
            fetchLocalidades();
        } else {
            fetch(`http://localhost:3000/api/localidades/filtro?busqueda=${encodeURIComponent(filtro)}`)
                .then((res) => res.json())
                .then((resData) => {
                    setLocalidades(resData.data);
                })
                .catch((err) => console.error("Error al filtrar las localidades:", err));
        }
    };

    const handleFiltroDirecciones = (filtro: string) => {
        if (filtro.trim() === '') {
            fetchDirecciones();
        } else {
            fetch(`http://localhost:3000/api/direcciones/filtro?busqueda=${encodeURIComponent(filtro)}`)
                .then((res) => res.json())
                .then((resData) => {
                    setDirecciones(resData.data);
                })
                .catch((err) => console.error("Error al filtrar las direcciones:", err));
        }
    };

    const handleModificarProvincia = (provincia: Provincia) => {
        setProvinciaSeleccionada(provincia);
    }

    const handleCerrarProvincia = () => {
        setProvinciaSeleccionada(null)
        fetchProvincias()
    }

    const handleGuardarProvincia = (id:number, nuevoNombre:string, nuevoCodigo:string) => {
        fetch(`http://localhost:3000/api/provincias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre, codigo: nuevoCodigo }),
        })
            .then((res) => res.json())
            .then((resData) => {
                console.log("Provincia modificada con éxito");
                fetchProvincias();
                handleCerrarProvincia();
            })
            .catch((err) => console.error("Error al modificar la provincia:", err));
    }

    const handleModificarLocalidad = (localidad: Localidad) => {
        setLocalidadSeleccionada(localidad);
    }

    const handleCerrarLocalidad = () => {
        setLocalidadSeleccionada(null)
        fetchLocalidades()
    }

    const handleGuardarLocalidad = (id:number, nuevoNombre:string, nuevoCodigoPostal:string) => {
        fetch(`http://localhost:3000/api/localidades/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre, codigoPostal: nuevoCodigoPostal }),
        })
            .then((res) => res.json())
            .then((resData) => {
                console.log("Localidad modificada con éxito");
                fetchLocalidades();
                handleCerrarLocalidad();
            })
            .catch((err) => console.error("Error al modificar la localidad:", err));
    }

    const handleModificarDireccion = (direccion: Direccion) => {
        setDireccionSeleccionada(direccion);
    }

    const handleCerrarDireccion = () => {
        setDireccionSeleccionada(null)
        fetchDirecciones()
    }

    const handleGuardarDireccion = (id:number, nuevaCalle:string, nuevaAltura:number, nuevosDetalles:string, lat:number, lng: number) => {
        fetch(`http://localhost:3000/api/direcciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ calle: nuevaCalle, altura: nuevaAltura, detalles: nuevosDetalles, lat, lng }),
        })
            .then((res) => res.json())
            .then((resData) => {
                console.log("Dirección modificada con éxito");
                fetchDirecciones();
                handleCerrarDireccion();
            })
            .catch((err) => console.error("Error al modificar la dirección:", err));
    }

    const handleAgregarProvincia = (nuevoNombre: string, nuevoCodigo: number) => {
        fetch('http://localhost:3000/api/provincias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, codigo: nuevoCodigo }),
        })
        .then((res) => res.json())
        .then(() => {
            fetchProvincias()
            setMostrarAgregarProvincia(false)
        })
        .catch((err) => console.error("Error al agregar la provincia:", err));
    }

    const handleAgregarLocalidad = (nuevoNombre: string, nuevoCodigoPostal: number, provinciaId: number) => {
        fetch('http://localhost:3000/api/localidades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, codigoPostal: nuevoCodigoPostal, provincia: provinciaId }),
        })
        .then((res) => res.json())
        .then(() => {
            fetchLocalidades()
            setMostrarAgregarLocalidad(false)
        })
        .catch((err) => console.error("Error al agregar la localidad:", err));
    }

    const handleAgregarDireccion = (nuevoCalle: string, nuevoAltura: number, nuevosDetalles: string, localidadId: number, lat: number, lng: number) => {
        fetch('http://localhost:3000/api/direcciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calle: nuevoCalle, altura: nuevoAltura, detalles: nuevosDetalles, localidad: localidadId, lat, lng }),
        })
        .then((res) => res.json())
        .then(() => {
            fetchDirecciones()
            setMostrarAgregarDireccion(false)
        })
        .catch((err) => console.error("Error al agregar la dirección:", err));
    }

    return (
        <>
            <HeaderAdministrador />
            <div className="GestionUbicaciones">
                <h1>Provincias</h1>
                <input
                    type="text"
                    placeholder="Buscar provincia..."
                    className="busqueda-ubicaciones"
                    onChange={(e) => handleFiltroProvincias(e.target.value)}
                />
                <button 
                    className="btn-agregar-ubicacion"
                    onClick={() => setMostrarAgregarProvincia(true)}
                >
                    Añadir Provincia
                </button>
                <div className="contenedor-tabla-ubicaciones">
                    <table className="tabla-ubicaciones" id="tabla-provincias">
                        <thead>
                            <tr>
                                <th>Provincia</th>
                                <th>Código</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {provincias.map((provincia) => (
                                <tr key={provincia.id}>
                                    <td>{provincia.nombre}</td>
                                    <td>{provincia.codigo}</td>
                                    <td>
                                        <button onClick={() => handleEliminarProvincia(provincia)} className="eliminar-ubicacion">Eliminar</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleModificarProvincia(provincia)} className="modificar-ubicacion">Modificar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="GestionUbicaciones">
                <h1>Localidades</h1>
                <input
                    type="text"
                    placeholder="Buscar localidad..."
                    className="busqueda-ubicaciones"
                    onChange={(e) => handleFiltroLocalidades(e.target.value)}
                />
                <button 
                    className="btn-agregar-ubicacion"
                    onClick={() => setMostrarAgregarLocalidad(true)}
                >
                    Añadir Localidad
                </button>
                <div className="contenedor-tabla-ubicaciones">
                    <table className="tabla-ubicaciones" id="tabla-localidades">
                        <thead>
                            <tr>
                                <th>Localidad</th>
                                <th>Código Postal</th>
                                <th>Provincia</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {localidades.map((localidad) => (
                                <tr key={localidad.id}>
                                    <td>{localidad.nombre}</td>
                                    <td>{localidad.codigoPostal}</td>
                                    <td>{localidad.provincia.nombre}</td>
                                    <td>
                                        <button onClick={() => handleEliminarLocalidad(localidad)} className="eliminar-ubicacion">Eliminar</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleModificarLocalidad(localidad)} className="modificar-ubicacion">Modificar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="GestionUbicaciones">
                <h1>Direcciones</h1>
                <input
                    type="text"
                    placeholder="Buscar localidad..."
                    className="busqueda-ubicaciones"
                    onChange={(e) => handleFiltroDirecciones(e.target.value)}
                />
                <button 
                    className="btn-agregar-ubicacion"
                    onClick={() => setMostrarAgregarDireccion(true)}
                >
                    Añadir Dirección
                </button>
                <div className="contenedor-tabla-ubicaciones">
                    <table className="tabla-ubicaciones" id="tabla-direcciones">
                        <thead>
                            <tr>
                                <th>Calle</th>
                                <th>Altura</th>
                                <th>Detalles</th>
                                <th>Localidad</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {direcciones.map((direccion) => (
                                <tr key={direccion.id}>
                                    <td>{direccion.calle}</td>
                                    <td>{direccion.altura}</td>
                                    <td>{direccion.detalles}</td>
                                    <td>{direccion.localidad.nombre}</td>
                                    <td>
                                        <button onClick={() => handleEliminarDireccion(direccion)} className="eliminar-ubicacion">Eliminar</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleModificarDireccion(direccion)} className="modificar-ubicacion">Modificar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {provinciaSeleccionada && (
                <div className="overlay">
                    <ProvinciaCard
                        provincia={provinciaSeleccionada}
                        onClose={handleCerrarProvincia}
                        onGuardar={handleGuardarProvincia}
                    />
                </div>
            )}
            {localidadSeleccionada && (
                <div className="overlay">
                    <LocalidadCard
                        localidad={localidadSeleccionada}
                        onClose={handleCerrarLocalidad}
                        onGuardar={handleGuardarLocalidad}
                    />
                </div>
            )}
            {direccionSeleccionada && (
                <div className="overlay">
                    <DireccionCard
                        direccion={direccionSeleccionada}
                        onClose={handleCerrarDireccion}
                        onGuardar={handleGuardarDireccion}
                    />
                </div>
            )}
            {mostrarAgregarProvincia && (
                <div className="overlay">
                    <AddProvinciaCard
                        onClose={() => setMostrarAgregarProvincia(false)}
                        onGuardar={handleAgregarProvincia}
                    />
                </div>
            )}
            {mostrarAgregarLocalidad && (
                <div className="overlay">
                    <AddLocalidadCard
                        onClose={() => setMostrarAgregarLocalidad(false)}
                        onGuardar={handleAgregarLocalidad}
                    />
                </div>
            )}
            {mostrarAgregarDireccion && (
                <div className="overlay">
                    <AddDireccionCard
                        onClose={() => setMostrarAgregarDireccion(false)}
                        onGuardar={handleAgregarDireccion}
                    />
                </div>
            )}
        </>
    );
}

export default GestionDirecciones;