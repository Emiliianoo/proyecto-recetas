import { render, screen, fireEvent } from "@testing-library/react";
import RecipeViewModal from "./RecipeViewModal";

describe("RecipeViewModal", () => {
  const receta = {
    id: "1",
    nombre: "Taco",
    tipoCocina: "Mexicana",
    ingredientes: [{ id: "i1", nombre: "Carne" }],
    instrucciones: [{ id: "ins1", texto: "Cocinar" }],
  };

  const cerrarMock = vi.fn();
  const onGuardarNotaMock = vi.fn();
  const onEliminarNotaMock = vi.fn();

  test("Renderizar receta completa", () => {
    render(
      <RecipeViewModal
        receta={receta}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
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
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
