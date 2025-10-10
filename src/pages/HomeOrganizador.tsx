import './homeOrganizador.css';
import HeaderOrganizador from "../components/HeaderOrganizador";
import Footer from "../components/Footer"
import { useState, useEffect } from 'react';
import { useForm, useWatch} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Evento } from "../types/evento";

function HomeOrganizador() {
    
    const [eventosCreados, setEventosCreados] = useState<Evento[]>([])
    const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null)

    const navigate = useNavigate()

    const { register, handleSubmit, watch, formState: { errors }, control } = useForm();

    const onSubmit = async (data: any) => {
        console.log(data) 

        try {
            const eventoData = {
                nombre: (data.nombre).toLowerCase(),
                descripcion: data.descripcion,
                precioEntrada: data.precioEntrada,
                cantidadCupos: data.cantidadCupos,
                fechaInicio: data.fechaInicio,
                horaInicio: data.horaInicio,
                cuposDisponibles: data.cuposDisponibles,
                edadMinima: data.edadMinima || null,
                claseEvento: data.claseEvento,
                organizador: data.organizador,
                direccion: data.direccion,
                estado: data.estado = "pendiente",
                destacado: data.destacado = false
            }

            const response = await fetch(`http://localhost:3000/api/eventos/${data.tipo}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(eventoData)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Error en la creación del nuevo evento')
            }

            alert('✅ ¡Evento creado de forma exitosa!')

        } catch (error: any) {
            const errorMessage = error.message.toLowerCase();
                alert(`❌ Error: ${error.message}`);
        }
    }

    const watchTipo = useWatch({control , name: "tipo", defaultValue: ""})

    return (
        <>
        <HeaderOrganizador />
            <div className='HomeOrganizador'>
            <h1><u>Panel de organizador de Eventos</u></h1>
            <section id="organizador-panel">
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

                            <button type="submit" className="btn-creado">Crear Evento</button>

                        </form>
                    
                    </div> }
                </div>

            </section>
            
            </div>
            <Footer />
        </>
        
    )
}

export default HomeOrganizador