import './login.css'
import Header from "../components/Header"
import Footer from "../components/Footer"


function Login() {
    return (
        <>
            <Header />

            <div className="login-container">
                <div className="login-form">
                    <h1>Iniciar sesión</h1>
                    <form action="#" method="post">
                        <div className="input-group">
                            <label htmlFor="dni">Documento</label>
                            <input type="text" id="dni" name="dni" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" required />
                        </div>

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