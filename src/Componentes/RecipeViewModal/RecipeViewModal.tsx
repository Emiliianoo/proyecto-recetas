import { useState } from "react";
import "./RecipeViewModal.css";
import type { Receta } from "../../types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

interface Props {
  receta: Receta | null;
  cerrar: () => void;
  onGuardarNota: (recetaId: string, texto: string) => void;
  onEliminarNota: (recetaId: string, notaId: string) => void;
}

export default function RecipeViewModal({
  receta,
  cerrar,
  onGuardarNota,
  onEliminarNota,
}: Props) {
  const [notaTexto, setNotaTexto] = useState("");
  const [errorNota, setErrorNota] = useState("");

  // 🔥 Nuevo estado para el modal de confirmación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState<string | null>(null);

  if (!receta) return null;

  const manejarGuardarNota = () => {
    const limpia = notaTexto.trim();
    if (!limpia) {
      setErrorNota("La nota no puede estar vacía.");
      return;
    }
    onGuardarNota(receta.id, limpia);
    setNotaTexto("");
    setErrorNota("");
  };

  const abrirConfirmacion = (notaId: string) => {
    setNotaAEliminar(notaId);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = () => {
    if (notaAEliminar) {
      onEliminarNota(receta.id, notaAEliminar);
    }
    setMostrarConfirmacion(false);
    setNotaAEliminar(null);
  };

  return (
    <>
      {/* Modal principal */}
      <div className="view-overlay" onClick={cerrar}>
        <div className="view-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="view-title">{receta.nombre}</h2>
          <p className="view-subtitle">{receta.tipoCocina}</p>

          {/* Ingredientes */}
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

          {/* Notas */}
          <div className="view-section">
            <h3>Notas</h3>

            {receta.notas && receta.notas.length ? (
              <ul className="lista-notas">
                {receta.notas.map((nota) => (
                  <li key={nota.id}>
                    <div className="nota-header">
                      <p>{nota.texto}</p>
                      <button
                        className="btn-eliminar-nota"
                        onClick={() => abrirConfirmacion(nota.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                    <small>
                      {new Date(nota.fecha).toLocaleString("es-MX", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="texto-sin-notas">
                Aún no hay notas para esta receta.
              </p>
            )}

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

      {/* Modal de confirmación */}
      <ConfirmModal
        mostrar={mostrarConfirmacion}
        mensaje="¿Eliminar esta nota definitivamente?"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setMostrarConfirmacion(false)}
      />
    </>
  );
}
