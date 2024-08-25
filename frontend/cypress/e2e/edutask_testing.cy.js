describe('Logging into the system', () => {
  let uid; // User id
  let email; // Email of the user
  let taskid

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

      // Backend creation of the task
      cy.visit('http://localhost:3000');
      cy.contains('div', 'Email Address').find('input[type=text]').type(email);
      cy.get('form').submit();

      // Create a new task
      cy.get('form.submit-form').should('exist');
      taskid = `Task ${new Date().getTime()}`;
      cy.get('#title').type(taskid);
      cy.get('#url').type('youtube.com');
      cy.get('input[type="submit"]').click();
  
      // Verify that the task is created
      cy.contains('.container-element .title-overlay', taskid).should('exist');
      // Use the unique title to select the task
      cy.contains('.container-element .title-overlay', taskid).click();
      cy.get('.popup').should('be.visible'); // Ensure the popup is visible

      cy.viewport(1280, 720);

      // create multiple todo items
      cy.fixture('todo_lists.json').then((lists) => {
        lists.forEach((list) => {
          cy.get('input[placeholder="Add a new todo item"]').scrollIntoView().type(list.descr);
          cy.get('.popup-inner input[type="submit"]').click();
          
          // Verify that the todo item is visible
          cy.contains('.todo-item', list.descr).should('exist');
        });
      });

      });
    });
  });

  beforeEach(() => {

    cy.visit('http://localhost:3000');

    cy.contains('div', 'Email Address').find('input[type=text]').type(email);
    cy.get('form').submit();

    // Check if the page contains the form to add a new todo item
    cy.get('form.submit-form').should('exist');

    cy.contains('.container-element .title-overlay', taskid).click();

    // Verify the popup is visible
    cy.get('.popup').should('be.visible');

    cy.viewport(1280, 720);


  });

  // -----------------------------------------------------
  // Test case 1: R8UC1 (Create a todo item)
  // -----------------------------------------------------

  it('should keep the "Add" button disabled if the description is empty', () => {
    // Clear the description field to ensure it is empty
    cy.get('input[placeholder="Add a new todo item"').clear();
    // Assert that the "Add" button is disabled
    cy.get('.popup-inner input[type="submit"]').should('be.disabled');
  
  });
  
  it('should create a new todo item, description not disabled', () => {
    // Ensure the description field is cleared before entering new text
    cy.get('.popup-inner input[type="text"]').clear().type('todo list');
    cy.get('.popup-inner input[type="submit"]').click();
    // Assert that the todo item is visible
    cy.get('.todo-item').should('contain.text', 'todo list');
  });

  // -----------------------------------------------------
  // Test case 2: R8UC2 (Toggling an Existing Todo Item)
  // -----------------------------------------------------

  
  it('should mark an existing todo item as done', () => {


    // Click on the icon in front of the description of the todo item to mark it as done
    cy.get('.todo-item').contains('todo item status').parent().find('.checker').click();

    cy.get('.todo-item').contains('todo item status').should('have.class', 'checked', { timeout: 5000, interval: 500 });
  });


  it('should set an existing todo item to  undone', () => {

    // Click on the icon in front of the description of the todo item to mark it as done
    cy.get('.todo-item').contains('todo item status').parent().find('.checker').click();

    cy.get('.todo-item').contains('todo item status').should('not.have.class', 'checked', { timeout: 5000, interval: 500 });
  })


  
  // -----------------------------------------------------
  // Test Case 3: R8UC3 (Deleting an Existing Todo Item)
  // -----------------------------------------------------

  it('should delete the todo item when user clicks on the remove symbol', () => {
  
    // Get the number of todo items before deletion
    cy.get('.todo-item').its('length').then((initialTodoItemCount) => {
      // Click on the remove symbol of the todo item
      cy.get('.todo-item').contains('todo item to delete').parent().find('.remover').click();

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
