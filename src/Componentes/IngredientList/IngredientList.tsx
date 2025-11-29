import type { Ingrediente } from "../../types";
import "./IngredientList.css";

interface Props {
  readonly ingredientes: Ingrediente[];
  readonly eliminarIngrediente: (id: string) => void;
}

export default function IngredientList({
  ingredientes,
  eliminarIngrediente,
}: Props) {
  return (
    <ul className="lista">
      {ingredientes.map((ing) => (
        <li key={ing.id}>
          {ing.nombre}
          <button
            className="btn-eliminar"
            onClick={() => eliminarIngrediente(ing.id)}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
