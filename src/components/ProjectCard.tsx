import { Evento } from "../types/evento";
import './projectCard.css';

interface Props {
    evento: Evento;
    onClose: () => void;
}

const ProjectCardPendiente = ({ evento, onClose }: Props) => {
    return (
        <div className="ContenedorProjectCard">
            <div className="ProjectCardPendiente">
                <button onClick={onClose} id="boton-cerrar">Cerrar</button>
                <h2>{evento.nombre}</h2>
                <p>{evento.descripcion}</p>
                <p>Precio: {evento.precioEntrada}</p>
                <p>Cantidad de cupos: {evento.cantidadCupos}</p>
                <p>Fecha: {new Date(evento.fechaInicio).toLocaleDateString('es-AR', {day: '2-digit', month: 'long', year: 'numeric'})}</p>               
                <p>Hora de inicio: {new Date(evento.horaInicio).toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit'})}</p>
                <p>Hora de fin: {evento.horaFin ? new Date(evento.horaFin).toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit'}) : '-'}</p>
                <p>Cupos disponibles: {evento.cuposDisponibles}</p>
                <p>Edad mínima: {evento.edadMinima ? evento.edadMinima : '-'}</p>
                <p>Categoría: {evento.claseEvento.nombre}</p>
                <p>Localidad: {evento.direccion.localidad.nombre}</p>
                <p>Dirección: {evento.direccion.calle} {evento.direccion.altura}</p>
                <p>Organizador: {evento.organizador.empresa ? evento.organizador.empresa : `${evento.organizador.nombre} ${evento.organizador.apellido}`}</p>
            </div>
        </div>
    )
}

export default ProjectCardPendiente;