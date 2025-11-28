Cypress.Commands.add('createRecipe', ({nombre,tipo,ingredientes, instrucciones}) => {
  cy.get('button[class = "btn-agregar"]').click()
  
  if(nombre !== null){
    cy.get('input[id="nombre"]').type(nombre)
  }
  if(tipo !== null){
    cy.get('input[id="tipo"]').type(tipo)
  }
  if(ingredientes != null){
    ingredientes.forEach((ingrediente) => {
        cy.get('input[type="text"]').eq(2).type(ingrediente);
        cy.get('button.btn-add').eq(0).click();
    });
  }
  if(instrucciones != null){
    instrucciones.forEach((instruccion) => {
        cy.get('input[type="text"]').eq(3).type(instruccion)
        cy.get('button[class = "btn-add"]').eq(1).click();
    })
  }
  cy.get('button[class = "btn-guardar"]').click()
})

Cypress.Commands.add("addNote", (text) => {
  cy.get("textarea").type(text)
  cy.get('button[class="btn-guardar-nota"]').click()
})
