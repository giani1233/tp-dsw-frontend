import './home.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventsMap from '../components/EventsMap';
import { useAuth } from '../AuthContext' 
import { fetchConToken } from '../utils/fetchConToken';

function capitalizar(texto: string | undefined) {
    if (!texto) return '';
    return texto.replace(/\b\w/g, l => l.toUpperCase());
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

function Home() {
    const [eventos, setEventos] = useState<any[]>([])
    const [eventosFiltrados, setEventosFiltrados] = useState<any[]>([])
    const [eventosDestacados, setEventosDestacados] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [slideIndex, setSlideIndex] = useState(0);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [errorCompra, setErrorCompra] = useState<{[id: number]: string}>({})
    const { usuario } = useAuth() 

    const navigate = useNavigate();

    useEffect(() => {
        if (usuario) {
            if (usuario.tipo === 'administrador') {
                navigate('/administrador')
            } else if (usuario.tipo === 'organizador') {
                navigate('/misEventos')
            } else {
                navigate('/')
            }
        }
    }, [usuario])

    useEffect(() => {
    const fetchEventos = async () => {
            try {
                const response = await fetch('https://tp-dsw-backend-yjx3.onrender.com/api/eventos/aprobados')
                if (!response.ok) throw new Error('Error al cargar eventos')
                const contentType = response.headers.get('Content-Type')
                if (!contentType?.includes('application/json')) throw new Error('Error de servidor')
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
            const response = await fetch('https://tp-dsw-backend-yjx3.onrender.com/api/eventos/destacados')
            if (!response.ok) throw new Error('Error al cargar eventos destacados')
            const contentType = response.headers.get('Content-Type')
            if (!contentType?.includes('application/json')) throw new Error('Error de servidor')
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
        setErrorCompra(prev => ({ ...prev, [evento.id]: '' }))
        if(!usuario) {
            window.location.href = '/login';
            return;
        }
        try {
            const response = await fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/pagos/crear-preferencia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: evento.nombre, monto: evento.precioEntrada, cantidad: 1, idEvento: evento.id })
            })

            if (!response.ok) {
                const error = await response.json()
                setErrorCompra(prev => ({ ...prev, [evento.id]: error.message }))
                return
            }

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
            <EventsMap/>
            <h2>🌟 Eventos destacados 🌟</h2>
            <div className="contenedor-carrusel">
                {cargando && <p>Cargando...</p>}
                {error && <p style={{color: 'red'}}>Error: {error}</p>}
                {!cargando && !error && eventosDestacados.length === 0 && <p>No hay eventos destacados.</p>}
                {!cargando && !error && (
                    <div className="carrusel">
                        <button onClick={prevSlide} className="flecha-izquierda">&#10094;</button>
                        <div className="contenedor-slide">
                            <div className="slides" style={{ transform: `translateX(-${slideIndex * 39}%)` }}>
                                {eventosDestacados.map((evento) => (
                                    <div key={evento.id} className="slide">
                                        <h2>{evento.nombre}</h2> {}
                                        <hr />
                                        <p className="descripcion">{evento.descripcion}</p>
                                        <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                                        <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                                        <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                                        <p><strong>Cupos disponibles:</strong> {evento.cuposDisponibles}</p>
                                        <p><strong>Edad mínima:</strong> {evento.edadMinima ? `${evento.edadMinima} años` : 'Sin restricción'}</p>
                                        <p><strong>Organiza:</strong> {" "}
                                        {evento.organizador ? `${capitalizar(evento.organizador.nombre)} ${capitalizar(evento.organizador.apellido)}` : "Sin organizador"}</p>
                                        <p><strong>Dirección:</strong> {evento.direccion.calle} {evento.direccion.altura}, {evento.direccion.localidad.nombre}</p>
                                        {errorCompra[evento.id] && (
                                            <p style={{ color: 'red', fontWeight: 'bold', marginTop: '8px' }}>
                                                {errorCompra[evento.id]}
                                            </p>
                                        )}
                                        <button onClick={() => handleCompra(evento)}>Comprar Entrada</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="flecha-derecha" onClick={nextSlide}>&#10095;</button>
                    </div>
                )}
            </div> 
            <h2>🔰 Todos los eventos 🔰</h2>
            <section className="eventos">
                {cargando && <p>Cargando...</p>}
                {error && <p style={{color: 'red'}}>Error: {error}</p>}
                {!cargando && !error && eventos.length === 0 && <p>No hay eventos disponibles.</p>}
                {!cargando && !error && eventosFiltrados.map(evento => (
                <div key={evento.id} className="evento">
                    <h2>{evento.nombre}</h2> {}
                    <p className="descripcion">{evento.descripcion}</p>
                    <p><strong>Fecha:</strong> {formatearFecha(evento.fechaInicio)}</p>
                    <p><strong>Hora de inicio:</strong> {formatearHora(evento.horaInicio)}</p>
                    <p><strong>Precio de entrada:</strong> ${evento.precioEntrada}</p>
                    <p><strong>Cupos disponibles:</strong> {evento.cuposDisponibles}</p>
                    <p><strong>Edad mínima:</strong> {evento.edadMinima ? `${evento.edadMinima} años` : 'Sin restricción'}</p>
                    <p><strong>Organiza:</strong> {" "}
                    {evento.organizador ? `${capitalizar(evento.organizador.nombre)} 
                    ${capitalizar(evento.organizador.apellido)}` : "Sin organizador"}</p>
                    <p><strong>Dirección:</strong> {evento.direccion.calle} {evento.direccion.altura}, {evento.direccion.localidad.nombre}</p>
                    {errorCompra[evento.id] && (
                        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '8px' }}>
                            {errorCompra[evento.id]}
                        </p>
                    )}
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