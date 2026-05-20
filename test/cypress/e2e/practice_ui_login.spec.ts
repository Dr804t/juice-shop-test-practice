/*
 * Practice Lab: UI Automation (Junior-Middle Level)
 * Objective: Automate Login via the browser.
 */

describe('Juice Shop UI Practice', () => {
  it('should log in through the user interface', () => {
    // 1. Visit the app
    cy.visit('http://localhost:3000/#/login');

    // 2. Dismiss the "Welcome" and "Cookie" popups if they appear
    // Hint: Use cy.get('button').contains('Dismiss').click();
    // Hint: Use cy.get('.cc-dismiss').click(); // For the cookie banner
    
    // cy.get("button").contains('Dismiss').click();
    // cy.get('.cc-dismiss').click();
    
    // 3. Type email and password
    // Find the selectors! (Use the Cypress Selector Playground in the browser)
    cy.get('#email').type('admin@juice-sh.op');
    cy.get('#password').type('admin123');

    // 4. Click Log In
    cy.get('#loginButton').click();

    // 5. Verify success
    cy.url().should('include', '/search');
    cy.get('button').contains('account_circle').should('be.visible');
  });
});
