describe('Gestión de Eventos', () => {
  const randomString = (length: number) => {
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };

  const randomNumero = Math.floor(10000 + Math.random() * 90000).toString();
  const randomEdad = Math.floor(10 + Math.random() * 90).toString();
  const randomNombre = `Test nombre ${randomString(8)}`;
  const randomDescripcion = `Test descripcion ${randomString(12)}`;
  const email = 'pablogom@gmail.com';
  const password = '87654321';
  const adminEmail = 'admin@gmail.com';
  const adminPassword = '12345678';

  it('Creación de un Nuevo Evento', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('#root [name="email"]').type(email);
    cy.get('#root [name="contrasena"]').type(password);
    cy.get('#root button.btn-login').click();
    cy.get('#root a[href="/organizador"]').click();
    cy.get('[name="nombre"]').type(randomNombre);
    cy.get('[name="descripcion"]').type(randomDescripcion);
    cy.get('[name="fecha"]').type('2027-07-17');
    cy.get('[name="horaInicio"]').type('21:00');
    cy.get('[name="horaFin"]').type('23:00');
    cy.get('[name="precioEntrada"]').type(randomNumero);
    cy.get('[name="cantidadCupos"]').type(randomNumero);
    cy.get('[name="edadMinima"]').type(randomEdad);
    cy.get('[name="categoria"]').select('1');
    cy.get('#provincia').select('1');
    cy.get('[name="localidad"]').select('1');
    cy.get('[name="direccion"]').select('2');
    cy.get('#organizador-panel button.homeOrg-btn').click();
  })

  it('Aprobación y Destacado de un Nuevo Evento', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('#root [name="email"]').type(adminEmail);
    cy.get('#root [name="contrasena"]').type(adminPassword);
    cy.get('#root button.btn-login').click();
    cy.get('div:nth-child(1) > div.botones-card > #aceptar-evento').click();
    cy.get('#boton-destacado').click();
  })
  
  it('Quitar Destacado y Eliminación de un Nuevo Evento', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('#root [name="email"]').type(adminEmail);
    cy.get('#root [name="contrasena"]').type(adminPassword);
    cy.get('#root button.btn-login').click();
    cy.get('div:nth-child(1) > div.botones-card > #boton-destacado').click();
    cy.get('section.EventosAprobados div:nth-child(1) div.botones-card #rechazar-evento').click();
  });
})