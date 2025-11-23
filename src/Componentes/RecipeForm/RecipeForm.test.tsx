import { render, screen, fireEvent } from "@testing-library/react";
import RecipeForm from "./RecipeForm";

describe("RecipeForm", () => {
  const agregarRecetaMock = vi.fn();

  test("muestra error si se guarda sin completar campos", () => {
    render(<RecipeForm agregarReceta={agregarRecetaMock} />);
    fireEvent.click(screen.getByText("Guardar Receta"));
    expect(
      screen.getByText(/Debes completar todos los campos/i)
    ).toBeInTheDocument();
  });
});
