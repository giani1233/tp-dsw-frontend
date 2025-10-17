import './misEventos.css';
import HeaderOrganizador from '../components/HeaderOrganizador';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { Usuario } from '../types/usuario';

function capitalizar(texto: string | undefined) {
    return texto ? texto.replace(/\b\w/g, l => l.toUpperCase()) : '';
}

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

    return (
        <>
            <HeaderOrganizador />
            <div className="MisEventos">
                <h1><u>Mis eventos pendientes</u></h1>
                {cargando && <p>Cargando...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}
                {!cargando && !error && eventos.length === 0 && <p>No tienes eventos pendientes.</p>}
                <section className="eventos">
                    {!cargando && !error && eventos.map(evento => (
                        <div key={evento.id} className="evento">
                            <h2>{evento.nombre}</h2>
                            <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                            <p><strong>Hora de inicio:</strong> {new Date(evento.horaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                            <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
                            <p><strong>Dirección:</strong> {evento.direccion.calle} {evento.direccion.altura}, {evento.direccion.localidad?.nombre}</p>
                        </div>
                    ))}
                </section>
            </div>
            <Footer />
        </>
    );
}

export default MisEventos;
