import { render, screen, fireEvent } from "@testing-library/react";
import RecipeCard from "./RecipeCard";

describe("RecipeCard", () => {
  const receta = {
    id: "1",
    nombre: "Taco",
    tipoCocina: "Mexicana",
    ingredientes: [],
    instrucciones: [],
  };
  const onVerMock = vi.fn();

  test("Renderizar datos de la receta", () => {
    render(<RecipeCard receta={receta} onVer={onVerMock} />);
    expect(screen.getByText("Taco")).toBeInTheDocument();
    expect(screen.getByText(/Tipo de cocina: Mexicana/i)).toBeInTheDocument();
  });

  test("Click en 'Ver'", () => {
    render(<RecipeCard receta={receta} onVer={onVerMock} />);
    fireEvent.click(screen.getByText(/Ver/i));
    expect(onVerMock).toHaveBeenCalledWith(receta);
  });

  test("Receta con nombre o tipo largo", () => {
    const recetaLarga = {
      ...receta,
      nombre: "x".repeat(500),
      tipoCocina: "y".repeat(500),
    };
    render(<RecipeCard receta={recetaLarga} onVer={onVerMock} />);
    expect(screen.getByText("x".repeat(500))).toBeInTheDocument();
    expect(screen.getByText(/Tipo de cocina: y{500}/i)).toBeInTheDocument();
  });
});
