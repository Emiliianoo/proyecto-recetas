// Tipos globales del proyecto

export interface Ingrediente {
  id: string;
  nombre: string;
}

export interface Instruccion {
  id: string;
  texto: string;
}

export interface Receta {
  id: string;
  nombre: string;
  tipoCocina: string;
  ingredientes: Ingrediente[];
  instrucciones: Instruccion[];
}
