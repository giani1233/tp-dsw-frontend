import './login.css'
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from 'react'

function Login() {
    const [documento, setDocumento] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Lógica de inicio de sesión
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

    // Html del formulario de inicio de sesión
    return (
        <>
            <Header />

            <div className="login-container">
                <div className="login-form">
                    <h1>Iniciar sesión</h1>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="dni">Documento</label>
                            <input onChange={(event) => setDocumento(event.target.value)} type="text" id="dni" name="dni" minLength={8} maxLength={8} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input onChange={(event) => setPassword(event.target.value)} type="password" id="password" name="password" minLength={8} maxLength={20} required />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-login">Acceder</button>

                        <div className="forgot-password">
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Login