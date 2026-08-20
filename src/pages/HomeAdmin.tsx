import './homeAdmin.css';
import HeaderAdministrador from "../components/HeaderAdministrador";
import Footer from "../components/Footer";
import { useState, useEffect } from 'react';
import { Evento } from "../types/evento";
import ProjectCard from '../components/ProjectCard';
import { fetchConToken } from '../utils/fetchConToken';

function HomeAdmin() {

    const [eventosPendientes, setEventosPendientes] = useState<Evento[]>([])
    const [eventosAprobados, setEventosAprobados] = useState<Evento[]>([])
    const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null)
    const [cargando, setCargando] = useState(true)
    const [procesando, setProcesando] = useState<number | null>(null)
    const [modal, setModal] = useState<{ mensaje: string, tipo: 'exito' | 'error' } | null>(null)
    const [confirmacion, setConfirmacion] = useState<{ mensaje: string, onConfirmar: () => void } | null>(null)
    const [errorCarga, setErrorCarga] = useState<string | null>(null)
    
    const fetchPendientes = () => {fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/eventos/pendientes')
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar eventos pendientes')
            return res.json()
        })
        .then((resData) => { 
            console.log(resData);
            setEventosPendientes(resData.data)
        })
        .catch(err => {
            console.error(err)
            setErrorCarga('Error al cargar los eventos pendientes')
        })
    }

    const fetchAprobados = () => {fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/eventos/aprobados')
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar eventos aprobados')
            return res.json()
        })
        .then((resData) => { 
            console.log(resData);
            setEventosAprobados(resData.data)
        })
        .catch(err => {
            console.error(err)
            setErrorCarga('Error al cargar los eventos aprobados')
        })
    }

    useEffect(() => {
        setCargando(true)
        Promise.all([fetchPendientes(), fetchAprobados()]).finally(() => setCargando(false));
    }, [])

    const handleAceptar = (id: number) => {
        setProcesando(id);
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 'aprobado' }),
        })
        .then((res) => res.json())
        .then((resData) => {
            console.log(resData);
            fetchPendientes();
            fetchAprobados();
            setModal({ mensaje: 'Evento aprobado correctamente', tipo: 'exito' })
        })
        .catch(() => setModal({ mensaje: 'Error al aprobar el evento', tipo: 'error' }))
        .finally(() => setProcesando(null));
    };

    const handleRechazar = (id: number) => {
        setConfirmacion({ 
            mensaje: 'Está seguro de que desea rechazar/eliminar este evento?', 
            onConfirmar: () => {
                setConfirmacion(null);
                setProcesando(id);
                fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/${id}`, {
                    method: 'DELETE',
                })
                .then(() => {
                    fetchPendientes();
                    fetchAprobados();
                    setModal({ mensaje: 'Evento rechazado/eliminado correctamente', tipo: 'exito' })
                })
                .catch(() => setModal({ mensaje: 'Error al rechazar/eliminar el evento', tipo: 'error' }))
                .finally(() => setProcesando(null));
            }
        });
    };

    const handleDestacado = (evento: Evento) => {
        setProcesando(evento.id);
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/${evento.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ destacado: !evento.destacado }),
        })
        .then(() => {
            fetchPendientes();
            fetchAprobados();
            setModal({ mensaje: evento.destacado ? 'Evento removido de destacados correctamente' : 'Evento destacado correctamente', tipo: 'exito' })
        })
        .catch(() => setModal({ mensaje: 'Error al actualizar el evento destacado', tipo: 'error' }))
        .finally(() => setProcesando(null));
    };

    const handleFiltro = (valor: string) => {
    const query = valor.trim() ? `?filtro=${encodeURIComponent(valor)}` : '';
    Promise.all([
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/pendientes${query}`).then(res => res.json()),
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/aprobados${query}`).then(res => res.json())
    ])
    .then(([pendientesData, aprobadosData]) => {
        setEventosPendientes(pendientesData.data);
        setEventosAprobados(aprobadosData.data);
        })
        .catch(err => console.error("Error al filtrar los eventos:", err));
    };

    return (
        <>
        <HeaderAdministrador />
            <div className='HomeAdmin'>
                <h2> Gestión de eventos </h2>
                <div id = "contenedor-busqueda-eventos">
                    <input
                        type="text"
                        placeholder="Buscar evento..."
                        className="busqueda-eventos"
                        onChange={(e) => handleFiltro(e.target.value)}
                    />
                </div>
                { cargando ? (
                    <p className="loading-msg">Cargando eventos...</p>
                ) : errorCarga ? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{errorCarga}</p>
                ) : (
                    <>
                    <section className='EventosPendientes'>
                        <h3> Eventos pendientes de aprobación </h3>
                        {eventosPendientes.length === 0 ? (
                            <p>No hay eventos pendientes de aprobación.</p>
                        ) : (
                            <div className='lista-eventos'>
                            {eventosPendientes.map((evento) => (
                                <div key={evento.id} className='evento-card' onClick={() => setEventoSeleccionado(evento)}>
                                <h4>{evento.nombre}</h4>
                                <div className='botones-card'>
                                    <button onClick={(e) => { e.stopPropagation(); handleAceptar(evento.id); }} id="aceptar-evento" disabled={procesando === evento.id}>{procesando === evento.id ? 'Procesando...' : 'Aceptar'}</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRechazar(evento.id); }} id="rechazar-evento" disabled={procesando === evento.id}>{procesando === evento.id ? 'Procesando...' : 'Rechazar'}</button>
                                </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </section>
                    <section className='EventosAprobados'>
                        <h3> Eventos aprobados </h3>
                        {eventosAprobados.length === 0 ? (
                            <p>No hay eventos aprobados.</p>
                        ) : ( 
                            <div className='lista-eventos'>
                                {eventosAprobados.map((evento) => (
                                    <div key={evento.id} className='evento-card' onClick={() => setEventoSeleccionado(evento)}>
                                    <h4>{evento.nombre}</h4>
                                    <div className='botones-card'>
                                        <button onClick={(e) => { e.stopPropagation(); handleDestacado(evento); }} id="boton-destacado" disabled={procesando === evento.id}> {procesando === evento.id ? "Procesando..." : evento.destacado ? "Quitar de destacados" : "Marcar como destacado"}</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleRechazar(evento.id); }} id="rechazar-evento" disabled={procesando === evento.id}>{procesando === evento.id ? 'Procesando...' : 'Eliminar evento'}</button>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                    </>
                )}
            </div>
            {eventoSeleccionado && (
                <div className="overlay">
                    <ProjectCard evento={eventoSeleccionado} onClose={() => setEventoSeleccionado(null)} />
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
    )
}

export default HomeAdmin