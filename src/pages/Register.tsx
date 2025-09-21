import './register.css'
import Header from "../components/Header"
import Footer from "../components/Footer"


function Register() {
    return (
        <>
            <Header />

            <div className="register-container">
                <div className="register-form">
                    <h1>Crear cuenta</h1>
                    <form action="#" method="post">
                        <div className="input-group">
                            <label htmlFor="dni">Documento:</label>
                            <input type="text" id="dni" name="dni" minLength={8} maxLength={8} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="apellido">Apellido:</label>
                            <input type="text" id="apellido" name="apellido" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="telefono">Teléfono:</label>
                            <input type="text" id="telefono" name="telefono" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="tipo">Tipo de Usuario:</label><br/><br/>
                            <select id="tipo" name="tipo" required>
                                <option value="">Seleccione un tipo</option>
                                <option value="tipo1">Visitante</option>
                                <option value="tipo2">Creador</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                            <input type="date" id="fechaNacimiento" name="fechaNacimiento" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contraseña">Contraseña:</label>
                            <input type="password" id="contraseña" name="contraseña" minLength={8} maxLength={20} required />
                            <span className="hint">*Use entre 8 y 20 caracteres</span>
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmarContraseña">Confirmar Contraseña:</label>
                            <input type="password" id="confirmarContraseña" name="confirmarContraseña" minLength={8} maxLength={20} required />
                        </div>
                        
                        <button type="submit" className="btn-register">Registrar</button>

                        <div className="login-link">
                            <p>¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Register