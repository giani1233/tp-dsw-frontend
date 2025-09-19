import './login.css'
import Header from "../components/Header"
import Footer from "../components/Footer"


function Login() {
    return (
        <>
            <Header />
                <h1>LOGIN</h1>

                <form className="login-form">
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" required /><br/>

                    <label htmlFor="contraseña">Contraseña: </label>
                    <input type="password" id="contraseña" name="contraseña" required /><br/>

                    <button type="submit">Login</button>
                </form>

            <Footer />
        </>
    )
}

export default Login