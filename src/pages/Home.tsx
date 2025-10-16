import './home.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react';

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

function Home() {
    const [eventos, setEventos] = useState<any[]>([])
    const [eventosFiltrados, setEventosFiltrados] = useState<any[]>([])
    const [eventosDestacados, setEventosDestacados] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [slideIndex, setSlideIndex] = useState(0);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [organizadores, setOrganizadores] = useState<any[]>([]);

    useEffect(() => {
    const fetchOrganizadores = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/usuarios');
            if (!response.ok) throw new Error('Error al cargar organizadores');
            const data = await response.json();
            setOrganizadores(Array.isArray(data) ? data : data.data);
        } catch (error: any) {
            // Puedes manejar el error si lo deseas
        }
    };
    fetchOrganizadores();
}, []);

    function obtenerNombreOrganizador(id: number) {
        const organizador = organizadores.find(o => o.id === id);
        return organizador ? `${organizador.nombre} ${organizador.apellido}` : `ID ${id}`;
    }

    useEffect(() => {
    const fetchEventos = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/eventos/aprobados')
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
    const fetchDestacados = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/eventos/destacados')
            if (!response.ok) throw new Error('Error al cargar eventos destacados')
            const data = await response.json()
            console.log(data)
            setEventosDestacados(Array.isArray(data) ? data : data.data)
        } catch (error: any) {
            setError(error.message || 'Ocurrió un error')
        } finally {
            setCargando(false)
        }
    }
    fetchEventos()
    fetchDestacados()
    }, [])

    useEffect(() => {
        let filtrados = eventos
        if (categoriaSeleccionada) {
            filtrados = filtrados.filter(e => e.claseEvento?.nombre === categoriaSeleccionada)
        }
        if (busqueda) {
            filtrados = filtrados.filter(e =>
                e.nombre.toLowerCase().includes(busqueda.toLowerCase()) 
            )
        }
        setEventosFiltrados(filtrados)
    }, [categoriaSeleccionada, busqueda, eventos])

    const nextSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % eventos.length);
    }
    const prevSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex - 1 + eventos.length) % eventos.length);
    }

    const handleCompra = async (evento: any) => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || null);
        if(!usuario) {
            window.location.href = '/login';
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/pagos/crear-preferencia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: evento.nombre, monto: evento.precioEntrada, cantidad: 1, idEvento: evento.id, idUsuario: usuario.id })
            })

            const data = await response.json()

            if (data.id) {
                const mpUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
                window.location.href = mpUrl;
            } else {
                console.error('No se pudo crear la preferencia:', data);
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
        }
    }

    return (
        <>
        <Header 
            onCategoryChange={setCategoriaSeleccionada}
            onSearch={setBusqueda}
        />
            <div className='Home'>
            <h1><u>Eventos disponibles a la fecha de: {new Date().toLocaleDateString()}</u></h1>
            <h2>🌟 Eventos destacados 🌟</h2>
            <div className="contenedor-carrusel">
                {cargando && <p>Cargando...</p>}
                {error && <p style={{color: 'red'}}>Error: {error}</p>}
                {!cargando && !error && eventosDestacados.length === 0 && <p>No hay eventos destacados.</p>}
                {!cargando && !error && (
                    <div className="carrusel">
                        <button onClick={prevSlide} className="flecha-izquierda">&#10094;</button>
                        <div className="contenedor-slide">
                            <div className="slides" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
                                {eventosDestacados.map((evento) => (
                                    <div key={evento.id} className="slide">
                                        <h2>{evento.nombre}</h2> {}
                                        <hr />
                                        <p className="descripcion">{evento.descripcion}</p>
                                        <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                                        <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                                        <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                                        <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
                                        <p><strong>Edad mínima:</strong> {evento.edadMinima ? `${evento.edadMinima} años` : 'Sin restricción'}</p>
                                        <p><strong>Organiza:</strong> {obtenerNombreOrganizador(evento.organizadorId)}</p>
                                        <button onClick={() => handleCompra(evento)}>Comprar Entrada</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="flecha-derecha" onClick={nextSlide}>&gt;</button>
                    </div>
                )}
            </div> 
            <h2>⭐ Todos los eventos ⭐</h2>
            <section className="eventos">
                {cargando && <p>Cargando...</p>}
                {error && <p style={{color: 'red'}}>Error: {error}</p>}
                {!cargando && !error && eventos.length === 0 && <p>No hay eventos disponibles.</p>}
                {!cargando && !error && eventosFiltrados.map(evento => (
                <div key={evento.id} className="evento">
                    <h2>{evento.nombre}</h2> {}
                    <hr />
                    <p className="descripcion">{evento.descripcion}</p>
                    <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                    <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                    <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                    <p><strong>Cupos disponibles:</strong> {evento.cantidadCupos}</p>
                    <p><strong>Edad mínima:</strong> {evento.edadMinima ? `${evento.edadMinima} años` : 'Sin restricción'}</p>
                    <p><strong>Organiza:</strong> {obtenerNombreOrganizador(evento.organizadorId)}</p>
                    <button onClick={() => handleCompra(evento)}>Comprar Entrada</button>
                </div>
                ))}
            </section>
            </div>
        <Footer />
        </>
    )
}

export default Home