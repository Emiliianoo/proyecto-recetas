import { render, screen, fireEvent } from "@testing-library/react";
import RecipeForm from "./RecipeForm";

describe("RecipeForm", () => {
  const agregarRecetaMock = vi.fn();

  beforeEach(() => {
    agregarRecetaMock.mockClear(); // limpia llamadas previas
  });

  test("Guardar receta con todos los campos completos", () => {
    render(<RecipeForm agregarReceta={agregarRecetaMock} />);
    fireEvent.change(screen.getByLabelText(/Nombre de la receta/i), {
      target: { value: "Taco" },
    });
    fireEvent.change(screen.getByLabelText(/Tipo de cocina/i), {
      target: { value: "Mexicana" },
    });
    fireEvent.change(screen.getAllByRole("textbox")[2], {
      target: { value: "Carne" },
    });
    fireEvent.click(screen.getAllByText(/Agregar/)[0]);
    fireEvent.change(screen.getAllByRole("textbox")[3], {
      target: { value: "Cocinar carne" },
    });
    fireEvent.click(screen.getAllByText(/Agregar/)[1]);
    fireEvent.click(screen.getByText(/Guardar Receta/i));

    expect(agregarRecetaMock).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText(/Debes completar todos los campos/i)
    ).not.toBeInTheDocument();
  });

  test("Guardar sin completar campos", () => {
    render(<RecipeForm agregarReceta={agregarRecetaMock} />);
    fireEvent.click(screen.getByText(/Guardar Receta/i));
    expect(
      screen.getByText(/Debes completar todos los campos/i)
    ).toBeInTheDocument();
    expect(agregarRecetaMock).not.toHaveBeenCalled();
  });

  test("Agregar/eliminar ingredientes", () => {
    render(<RecipeForm agregarReceta={agregarRecetaMock} />);
    const inputIng = screen.getAllByRole("textbox")[2];
    fireEvent.change(inputIng, { target: { value: "Tomate" } });
    fireEvent.click(screen.getAllByText(/Agregar/)[0]);
    expect(screen.getByText("Tomate")).toBeInTheDocument();

    fireEvent.click(screen.getByText("X"));
    expect(screen.queryByText("Tomate")).not.toBeInTheDocument();
  });

  test("Agregar/eliminar instrucciones", () => {
    render(<RecipeForm agregarReceta={agregarRecetaMock} />);
    const inputInst = screen.getAllByRole("textbox")[3];
    fireEvent.change(inputInst, { target: { value: "Mezclar" } });
    fireEvent.click(screen.getAllByText(/Agregar/)[1]);
    expect(screen.getByText("Mezclar")).toBeInTheDocument();

    fireEvent.click(screen.getByText("X"));
    expect(screen.queryByText("Mezclar")).not.toBeInTheDocument();
  });

  test("Ingrediente o instrucción con texto muy largo", () => {
    render(<RecipeForm agregarReceta={agregarRecetaMock} />);
    const largo = "x".repeat(1000);
    fireEvent.change(screen.getAllByRole("textbox")[2], {
      target: { value: largo },
    });
    fireEvent.click(screen.getAllByText(/Agregar/)[0]);
    expect(screen.getByText(largo)).toBeInTheDocument();
  });

  test("Intentar agregar ingrediente vacío", () => {
    render(<RecipeForm agregarReceta={agregarRecetaMock} />);
    fireEvent.click(screen.getAllByText(/Agregar/)[0]);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
