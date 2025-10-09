import './homeAdmin.css';
import HeaderAdministrador from "../components/HeaderAdministrador";
import { useState, useEffect } from 'react';
import { Evento } from "../types/evento";
import ProjectCard from '../components/ProjectCard';

function HomeAdmin() {

    const [eventosPendientes, setEventosPendientes] = useState<Evento[]>([])
    const [eventosAprobados, setEventosAprobados] = useState<Evento[]>([])
    const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null)
    
    const fetchPendientes = () => {fetch('http://localhost:3000/api/eventos/pendientes')
        .then((res) => res.json())
        .then((resData) => { 
            console.log(resData);
            setEventosPendientes(resData.data)
        })
        .catch((err) => console.error("Error al cargar los eventos:", err))
    }

    const fetchAprobados = () => {fetch('http://localhost:3000/api/eventos/aprobados')
        .then((res) => res.json())
        .then((resData) => { 
            console.log(resData);
            setEventosAprobados(resData.data)
        })
        .catch((err) => console.error("Error al cargar los eventos:", err))
    }

    useEffect(() => {
        fetchPendientes();
        fetchAprobados();
    }, [])

    const handleClick = (evento: Evento) => {
        setEventoSeleccionado(evento)
    }

    const handleVolver = () => {
        setEventoSeleccionado(null)
    }

    const handleAceptar = (id: number) => {
        fetch(`http://localhost:3000/api/eventos/${id}`, {
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
        })
        .catch((err) => console.error("Error al aprobar el evento:", err));
    };

    const handleRechazar = (id: number) => {
        fetch(`http://localhost:3000/api/eventos/${id}`, {
            method: 'DELETE',
        })
        .then((res) => res.json())
        .then((resData) => {
            console.log(resData);
            fetchPendientes();
            fetchAprobados();
        })
        .catch((err) => console.error("Error al rechazar el evento:", err));
    };

    const handleDestacado = (evento: Evento) => {
        fetch(`http://localhost:3000/api/eventos/${evento.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ destacado: !evento.destacado }),
        })
        .then((res) => res.json())
        .then((resData) => {
            console.log(resData);
            fetchPendientes();
            fetchAprobados();
        })
        .catch((err) => console.error("Error al aprobar el evento:", err));
    };

    if (eventoSeleccionado) {
        return (
            <>
                <ProjectCard
                    evento={eventoSeleccionado}
                    onClose={handleVolver}
                />
            </>
        )
    }

    return (
        <>
        <HeaderAdministrador />
            <div className='HomeAdmin'>
                <h2> Gestión de eventos </h2>

                <section className='EventosPendientes'>
                    <h3> Eventos pendientes de aprobación </h3>
                    {eventosPendientes.length === 0 ? (
                        <p>No hay eventos pendientes de aprobación.</p>
                    ) : (
                        <div className='lista-eventos'>
                            {eventosPendientes.map((evento) => (
                                <div key={evento.id} className='evento-card' onClick={() => handleClick(evento)}>
                                    <h4>{evento.nombre}</h4>
                                <div className='botones-card'>
                                    <button onClick={(e) => { e.stopPropagation(); handleAceptar(evento.id); }}>Aceptar</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRechazar(evento.id); }}>Rechazar</button>
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
                                <div key={evento.id} className='evento-card' onClick={() => handleClick(evento)}>
                                    <h4>{evento.nombre}</h4>
                                <div className='botones-card'>
                                    <button onClick={(e) => { e.stopPropagation(); handleDestacado(evento); }}>
                                        {evento.destacado ? "Quitar de destacados" : "Marcar como destacado"}
                                    </button>
                                </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}

export default HomeAdmin