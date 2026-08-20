import './gestionUsuarios.css'
import HeaderAdministrador from "../components/HeaderAdministrador"
import { useState, useEffect } from 'react'
import { Usuario } from '../types/usuario';
import Footer from '../components/Footer';
import { fetchConToken } from '../utils/fetchConToken';

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState<number | null>(null);
    const [modal, setModal] = useState<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);
    const [confirmacion, setConfirmacion] = useState<{mensaje: string, onConfirmar: () => void} | null>(null);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);

    const fetchUsuarios = () => {
        setErrorCarga(null);
        return fetchConToken('https://tp-dsw-backend-yjx3.onrender.com/api/usuarios')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar los usuarios')
                return res.json()
            })
            .then((resData) => setUsuarios(resData.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('No se pudieron cargar los usuarios')
            })
    };

    useEffect(() => {
        setCargando(true);
        fetchUsuarios().finally(() => setCargando(false));
    }, []);

    const handleEliminar = (usuario: Usuario) => {
        setConfirmacion({
            mensaje: `Está seguro de que desea eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
            onConfirmar: () => {
                setConfirmacion(null);
                setProcesando(usuario.id);
                fetchConToken(`https://tp-dsw-backend-yjx3.onrender.com/api/usuarios/${usuario.tipo}/${usuario.id}`, {
                    method: 'DELETE',
                })
                .then(res => {
                    if (res.ok) {
                        fetchUsuarios();
                        setModal({ mensaje: "Usuario eliminado correctamente", tipo: 'exito' });
                    } else {
                        setModal({ mensaje: "Error al eliminar el usuario", tipo: 'error' });
                    }
                })
                .catch(() => setModal({ mensaje: "Error al eliminar el usuario", tipo: 'error' }))
                .finally(() => setProcesando(null));
            }
        })
    }; 
    
    const handleFiltro = (filtro: string) => {
        const url = filtro.trim() === '' ? 'https://tp-dsw-backend-yjx3.onrender.com/api/usuarios' : `https://tp-dsw-backend-yjx3.onrender.com/api/usuarios/filtro?busqueda=${encodeURIComponent(filtro)}`;
        setCargando(true);
        fetchConToken(url)
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar los usuarios')
                return res.json()
            })
            .then(resData => setUsuarios(resData.data))
            .catch(err => {
                console.error(err)
                setErrorCarga('No se pudieron cargar los usuarios')
            })
            .finally(() => setCargando(false));
    };

    return (
        <>
            <HeaderAdministrador />
            <div className="GestionUsuarios">
                <h1>Gestión de Usuarios</h1>
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    className="busqueda-usuarios"
                    onChange={(e) => handleFiltro(e.target.value)}
                />
                {cargando ? (
                    <p className="loading-msg">Cargando usuarios...</p>
                ) : 
                errorCarga ? (
                    <p style={{ color: 'red', textAlign: 'center' }}>{errorCarga}</p>
                ) : (
                    <div className="contenedor-tabla-usuarios">
                        <table className="tabla-usuarios">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Fecha de nacimiento</th>
                                    <th>Empresa</th>
                                    <th>Rol</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.apellido}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.telefono}</td>
                                        <td>
                                            {usuario.fechaNacimiento
                                                ? new Date(usuario.fechaNacimiento).toLocaleDateString('es-AR')
                                                : ''}
                                        </td>
                                        <td>{usuario.empresa}</td>
                                        <td>{usuario.tipo}</td>
                                        <td>
                                            <button onClick={() => handleEliminar(usuario)} disabled={procesando === usuario.id}>{procesando === usuario.id ? 'Eliminando...' : 'Eliminar'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {modal && (
                <div className="overlay">
                    <div className="modal-feedback">
                        <p className={modal.tipo === 'exito' ? 'modal-exito' : 'modal-error'}>
                            {modal.tipo === 'exito' ? '✅' : '❌'} {modal.mensaje}
                        </p>
                        <button onClick={() => setModal(null)}>Cerrar</button>
                    </div>
                </div>
            )}
            {confirmacion && (
                <div className="overlay">
                    <div className="modal-feedback">
                        <p>{confirmacion.mensaje}</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={confirmacion.onConfirmar} id="aceptar-evento">Confirmar</button>
                            <button onClick={() => setConfirmacion(null)} id="rechazar-evento">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default GestionUsuarios;
