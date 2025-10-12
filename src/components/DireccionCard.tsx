import './categoryCard.css'
import { useState } from 'react'
import { Direccion } from '../types/direccion'

interface DireccionCardProps {
    direccion: Direccion;
    onClose: () => void;
    onGuardar: (id: number, nuevaCalle: string, nuevaAltura: number, nuevosDetalles: string) => void;
}

function DireccionCard ({ direccion, onClose, onGuardar}: DireccionCardProps) {
    
    const [nuevaCalle, setNuevaCalle] = useState(direccion.calle)
    const [nuevaAltura, setNuevaAltura] = useState(direccion.altura)
    const [nuevosDetalles, setNuevosDetalles] = useState(direccion.detalles)

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault()
        onGuardar(direccion.id, nuevaCalle, nuevaAltura, nuevosDetalles)
    }

    return (
        <div className = "card-categoria">
            <button className='cerrar-card-categoria' onClick={onClose}>Cerrar</button>
            <h2>Modificar dirección</h2>
            <form onSubmit={handleGuardar}>
                <label>Nueva calle:</label>
                <input 
                    type="text" 
                    placeholder={nuevaCalle} 
                    onChange={(e) => setNuevaCalle(e.target.value)} 
                    required
                />
                <label>Nueva altura:</label>
                <input 
                    type="number" 
                    placeholder={nuevaAltura.toString()}  
                    onChange={(e) => setNuevaAltura(Number(e.target.value))}
                    required
                /> 
                <label>Nuevos detalles:</label>
                <textarea
                    placeholder={nuevosDetalles}
                    onChange={(e) => setNuevosDetalles(e.target.value)}
                />
                <button type="submit" className='boton-guardar-categoria'>Guardar</button>
            </form>
        </div>
    )
}

export default DireccionCard

