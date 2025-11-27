import { render, screen, fireEvent } from "@testing-library/react";
import RecipeViewModal from "./RecipeViewModal";

vi.mock("../ConfirmModal/ConfirmModal", () => ({
  default: (props: { mostrar: boolean; onConfirmar: () => void }) => {
    const { mostrar, onConfirmar } = props;

    if (mostrar) {
      onConfirmar();
    }
    return null;
  },
}));

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
  const onActualizarNotaMock = vi.fn();

  // Tests H1

  test("Renderizar receta completa", () => {
    render(
      <RecipeViewModal
        receta={receta}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
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
      />
    );
    expect(container.firstChild).toBeNull();
  });

  // Tests H2

  test("Agregar una nota nueva en una receta existente", () => {
    render(
      <RecipeViewModal
        receta={{ ...receta, notas: [] }}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
      />
    );

    const textarea = screen.getByPlaceholderText(/nota/i);
    fireEvent.change(textarea, { target: { value: "Mi primera nota" } });

    const botonGuardar = screen.getByRole("button", { name: /guardar nota/i });
    fireEvent.click(botonGuardar);

    expect(onGuardarNotaMock).toHaveBeenCalledWith("1", "Mi primera nota");
  });

  test("Editar una nota y verificar que se actualice correctamente", () => {
    render(
      <RecipeViewModal
        receta={{
          ...receta,
          notas: [
            {
              id: "n1",
              texto: "Nota inicial",
              fecha: "2025-01-01T00:00:00.000Z",
            },
          ],
        }}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /editar/i }));

    const textarea = screen.getByPlaceholderText(/edita el texto de la nota/i);
    expect((textarea as HTMLTextAreaElement).value).toBe("Nota inicial");

    fireEvent.change(textarea, { target: { value: "Nota modificada" } });

    const botonActualizar = screen.getByRole("button", {
      name: /actualizar nota/i,
    });
    fireEvent.click(botonActualizar);

    expect(onActualizarNotaMock).toHaveBeenCalledWith(
      "1",
      "n1",
      "Nota modificada"
    );
  });

  test("Eliminar la nota y confirmar que desaparezca visualmente", () => {
    const recetaConNota = {
      ...receta,
      notas: [
        {
          id: "n1",
          texto: "Nota a borrar",
          fecha: "2025-01-01T00:00:00.000Z",
        },
      ],
    };

    const { rerender } = render(
      <RecipeViewModal
        receta={recetaConNota}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
      />
    );

    expect(screen.getByText("Nota a borrar")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));

    expect(onEliminarNotaMock).toHaveBeenCalledWith("1", "n1");

    const recetaSinNota = { ...recetaConNota, notas: [] };

    rerender(
      <RecipeViewModal
        receta={recetaSinNota}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
      />
    );

    expect(screen.queryByText("Nota a borrar")).toBeNull();
  });

  test("Abrir receta y verificar que la nota aparece en el lugar correcto", () => {
    render(
      <RecipeViewModal
        receta={{
          ...receta,
          notas: [
            {
              id: "n1",
              texto: "Nota visible",
              fecha: "2025-01-01T00:00:00.000Z",
            },
          ],
        }}
        cerrar={cerrarMock}
        onGuardarNota={onGuardarNotaMock}
        onEliminarNota={onEliminarNotaMock}
        onActualizarNota={onActualizarNotaMock}
      />
    );

    const notaElemento = screen.getByText("Nota visible");
    expect(notaElemento).toBeInTheDocument();

    const lista = notaElemento.closest("ul");
    expect(lista).not.toBeNull();
    expect(lista).toHaveClass("lista-notas");
  });
});
