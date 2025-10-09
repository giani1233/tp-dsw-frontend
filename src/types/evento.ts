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
    edadMinima: number,
    estado: string;
    destacado: boolean;
    direccion: {
    altura: number;
    calle: string;
    localidad: {
        nombre: string;
    }
    };
    organizador: {
        nombre: string;
        apellido: string;
        empresa: string;
    };
    claseEvento: {
        nombre: string;
    };
}
