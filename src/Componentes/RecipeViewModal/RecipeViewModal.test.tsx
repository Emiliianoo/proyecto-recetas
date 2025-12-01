import { render, screen, fireEvent } from "@testing-library/react";
import RecipeViewModal from "./RecipeViewModal";
import { describe, test, expect, vi } from "vitest";

describe("RecipeViewModal", () => {
  const receta = {
    id: "1",
    nombre: "Taco",
    tipoCocina: "Mexicana",
    tiempoCoccionMinutos: 30,
    ingredientes: [{ id: "i1", nombre: "Carne" }],
    instrucciones: [{ id: "ins1", texto: "Cocinar" }],
  };

  const cerrarMock = vi.fn();
  const onGuardarNotaMock = vi.fn();
  const onEliminarNotaMock = vi.fn();
  const onActualizarNotaMock = vi.fn();
  const onGuardarImagenesMock = vi.fn();
  const onEliminarImagenMock = vi.fn();
  const onReemplazarImagenMock = vi.fn();

  test("Renderizar receta completa", () => {
    render(
      <RecipeViewModal
        receta={receta}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
        onGuardarImagenes={onGuardarImagenesMock}
        onEliminarImagen={onEliminarImagenMock}
        onReemplazarImagen={onReemplazarImagenMock}
      />
    );
    expect(screen.getByText("Taco")).toBeInTheDocument();
    expect(screen.getByText("Mexicana")).toBeInTheDocument();
    expect(screen.getByText("Carne")).toBeInTheDocument();
    expect(screen.getByText("Cocinar")).toBeInTheDocument();
  });

  test("Cerrar modal", () => {
    render(
      <RecipeViewModal
        receta={receta}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
        onGuardarImagenes={onGuardarImagenesMock}
        onEliminarImagen={onEliminarImagenMock}
        onReemplazarImagen={onReemplazarImagenMock}
      />
    );
    fireEvent.click(screen.getByText(/Cerrar/i));
    expect(cerrarMock).toHaveBeenCalled();
  });

  test("Receta null", () => {
    const { container } = render(
      <RecipeViewModal
        receta={null}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
        onGuardarImagenes={onGuardarImagenesMock}
        onEliminarImagen={onEliminarImagenMock}
        onReemplazarImagen={onReemplazarImagenMock}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
