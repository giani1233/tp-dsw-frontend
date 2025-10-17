import './homeOrganizador.css';
import HeaderOrganizador from "../components/HeaderOrganizador";
import Footer from "../components/Footer"
import { useState, useEffect, use } from 'react';
import { useForm, useWatch} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Evento } from "../types/evento";
import { ClaseEvento } from '../types/claseEvento';
import { Direccion } from '../types/direccion';
import { Localidad } from '../types/localidad';
import { Provincia } from '../types/provincia';
import { Usuario } from '../types/usuario';

function HomeOrganizador() {
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categorias, setCategorias] = useState<ClaseEvento[]>([]); 
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<number | null>(null);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<number | null>(null);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
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

    useEffect(() => {
      const cargarUsuario = async () => {
        const usuarioLocal = localStorage.getItem('usuario');
        if (!usuarioLocal) return;
        const usuarioObj = JSON.parse(usuarioLocal);
        try {
          const res = await fetch(`http://localhost:3000/api/usuarios/Organizador/${usuarioObj.id}`);
          if (!res.ok) throw new Error('No se pudo cargar el usuario');
          const data = await res.json();
          setUsuario(data.data);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
        }
      }

      cargarUsuario();
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/api/eventos/clases')
        .then((res) => res.json())
        .then((resData) => {
            console.log("Categorías cargadas:", resData.data);
            setCategorias(resData.data)
        })
        .catch((err) => console.error("Error al cargar las categorías:", err))
    }, [])

    useEffect(() => {
        fetch('http://localhost:3000/api/provincias')
        .then((res) => res.json())
        .then((resData) => {
            console.log("Provincias cargadas:", resData.data);
            setProvincias(resData.data)
        })
        .catch((err) => console.error("Error al cargar las provincias:", err))
    }, [])

    useEffect(() => {
        if (provinciaSeleccionada === null) return;
        fetch(`http://localhost:3000/api/localidades/provincia/${provinciaSeleccionada}`)
        .then((res) => res.json())
        .then((resData) => {
            console.log("Localidades cargadas:", resData.data);
            setLocalidades(resData.data)
        })
        .catch((err) => console.error("Error al cargar las localidades:", err))
    }, [provinciaSeleccionada])

    useEffect(() => {
        if (localidadSeleccionada === null) return;
        fetch(`http://localhost:3000/api/direcciones/localidad/${localidadSeleccionada}`)
        .then((res) => res.json())
        .then((resData) => {
            console.log("Direcciones cargadas:", resData.data);
            setDirecciones(resData.data)
        })
        .catch((err) => console.error("Error al cargar las direcciones:", err))
    }, [localidadSeleccionada])
const resetForm = () => {
  setMostrarFormulario(false);
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


  const onSubmit = async (data: any) => {
    try {
      const fechaInicio = data.fecha ? new Date(data.fecha) : null;
      const horaInicio = data.horaInicio ? new Date(`1970-01-01T${data.horaInicio}:00`) : null;
      const horaFin = data.horaFin ? new Date(`1970-01-01T${data.horaFin}:00`) : null;
      const eventoParaCrear = {
        ...data,
        claseEvento: data.categoria,   
        direccion: data.direccion,      
        precioEntrada: Number(data.precioEntrada),
        cantidadCupos: Number(data.cantidadCupos),
        cuposDisponibles: Number(data.cantidadCupos),
        edadMinima: Number(data.edadMinima),
        fechaInicio: fechaInicio,
        horaInicio: horaInicio,
        horaFin: horaFin,
        estado: "pendiente",
        destacado: false,
        organizador: usuario ? usuario.id : null
      };
      const respuestaC = await fetch(`http://localhost:3000/api/eventos`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(eventoParaCrear)
      });
      const resultadoC = await respuestaC.json();
      if (!respuestaC.ok) {
        throw new Error(resultadoC.message || 'Error en la creación de evento.');
      }
      setEventos([...eventos, resultadoC]);
      alert('✅ ¡Creación exitosa!');
      resetForm();
    } catch (error) {
      console.error(error);
      alert('❌ Ocurrió un error al crear el evento.');
    }
  };

