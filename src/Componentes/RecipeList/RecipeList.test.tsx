import { render, screen } from "@testing-library/react";
import RecipeList from "./RecipeList";

describe("RecipeList", () => {
  const receta1 = {
    id: "1",
    nombre: "Taco",
    tipoCocina: "Mexicana",
    ingredientes: [],
    instrucciones: [],
  };
  const receta2 = {
    id: "2",
    nombre: "Pizza",
    tipoCocina: "Italiana",
    ingredientes: [],
    instrucciones: [],
  };
  const onVerMock = vi.fn();

  test("Lista vacía", () => {
    render(<RecipeList recetas={[]} onVer={onVerMock} />);
    expect(screen.getByText(/No hay recetas registradas/i)).toBeInTheDocument();
  });

  test("Orden de las recetas", () => {
    render(<RecipeList recetas={[receta1, receta2]} onVer={onVerMock} />);
    const cards = screen.getAllByText(/Taco|Pizza/i);
    expect(cards[0]).toHaveTextContent("Taco");
    expect(cards[1]).toHaveTextContent("Pizza");
  });
});
