import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './eventsMap.css'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type EventoMapa = {
    id: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    horaInicio: string;
    horaFin: string;
    clase: string;
}

type UbicacionMapa = {
    direccionId: number;
    latitud: number;
    longitud: number;
    calle: string;
    altura: string;
    localidad: string;
    eventos: EventoMapa[];
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

function formatearHora(fechaHora: string) { 
    const fecha = new Date(fechaHora.replace(' ', 'T'));
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}hs`;
}

function EventsMap() {
    const [ubicaciones, setUbicaciones] = useState<UbicacionMapa[]>([])
    const [cargando, setCargando] = useState(true)
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<UbicacionMapa | null>(null)

    useEffect(() => {
        const fecthMapa = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/eventos/aprobados-para-mapa')
                if (!res.ok) {
                    throw new Error('Error al cargar mapa');
                }
                const data = await res.json()
                setUbicaciones(data.data)
            } catch (err) {
                console.error('Error cargando mapa', err)
            } finally {
                setCargando(false)
            }
        }
        fecthMapa()
    }, [])

    if (cargando) return <p>Cargando mapa...</p>;

    return (
            <>
                <div className="contenedor-mapa">
                    <MapContainer center={[-34.6037, -58.3816]} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {ubicaciones.map((ubi) => (
                        <Marker
                        key={ubi.direccionId}
                        position={[ubi.latitud, ubi.longitud]}
                        eventHandlers={{
                            click: () => setDireccionSeleccionada(ubi),
                        }}
                        />
                    ))}
                    </MapContainer>
                </div>

                {direccionSeleccionada && (
                    <div className="contenedor-modal" onClick={() => setDireccionSeleccionada(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>
                        {direccionSeleccionada.calle} {direccionSeleccionada.altura} - {direccionSeleccionada.localidad}
                        </h2>
                        <hr />
                        {direccionSeleccionada.eventos.map((ev) => (
                        <div key={ev.id} className="evento-modal">
                            <h3>
                                {ev.nombre}
                            </h3>
                            <p>
                                {ev.descripcion}
                            </p>
                            <p>
                                <strong>Fecha:</strong>{' '}
                                {formatearFecha(ev.fechaInicio)}
                            </p>
                            <p>
                                <strong>Hora inicio:</strong> 
                                {formatearHora(ev.horaInicio)}
                            </p>
                            <p>
                                <strong>Hora fin:</strong> 
                                {formatearHora(ev.horaFin)}
                            </p>
                            <p>
                                <strong>Categoría:</strong> 
                                {ev.clase}
                            </p>
                        </div>
                        ))}

                        <button
                            className="cerrar"
                            onClick={() => setDireccionSeleccionada(null)}
                        >
                            Cerrar
                        </button>
                    </div>
                    </div>
                )}
            </>
    )
}

export default EventsMap