import './categoryCard.css'
import { useState } from 'react'
import { ClaseEvento } from '../types/claseEvento'

interface CategoryCardProps {
    categoria: ClaseEvento;
    onClose: () => void;
    onGuardar: (id: number, nuevoNombre: string) => void;
}

function CategoryCard ({ categoria, onClose, onGuardar}: CategoryCardProps) {
    
    const [nuevoNombre, setNuevoNombre] = useState(categoria.nombre)

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault()
        onGuardar(categoria.id, nuevoNombre)
    }

    return (
        <div className = "card-categoria">
            <button className='cerrar-card-categoria' onClick={onClose}>Cerrar</button>
            <h2>Modificar categoría</h2>
            <form onSubmit={handleGuardar}>
                <label>Nuevo nombre:</label>
                <input 
                    type="text" 
                    placeholder={nuevoNombre} 
                    onChange={(e) => setNuevoNombre(e.target.value)} 
                    required
                />
                <button type="submit" className='boton-guardar-categoria'>Guardar</button>
            </form>
        </div>
    )
}

export default CategoryCard

