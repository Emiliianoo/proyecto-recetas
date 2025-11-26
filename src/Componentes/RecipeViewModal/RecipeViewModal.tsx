import "./RecipeViewModal.css";
import type { Receta } from "../../types";

interface Props {
  readonly receta: Receta | null;
  readonly cerrar: () => void;
}

export default function RecipeViewModal({ receta, cerrar }: Props) {
  if (!receta) return null;

  return (
    <div
      className="view-overlay"
      role="button"
      tabIndex={0}
      onClick={cerrar}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") cerrar();
      }}
    >
      <div
        className="view-content"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 className="view-title">{receta.nombre}</h2>
        <p className="view-subtitle">{receta.tipoCocina}</p>

        <div className="view-section">
          <h3>Ingredientes</h3>
          <ul>
            {receta.ingredientes.map((ing) => (
              <li key={ing.id}>{ing.nombre}</li>
            ))}
          </ul>
        </div>

        <div className="view-section">
          <h3>Instrucciones</h3>
          <ol>
            {receta.instrucciones.map((inst) => (
              <li key={inst.id}>{inst.texto}</li>
            ))}
          </ol>
        </div>

        <button className="view-close-btn" onClick={cerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
