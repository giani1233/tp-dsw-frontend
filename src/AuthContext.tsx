import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import jwtDecode from "jwt-decode";

interface UsuarioToken {
    id: number,
    nombre: string,
    tipo: string,
    exp: number
}

interface AuthContextType {
    usuario: UsuarioToken | null,
    login: (token: string) => void,
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioToken | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if(token) {
            try {
                const usuarioDecodificado = jwtDecode<UsuarioToken>(token)
                const ahora = Date.now() / 1000
                if(usuarioDecodificado.exp > ahora) {
                    setUsuario(usuarioDecodificado)
                } else {
                    localStorage.removeItem("token")
                    setUsuario(null)
                } 
            } catch (error) {
                    localStorage.removeItem("token")
                    setUsuario(null)
            }
        }
    }, [])

    const login = (token:string) => {
        localStorage.setItem("token", token)
        const usuarioDecodificado = jwtDecode<UsuarioToken>(token)
        setUsuario(usuarioDecodificado)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider")
    }
    return context
}

