describe('Juice Shop UI Basket Flow', () => {
    beforeEach(() => {
        // Step 1: Bypass popups using cookies for a clean test run
        cy.setCookie('cookieconsent_status', 'dismiss')
        cy.setCookie('welcomebanner_status', 'dismiss')

        // Step 2: Log in through the UI
        cy.visit('http://localhost:3000/#/login')
        cy.get('[id=email]').type('admin@juice-sh.op')
        cy.get('[id=password]').type('admin123')
        cy.get('button').contains('Log in').click()

        // Step 3: Verify we are on the search page before starting the test
        cy.url().should('include','search')
    })

    it('should search for Apple products and add only them (no Pineapples!)', () => {
      // 1. Click search icon and type "Apple"
      cy.get('button').contains('search').click()
      cy.get('[id=searchQuery]').get('input').type('Apple {enter}')

      // 2. The "Senior" Logic: Loop through all product cards on the screen
      // .mat-grid-tile is the container for each product card in the grid
      cy.get('app-product').each(($card) => {
          // Find the name of the product inside this specific card
          const productName = $card.find('.name').text()

          cy.log(productName) 

          // Use Regex: \b means "word boundary". 
          // This matches "Apple" but NOT "Pineapple" because "Pine" is attached to it.
          if (productName.match(/\bApple\b/i)) {
              // We log it so you can see it in the Cypress console!
              cy.log(`Found a match: ${productName}`)

              // Find the "Add to Basket" button inside this specific card and click it
              // We use cy.wrap($card) to turn the jQuery object back into a Cypress object
              cy.wrap($card).find('button[aria-label="Add to Basket"]').click()

              // Optional: Wait for the little "Snackbar" notification to disappear
              // so it doesn't block the next click (good stability practice)
            //   cy.get('.mat-simple-snack-bar-content').should('be.visible')
            //   cy.get('.mat-simple-snack-bar-content').should('not.exist')
          } else {
              cy.log(`Skipping: ${productName} (Doesn't match our criteria)`)
          }
      })
      
      // 3. Go to the shopping cart
      cy.get('button').contains('shopping_cart').click()
      cy.url().should('include', 'basket')

      // 4. Final Verification: Check the basket table
      // We check that "Apple Juice" is there, but "Pineapple" is NOT there.
      cy.get('mat-table').should('contain', 'Apple Juice')
      cy.get('mat-table').should('not.contain', 'Pineapple')
    })

})
