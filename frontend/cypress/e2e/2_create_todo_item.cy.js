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
    // Ensure the description field is cleared before entering new text
    cy.get('.popup-inner input[type="text"]').clear().type('todo list');
    cy.get('.popup-inner input[type="submit"]').click();
    // Assert that the todo item is visible
    cy.get('.todo-item').should('exist');
  });

  // Additional test case: Verify the "Add" button is disabled if the description is empty
  it('should keep the "Add" button disabled if the description is empty', () => {
    // Clear the description field to ensure it is empty
    cy.get('.popup-inner input[type="text"]').clear();
    // Assert that the "Add" button is disabled
    cy.get('.popup-inner input[type="submit"]').should('be.disabled');
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
