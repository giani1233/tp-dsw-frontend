import './misEventos.css';
import HeaderOrganizador from '../components/HeaderOrganizador';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchConToken } from '../utils/fetchConToken';

function formatearFecha(fechaISO: string) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const fecha = new Date(fechaISO);
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]}, ${fecha.getFullYear()}`;
}

function formatearHora(fechaHora: string) {
    const fecha = new Date(fechaHora.replace(' ', 'T'));
    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}hs`;
}

function MisEventos() {
    const [eventos, setEventos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { usuario } = useAuth();

    useEffect(() => {
        const fetchMisEventos = async () => {
            if (!usuario) {
                setError('No hay usuario logueado');
                setCargando(false);
                return;
            }
            try {
                const response = await fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/eventos/organizador/${usuario.id}`);
                if (!response.ok) throw new Error('Error al cargar tus eventos');
                const data = await response.json();
                setEventos(Array.isArray(data) ? data : data.data);
            } catch (err: any) {
                setError(err.message || 'Ocurrió un error');
            } finally {
                setCargando(false);
            }
        };
        fetchMisEventos();
    }, [usuario]);

    const fecha = new Date();
    const eventosPendientes = eventos.filter(e => e.estado === 'pendiente');
    const eventosAprobados = eventos.filter(e => e.estado === 'aprobado' && new Date(e.fechaInicio) >= fecha);
    const eventosFinalizados = eventos.filter(e => e.estado === 'aprobado' && new Date(e.fechaInicio) < fecha);

    const renderEventos = (lista: any[]) => lista.map(evento => (
        <div key={evento.id} className="evento">
            <h2>{evento.nombre}</h2>
            <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
            <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
            <p><strong>Hora de fin:</strong> {formatearHora(evento.horaFin)}</p>
            <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
            <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
            <p><strong>Dirección:</strong> {evento.direccion.calle} {evento.direccion.altura}, {evento.direccion.localidad?.nombre}</p>
        </div>
    ))

    return (
        <>
            <HeaderOrganizador />
            <main className='MisEventos'>
                {cargando ? (
                    <p className="loading-msg">Cargando tus eventos...</p>
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                ) : (
                    <>
                        <h1><u>Eventos pendientes</u></h1>
                        {eventosPendientes.length === 0
                            ? <p>No tenés eventos pendientes.</p>
                            : <section className="eventos">{renderEventos(eventosPendientes)}</section>
                        }
                        <h1><u>Eventos aprobados</u></h1>
                        {eventosAprobados.length === 0
                            ? <p>No tenés eventos aprobados vigentes.</p>
                            : <section className="eventos">{renderEventos(eventosAprobados)}</section>
                        }
                        <h1><u>Eventos finalizados</u></h1>
                        {eventosFinalizados.length === 0
                            ? <p>No tenés eventos finalizados.</p>
                            : <section className="eventos">{renderEventos(eventosFinalizados)}</section>
                        }
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default MisEventos;
