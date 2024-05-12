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

  // Test Case 4: R8UC3 (Deleting an Existing Todo Item)
  it('should delete the todo item in the second place when user clicks on the remove symbol', () => {
    cy.wait(1000);
  
    // Get the number of todo items before deletion
    cy.get('.todo-item').its('length').then((initialTodoItemCount) => {
      // Click on the remove symbol of the todo item in the second place (index 1)
      cy.get('.todo-item .remover').eq(1).click();
      // cy.get('.close-btn').click({force:true})
      // cy.contains('.container-element .title-overlay', 'New Todo Item').click();
      // Assert that the todo item is removed
      cy.get('.todo-item').its('length').should('eq', initialTodoItemCount - 1);
    });
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
