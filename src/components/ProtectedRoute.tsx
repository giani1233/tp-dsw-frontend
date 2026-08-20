import { JSX } from 'react';
import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext';

interface ProtectedRouteProps {
    children: JSX.Element;
    tiposPermitidos: string[];
}

function RutaProtegida({ children, tiposPermitidos }: ProtectedRouteProps) {
    const { usuario } = useAuth();
    
    if (!usuario) {
        return <Navigate to="/login" />
    }

    if(!tiposPermitidos.includes(usuario.tipo)) {
        return <Navigate to="/login" />
    }

    return children
}

export default RutaProtegida