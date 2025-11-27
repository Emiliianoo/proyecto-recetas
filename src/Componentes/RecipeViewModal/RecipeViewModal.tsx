import { useEffect, useRef, useState } from "react";
import "./RecipeViewModal.css";
import type { Receta } from "../../types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

interface Props {
  readonly receta: Receta | null;
  readonly cerrar: () => void;
  readonly onGuardarNota: (recetaId: string, texto: string) => void;
  readonly onEliminarNota: (recetaId: string, notaId: string) => void;
  readonly onActualizarNota: (
    recetaId: string,
    notaId: string,
    nuevoTexto: string
  ) => void;
}

export default function RecipeViewModal({
  receta,
  cerrar,
  onGuardarNota,
  onEliminarNota,
  onActualizarNota,
}: Props) {
  const [notaTexto, setNotaTexto] = useState("");
  const [errorNota, setErrorNota] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState<string | null>(null);

  const [estaEditando, setEstaEditando] = useState(false);
  const [notaEditandoId, setNotaEditandoId] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (receta) {
      // showModal() abre el dialog como modal nativo
      dialogRef.current?.showModal();
    } else {
      // si receta queda null, cerramos el dialog
      dialogRef.current?.close();
    }
  }, [receta]);

  if (!receta) return null;

  const manejarGuardarONActualizar = () => {
    setErrorNota("");
    setMensajeExito("");

    const limpia = notaTexto.trim();
    if (!limpia) {
      setErrorNota("La nota no puede estar vacía.");
      return;
    }

    if (estaEditando && notaEditandoId) {
      // actualizar nota existente
      onActualizarNota(receta.id, notaEditandoId, limpia);
      setMensajeExito("Nota actualizada correctamente.");
      setEstaEditando(false);
      setNotaEditandoId(null);
      setNotaTexto("");
    } else {
      // crear nueva nota
      onGuardarNota(receta.id, limpia);
      setMensajeExito("Nota agregada correctamente.");
      setNotaTexto("");
    }
  };

  const manejarEditarNota = (notaId: string, texto: string) => {
    setEstaEditando(true);
    setNotaEditandoId(notaId);
    setNotaTexto(texto);
    setErrorNota("");
    setMensajeExito("");
  };

  const manejarCancelarEdicion = () => {
    setEstaEditando(false);
    setNotaEditandoId(null);
    setNotaTexto("");
    setErrorNota("");
    setMensajeExito("");
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
    setEstaEditando(false);
    setNotaEditandoId(null);
    setNotaTexto("");
  };

  return (
    <dialog
      ref={dialogRef}
      className="view-dialog"
      onClose={cerrar}
      aria-labelledby="view-title"
    >
      <div className="view-content" onClick={(e) => e.stopPropagation()}>
        <h2 id="view-title" className="view-title">
          {receta.nombre}
        </h2>

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

        <div className="view-section">
          <h3>Notas</h3>

          {receta.notas?.length ? (
            <ul className="lista-notas">
              {receta.notas.map((nota) => (
                <li key={nota.id}>
                  <div className="nota-header">
                    <p>{nota.texto}</p>
                    <div className="nota-actions">
                      <button
                        className="btn-editar-nota"
                        onClick={() => manejarEditarNota(nota.id, nota.texto)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn-eliminar-nota"
                        onClick={() => abrirConfirmacion(nota.id)}
                      >
                        Eliminar
                      </button>
                    </div>
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
            <p>Aún no hay notas.</p>
          )}

          <textarea
            className="nota-textarea"
            placeholder={
              estaEditando
                ? "Edita el texto de la nota..."
                : "Escribe una nota sobre esta receta..."
            }
            value={notaTexto}
            onChange={(e) => setNotaTexto(e.target.value)}
          />

          {errorNota && <p className="error-nota">{errorNota}</p>}
          {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}

          <div className="nota-botones">
            <button
              className="btn-guardar-nota"
              onClick={manejarGuardarONActualizar}
            >
              {estaEditando ? "Actualizar nota" : "Guardar nota"}
            </button>

            {estaEditando && (
              <button
                className="btn-cancelar-edicion"
                onClick={manejarCancelarEdicion}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </div>

        <button className="view-close-btn" onClick={cerrar}>
          Cerrar
        </button>

        <ConfirmModal
          mostrar={mostrarConfirmacion}
          mensaje="¿Eliminar esta nota definitivamente?"
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setMostrarConfirmacion(false)}
        />
      </div>
    </dialog>
  );
}
