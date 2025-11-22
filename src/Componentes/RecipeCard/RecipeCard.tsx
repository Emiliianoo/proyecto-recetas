import type { Receta } from "../../types";
import "./RecipeCard.css";

interface Props {
  receta: Receta;
}

export default function RecipeCard({ receta }: Props) {
  return (
    <div className="tarjeta">
      <h3>{receta.nombre}</h3>
      <p>
        <strong>Tipo:</strong> {receta.tipoCocina}
      </p>

      <h4>Ingredientes</h4>
      <ul>
        {receta.ingredientes.map((i) => (
          <li key={i.id}>{i.nombre}</li>
        ))}
      </ul>

      <h4>Instrucciones</h4>
      <ol>
        {receta.instrucciones.map((i) => (
          <li key={i.id}>{i.texto}</li>
        ))}
      </ol>
    </div>
  );
}
