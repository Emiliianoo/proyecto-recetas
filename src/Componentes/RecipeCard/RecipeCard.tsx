import type { Receta } from "../../types";
import "./RecipeCard.css";

interface Props {
  readonly receta: Receta;
  readonly onVer: (receta: Receta) => void;
}

export default function RecipeCard({ receta, onVer }: Props) {
  return (
    <div className="tarjeta">
      <h3>{receta.nombre}</h3>
      <p className="tipo">Tipo de cocina: {receta.tipoCocina}</p>

      <button className="btn-ver" onClick={() => onVer(receta)}>
        Ver
      </button>
    </div>
  );
}
