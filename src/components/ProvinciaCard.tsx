import './categoryCard.css'
import { useState } from 'react'
import { Provincia } from '../types/provincia';

interface ProvinciaCardProps {
    provincia: Provincia;
    onClose: () => void;
    onGuardar: (id: number, nuevoNombre: string, nuevoCodigo: string) => void;
}

function ProvinciaCard ({ provincia, onClose, onGuardar}: ProvinciaCardProps) {
    
    const [nuevoNombre, setNuevoNombre] = useState(provincia.nombre)
    const [nuevoCodigo, setNuevoCodigo] = useState(provincia.codigo)

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault()
        onGuardar(provincia.id, nuevoNombre, nuevoCodigo)
    }

    return (
        <div className = "card-categoria">
            <button className='cerrar-card-categoria' onClick={onClose}>Cerrar</button>
            <h2>Modificar provincia</h2>
            <form onSubmit={handleGuardar}>
                <label>Nuevo nombre:</label>
                <input 
                    type="text" 
                    placeholder={nuevoNombre} 
                    onChange={(e) => setNuevoNombre(e.target.value)} 
                    required
                />
                <label>Nuevo código:</label>
                <input 
                    type="number" 
                    placeholder={nuevoCodigo}  
                    onChange={(e) => setNuevoCodigo(e.target.value)}
                    required
                /> 
                <button type="submit" className='boton-guardar-categoria'>Guardar</button>
            </form>
        </div>
    )
}

export default ProvinciaCard

