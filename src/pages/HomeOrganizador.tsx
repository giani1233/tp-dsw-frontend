import './homeOrganizador.css';
import HeaderOrganizador from "../components/HeaderOrganizador";
import Footer from "../components/Footer"
import { useState, useEffect } from 'react';
import { useForm, useWatch} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Evento } from "../types/evento";

function HomeOrganizador() {
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm();
  const [eventoData, setEventoData] = useState<Partial<Evento>>({
      nombre: '',
      descripcion: '',
      precioEntrada: 0,
      cantidadCupos: 0,
      fechaInicio: new Date(),
      horaInicio: new Date(),
      horaFin: new Date(),
      edadMinima: 0,
      direccion: {
        calle: '',
        altura: 0,
        localidad: {
          nombre: ''
        }
      }
    })

  const onSubmit = async (data: any) => {
        console.log(data) 

  useEffect(() => {
    const organizador = localStorage.getItem('usuario');
    const id = JSON.parse(organizador).id
    const respuestaEv = async() => {
    const respuestaE = await fetch(`http://localhost:3000/organizador/${id}`)
    if (!respuestaE.ok) {
      throw new Error("Error obteniendo eventos");
    }
    const resultado = await respuestaE.json();
    setEventos(resultado)
    }})   


  const respuestaC = await fetch(`http://localhost:3000/api/eventos`, {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(eventoData)
      })

  const resultadoC = await respuestaC.json()

  if (!respuestaC.ok) {
    throw new Error(resultadoC.message || 'Error en la creación de evento.')}
    alert('✅ ¡Creación exitosa!')

  const handleSubmit = () => {
    // Validación básica
    if (!eventoData.nombre || !eventoData.descripcion || !eventoData.fechaInicio || !eventoData.horaInicio) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    if (eventos) {
      const eventosActualizados = eventos.map(evento =>
        evento.nombre === evento.nombre
          ? {
              ...eventoEditando,
              ...eventoData,
              cuposDisponibles: eventoData.cantidadCupos || 0,
              organizador: eventoData.organizador
            } as Evento
          : evento
      );
      setEventos(eventosActualizados);
    } else {
      const nuevoEvento: Evento = {
      id: data.id,
      nombre: (data.nombre).toLowerCase(),
      descripcion: data.descripcion,
      precioEntrada: data.precioEntrada,
      cantidadCupos: data.cantidadCupos || null,
      fechaInicio: data.fechaInicio,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      cuposDisponibles: data.cuposDisponibles || null,
      edadMinima: data.edadMinima || null,
      claseEvento: data.claseEvento,
      organizador: data.usuario,
      direccion: data.direccion,
      estado: "pendiente",
      destacado: data.destacado = false
      };
      setEventos([...eventos, nuevoEvento]);
    }
    resetForm();
  };


  const resetForm = () => {
    setMostrarFormulario(false);
    setEventos(null);
    setEventoData({
      nombre: '',
      descripcion: '',
      precioEntrada: 0,
      cantidadCupos: 0,
      fechaInicio: new Date(),
      horaInicio: new Date(),
      horaFin: new Date(),
      edadMinima: 0,
      direccion: {
        calle: '',
        altura: 0,
        localidad: {
          nombre: ''
        }
      }
    });
  };

  ;
  };

  const editarEvento = (evento: Evento) => {
    if (evento.estado === 'pendiente') {
      setEventoEditando(evento);
      setEventoData(evento);
      setMostrarFormulario(true);
    }
  }

  return (
    <>
    <HeaderOrganizador />
      <div className='HomeOrganizador'>
      <h1><u>Panel de organizador de Eventos</u></h1>
      <main id="organizador-panel">
          <p>Bienvenido al panel de organizador de eventos. Aquí puedes gestionar tus eventos, ver estadísticas y otras configuraciones relacionadas con tus creaciones.</p>
          <div className= 'nuevoEvento-crear'>
              <p>Haga clic para empezar a crear su evento.</p>
              { <div className="nuevoEvento-container">
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div className="input-group">
                          <label htmlFor="nombre">Nombre:</label>
                          <input type="text" id="nombre" {...register("nombre", {required: "El nombre es obligatorio",
                              pattern: {value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, message: "El nombre solo puede contener letras"}})} 
                          />
                          {errors.nombre && typeof errors.nombre.message === "string" &&<span className="error-message">{errors.nombre.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="descripcion">descripcion:</label>
                          <input type="text" id="descripcion" minLength={20} maxLength={500} {...register("descripcion", {required: "La descripcion es obligatoria",
                              minLength: {value: 20, message:"La descripcion debe tener al menos 20 caracteres."},
                              maxLength: {value: 500, message:"La descripcion no debe sobrepasar los 500 caracteres"}
                              })} 
                          />
                          {errors.descripcion && typeof errors.descripcion.message === "string" &&<span className="error-message">{errors.descripcion.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="precioEntrada">Precio de Entrada:</label>
                          <input type="text" id="precioEntrada" minLength={1} maxLength={10} {...register("precioEntrada", {required: "El Precio de Entrada es obligatorio",
                                  minLength: {value: 1, message: "El Precio de Entrada debe de ser al menos $1."},
                                  maxLength: {value: 8, message: "El Precio de Entrada no debe pasar de las 10 cifras"},})}
                              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} pattern="[0-9]*" inputMode="numeric"
                      />
                      {errors.precioEntrada && typeof errors.precioEntrada.message === "string" &&<span className="error-message">{errors.precioEntrada.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="cantidadCupos">Cantidad de Cupos:</label>
                          <input type="text" id="cantidadCupos" minLength={1} maxLength={8} {...register("cantidadCupos", {required: "La cantidad de Cupos es obligatoria",
                                  minLength: {value: 1, message: "La cantidad de Cupos debe de ser al menos una."},
                                  maxLength: {value: 8, message: "La cantidad de Cupos no debe pasar de las 8 cifras"},})}
                              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} pattern="[0-9]*" inputMode="numeric"
                      />
                      {errors.cantidadCupos && typeof errors.cantidadCupos.message === "string" &&<span className="error-message">{errors.cantidadCupos.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="fecha">Fecha:</label>
                          <input type="date" id="fecha" {...register("fecha", {required: "La fecha del Evento es obligatoria",
                          validate: {
                          notFuture: (value) => {
                          const date = new Date(value)
                          const today = new Date()
                          return date <= today || "La fecha de nacimiento no puede ser futura"}}      
                                  })}    
                      />
                      {errors.fecha && typeof errors.fecha.message === "string" &&<span className="error-message">{errors.fecha.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="horaInicio">Hora de Inicio:</label>
                          <input type="text" id="horaInicio" minLength={1} maxLength={8} {...register("horaInicio", {required: "La cantidad de Cupos es obligatoria",
                                  minLength: {value: 1, message: "La cantidad de Cupos debe de ser al menos una."},
                                  maxLength: {value: 8, message: "La cantidad de Cupos no debe pasar de las 8 cifras"},})}
                              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} pattern="[0-9]*" inputMode="numeric"
                      />
                      {errors.horaInicio && typeof errors.horaInicio.message === "string" &&<span className="error-message">{errors.horaInicio.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="horaFin">Hora de Fin:</label>
                          <input type="text" id="horaFin" minLength={1} maxLength={8} {...register("horaFin", {required: "La cantidad de Cupos es obligatoria",
                                  minLength: {value: 1, message: "La cantidad de Cupos debe de ser al menos una."},
                                  maxLength: {value: 8, message: "La cantidad de Cupos no debe pasar de las 8 cifras"},})}
                              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} pattern="[0-9]*" inputMode="numeric"
                      />
                      {errors.horaFin && typeof errors.horaFin.message === "string" &&<span className="error-message">{errors.horaFin.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="edadMinima">Precio de Entrada:</label>
                          <input type="text" id="edadMinima" minLength={1} maxLength={10} {...register("edadMinima", {required: "El Precio de Entrada es obligatorio",
                                  minLength: {value: 1, message: "El Precio de Entrada debe de ser al menos $1."},
                                  maxLength: {value: 8, message: "El Precio de Entrada no debe pasar de las 10 cifras"},})}
                              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} pattern="[0-9]*" inputMode="numeric"
                      />
                      {errors.edadMinima && typeof errors.edadMinima.message === "string" &&<span className="error-message">{errors.edadMinima.message}</span>}
                      </div>
                      <div className="input-group">
                          <label htmlFor="descripcion">descripcion:</label>
                          <input type="text" id="descripcion" minLength={20} maxLength={500} {...register("descripcion", {required: "La descripcion es obligatoria",
                              minLength: {value: 20, message:"La descripcion debe tener al menos 20 caracteres."},
                              maxLength: {value: 500, message:"La descripcion no debe sobrepasar los 500 caracteres"}
                              })} 
                          />
                          {errors.descripcion && typeof errors.descripcion.message === "string" &&<span className="error-message">{errors.descripcion.message}</span>}
                      </div>

                      <button type="submit" className="btn-creado">Crear Evento</button>

                  </form>
              
              </div> }
          </div>
        <div className='eventoAModificar-container'>
        {eventos.map(evento => (
          <div key={evento.id}>
            <h3 className='eventoAModificar-nombre'>{evento.nombre}</h3>
            <p className='eventoAModificar-descripcion'>{evento.descripcion}</p>
            <span className='eventoAModificar-fechaInicio'>{new Date(evento.fechaInicio).toLocaleDateString('es-AR')}</span>
            <span className='eventoAModificar-precioEntrada'>${evento.precioEntrada}</span>
            <button onClick={() => editarEvento(evento)} className="eventoAModificar-btn">Editar Evento</button>
          </div>
          ))}
        </div>
      </main>
      
      </div>
      <Footer />
    </>
      
  )
}

export default HomeOrganizador