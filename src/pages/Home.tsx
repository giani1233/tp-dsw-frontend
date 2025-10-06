import './home.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react';

function formatearFecha(fechaISO: string) { // Formatea fechaInicio del evento (Convierte "2023-11-15" a "15 de Noviembre, 2023")
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

function formatearHora(fechaHora: string) { // Formatea horaInicio del evento (Convierte "2023-11-15 21:00:00" a "21:00hs")
  const fecha = new Date(fechaHora.replace(' ', 'T'));
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  return `${horas}:${minutos}hs`;
}

function Home() {
    const [eventos, setEventos] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
    const fetchEventos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/eventos')
            if (!response.ok) throw new Error('Error al cargar eventos')
            const data = await response.json()
            console.log(data)
            setEventos(Array.isArray(data) ? data : data.data)
        } catch (error: any) {
            setError(error.message || 'Ocurrió un error')
        } finally {
            setCargando(false)
        }
        }
    fetchEventos()
  }, [])

    return (
        <>
        <Header />
            <div className='Home'>
            <h1><u>Eventos disponibles a la fecha de: {new Date().toLocaleDateString()}</u></h1>
            <section id="eventos">
                {cargando && <p>Cargando...</p>}
                {error && <p style={{color: 'red'}}>Error: {error}</p>}
                {!cargando && !error && eventos.length === 0 && <p>No hay eventos disponibles.</p>}
                {!cargando && !error && eventos.map(evento => (
                <div key={evento.id} className="evento">
                    <h2>{evento.nombre}</h2> {/* Quizás podemos hacer que el organizador pueda elegir un emoji a mostrar al momento de crear el evento, y este se carga acá, para que tenga un poco mas de color nomás */}
                    <hr />
                    <p className="descripcion">{evento.descripcion}</p>
                    <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                    <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                    <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                    <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
                    <p><strong>Edad mínima:</strong> {evento.edadMinima ? `${evento.edadMinima} años` : 'Sin restricción'}</p>
                    <button>Comprar Entrada</button>
                </div>
                ))}

                <div className="evento" id="evento-1">
                    <h2>Concierto de Electrónica 🎶</h2> <hr></hr>
                    <p className="descripcion">Disfruta de una noche llena de música en vivo de las mejores bandas de electrónica.</p>
                    <p><strong>Fecha:</strong> 15 de Noviembre, 2025</p>
                    <p><strong>Hora de inicio:</strong> 21:00hs</p>
                    <p><strong>Precio de entrada:</strong> $8500</p>
                    <p><strong>Cupos disponibles:</strong> 10000</p>
                    <p><strong>Edad mínima:</strong> 18 años</p>
                    <button>Comprar Entrada</button>
                </div>

                <div className="evento" id="evento-2">
                    <h2>Obra de Teatro: "El Gran Show" 🎤</h2> <hr></hr>
                    <p className="descripcion">Una comedia divertida que te hará reír de principio a fin.</p>
                    <p><strong>Fecha:</strong> 20 de Noviembre, 2025</p>
                    <p><strong>Hora de inicio:</strong> 20:00hs</p>
                    <p><strong>Precio de entrada:</strong> $12000</p>
                    <p><strong>Cupos disponibles:</strong> 5000</p>
                    <p><strong>Edad mínima:</strong> 12 años</p>
                    <button>Comprar Entrada</button>
                </div>

                <div className="evento" id="evento-3">
                    <h2>Exposición de Arte Contemporáneo 🎨</h2> <hr></hr>
                    <p className="descripcion">Explora las obras de artistas emergentes y consagrados en esta exposición única.</p>
                    <p><strong>Fecha:</strong> 25 de Noviembre, 2025</p>
                    <p><strong>Hora de inicio:</strong> 10:00hs</p>
                    <p><strong>Precio de entrada:</strong> $5000</p>
                    <p><strong>Cupos disponibles:</strong> 200</p>
                    <p><strong>Edad mínima:</strong> Sin restricción</p>
                    <button>Comprar Entrada</button>
                </div>

            </section>
            </div>
        <Footer />
        </>
    )
}

export default Home