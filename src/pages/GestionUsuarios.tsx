import './gestionUsuarios.css'
import HeaderAdministrador from "../components/HeaderAdministrador"
import { useState, useEffect } from 'react'
import { Usuario } from '../types/usuario';

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const fetchUsuarios = () => {
        fetch('http://localhost:3000/api/usuarios')
            .then((res) => res.json())
            .then((resData) => {
                console.log(resData);
                setUsuarios(resData.data);
            })
            .catch((err) => console.error("Error al cargar los usuarios:", err));
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleEliminar = (usuario: Usuario) => {
        fetch(`http://localhost:3000/api/usuarios/${usuario.tipo}/${usuario.id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (res.ok) {
                    console.log("Usuario eliminado con éxito");
                    fetchUsuarios();
                } else {
                    console.error("Error al eliminar el usuario");
                }
            })
            .catch((err) => console.error("Error al eliminar el usuario:", err));
    }; 
    
    const handleFiltro = (filtro: string) => {
        if (filtro.trim() === '') {
            fetchUsuarios();
        } else {
            fetch(`http://localhost:3000/api/usuarios/filtro?busqueda=${encodeURIComponent(filtro)}`)
                .then((res) => res.json())
                .then((resData) => {
                    setUsuarios(resData.data);
                })
                .catch((err) => console.error("Error al filtrar los usuarios:", err));
        }
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
                                        <button onClick={() => handleEliminar(usuario)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default GestionUsuarios;
