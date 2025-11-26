import { useState } from "react";
import "./RecipeViewModal.css";
import type { Receta } from "../../types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Modal from "../Modal/Modal";

interface Props {
  receta: Receta | null;
  cerrar: () => void;
  onGuardarNota: (recetaId: string, texto: string) => void;
  onEliminarNota: (recetaId: string, notaId: string) => void;
  onActualizarNota: (
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

  // Estado para eliminar
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState<string | null>(null);

  // Estado para el modo edición
  const [estaEditando, setEstaEditando] = useState(false);
  const [notaEditandoId, setNotaEditandoId] = useState<string | null>(null);

  // Estado para modal de agregar imagen (UI-only)
  const [mostrarModalImagen, setMostrarModalImagen] = useState(false);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<FileList | null>(null);

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
    <>
      <div className="view-overlay" onClick={cerrar}>
        <div className="view-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="view-title">{receta.nombre}</h2>
          <p className="view-subtitle">{receta.tipoCocina}</p>
          <div className="view-actions">
            <button className="btn-agregar-imagen" onClick={() => { setArchivosSeleccionados(null); setMostrarModalImagen(true); }}>
              Agregar Imagen
            </button>
          </div>

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

            {receta.notas && receta.notas.length ? (
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
              <p className="texto-sin-notas">
                Aún no hay notas para esta receta.
              </p>
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
        </div>
      </div>

      <ConfirmModal
        mostrar={mostrarConfirmacion}
        mensaje="¿Eliminar esta nota definitivamente?"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setMostrarConfirmacion(false)}
      />

      <Modal mostrar={mostrarModalImagen} cerrar={() => setMostrarModalImagen(false)}>
        <div className="modal-imagen-contenido">
          <h3>Agregar imágenes (vista)</h3>
          <p className="nota-pequena">Por ahora solo se muestra el selector de archivos; las imágenes no se guardarán.</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setArchivosSeleccionados(e.target.files)}
          />

          {archivosSeleccionados && archivosSeleccionados.length > 0 && (
            <div className="lista-archivos">
              <p>Archivos seleccionados:</p>
              <ul>
                {Array.from(archivosSeleccionados).map((f, idx) => (
                  <li key={idx}>{f.name} ({Math.round(f.size / 1024)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button onClick={() => setMostrarModalImagen(false)}>Cerrar</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
