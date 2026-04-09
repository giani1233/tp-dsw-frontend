describe('Flujo de registro y login', () => {

  const randomString = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const randomDni = Math.floor(10000000 + Math.random() * 90000000).toString();
  const randomEmail = `test_${Date.now()}@example.com`;
  const randomName = `Test nombre ${randomString(5)}`;
  const randomSurname = `Test apellido ${randomString(5)}`;
  const randomTel = Math.floor(100000000 + Math.random() * 900000000).toString();
  const password = 'TestPassword123!';

  beforeEach(() => {
    cy.visit('http://localhost:5173/register');
  })

  it('Debería mostrar errores cuando el formulario está vacío', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('El dni es obligatorio').should('be.visible');
    cy.contains('El nombre es obligatorio').should('be.visible');
    cy.contains('El email es obligatorio').should('be.visible');
  });

  it('Debería registrar un nuevo usuario exitosamente', () => {
    cy.get('#dni').type(randomDni);
    cy.get('#nombre').type(randomName);
    cy.get('#apellido').type(randomSurname);
    cy.get('#email').type(randomEmail);
    cy.get('#telefono').type(randomTel);
    cy.get('#tipo').select('Cliente');
    cy.get('#fechaNacimiento').type('2000-01-01');
    cy.get('#contraseña').type(password);
    cy.get('#confirmarContraseña').type(password);  
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
  });

  it('Debería iniciar sesión con el usuario registrado', () => {
    cy.get('#email').type(randomEmail);
    cy.get('#contraseña').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
})