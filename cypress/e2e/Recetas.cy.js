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
    ingredientes: ["Harina", "Chocolate","Leche"],
    instrucciones: ["Mezclar", "Hornear"],
    error: "nombre"
  },
  {
    nombre: "Pastel",
    tipo: null,
    ingredientes: ["Harina", "Chocolate","Leche"],
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
    ingredientes: ["Harina", "Chocolate","Leche"],
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

  // Receta 1
  const nombre1 = "Pastel de Chocolate";
  const tipo1 = "Postres";
  const ingredientes1 = ["Harina", "Chocolate", "Leche"];
  const instrucciones1 = ["Mezclar", "Hornear"];

  // Receta 2
  const nombre2 = "Tacos de Pollo";
  const tipo2 = "Mexicana";
  const ingredientes2 = ["Tortillas", "Pollo", "Cebolla", "Cilantro", "Limón"];
  const instrucciones2 = ["Cocinar el pollo", "Armar los tacos", "Servir con limón"];

  // Receta 3
  const nombre3 = "Ensalada César";
  const tipo3 = "Ensaladas";
  const ingredientes3 = ["Lechuga", "Crutones", "Queso Parmesano", "Aderezo César"];
  const instrucciones3 = ["Lavar la lechuga", "Agregar los ingredientes", "Mezclar bien"];

  const recetas = [
    {
      nombre: nombre1,
      tipo: tipo1,
      ingredientes: ingredientes1,
      instrucciones: instrucciones1
    },
    {
      nombre: nombre2,
      tipo: tipo2,
      ingredientes: ingredientes2,
      instrucciones: instrucciones2
    },
    {
      nombre: nombre3,
      tipo: tipo3,
      ingredientes: ingredientes3,
      instrucciones: instrucciones3
    }
  ];


  it('Verificar que el usuario pueda agregar mas de una receta', () => {
    recetas.forEach((receta) => {
      cy.createRecipe({
        nombre: receta.nombre,
        tipo: receta.tipo,
        ingredientes: receta.ingredientes,
        instrucciones: receta.instrucciones
      });

      cy.contains(receta.nombre).should("exist");
    });
  });

})
