import './register.css'
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useForm, useWatch} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function Register() {

    const navigate = useNavigate()

    const { register, handleSubmit, watch, formState: { errors }, control } = useForm();

    const onSubmit = async (data: any) => {
        console.log(data) 

        try {
            const userData = {
                dni: data.dni,
                nombre: data.nombre.toLowerCase(),
                apellido: (data.apellido).toLowerCase(),
                email: (data.email).toLowerCase(),
                telefono: data.telefono,
                tipo: data.tipo,
                contrasena: data.contraseña,
                fechaNacimiento: data.fechaNacimiento || null,
                empresa: data.empresa || null
            }

            const response = await fetch(`http://localhost:3000/api/usuarios/${data.tipo}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Error en el registro')
            }

            alert('✅ ¡Registro exitoso!')

            navigate('/login', { 
                state: { registroExitoso: true },
                replace: true 
            });

        } catch (error: any) {
            const errorMessage = error.message.toLowerCase();
            if (errorMessage.includes('usuario.usuario_dni_unique')) {
                alert('❌ El DNI ya está registrado. Por favor, utiliza otro documento.');
            } else if (errorMessage.includes('usuario.usuario_email_unique')) {
                alert('❌ Ya existe una cuenta con ese email.');
            } else if (errorMessage.includes('usuario.usuario_telefono_unique')) {
                alert('❌ El teléfono ya está registrado. Por favor, utiliza otro número.');
            } else {
                alert(`❌ Error: ${error.message}`);
            }
        }
    }

    const watchPassword = watch("contraseña")
    const watchTipo = useWatch({control , name: "tipo", defaultValue: ""})
    return (
        <>
            <Header />

            <div className="register-container">
                <div className="register-form">
                    <h1>Crear cuenta</h1>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="input-group">
                            <label htmlFor="dni">Documento:</label>
                            <input type="text" id="dni" minLength={8} maxLength={8} {...register("dni", {required: "El dni es obligatorio",
                                                                            minLength: {value: 8, message: "El dni debe tener 8 caracteres"},
                                                                            maxLength: {value: 8, message: "El dni debe tener 8 caracteres"},   
                                                                            })}
                                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} pattern="[0-9]*" inputMode="numeric"
                            />
                            {errors.dni && typeof errors.dni.message === "string" &&<span className="error-message">{errors.dni.message}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input type="text" id="nombre" {...register("nombre", {required: "El nombre es obligatorio",
                                                                                    pattern: {value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, message: "El nombre solo puede contener letras"}
                                                                                    })} 
                            />
                            {errors.nombre && typeof errors.nombre.message === "string" &&<span className="error-message">{errors.nombre.message}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="apellido">Apellido:</label>
                            <input type="text" id="apellido" {...register("apellido", {required: "El apellido es obligatorio",
                                                                                    pattern: {value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, message: "El apellido solo puede contener letras"}
                                                                                    })} 
                            />
                            {errors.apellido && typeof errors.apellido.message === "string" &&<span className="error-message">{errors.apellido.message}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" {...register("email", {required: "El email es obligatorio",
                                                                                    pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "El email no es válido"}
                                                                                    })} 
                            />
                            {errors.email && typeof errors.email.message === "string" &&<span className="error-message">{errors.email.message}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="telefono">Teléfono:</label>
                            <input type="text" id="telefono" {...register("telefono", {required: "El teléfono es obligatorio",
                                                                                    })}
                                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} pattern="[0-9]*" inputMode="numeric"
                            />
                            {errors.telefono && typeof errors.telefono.message === "string" &&<span className="error-message">{errors.telefono.message}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="tipo">Tipo de Usuario:</label><br/><br/>
                            <select id="tipo" {...register("tipo", { required: "Selecciona un tipo de usuario" })}>
                                <option value="">Seleccione un tipo</option>
                                <option value="cliente">Cliente</option>
                                <option value="organizador">Organizador</option>
                            </select>
                            {errors.tipo && typeof errors.tipo.message === "string" &&<span className="error-message">{errors.tipo.message}</span>}
                        </div>
                        {watchTipo === "cliente" && (
                            <div className="input-group">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                            <input type="date" id="fechaNacimiento" {...register("fechaNacimiento", {required: "La fecha de nacimiento es obligatoria",
                                                                                                    validate: {
                                                                                                        notFuture: (value) => {
                                                                                                            const date = new Date(value)
                                                                                                            const today = new Date()
                                                                                                            return date <= today || "La fecha de nacimiento no puede ser futura"    
                                                                                                        }
                                                                                                    }
                                                                                                    })} 
                            />
                            {errors.fechaNacimiento && typeof errors.fechaNacimiento.message === "string" &&<span className="error-message">{errors.fechaNacimiento.message}</span>}
                        </div>
                        )}
                        {watchTipo === "organizador" && (
                            <div className="input-group">
                            <label htmlFor="empresa">Empresa:</label>
                            <input type="text" id="empresa" {...register("empresa", { pattern: {value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, message: "El nombre de la empresa solo puede contener letras"} 
                                                                                    })} 
                            />
                            {errors.empresa && typeof errors.empresa.message === "string" &&<span className="error-message">{errors.empresa.message}</span>}
                        </div>
                        )}
                        <div className="input-group">
                            <label htmlFor="contraseña">Contraseña:</label>
                            <input type="password" id="contraseña" minLength={8} maxLength={20} {...register("contraseña", {required: "La contraseña es obligatoria",
                                                                                            minLength: {value: 8, message: "La contraseña debe tener entre 8 y 20 caracteres"},
                                                                                            maxLength: {value: 20, message: "La contraseña debe tener entre 8 y 20 caracteres"},
                                                                                            pattern: {value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: "La contraseña debe tener al menos una mayúscula y un número"}
                                                                                            })} 
                            />
                            <span className="hint">*Use entre 8 y 20 caracteres</span>
                            {errors.contraseña && typeof errors.contraseña.message === "string" &&<span className="error-message">{errors.contraseña.message}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmarContraseña">Confirmar Contraseña:</label>
                            <input type="password" id="confirmarContraseña" {...register("confirmarContraseña", {required: "Debe confirmar la contraseña",
                                                                                                                validate: value => value === watchPassword || "Las contraseñas no coinciden"
                            })}
                            />
                            {errors.confirmarContraseña && typeof errors.confirmarContraseña.message === "string" &&<span className="error-message">{errors.confirmarContraseña.message}</span>}
                        </div>
                        
                        <button type="submit" className="btn-register">Registrar</button>

                        <div className="login-link">
                            <p>Ya posee una cuenta? <a href="/login">Iniciar sesión</a></p>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Register