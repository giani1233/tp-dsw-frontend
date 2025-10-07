import { JSX } from 'react';
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
    children: JSX.Element;
    tiposPermitidos: string[];
}

function RutaProtegida({ children, tiposPermitidos }: ProtectedRouteProps) {
    const usuario = localStorage.getItem('usuario')
    
    if (!usuario) {
        return <Navigate to="/login" />
    }

    const tipo = JSON.parse(usuario).tipo

    if(!tiposPermitidos.includes(tipo)) {
        return <Navigate to="/login" />
    }

    return children
}

export default RutaProtegida