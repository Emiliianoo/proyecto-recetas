import { render, screen } from "@testing-library/react";
import RecipeViewModal from "./RecipeViewModal";
import { describe, it, expect, vi } from "vitest";
import type { Receta } from "../../types";

describe("RecipeViewModal - Single Smoke Test", () => {
  it("renders and shows the 'Agregar Imagen' button", () => {
    const receta: Receta = {
      id: "1",
      nombre: "Pasta",
      tipoCocina: "Italiana",
      ingredientes: [],
      instrucciones: [],
      notas: [],
      imagenes: [],
    };

    const cerrarMock = vi.fn();
    const noop = vi.fn();

    render(
      <RecipeViewModal
        receta={receta}
        cerrar={cerrarMock}
        onGuardarNota={noop}
        onEliminarNota={noop}
        onActualizarNota={noop}
        onGuardarImagenes={noop}
        onEliminarImagen={noop}
        onReemplazarImagen={noop}
      />
    );

    expect(screen.getByText("Agregar Imagen")).toBeInTheDocument();
  });
});
