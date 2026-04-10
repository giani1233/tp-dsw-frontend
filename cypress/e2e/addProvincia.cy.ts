describe('Flujo de Administración - Gestión de Provincias', () => {
  
  const nombreProvinciaTest = `TestProvincia_${Date.now()}`;
  const codigoProvinciaTest = Math.floor(100 + Math.random() * 900).toString();
  const adminEmail = 'admin@gmail.com';
  const adminPassword = '12345678';

  // Esta función centraliza el login para no repetir código
  const login = () => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[name="email"]').type(adminEmail);
    cy.get('input[name="contrasena"]').type(adminPassword);
    cy.get('.btn-login').click();
  };

  it('Sección 1: Autenticación de Administrador', () => {
    login();
    cy.url().should('include', '/administrador');
  });

  it('Sección 2: Navegación al módulo de Ubicaciones', () => {
    login(); // Reutilizamos la sesión
    cy.get('.navigationAdministrador').contains('Ubicaciones').click();
    cy.url().should('include', '/gestionDirecciones');
  });

  it('Sección 3: Apertura y llenado del formulario de Provincia', () => {
    login();
    cy.get('.navigationAdministrador').contains('Ubicaciones').click();
    
    cy.contains('button', 'Añadir Provincia').click();
    cy.get('.card-add-categoria').within(() => {
      cy.get('input[type="text"]').type(nombreProvinciaTest);
      cy.get('input[type="number"]').type(codigoProvinciaTest);
      cy.get('#boton-guardar-categoria').click();
    });
  });

  it('Sección 4: Verificación de persistencia en la tabla', () => {
    login();
    cy.get('.navigationAdministrador').contains('Ubicaciones').click();
    
    // Verificamos que la provincia creada en el paso anterior esté allí
    cy.get('table').should('contain', nombreProvinciaTest);
  });
});