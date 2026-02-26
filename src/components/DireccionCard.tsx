import './categoryCard.css'
import './addDireccionCard.css'
import { useState, useCallback } from 'react'
import { Direccion } from '../types/direccion'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface DireccionCardProps {
    direccion: Direccion;
    onClose: () => void;
    onGuardar: (id: number, nuevaCalle: string, nuevaAltura: number, nuevosDetalles: string, lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng)
        }
    })
    return null
}

function DireccionCard ({ direccion, onClose, onGuardar}: DireccionCardProps) {
    
    const [nuevaCalle, setNuevaCalle] = useState(direccion.calle)
    const [nuevaAltura, setNuevaAltura] = useState(direccion.altura)
    const [nuevosDetalles, setNuevosDetalles] = useState(direccion.detalles)
    const [lat, setLat] = useState<number>(direccion.lat ? Number(direccion.lat) : -34.6037)
    const [lng, setLng] = useState<number>(direccion.lng ? Number(direccion.lng) : -58.3816)
    const [cargandoGeo, setCargandoGeo] = useState(false)

    const handleMapClick = useCallback(async (latClick: number, lngClick: number) => {
        setLat(latClick)
        setLng(lngClick)
        setCargandoGeo(true)
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latClick}&lon=${lngClick}&format=json`,
                { headers: { 'Accept-Language': 'es' } }
            )
            const data = await res.json()
            const address = data.address
            if (address.road) setNuevaCalle(address.road)
            if (address.house_number) setNuevaAltura(Number(address.house_number))
        } catch (err){
            console.error('Error geolocalizando data', err)
        } finally {
            setCargandoGeo(false)
        }
    }, [])

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault()
        onGuardar(direccion.id, nuevaCalle, nuevaAltura, nuevosDetalles, lat, lng)
    }

    return (
        <div className = "card-add-direccion">
            <h2>Modificar dirección</h2>
            <form onSubmit={handleGuardar}>
                <label className='map-label'>
                    Seleccionar ubicación en el mapa
                </label>
                <div className='map-container'>
                    <MapContainer key={`${direccion.lat}-${direccion.lng}`} center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                        <MapClickHandler onMapClick={handleMapClick} />
                        <Marker position={[lat, lng]} />
                    </MapContainer>
                </div>
                {cargandoGeo && <small className='map-cargando'>Obteniendo dirección...</small>}
                <small className = 'map-coordenadas'>
                    Coordenadas: {lat.toFixed(5)}, {lng.toFixed(5)}
                </small>
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
                <div className='card-add-categoria-botones'>
                    <button type='submit' id = 'boton-guardar-categoria'>Guardar</button>
                    <button type='button' onClick={onClose} id = 'boton-cerrar-categoria'>Cancelar</button>
                </div>
            </form>
        </div>
    )
}

export default DireccionCard

