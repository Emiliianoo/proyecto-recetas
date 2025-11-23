import type { Receta } from "../../types";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./RecipeList.css";

interface Props {
  recetas: Receta[];
  onVer: (receta: Receta) => void;
}

export default function RecipeList({ recetas, onVer }: Props) {
  if (recetas.length === 0)
    return <p className="texto-vacio">No hay recetas registradas.</p>;

  return (
    <div className="lista-recetas">
      {recetas.map((r) => (
        <RecipeCard key={r.id} receta={r} onVer={onVer} />
      ))}
    </div>
  );
}
