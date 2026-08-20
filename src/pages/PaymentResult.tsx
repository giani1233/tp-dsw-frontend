import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface PaymentResultProps {
    titulo: string;
    mensaje: string;
}

function PaymentResult({ titulo, mensaje }: PaymentResultProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>{titulo}</h1>
            <p>{mensaje}</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Redirigiendo...</p>
        </div>
    );
}

export default PaymentResult;

