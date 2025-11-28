import { error } from 'console'
import './commands'
describe('agregar notas especiales o modificaciones en cada receta', () => {
  it('Validar que el usuario pueda agregar una nota a una receta existente con éxito.', () => {
    cy.visit("https://proyecto-recetas-cocina.netlify.app")
    const nombre = "Pastel de Chocolate";
    const tipo = "Postres";
    const ingredientes = ["Harina", "Chocolate","Leche"];
    const instrucciones = ["Mezclar, hornear"];
    // Crear
    cy.createRecipe({
      nombre,
      tipo,
      ingredientes,
      instrucciones
    })

    cy.get('button[class = "btn-ver"]').click()
    const text = "texto de prueba";
    cy.addNote({
      text
    })

    
  })
  it('Validar que no se pueda guardar una nota si el campo está vacío.', () => {
    cy.visit("https://proyecto-recetas-cocina.netlify.app")
    const nombre = "Pastel de Chocolate";
    const tipo = "Postres";
    const ingredientes = ["Harina", "Chocolate","Leche"];
    const instrucciones = ["Mezclar, hornear"];
    // Crear
    cy.createRecipe({
      nombre,
      tipo,
      ingredientes,
      instrucciones
    })

    cy.get('button[class = "btn-ver"]').click()
    const text = null;
    cy.addNote({
      text
    })
    cy.contains("La nota no puede estar vacía.").should("exist");
    
  })

  it('Validar que una receta pueda tener más de una nota.', () => {
    cy.visit("https://proyecto-recetas-cocina.netlify.app")
    const nombre = "Pastel de Chocolate";
    const tipo = "Postres";
    const ingredientes = ["Harina", "Chocolate","Leche"];
    const instrucciones = ["Mezclar, hornear"];
    // Crear
    cy.createRecipe({
      nombre,
      tipo,
      ingredientes,
      instrucciones
    })

    cy.get('button[class = "btn-ver"]').click()
    const text = "notas de prueba";
    cy.addNote({
      text
    })

    cy.addNote({
      text
    })

    cy.get('.lista-notas li').should('have.length', 2); //se valida que se hayan generado las dos notas
  })

  it('Eliminar nota exitosamente.', () => {
    cy.visit("https://proyecto-recetas-cocina.netlify.app")
    const nombre = "Pastel de Chocolate";
    const tipo = "Postres";
    const ingredientes = ["Harina", "Chocolate","Leche"];
    const instrucciones = ["Mezclar, hornear"];
    // Crear
    cy.createRecipe({
      nombre,
      tipo,
      ingredientes,
      instrucciones
    })

    cy.get('button[class = "btn-ver"]').click()
    const text = "nota de prueba";
    cy.addNote({
      text
    })

    cy.get('button[class = "btn-eliminar-nota"]').click() 
    cy.get('button[class = "confirm-btn eliminar"]').click()
  })
})