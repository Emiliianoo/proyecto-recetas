import { describe, it, expect, vi } from "vitest";
import type { Receta, ImagenReceta } from "./types";

/**
 * Pruebas unitarias para los handlers de imágenes en App.tsx
 *
 * Nota: Estas pruebas demuestran la lógica esperada de los handlers.
 * Para pruebas de integración completas, considera usar React Testing Library
 * en una prueba de App.tsx completa.
 */

describe("App Image Handlers", () => {
  // Helper que aplica una transformación a las imágenes de la receta y sincroniza recetaSeleccionada
  const actualizarRecetas = (
    recetaId: string,
    transformar: (imagenes: ImagenReceta[]) => ImagenReceta[],
    recetas: Receta[],
    recetaSeleccionada: Receta | null,
    setRecetas: (recetas: Receta[]) => void,
    setRecetaSeleccionada: (receta: Receta | null) => void
  ) => {
    const updatedRecetas = recetas.map((r) =>
      r.id === recetaId ? { ...r, imagenes: transformar(r.imagenes || []) } : r
    );
    setRecetas(updatedRecetas);

    if (recetaSeleccionada?.id === recetaId) {
      setRecetaSeleccionada({
        ...recetaSeleccionada,
        imagenes: transformar(recetaSeleccionada.imagenes || []),
      });
    }
  };

  const mockManejarGuardarImagenes = (
    recetaId: string,
    imagenesNuevas: ImagenReceta[],
    recetas: Receta[],
    recetaSeleccionada: Receta | null,
    setRecetas: (recetas: Receta[]) => void,
    setRecetaSeleccionada: (receta: Receta | null) => void
  ) => {
    actualizarRecetas(
      recetaId,
      (imagenes) => [...imagenes, ...imagenesNuevas],
      recetas,
      recetaSeleccionada,
      setRecetas,
      setRecetaSeleccionada
    );
  };

  const mockManejarEliminarImagen = (
    recetaId: string,
    imagenId: string,
    recetas: Receta[],
    recetaSeleccionada: Receta | null,
    setRecetas: (recetas: Receta[]) => void,
    setRecetaSeleccionada: (receta: Receta | null) => void
  ) => {
    actualizarRecetas(
      recetaId,
      (imagenes) => imagenes.filter((img) => img.id !== imagenId),
      recetas,
      recetaSeleccionada,
      setRecetas,
      setRecetaSeleccionada
    );
  };

  const mockManejarReemplazarImagen = (
    recetaId: string,
    imagenId: string,
    nuevaImagen: ImagenReceta,
    recetas: Receta[],
    recetaSeleccionada: Receta | null,
    setRecetas: (recetas: Receta[]) => void,
    setRecetaSeleccionada: (receta: Receta | null) => void
  ) => {
    actualizarRecetas(
      recetaId,
      (imagenes) =>
        imagenes.map((img) => (img.id === imagenId ? nuevaImagen : img)),
      recetas,
      recetaSeleccionada,
      setRecetas,
      setRecetaSeleccionada
    );
  };

  // ===== PRUEBAS DE GUARDAR IMÁGENES =====

  describe("manejarGuardarImagenes", () => {
    it("Debe agregar imágenes a la receta correcta", () => {
      const recetas: Receta[] = [
        {
          id: "1",
          nombre: "Pasta",
          tipoCocina: "Italiana",
          ingredientes: [],
          instrucciones: [],
          notas: [],
          imagenes: [],
        },
      ];

      const nuevasImagenes: ImagenReceta[] = [
        {
          id: "img1",
          url: "data:image/jpeg;base64,test",
          fecha: new Date().toISOString(),
        },
      ];

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarGuardarImagenes(
        "1",
        nuevasImagenes,
        recetas,
        recetas[0],
        setRecetas,
        setRecetaSeleccionada
      );

      expect(setRecetas).toHaveBeenCalled();
      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes).toHaveLength(1);
      expect(updatedRecetas[0].imagenes[0].id).toBe("img1");
    });

    it("Debe actualizar recetaSeleccionada cuando es la misma receta", () => {
      const receta: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [],
      };

      const nuevasImagenes: ImagenReceta[] = [
        {
          id: "img1",
          url: "data:image/jpeg;base64,test",
          fecha: new Date().toISOString(),
        },
      ];

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarGuardarImagenes(
        "1",
        nuevasImagenes,
        [receta],
        receta,
        setRecetas,
        setRecetaSeleccionada
      );

      expect(setRecetaSeleccionada).toHaveBeenCalled();
      const updatedReceta = setRecetaSeleccionada.mock.calls[0][0];
      expect(updatedReceta.imagenes).toHaveLength(1);
    });

    it("No debe modificar recetaSeleccionada si es otra receta", () => {
      const receta1: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [],
      };

      const receta2: Receta = {
        id: "2",
        nombre: "Pizza",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [],
      };

      const nuevasImagenes: ImagenReceta[] = [
        {
          id: "img1",
          url: "data:image/jpeg;base64,test",
          fecha: new Date().toISOString(),
        },
      ];

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarGuardarImagenes(
        "1",
        nuevasImagenes,
        [receta1, receta2],
        receta2,
        setRecetas,
        setRecetaSeleccionada
      );

      expect(setRecetaSeleccionada).not.toHaveBeenCalled();
    });

    it("Debe agregar múltiples imágenes a la vez", () => {
      const receta: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [],
      };

      const nuevasImagenes: ImagenReceta[] = [
        {
          id: "img1",
          url: "data:image/jpeg;base64,test1",
          fecha: new Date().toISOString(),
        },
        {
          id: "img2",
          url: "data:image/jpeg;base64,test2",
          fecha: new Date().toISOString(),
        },
        {
          id: "img3",
          url: "data:image/jpeg;base64,test3",
          fecha: new Date().toISOString(),
        },
      ];

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarGuardarImagenes(
        "1",
        nuevasImagenes,
        [receta],
        receta,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes).toHaveLength(3);
    });

    it("Debe preservar imágenes existentes al agregar nuevas", () => {
      const recetaConImagenes: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img-old",
            url: "data:image/jpeg;base64,old",
            fecha: new Date().toISOString(),
          },
        ],
      };

      const nuevasImagenes: ImagenReceta[] = [
        {
          id: "img-new",
          url: "data:image/jpeg;base64,new",
          fecha: new Date().toISOString(),
        },
      ];

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarGuardarImagenes(
        "1",
        nuevasImagenes,
        [recetaConImagenes],
        recetaConImagenes,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes).toHaveLength(2);
      expect(updatedRecetas[0].imagenes[0].id).toBe("img-old");
      expect(updatedRecetas[0].imagenes[1].id).toBe("img-new");
    });
  });

  // ===== PRUEBAS DE ELIMINAR IMAGEN =====

  describe("manejarEliminarImagen", () => {
    it("Debe eliminar imagen específica por ID", () => {
      const receta: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img1",
            url: "data:image/jpeg;base64,test1",
            fecha: new Date().toISOString(),
          },
          {
            id: "img2",
            url: "data:image/jpeg;base64,test2",
            fecha: new Date().toISOString(),
          },
        ],
      };

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarEliminarImagen(
        "1",
        "img1",
        [receta],
        receta,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes).toHaveLength(1);
      expect(updatedRecetas[0].imagenes[0].id).toBe("img2");
    });

    it("No debe afectar otras recetas al eliminar imagen", () => {
      const receta1: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img1",
            url: "data:image/jpeg;base64,test1",
            fecha: new Date().toISOString(),
          },
        ],
      };

      const receta2: Receta = {
        id: "2",
        nombre: "Pizza",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img2",
            url: "data:image/jpeg;base64,test2",
            fecha: new Date().toISOString(),
          },
        ],
      };

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarEliminarImagen(
        "1",
        "img1",
        [receta1, receta2],
        receta1,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes).toHaveLength(0);
      expect(updatedRecetas[1].imagenes).toHaveLength(1);
    });
  });

  // ===== PRUEBAS DE REEMPLAZAR IMAGEN =====

  describe("manejarReemplazarImagen", () => {
    it("Debe reemplazar imagen por ID manteniendo su posición", () => {
      const receta: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img1",
            url: "data:image/jpeg;base64,old1",
            fecha: new Date(2025, 0, 1).toISOString(),
          },
          {
            id: "img2",
            url: "data:image/jpeg;base64,old2",
            fecha: new Date(2025, 0, 2).toISOString(),
          },
        ],
      };

      const nuevaImagen: ImagenReceta = {
        id: "img1",
        url: "data:image/jpeg;base64,new",
        fecha: new Date().toISOString(),
      };

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarReemplazarImagen(
        "1",
        "img1",
        nuevaImagen,
        [receta],
        receta,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes[0].id).toBe("img1");
      expect(updatedRecetas[0].imagenes[0].url).toBe(
        "data:image/jpeg;base64,new"
      );
      expect(updatedRecetas[0].imagenes[1].url).toBe(
        "data:image/jpeg;base64,old2"
      );
    });

    it("Debe actualizar la fecha al reemplazar imagen", () => {
      const receta: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img1",
            url: "data:image/jpeg;base64,old",
            fecha: new Date(2025, 0, 1).toISOString(),
          },
        ],
      };

      const nuevaFecha = new Date().toISOString();
      const nuevaImagen: ImagenReceta = {
        id: "img1",
        url: "data:image/jpeg;base64,new",
        fecha: nuevaFecha,
      };

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarReemplazarImagen(
        "1",
        "img1",
        nuevaImagen,
        [receta],
        receta,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes[0].fecha).toBe(nuevaFecha);
    });

    it("Debe mantener IDs de otras imágenes al reemplazar una", () => {
      const receta: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img1",
            url: "data:image/jpeg;base64,old1",
            fecha: new Date().toISOString(),
          },
          {
            id: "img2",
            url: "data:image/jpeg;base64,old2",
            fecha: new Date().toISOString(),
          },
        ],
      };

      const nuevaImagen: ImagenReceta = {
        id: "img1",
        url: "data:image/jpeg;base64,new",
        fecha: new Date().toISOString(),
      };

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarReemplazarImagen(
        "1",
        "img1",
        nuevaImagen,
        [receta],
        receta,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[0].imagenes[0].id).toBe("img1");
      expect(updatedRecetas[0].imagenes[1].id).toBe("img2");
    });

    it("No debe afectar otras recetas al reemplazar imagen", () => {
      const receta1: Receta = {
        id: "1",
        nombre: "Pasta",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img1",
            url: "data:image/jpeg;base64,old",
            fecha: new Date().toISOString(),
          },
        ],
      };

      const receta2: Receta = {
        id: "2",
        nombre: "Pizza",
        tipoCocina: "Italiana",
        ingredientes: [],
        instrucciones: [],
        notas: [],
        imagenes: [
          {
            id: "img2",
            url: "data:image/jpeg;base64,pizza",
            fecha: new Date().toISOString(),
          },
        ],
      };

      const nuevaImagen: ImagenReceta = {
        id: "img1",
        url: "data:image/jpeg;base64,new",
        fecha: new Date().toISOString(),
      };

      const setRecetas = vi.fn();
      const setRecetaSeleccionada = vi.fn();

      mockManejarReemplazarImagen(
        "1",
        "img1",
        nuevaImagen,
        [receta1, receta2],
        receta1,
        setRecetas,
        setRecetaSeleccionada
      );

      const updatedRecetas = setRecetas.mock.calls[0][0];
      expect(updatedRecetas[1].imagenes[0].url).toBe(
        "data:image/jpeg;base64,pizza"
      );
    });
  });
});
