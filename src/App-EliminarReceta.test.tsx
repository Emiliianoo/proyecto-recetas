import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { beforeEach } from "vitest";
import type { Receta } from "./types";

let recetasMock: Receta[] = [];

beforeEach(() => {
  recetasMock = [
    {
      id: "1",
      nombre: "Taco",
      tipoCocina: "Mexicana",
      ingredientes: [],
      instrucciones: [],
    },
    {
      id: "2",
      nombre: "Pasta",
      tipoCocina: "Italiana",
      ingredientes: [],
      instrucciones: [],
    },
  ];
});

describe("App – eliminar recetas", () => {
  test("Elimina una receta correctamente", () => {
    render(<App initialRecetas={recetasMock} />);

    const tarjetaTaco = screen.getByText(/taco/i);
    expect(tarjetaTaco).toBeInTheDocument();

    const btnEliminar = screen.getAllByText(/eliminar/i)[0];
    fireEvent.click(btnEliminar);

    // Seleccionamos el botón 'Eliminar' del modal
    const btnEliminarModal = screen.getByText(/eliminar/i, {
      selector: "button.confirm-btn.eliminar",
    });
    fireEvent.click(btnEliminarModal);

    expect(screen.queryByText(/taco/i)).toBeNull();
  });

  test("Cancelar eliminación mantiene la receta", () => {
    render(<App initialRecetas={recetasMock} />);

    const recetaInicial = screen.getByText(/taco/i);
    expect(recetaInicial).toBeInTheDocument();

    const btnEliminar = screen.getAllByText(/eliminar/i)[0];
    fireEvent.click(btnEliminar);

    const btnCancelar = screen.getByText(/cancelar/i, {
      selector: "button.confirm-btn.cancelar",
    });
    fireEvent.click(btnCancelar);

    expect(screen.getByText(/taco/i)).toBeInTheDocument();
  });

  test("El modal de confirmación aparece al intentar eliminar", () => {
    render(<App initialRecetas={recetasMock} />);

    const btnEliminar = screen.getAllByText(/eliminar/i)[0];
    fireEvent.click(btnEliminar);

    expect(
      screen.getByText(/eliminar esta receta definitivamente/i)
    ).toBeInTheDocument();
  });

  test("El estado cambia y la lista se actualiza tras eliminar", () => {
    render(<App initialRecetas={recetasMock} />);

    const tarjetasAntes = screen.getAllByRole("heading", { level: 3 }).length;

    const btnEliminar = screen.getAllByText(/eliminar/i)[0];
    fireEvent.click(btnEliminar);

    const btnEliminarModal = screen.getByText(/eliminar/i, {
      selector: "button.confirm-btn.eliminar",
    });
    fireEvent.click(btnEliminarModal);

    const tarjetasDespues = screen.getAllByRole("heading", { level: 3 }).length;

    expect(tarjetasDespues).toBe(tarjetasAntes - 1);
  });

  test("Eliminar una receta no afecta a las demás", () => {
    render(<App initialRecetas={recetasMock} />);

    expect(screen.getByText(/taco/i)).toBeInTheDocument();
    expect(screen.getByText(/pasta/i)).toBeInTheDocument();

    const btnEliminarTaco = screen.getAllByText(/eliminar/i)[0];
    fireEvent.click(btnEliminarTaco);

    const btnEliminarModal = screen.getByText(/eliminar/i, {
      selector: "button.confirm-btn.eliminar",
    });
    fireEvent.click(btnEliminarModal);

    expect(screen.queryByText(/taco/i)).toBeNull();
    expect(screen.getByText(/pasta/i)).toBeInTheDocument();
  });

  test("Todos los elementos de la lista tienen botón 'Eliminar'", () => {
    render(<App initialRecetas={recetasMock} />);

    const tarjetas = screen.getAllByRole("heading", { level: 3 });
    const botonesEliminar = screen.getAllByText(/eliminar/i);

    expect(botonesEliminar.length).toBe(tarjetas.length);
  });
});
