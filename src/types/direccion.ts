export interface Direccion {
    id: number;
    calle: string;
    altura: number;
    detalles: string;
    localidad: {
        id: number;
        nombre: string;
    }
}
