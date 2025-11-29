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
  // Helpers para crear objetos de prueba
  const crearReceta = (
    id: string,
    nombre: string,
    imagenes: ImagenReceta[] = []
  ): Receta => ({
    id,
    nombre,
    tipoCocina: "Italiana",
    ingredientes: [],
    instrucciones: [],
    notas: [],
    imagenes,
  });

  const crearImagen = (
    id: string,
    url: string = "data:image/jpeg;base64,test"
  ): ImagenReceta => ({
    id,
    url,
    fecha: new Date().toISOString(),
  });

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
      const recetas = [crearReceta("1", "Pasta")];
      const nuevasImagenes = [crearImagen("img1")];
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
      const receta = crearReceta("1", "Pasta");
      const nuevasImagenes = [crearImagen("img1")];
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
      const receta1 = crearReceta("1", "Pasta");
      const receta2 = crearReceta("2", "Pizza");
      const nuevasImagenes = [crearImagen("img1")];
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
      const receta = crearReceta("1", "Pasta");
      const nuevasImagenes = [
        crearImagen("img1", "data:image/jpeg;base64,test1"),
        crearImagen("img2", "data:image/jpeg;base64,test2"),
        crearImagen("img3", "data:image/jpeg;base64,test3"),
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
      const receta = crearReceta("1", "Pasta", [
        crearImagen("img-old", "data:image/jpeg;base64,old"),
      ]);
      const nuevasImagenes = [
        crearImagen("img-new", "data:image/jpeg;base64,new"),
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
      expect(updatedRecetas[0].imagenes).toHaveLength(2);
      expect(updatedRecetas[0].imagenes[0].id).toBe("img-old");
      expect(updatedRecetas[0].imagenes[1].id).toBe("img-new");
    });
  });

  // ===== PRUEBAS DE ELIMINAR IMAGEN =====

  describe("manejarEliminarImagen", () => {
    it("Debe eliminar imagen específica por ID", () => {
      const receta = crearReceta("1", "Pasta", [
        crearImagen("img1", "data:image/jpeg;base64,test1"),
        crearImagen("img2", "data:image/jpeg;base64,test2"),
      ]);
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
      const receta1 = crearReceta("1", "Pasta", [
        crearImagen("img1", "data:image/jpeg;base64,test1"),
      ]);
      const receta2 = crearReceta("2", "Pizza", [
        crearImagen("img2", "data:image/jpeg;base64,test2"),
      ]);
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
      const receta = crearReceta("1", "Pasta", [
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
      ]);
      const nuevaImagen = crearImagen("img1", "data:image/jpeg;base64,new");
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
      const receta = crearReceta("1", "Pasta", [
        {
          id: "img1",
          url: "data:image/jpeg;base64,old",
          fecha: new Date(2025, 0, 1).toISOString(),
        },
      ]);
      const nuevaFecha = new Date().toISOString();
      const nuevaImagen = crearImagen("img1", "data:image/jpeg;base64,new");
      Object.assign(nuevaImagen, { fecha: nuevaFecha });
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
      const receta = crearReceta("1", "Pasta", [
        crearImagen("img1", "data:image/jpeg;base64,old1"),
        crearImagen("img2", "data:image/jpeg;base64,old2"),
      ]);
      const nuevaImagen = crearImagen("img1", "data:image/jpeg;base64,new");
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
      const receta1 = crearReceta("1", "Pasta", [
        crearImagen("img1", "data:image/jpeg;base64,old"),
      ]);
      const receta2 = crearReceta("2", "Pizza", [
        crearImagen("img2", "data:image/jpeg;base64,pizza"),
      ]);
      const nuevaImagen = crearImagen("img1", "data:image/jpeg;base64,new");
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
