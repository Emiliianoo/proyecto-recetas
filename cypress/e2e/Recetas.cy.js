import './commands'

describe('registrar una receta con nombre, tipo de cocina, lista de ingredientes e instrucciones', () => {
  
  beforeEach(() => {
    cy.visit("https://proyecto-recetas-cocina.netlify.app");
  });

  it('Crear una receta y validar que los datos se guarden', () => {
    const nombre = "Pastel de Chocolate";
    const tipo = "Postres";
    const ingredientes = ["Harina", "Chocolate","Leche"];
    const instrucciones = ["Mezclar", "hornear"];
    // Crear
    cy.createRecipe({
      nombre,
      tipo,
      ingredientes,
      instrucciones
    })

    cy.contains(nombre).should("exist")

    cy.get('button[class = "btn-ver"]').click()
    cy.get('.view-content').within(() => {
      cy.contains(nombre).should("exist");
      cy.contains(tipo).should("exist");
      cy.get('ul li').each((item, index) => {
        cy.wrap(item).should('contain.text', ingredientes[index]);
      });
      cy.get('ol li').each((item, index) => {
        cy.wrap(item).should('contain.text', instrucciones[index]);
      });
    })
  })
  const casos = [
  {
    nombre: null,
    tipo: "Postres",
    ingredientes: ["Harina", "Chocolate", "Leche"],
    instrucciones: ["Mezclar", "Hornear"],
    error: "nombre"
  },
  {
    nombre: "Pastel",
    tipo: null,
    ingredientes: ["Harina"],
    instrucciones: ["Mezclar", "Hornear"],
    error: "tipo"
  },
  {
    nombre: "Pastel",
    tipo: "Postres",
    ingredientes: null,
    instrucciones: ["Mezclar", "Hornear"],
    error: "ingredientes"
  },
  {
    nombre: "Pastel",
    tipo: "Postres",
    ingredientes: ["Harina"],
    instrucciones: null,
    error: "instrucciones"
  },
  {
    nombre: null,
    tipo: null,
    ingredientes: null,
    instrucciones: null,
    error: "todo"
  }
];

  casos.forEach(caso => {
    it(`No debe guardar cuando falta: ${caso.error}`, () => {
      cy.createRecipe({
        nombre: caso.nombre,
        tipo: caso.tipo,
        ingredientes: caso.ingredientes,
        instrucciones: caso.instrucciones
      })

      cy.get("p.error").should("exist")
    })
  })
})
