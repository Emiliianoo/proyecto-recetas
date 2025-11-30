import { error } from 'console'
import './commands'
describe('agregar notas especiales o modificaciones en cada receta', () => {
  
  beforeEach(() => {
    cy.visit("https://proyecto-recetas-cocina.netlify.app");

    cy.createRecipe({
      nombre: "Pastel de Chocolate",
      tipo: "Postres",
      ingredientes: ["Harina", "Chocolate", "Leche"],
      instrucciones: ["Mezclar", "Hornear"]
    });

    cy.get('.btn-ver').click();
  });
  
  it('Validar que el usuario pueda agregar una nota a una receta existente con éxito.', () => {
    const text = "texto de prueba";
    cy.addNote({
      text
    })

    cy.contains("Nota agregada correctamente.").should("exist");
    
  })
  it('Validar que no se pueda guardar una nota si el campo está vacío.', () => {
    const text = null;
    cy.addNote({
      text
    })
    cy.contains("La nota no puede estar vacía.").should("exist");
    
  })

  it('Validar que una receta pueda tener más de una nota.', () => {
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
    const text = "nota de prueba";
    cy.addNote({
      text
    })

    cy.get('button[class = "btn-eliminar-nota"]').click() 
    cy.get('button[class = "confirm-btn eliminar"]').click()

    cy.contains("Nota eliminada").should("exist");
    cy.get('.lista-notas li').should('have.length', 0);
  })
  
  it('Validar que una nota ya registrada pueda ser modificada', () => {
    const text = "nota de prueba";
    cy.addNote({
      text
    })

    const nuevoTexto = "nota modificada";
    cy.get('button[class="btn-editar-nota"]').click()

    cy.get("textarea").clear().type(nuevoTexto)

    cy.get('button[class="btn-guardar-nota"]').click()

    cy.contains(nuevoTexto).should("exist");
    cy.contains("Nota actualizada correctamente.").should("exist");


  })

  it('Validar que el sistema impida dejar una nota completamente vacía tras una edición.', () => {
    const text = "nota de prueba";
    cy.addNote({
      text
    })
    cy.get('button[class="btn-editar-nota"]').click()

    cy.get("textarea").clear()

    cy.get('button[class="btn-guardar-nota"]').click()

    cy.contains("La nota no puede estar vacía.").should("exist");
  })

  it('Evitar que al editar una nota se modifiquen otras notas por error', () => {
  const nota1 = "Esta es la primera nota";
  const nota2 = "Esta es la segunda nota";

  cy.addNote({ text: nota1 });
  cy.addNote({ text: nota2 });

  const nuevaNota1 = "Primera nota modificada";

  cy.get('.lista-notas li').first().within(() => {
    cy.get('.btn-editar-nota').click();
  });

  cy.get('textarea').clear().type(nuevaNota1);
  cy.get('.btn-guardar-nota').click();

  // Validar que solo una fue modificada
  cy.get('.lista-notas li').first().should('contain.text', nuevaNota1);
  cy.get('.lista-notas li').eq(1).should('contain.text', nota2);
});
})