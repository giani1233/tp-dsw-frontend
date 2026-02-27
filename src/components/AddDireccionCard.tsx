import React, { useState, useEffect, useCallback } from 'react'
import './addCategoryCard.css'
import { Localidad } from '../types/localidad';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './addDireccionCard.css'

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface AddDireccionCardProps {
    onClose: () => void;
    onGuardar: (nuevaCalle: string, nuevaAltura: number, nuevosDetalles: string, localidad: number, lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng)
        }
    })
    return null
}

function AddDireccionCard({ onClose, onGuardar }: AddDireccionCardProps) {
    const [nuevaCalle, setNuevaCalle] = useState('')
    const [nuevaAltura, setNuevaAltura] = useState('')
    const [nuevosDetalles, setNuevosDetalles] = useState('')
    const [localidadId, setLocalidadId] = useState('')
    const [localidades, setLocalidades] = useState<Localidad[]>([])
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [cargandoGeo, setCargandoGeo] = useState(false)

    useEffect(() => {
        fetch('http://localhost:3000/api/localidades')
            .then((res) => res.json())
            .then((data) => setLocalidades(data.data))
            .catch((err) => console.error('Error fetching localidades:', err));
    }, [])

    const handleMapClick = useCallback(async (latClick: number, lngClick: number) => {
        setLat(latClick)
        setLng(lngClick)
        setCargandoGeo(true)
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latClick}&lon=${lngClick}&format=json`,
                { headers: {'Accept-language': 'es'} }
            )
            const data = await res.json()
            const address = data.address
            if(address.road) setNuevaCalle(address.road)
            if(address.house_number) setNuevaAltura(address.house_number)
        } catch (err) {
            console.error('Error geolocalizando data', err)
        } finally {
            setCargandoGeo(false)
        }
    }, [])

    const handleEnviar = (e: React.FormEvent) => {
        e.preventDefault()
        if (nuevaCalle.trim() !== '' && parseInt(nuevaAltura) > 0 && localidadId !== '' && lat !== null && lng !== null) {
            onGuardar(nuevaCalle, parseInt(nuevaAltura), nuevosDetalles, parseInt(localidadId), lat, lng)
    }
}

    return (
        <div className='card-add-direccion'>
            <h2>Añadir Nueva Dirección</h2>
            <form onSubmit={handleEnviar}>
                <label className='map-label'>Seleccionar ubicación en el mapa</label>
                <div className='map-container'>
                    <MapContainer center={[-34.6037, -58.3816]} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                        <MapClickHandler onMapClick={handleMapClick} />
                        {lat !== null && lng !== null && <Marker position={[lat, lng]} />}
                    </MapContainer>
                </div>
                {cargandoGeo && <small className='map-cargando'>Obteniendo dirección...</small>}
                {lat && lng && (
                    <small className='map-coordenadas'>
                        Coordenadas: {lat.toFixed(5)}, {lng.toFixed(5)}
                    </small>
                )}
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