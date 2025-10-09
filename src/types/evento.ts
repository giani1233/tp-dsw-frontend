export interface Evento {
    id: number;
    nombre: string;
    descripcion: string;
    precioEntrada: number;
    cantidadCupos: number;
    fechaInicio: Date;
    horaInicio: Date;
    horaFin: Date;
    cuposDisponibles: number;
    estado: string;
    destacado: boolean;
    idCategoria: number;
    idUsuario: number;
    idDireccion: number;
}
