import HeaderAdministrador from "../components/HeaderAdministrador";

function HomeAdmin() {
    return (
        <>
        <HeaderAdministrador />
            <div className='HomeAdmin'>
            <h1><u>Panel de Administración</u></h1>
            <section id="admin-panel">
                <p>Bienvenido al panel de administración. Aquí puedes gestionar eventos, usuarios y otras configuraciones del sistema.</p>
            </section>
            </div>
        </>
    )
}

export default HomeAdmin