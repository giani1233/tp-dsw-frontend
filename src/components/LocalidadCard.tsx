import './categoryCard.css'
import { useState } from 'react'
import { Localidad } from '../types/localidad';

interface LocalidadCardProps {
    localidad: Localidad;
    onClose: () => void;
    onGuardar: (id: number, nuevoNombre: string, nuevoCodigoPostal: string) => void;
}

function LocalidadCard ({ localidad, onClose, onGuardar}: LocalidadCardProps) {
    
    const [nuevoNombre, setNuevoNombre] = useState(localidad.nombre)
    const [nuevoCodigoPostal, setNuevoCodigoPostal] = useState(localidad.codigoPostal)

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault()
        onGuardar(localidad.id, nuevoNombre, nuevoCodigoPostal)
    }

    return (
        <div className = "card-categoria">
            <button className='cerrar-card-categoria' onClick={onClose}>Cerrar</button>
            <h2>Modificar localidad</h2>
            <form onSubmit={handleGuardar}>
                <label>Nuevo nombre:</label>
                <input 
                    type="text" 
                    placeholder={nuevoNombre} 
                    onChange={(e) => setNuevoNombre(e.target.value)} 
                    required
                />
                <label>Nuevo código posal:</label>
                <input 
                    type="number" 
                    placeholder={nuevoCodigoPostal}  
                    onChange={(e) => setNuevoCodigoPostal(e.target.value)}
                    required
                /> 
                <button type="submit" className='boton-guardar-categoria'>Guardar</button>
            </form>
        </div>
    )
}

export default LocalidadCard

