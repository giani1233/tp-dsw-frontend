import React, { useState } from 'react'
import './addCategoryCard.css'

interface AddProvinciaCardProps {
    onClose: () => void;
    onGuardar: (nuevoNombre: string, nuevoCodigo: number) => void;
}

function AddProvinciaCard({ onClose, onGuardar }: AddProvinciaCardProps) {
    const [nuevoNombre, setNuevoNombre] = useState('')
    const [nuevoCodigo, setNuevoCodigo] = useState('')

    const handleEnviar = (e: React.FormEvent) => {
        e.preventDefault()
        if (nuevoNombre.trim() !== '' && nuevoCodigo !== '') {
            onGuardar(nuevoNombre, parseInt(nuevoCodigo))
    }
}

    return (
        <div className='card-add-categoria'>
            <h2>Añadir Nueva Provincia</h2>
            <form onSubmit={handleEnviar}>
                <label>Nombre</label> 
                <input 
                    type="text" 
                    value={nuevoNombre} 
                    onChange={(e) => setNuevoNombre(e.target.value)} 
                    required 
                />
                <label>Código</label> 
                <input 
                    type="number" 
                    value={nuevoCodigo} 
                    onChange={(e) => setNuevoCodigo(e.target.value)} 
                    required 
                />
                <div className='card-add-categoria-botones'>
                    <button type="submit" id="boton-guardar-categoria">Guardar</button>
                    <button type="button" onClick={onClose} id="boton-cerrar-categoria">Cerrar</button>
                </div>
            </form>
        </div>
    )
}

export default AddProvinciaCard