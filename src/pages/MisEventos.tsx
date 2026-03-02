import './misEventos.css';
import HeaderOrganizador from '../components/HeaderOrganizador';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { Usuario } from '../types/usuario';

function formatearFecha(fechaISO: string) { 
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    return `${dia} de ${mes}, ${anio}`;
}

function formatearHora(fechaHora: string) { 
    const fecha = new Date(fechaHora.replace(' ', 'T'));
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}hs`;
}

function MisEventos() {
    const [eventos, setEventos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMisEventos = async () => {
            const usuario: Usuario | null = JSON.parse(localStorage.getItem('usuario') || 'null');
            if (!usuario) {
                setError('No hay usuario logueado');
                setCargando(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/api/eventos/organizador/${usuario.id}`);
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
    }, []);

    const fecha = new Date();
    const eventosPendientes = eventos.filter(e => e.estado === 'pendiente');
    const eventosAprobados = eventos.filter(e => e.estado === 'aprobado' && new Date(e.fechaInicio) >= fecha);
    const eventosFinalizados = eventos.filter(e => e.estado === 'aprobado' && new Date(e.fechaInicio) < fecha);

    return (
        <>
            <HeaderOrganizador />
            <main className='MisEventos'>
                <h1><u>Eventos pendientes</u></h1>
                {eventosPendientes.length === 0 && <p>No tienes eventos pendientes.</p>}
                <section className="eventos">
                {eventosPendientes.map(evento => (
                    <div key={evento.id} className="evento">
                        <h2>{evento.nombre}</h2>
                        <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                        <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                        <p><strong>Hora de fin:</strong> {formatearHora(evento.horaFin)}</p>
                        <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                        <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
                        <p><strong>Dirección:</strong> {evento.direccion.calle} {evento.direccion.altura}, {evento.direccion.localidad?.nombre}</p>
                    </div>
                ))}
                </section>

                <h1><u>Eventos aprobados</u></h1>
                {eventosAprobados.length === 0 && <p>No tienes eventos aprobados vigentes.</p>}
                <section className="eventos">
                {eventosAprobados.map(evento => (
                    <div key={evento.id} className="evento">
                        <h2>{evento.nombre}</h2>
                        <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                        <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                        <p><strong>Hora de fin:</strong> {formatearHora(evento.horaFin)}</p>
                        <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                        <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
                        <p><strong>Dirección:</strong> {evento.direccion.calle} {evento.direccion.altura}, {evento.direccion.localidad?.nombre}</p>
                    </div>
                ))}
                </section>

                <h1><u>Eventos finalizados</u></h1>
                {eventosFinalizados.length === 0 && <p>No tienes eventos finalizados.</p>}
                <section className="eventos">
                {eventosFinalizados.map(evento => (
                    <div key={evento.id} className="evento">
                        <h2>{evento.nombre}</h2>
                        <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                        <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                        <p><strong>Hora de fin:</strong> {formatearHora(evento.horaFin)}</p>
                        <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                        <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
                        <p><strong>Dirección:</strong> {evento.direccion.calle} {evento.direccion.altura}, {evento.direccion.localidad?.nombre}</p>
                    </div>
                ))}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default MisEventos;
