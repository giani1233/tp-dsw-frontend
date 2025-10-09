import { Evento } from "../types/evento";
import './projectCard.css';

interface Props {
    evento: Evento;
    onClose: () => void;
    onAceptar?: (id: number) => Promise<void> | void;
    onRechazar?: (id: number) => Promise<void> | void;
}

const ProjectCardPendiente = ({ evento, onClose, onAceptar, onRechazar }: Props) => {
    return (
        <div className="ContenedorProjectCard">
            <div className="ProjectCardPendiente">
                <button onClick={onClose} id="boton-cerrar">Cerrar</button>
                <h2>{evento.nombre}</h2>
                <p>{evento.descripcion}</p>
            </div>
        </div>
    )
}

export default ProjectCardPendiente;