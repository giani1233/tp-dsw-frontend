import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function FailurePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Pago fallido</h1>
        <p>No se pudo procesar tu pago. Por favor, intenta nuevamente.</p>
        </div>
    );
}

export default FailurePage;