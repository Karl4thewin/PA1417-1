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


  });

  it('should create a new task', () => {

    // Check if the page contains the form to add a new todo item
    cy.get('form.submit-form').should('exist');

    // Enter a title for the new todo item
    cy.get('#title').type('New Todo Item');

    // Enter a YouTube URL (optional)
    cy.get('#url').type('youtube.com');

    // Submit the form to create the new todo item
    cy.get('input[type="submit"]').click();
    cy.contains('.container-element .title-overlay', 'New Todo Item').click();

    // Verify the popup is visible
    cy.get('.popup').should('be.visible');
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
