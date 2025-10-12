import React, { useState, useEffect } from 'react'
import './addCategoryCard.css'
import { Localidad } from '../types/localidad';

interface AddDireccionCardProps {
    onClose: () => void;
    onGuardar: (nuevaCalle: string, nuevaAltura: number, nuevosDetalles: string, localidad: number) => void;
}

function AddDireccionCard({ onClose, onGuardar }: AddDireccionCardProps) {
    const [nuevaCalle, setNuevaCalle] = useState('')
    const [nuevaAltura, setNuevaAltura] = useState('')
    const [nuevosDetalles, setNuevosDetalles] = useState('')
    const [localidadId, setLocalidadId] = useState('')
    const [localidades, setLocalidades] = useState<Localidad[]>([])

    useEffect(() => {
        fetch('http://localhost:3000/api/localidades')
            .then((res) => res.json())
            .then((data) => setLocalidades(data.data))
            .catch((err) => console.error('Error fetching localidades:', err));
    }, [])

    const handleEnviar = (e: React.FormEvent) => {
        e.preventDefault()
        if (nuevaCalle.trim() !== '' && parseInt(nuevaAltura) > 0 && localidadId !== '') {
            onGuardar(nuevaCalle, parseInt(nuevaAltura), nuevosDetalles, parseInt(localidadId))
    }
}

    return (
        <div className='card-add-categoria'>
            <h2>Añadir Nueva Dirección</h2>
            <form onSubmit={handleEnviar}>
                <label>Calle</label> 
                <input 
                    type="text" 
                    value={nuevaCalle} 
                    onChange={(e) => setNuevaCalle(e.target.value)} 
                    required 
                />
                <label>Altura</label> 
                <input 
                    type="number" 
                    value={nuevaAltura} 
                    onChange={(e) => setNuevaAltura(e.target.value)} 
                    required 
                />
                <label>Detalles</label>
                <textarea 
                    value={nuevosDetalles} 
                    onChange={(e) => setNuevosDetalles(e.target.value)} 
                    required 
                />
                <label>Localidad</label>
                <select 
                    value={localidadId}
                    onChange={(e) => setLocalidadId(e.target.value)}
                    required
                >
                    <option value="">Seleccione una localidad</option>
                    {localidades.map((localidad) => (
                        <option key={localidad.id} value={localidad.id}>
                            {localidad.nombre}
                        </option>
                    ))}
                </select>
                <div className='card-add-categoria-botones'>
                    <button type="submit" id="boton-guardar-categoria">Guardar</button>
                    <button type="button" onClick={onClose} id="boton-cerrar-categoria">Cerrar</button>
                </div>
            </form>
        </div>
    )
}

export default AddDireccionCard