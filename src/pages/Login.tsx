import './login.css'
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState<string>('');
    const [contrasena, setContrasena] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3000/api/autenticacion/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contrasena })
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const data = await response.json();

            localStorage.setItem('token', data.token)
            localStorage.setItem('usuario', JSON.stringify(data.usuario))

            const tipo = data.usuario.tipo
            
            if (tipo === 'administrador') {
                navigate('/administrador')
            } else if (tipo === 'organizador') {
                navigate('/organizador')
            } else {
                navigate('/')
            }
            
            console.log('Login exitoso', data);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        }
    }

    useEffect(() => {
        const usuario = localStorage.getItem('usuario')
        if (usuario) {
            const tipo = JSON.parse(usuario).tipo
            if (tipo === 'administrador') {
                navigate('/administrador')
            } else if (tipo === 'organizador') {
                navigate('/organizador')
            } else {
                navigate('/')
            }
        }
    })

    return (
        <>
            <Header onCategoryChange={() => {}} onSearch={() => {}} />

            <div className="login-container">
                <div className="login-form">
                    <h1>Iniciar sesión</h1>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(event) => setEmail(event.target.value)} type="text" className="input" name="email" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input onChange={(event) => setContrasena(event.target.value)} type="password" className="input" name="contrasena" minLength={8} maxLength={20} required />
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