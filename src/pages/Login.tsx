import './login.css'
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
    const [documento, setDocumento] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documento, password })
            });
            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }
            const data = await response.json();
            // Aca podés guardar el token, redirigir, etc.
            console.log('Login exitoso', data);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        }
    }

    return (
        <>
            <Header />

            <div className="login-container">
                <div className="login-form">
                    <h1>Iniciar sesión</h1>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="dni">Documento</label>
                            <input onChange={(event) => setDocumento(event.target.value)} type="text" className="input" name="dni" minLength={8} maxLength={8} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input onChange={(event) => setPassword(event.target.value)} type="password" className="input" name="password" minLength={8} maxLength={20} required />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-login">Acceder</button>

                        <div className="forgot-password">
                            <Link to="#">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <div className="register-link">
                            <div>
                                Aún no posee una cuenta? 
                            </div>
                            <Link to="/register" className="btn-register">
                                Registrarse
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Login