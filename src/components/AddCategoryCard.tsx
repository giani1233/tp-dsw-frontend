import React, { useState } from 'react'
import './addCategoryCard.css'

interface AddCategoryCardProps {
    onClose: () => void;
    onGuardar: (nuevoNombre: string) => void;
}

function AddCategoryCard({ onClose, onGuardar }: AddCategoryCardProps) {
    const [nuevoNombre, setNuevoNombre] = useState('')

    const handleEnviar = (e: React.FormEvent) => {
        e.preventDefault()
        if (nuevoNombre.trim() !== '') {
            onGuardar(nuevoNombre)
    }
}

    return (
        <div className='card-add-categoria'>
            <h2>Añadir Nueva Categoría</h2>
            <form onSubmit={handleEnviar}>
                <label>Nombre</label> 
                <input 
                    type="text" 
                    value={nuevoNombre} 
                    onChange={(e) => setNuevoNombre(e.target.value)} 
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

export default AddCategoryCard