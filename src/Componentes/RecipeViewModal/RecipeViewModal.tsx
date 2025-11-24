// RecipeViewModal.tsx
import { useState } from "react";
import type { Receta } from "../../types";
import "./RecipeViewModal.css";

interface Props {
  receta: Receta | null;
  cerrar: () => void;
  onGuardarNota: (recetaId: string, texto: string) => void;
}

export default function RecipeViewModal({
  receta,
  cerrar,
  onGuardarNota,
}: Props) {
  const [notaTexto, setNotaTexto] = useState("");
  const [errorNota, setErrorNota] = useState("");

  if (!receta) return null;

  const manejarGuardarNota = () => {
    const limpia = notaTexto.trim();

    if (!limpia) {
      setErrorNota("La nota no puede estar vacía.");
      return;
    }

    // Mandamos la nota al padre para que la guarde en el estado global
    onGuardarNota(receta.id, limpia);

    // Limpiamos estados locales
    setNotaTexto("");
    setErrorNota("");
  };

  return (
    <div className="view-overlay" onClick={cerrar}>
      <div className="view-content" onClick={(e) => e.stopPropagation()}>
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

        {/* SECCIÓN DE NOTAS */}
        <div className="view-section">
          <h3>Notas</h3>

          {/* Mostrar notas ya guardadas */}
          {receta.notas && receta.notas.length > 0 && (
            <ul className="lista-notas">
              {receta.notas.map((nota) => (
                <li key={nota.id}>
                  <p>{nota.texto}</p>
                  <small>
                    {new Date(nota.fecha).toLocaleString("es-MX", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </small>
                </li>
              ))}
            </ul>
          )}

          {/* Campo para nueva nota */}
          <textarea
            className="nota-textarea"
            placeholder="Escribe una nota sobre esta receta..."
            value={notaTexto}
            onChange={(e) => setNotaTexto(e.target.value)}
          />

          {errorNota && <p className="error-nota">{errorNota}</p>}

          <button className="btn-guardar-nota" onClick={manejarGuardarNota}>
            Guardar nota
          </button>
        </div>

        <button className="view-close-btn" onClick={cerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
