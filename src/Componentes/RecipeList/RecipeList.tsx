import "./RecipeList.css";
import type { Receta } from "../../types";

interface Props {
  recetas: Receta[];
  verReceta: (receta: Receta) => void;
}

export default function RecipeList({ recetas, verReceta }: Props) {
  return (
    <div className="lista-recetas">
      {recetas.map((receta, index) => (
        <div className="tarjeta-receta" key={index}>
          <h3>{receta.nombre}</h3>
          <p className="tipo">{receta.tipoCocina}</p>

          <button className="btn-ver" onClick={() => verReceta(receta)}>
            Ver
          </button>
        </div>
      ))}
    </div>
  );
}
