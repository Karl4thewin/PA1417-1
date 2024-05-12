describe('Logging into the system', () => {
  let uid; // User id
  let email; // Email of the user

  before(() => {
    // Create a fabricated user from a fixture
    cy.fixture('user.json').then((user) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5000/users/create',
        form: true,
        body: user
      }).then((response) => {
        uid = response.body._id.$oid;
        email = user.email;
      });
    });
  });

  beforeEach(() => {

    cy.visit('http://localhost:3000');


    cy.contains('div', 'Email Address').find('input[type=text]').type(email);
    cy.get('form').submit();

    cy.contains('.container-element .title-overlay', 'New Todo Item').click();

    // Verify the popup is visible
    cy.get('.popup').should('be.visible');

  });

  // Test case 1: R8UC1 (Create a todo item)
  it('should create a new todo item', () => {



    // Wait for the new todo item input field to be visible
    cy.get('.popup-inner input[type="text"]').should('be.visible');
    // Input 'todo list' in the input field and click 'Add'
    cy.get('.popup-inner input[type="text"]').type('todo list');
    cy.get('.popup-inner input[type="submit"]').click();

    // Assert that the todo item is visible
    cy.get('.todo-item').should('exist');
  });
  
  after(() => {
    // Clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body);
    });
  });
});
