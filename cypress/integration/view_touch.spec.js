describe('Views - each route/view loads the expected container div', () => {
  it('visit each route to ensure it renders the expected container div', () => {
    const routes = [
      '/',
      'characters',
      'characters/1',
      'scenes',
      'scenes/1',
      'cast',
      'costumes/1',
      'directory',
      'script',
    ]

    cy.wrap(routes)
      .each(route => {
        cy.visit(route)
          .get('.content-container')
          .should('exist')
      })
  })
})
