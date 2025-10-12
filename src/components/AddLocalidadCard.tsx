import React, { useState, useEffect } from 'react'
import './addCategoryCard.css'
import { Provincia } from '../types/provincia';

interface AddLocalidadCardProps {
    onClose: () => void;
    onGuardar: (nuevoNombre: string, nuevoCodigoPostal: number, provincia: number) => void;
}

function AddLocalidadCard({ onClose, onGuardar }: AddLocalidadCardProps) {
    const [nuevoNombre, setNuevoNombre] = useState('')
    const [nuevoCodigoPostal, setNuevoCodigo] = useState('')
    const [provinciaId, setProvinciaId] = useState('')
    const [provincias, setProvincias] = useState<Provincia[]>([])

    useEffect(() => {
        fetch('http://localhost:3000/api/provincias')
            .then((res) => res.json())
            .then((data) => setProvincias(data.data))
            .catch((err) => console.error('Error fetching provincias:', err));
    }, [])

    const handleEnviar = (e: React.FormEvent) => {
        e.preventDefault()
        if (nuevoNombre.trim() !== '' && nuevoCodigoPostal !== '' && provinciaId !== '') {
            onGuardar(nuevoNombre, parseInt(nuevoCodigoPostal), parseInt(provinciaId))
    }
}

    return (
        <div className='card-add-categoria'>
            <h2>Añadir Nueva Localidad</h2>
            <form onSubmit={handleEnviar}>
                <label>Nombre</label> 
                <input 
                    type="text" 
                    value={nuevoNombre} 
                    onChange={(e) => setNuevoNombre(e.target.value)} 
                    required 
                />
                <label>Código Postal</label> 
                <input 
                    type="number" 
                    value={nuevoCodigoPostal} 
                    onChange={(e) => setNuevoCodigo(e.target.value)} 
                    required 
                />
                <label>Provincia</label>
                <select 
                    value={provinciaId}
                    onChange={(e) => setProvinciaId(e.target.value)}
                    required
                >
                    <option value="">Seleccione una provincia</option>
                    {provincias.map((provincia) => (
                        <option key={provincia.id} value={provincia.id}>
                            {provincia.nombre}
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

export default AddLocalidadCard