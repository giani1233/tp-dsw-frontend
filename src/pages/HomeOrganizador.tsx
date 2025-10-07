import HeaderOrganizador from "../components/HeaderOrganizador";

function HomeOrganizador() {
    
    return (
        <>
        <HeaderOrganizador />
            <div className='HomeOrganizador'>
            <h1><u>Panel de organizador de Eventos</u></h1>
            <section id="organizador-panel">
                <p>Bienvenido al panel de organizador de eventos. Aquí puedes gestionar tus eventos, ver estadísticas y otras configuraciones relacionadas con tus creaciones.</p>
            </section>
            </div>
        </>
    )
}

export default HomeOrganizador