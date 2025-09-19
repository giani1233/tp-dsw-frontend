import './register.css'
import Header from "../components/Header"
import Footer from "../components/Footer"


function Register() {
    return (
        <>
            <Header />
                <h1>REGISTER</h1>

                <form className="register-form">
                    <label htmlFor="dni">Dni: </label>
                    <input type="text" id="dni" name="dni" minLength={8} maxLength={8} required /><br/>

                    <label htmlFor="nombre">Nombre: </label>
                    <input type="text" id="nombre" name="nombre" required /><br/>

                    <label htmlFor="apellido">Apellido: </label>
                    <input type="text" id="apellido" name="apellido" required /><br/>

                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" required /><br/>

                    <label htmlFor="telefono">Teléfono: </label>
                    <input type="text" id="telefono" name="telefono" required /><br/>

                    <label htmlFor="tipo">Tipo de Usuario: </label>
                    <select id="tipo" name="tipo" required>
                        <option value="">Seleccione un tipo</option>
                        <option value="tipo1">Visitante</option>
                        <option value="tipo2">Creador</option>
                    </select><br/>

                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento: </label>
                    <input type="date" id="fechaNacimiento" name="fechaNacimiento" required /><br/>

                    <label htmlFor="contraseña">Contraseña: </label>
                    <input type="password" id="contraseña" name="contraseña" minLength={8} maxLength={20} required />
                    <span className="hint">(Use entre 8 y 20 caracteres)</span><br/>

                    <label htmlFor="confirmarContraseña">Confirmar Contraseña: </label>
                    <input type="password" id="confirmarContraseña" name="confirmarContraseña" minLength={8} maxLength={20} required /><br/>

                    <button type="submit">Register</button>
                </form>

            <Footer />
        </>
    )
}

export default Register