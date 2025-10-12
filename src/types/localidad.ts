export interface Localidad {
    id: number;
    nombre: string;
    codigoPostal: string;
    provincia: {
        id: number;
        nombre: string;
    }
}
