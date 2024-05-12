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

  // Test case 2: R8UC2 (Toggling an Existing Todo Item)

  it('should mark an existing todo item as done', () => {

    // Wait for the new todo item to be added
    cy.wait(1000);
  
    // Click on the icon in front of the description of the todo item to mark it as done
    cy.get('.todo-item .checker').first().click();

    cy.get('.todo-item .checker').first().should('have.class', 'checked', { timeout: 5000, interval: 500 });
  });

  it('should mark an existing todo item as undone', () => {
    // Wait for the new todo item to be added
    cy.wait(1000);
  
    // Click on the icon in front of the description of the todo item to mark it as done
    cy.get('.todo-item .checker').first().click();

    // Assert that the todo item is visually marked as done with a strikethrough effect
    cy.get('.todo-item .checker').first().should('not.have.class', 'checked', { timeout: 5000, interval: 500 });
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
