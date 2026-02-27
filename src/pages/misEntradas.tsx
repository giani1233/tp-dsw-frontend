import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './misEntradas.css';

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
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}hs`;
}

function MisEntradas() {
    const [entradas, setEntradas] = useState<Entrada[]>([]);
    const [loading, setLoading] = useState(true);

    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

    useEffect(() => {

        fetch(`http://localhost:3000/api/entradas/cliente/${usuario.id}`)
            .then(res => res.json())
            .then(data => setEntradas(data.data))
            .finally(() => setLoading(false));
    }, []);

    const solicitarReembolso = async (idEntrada: number) => {
        if (!confirm("Está seguro de que desea reembolsar esta entrada?")) return;

        await fetch(`http://localhost:3000/api/entradas/${idEntrada}/reembolsar`, {
            method: "POST"
        });

        setEntradas(prev => prev.filter(e => e.id !== idEntrada));
    };

    return (
        <>
        <Header onCategoryChange={() => {}} onSearch={() => {}} />

        <div className="mis-entradas">
            <h1>Mis Entradas</h1>

            {loading && <p>Cargando...</p>}

            {!loading && entradas.length === 0 && (
                <p className="sin-entradas">No tenés entradas compradas.</p>
            )}

            <div className="lista-entradas">
                {entradas.map(e => (
                    <div key={e.id} className="entrada">
                        <h3>{e.evento.nombre}</h3>
                        <p><strong>Fecha:</strong> {new Date(e.evento.fechaInicio).toLocaleDateString()}</p>
                        <p><strong>Hora:</strong> {formatearHora(e.evento.horaInicio)}</p>
                        <button className="btn-reembolso" onClick={() => solicitarReembolso(e.id)}>
                            Solicitar Reembolso
                        </button>
                    </div>
                ))}
            </div>
        </div>
        <Footer />
        </>
    );
}

export default MisEntradas;