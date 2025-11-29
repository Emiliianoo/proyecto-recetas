// Tipos globales del proyecto

export interface Ingrediente {
  id: string;
  nombre: string;
}

export interface Instruccion {
  id: string;
  texto: string;
}

export interface NotaReceta {
  id: string;
  texto: string;
  fecha: string;
}

export interface ImagenReceta {
  id: string;
  url: string; // base64 data URL
  fecha: string;
}

export interface Receta {
  id: string;
  nombre: string;
  tipoCocina: string;
  ingredientes: Ingrediente[];
  instrucciones: Instruccion[];
  notas?: NotaReceta[];
  imagenes?: ImagenReceta[];
}
