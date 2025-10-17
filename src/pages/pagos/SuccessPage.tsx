import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function SuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>¡Pago aprobado!</h1>
        <p>Gracias por tu compra. Tu entrada ha sido registrada correctamente.</p>
        </div>
    );
}

export default SuccessPage;