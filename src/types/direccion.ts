export interface Direccion {
    id: number;
    calle: string;
    altura: number;
    detalles: string;
    lat?: number | string;
    lng?: number | string;
    localidad: {
        id: number;
        nombre: string;
    }
}
