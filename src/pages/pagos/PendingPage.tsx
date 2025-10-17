import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


function PendingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Pago pendiente</h1>
        <p>Tu pago está en proceso. Cuando se confirme, recibirás la entrada.</p>
        </div>
    );
}

export default PendingPage;