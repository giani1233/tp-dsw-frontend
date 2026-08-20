import './login.css'
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useForm } from 'react-hook-form'
import jwtDecode from 'jwt-decode'

interface LoginForm {
    email: string;
    contrasena: string;
}

function Login() {
    const [error, setError] = useState<string>('');
    const [enviando, setEnviando] = useState(false);
    const { login, usuario } = useAuth() 
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

    const onSubmit = async (formData: LoginForm) => {
        setError('');
        setEnviando(true);
        try {
            const response = await fetch('https://tp-dsw-backend-yjx3.onrender.com/api/autenticacion/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, contrasena: formData.contrasena })
            });
            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }
            const data = await response.json();
            login(data.token)
            const decoded = jwtDecode<{ tipo: string }>(data.token)
            if (decoded.tipo === 'administrador') {
                navigate('/administrador')
            } else if (decoded.tipo === 'organizador') {
                navigate('/misEventos')
            } else {
                navigate('/')
            }
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setEnviando(false);
        }
    }

    useEffect(() => {
        if (usuario) {
            if (usuario.tipo === 'administrador') {
                navigate('/administrador')
            } else if (usuario.tipo === 'organizador') {
                navigate('/misEventos')
            } else {
                navigate('/')
            }
        }
    }, [usuario])

    return (
        <>
            <Header onCategoryChange={() => {}} onSearch={() => {}} />

            <div className="login-container">
                <div className="login-form">
                    <h1>Iniciar sesión</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="input" {...register('email', { required: 'El email es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'El email no es válido' } })} />
                            {errors.email && <span className="error-message">{errors.email.message}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" className="input" {...register('contrasena', { required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' }, maxLength: { value: 20, message: 'La contraseña no puede tener más de 20 caracteres' } })} />
                            {errors.contrasena && <span className="error-message">{errors.contrasena.message}</span>}
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-login" disabled={enviando}> {enviando ? 'Iniciando sesión...' : 'Acceder'} </button>

                        <div className="forgot-password">
                            <Link to="#">Olvidaste tu contraseña?</Link>
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