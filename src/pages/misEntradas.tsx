import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../AuthContext'
import './misEntradas.css';
import { fetchConToken } from "../utils/fetchConToken";

interface Entrada {
    id: number;
    estado: string;
    fechaCompra: string;
    evento: {
        nombre: string;
        fechaInicio: string;
        horaInicio: string;
    };
}

function formatearHora(fechaHora: string) { 
    const fecha = new Date(fechaHora.replace(' ', 'T'));
    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}hs`;
}

function MisEntradas() {
    const [entradas, setEntradas] = useState<Entrada[]>([]);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState<number | null>(null)
    const [modal, setModal] = useState<{ mensaje: string, tipo: 'exito' | 'error' } | null>(null)
    const [confirmacion, setConfirmacion] = useState<{ mensaje: string, onConfirmar: () => void } | null>(null)
    const [errorCarga, setErrorCarga] = useState<string | null>(null);
    const { usuario } = useAuth()

    useEffect(() => {
        if (!usuario) return;
        fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/entradas/cliente/${usuario.id}`)
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then(data => setEntradas(data.data))
            .catch((err) => {
                console.error(err);
                setErrorCarga('Error al cargar las entradas');
            })
            .finally(() => setLoading(false));
    }, [usuario]);

    const solicitarReembolso = (idEntrada: number) => {
        setConfirmacion({
            mensaje: 'Está seguro de que desea reembolsar esta entrada?',
            onConfirmar: async () => {
                setConfirmacion(null)
                setProcesando(idEntrada)
                try {
                    const res = await fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/entradas/${idEntrada}/reembolsar`, {
                        method: "POST"
                    });
                    if (res.ok) {
                        setEntradas(prev => prev.filter(e => e.id !== idEntrada))
                        setModal({ mensaje: 'Entrada reembolsada correctamente', tipo: 'exito' })
                    } else {
                        setModal({ mensaje: 'Error al reembolsar la entrada', tipo: 'error' })
                    }
                } catch {
                    setModal({ mensaje: 'Error al reembolsar la entrada', tipo: 'error' })
                } finally {
                    setProcesando(null)
                }
            }
        })
    };

    return (
        <>
        <Header onCategoryChange={() => {}} onSearch={() => {}} />
        <div className="mis-entradas">
            <h1>Mis Entradas</h1>
            {loading && <p className="loading-msg">Cargando tus entradas...</p>}
            {errorCarga && (
                <p style={{ color: 'red', textAlign: 'center' }}>{errorCarga}</p>
            )}
            {!loading && entradas.length === 0 && (
                <p className="sin-entradas">No tenés entradas compradas.</p>
            )}
            <div className="lista-entradas">
                {entradas.map(e => (
                    <div key={e.id} className="entrada">
                        <h3>{e.evento.nombre}</h3>
                        <p><strong>Fecha:</strong> {new Date(e.evento.fechaInicio).toLocaleDateString()}</p>
                        <p><strong>Hora:</strong> {formatearHora(e.evento.horaInicio)}</p>
                        <button
                            className="btn-reembolso"
                            onClick={() => solicitarReembolso(e.id)}
                            disabled={procesando === e.id}
                        >
                            {procesando === e.id ? 'Procesando...' : 'Solicitar Reembolso'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
        {modal && (
            <div className="overlay">
                <div className="modal-feedback">
                    <p className={modal.tipo === 'exito' ? 'modal-exito' : 'modal-error'}>
                        {modal.tipo === 'exito' ? '✅' : '❌'} {modal.mensaje}
                    </p>
                    <button onClick={() => setModal(null)}>Cerrar</button>
                </div>
            </div>
        )}
        {confirmacion && (
            <div className="overlay">
                <div className="modal-feedback">
                    <p>{confirmacion.mensaje}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button onClick={confirmacion.onConfirmar} id="aceptar-evento">Confirmar</button>
                        <button onClick={() => setConfirmacion(null)} id="rechazar-evento">Cancelar</button>
                    </div>
                </div>
            </div>
        )}
        <Footer />
        </>
    );
}

export default MisEntradas;