const editarEvento = (evento: Evento) => {
  if (evento.estado === 'pendiente') {
    setEventoEditando(evento);
    setEventoData({
      ...evento,
      direccion: evento.direccion || {
        calle: '',
        altura: 0,
        localidad: { nombre: '' }
      }
    });
    setMostrarFormulario(true);
  }
};


  return (
    <>
    <HeaderOrganizador />
      <div className='HomeOrganizador'>
      <main id="organizador-panel">
          <div className= 'nuevoEvento-crear'>
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
                          <label htmlFor="descripcion">Descripción:</label>
                          <input type="text" id="descripcion" minLength={20} maxLength={500} {...register("descripcion", {required: "La descripción es obligatoria",
                              minLength: {value: 20, message:"La descripción debe tener al menos 20 caracteres."},
                              maxLength: {value: 500, message:"La descripción no debe sobrepasar los 500 caracteres"}
                              })} 
                          />
                          {errors.descripcion && typeof errors.descripcion.message === "string" &&<span className="error-message">{errors.descripcion.message}</span>}
                      </div>
                      
                      <div className="input-group">
                          <label htmlFor="fecha">Fecha:</label>
                          <input type="date" id="fecha" {...register("fecha", {required: "La fecha del Evento es obligatoria",
                          validate: {
                          notFuture: (value) => {
                          const date = new Date(value)
                          const today = new Date()
                          return date >= today || "La fecha del evento no puede ser pasada"}}      
                                  })}    
                      />
                      {errors.fecha && typeof errors.fecha.message === "string" &&<span className="error-message">{errors.fecha.message}</span>}
                      </div>

                      <div className="input-group">
                          <label htmlFor="horaInicio">Hora de Inicio:</label>
                          <input type="time" id="horaInicio" {...register("horaInicio", {required: "La hora de inicio es obligatoria",})} />
                      {errors.horaInicio && typeof errors.horaInicio.message === "string" &&<span className="error-message">{errors.horaInicio.message}</span>}
                      </div>

                      <div className="input-group">
                          <label htmlFor="horaFin">Hora de Fin:</label>
                          <input type="time" id="horaFin" {...register("horaFin", {required: "La hora de fin es obligatoria",})} />
                      {errors.horaFin && typeof errors.horaFin.message === "string" &&<span className="error-message">{errors.horaFin.message}</span>}
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
                          <label htmlFor="edadMinima">Edad Mínima:</label>
                          <input type="number" id="edadMinima" min={0} max={120} {...
                          register("edadMinima", {
                                  required: "La edad mínima es obligatoria",
                                  min: { value: 0, message: "La edad mínima debe ser al menos 0" },
                                  max: { value: 120, message: "La edad mínima no debe superar 120" }
                              })}
                          />
                          {errors.edadMinima && typeof errors.edadMinima.message === "string" && (
                              <span className="error-message">{errors.edadMinima.message}</span>
                          )}
                      </div>

                      <select id="categoria" {...register("categoria", { required: "La categoría es obligatoria" })}>
                        <option value="">Seleccione una categoría</option>
                        {categorias.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                      </select>

                      <select id="provincia" onChange={e => setProvinciaSeleccionada(Number(e.target.value))}>
                        <option value="">Seleccione una provincia</option>
                        {provincias.map(p => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>

                      <select
                        id="localidad"
                        disabled={!provinciaSeleccionada}
                        {...register("localidad", { required: "Debe seleccionar una localidad" })}
                        onChange={(e) => setLocalidadSeleccionada(Number(e.target.value))}
                      >
                        <option value="">Seleccione una localidad</option>
                        {localidades.length
                          ? localidades.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)
                          : <option value="">No hay localidades disponibles</option>
                        }
                      </select>

                      <select id="direccion" disabled={!provinciaSeleccionada} {...register("direccion", { required: "Debe seleccionar una dirección" })}>
                        <option value="">Seleccione una dirección</option>
                        {direcciones.length
                          ? direcciones.map(d => <option key={d.id} value={d.id}>{d.calle} al {d.altura}, {d.detalles}</option>)
                          : <option value="">No hay direcciones disponibles</option>
                        }
                      </select>

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