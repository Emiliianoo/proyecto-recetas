import { useState } from "react";
import "./RecipeViewModal.css";
import type { Receta, ImagenReceta } from "../../types";
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
  onGuardarImagenes: (recetaId: string, imagenes: ImagenReceta[]) => void;
  onEliminarImagen: (recetaId: string, imagenId: string) => void;
}

export default function RecipeViewModal({
  receta,
  cerrar,
  onGuardarNota,
  onEliminarNota,
  onActualizarNota,
  onGuardarImagenes,
  onEliminarImagen,
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

  // Estado para modal de agregar imagen
  const [mostrarModalImagen, setMostrarModalImagen] = useState(false);
  const [archivosSeleccionados, setArchivosSeleccionados] =
    useState<FileList | null>(null);
  const [cargandoImagenes, setCargandoImagenes] = useState(false);

  // Estado para lightbox de imágenes expandidas
  const [mostrarLightbox, setMostrarLightbox] = useState(false);
  const [imagenActual, setImagenActual] = useState<ImagenReceta | null>(null);

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

  const manejarCargarImagenes = async () => {
    if (!archivosSeleccionados || archivosSeleccionados.length === 0) return;

    setCargandoImagenes(true);
    const nuevasImagenes: ImagenReceta[] = [];

    for (let i = 0; i < archivosSeleccionados.length; i++) {
      const file = archivosSeleccionados[i];
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          const url = e.target?.result as string;
          nuevasImagenes.push({
            id: crypto.randomUUID(),
            url,
            fecha: new Date().toISOString(),
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    onGuardarImagenes(receta.id, nuevasImagenes);
    setCargandoImagenes(false);
    setMostrarModalImagen(false);
    setArchivosSeleccionados(null);
  };

  return (
    <>
      <div className="view-overlay" onClick={cerrar}>
        <div className="view-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="view-title">{receta.nombre}</h2>
          <p className="view-subtitle">{receta.tipoCocina}</p>
          <div className="view-actions">
            <button
              className="btn-agregar-imagen"
              onClick={() => {
                setArchivosSeleccionados(null);
                setMostrarModalImagen(true);
              }}
            >
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

          {/* GALERÍA DE IMÁGENES */}
          {receta.imagenes && receta.imagenes.length > 0 && (
            <div className="view-section">
              <h3>Imágenes de progreso</h3>
              <div className="galeria-imagenes">
                {receta.imagenes.map((img) => (
                  <div
                    key={img.id}
                    className="galeria-item"
                    onClick={() => {
                      setImagenActual(img);
                      setMostrarLightbox(true);
                    }}
                  >
                    <img src={img.url} alt="Progreso" />
                    <small>
                      {new Date(img.fecha).toLocaleDateString("es-MX")}
                    </small>
                    <button
                      className="galeria-btn-eliminar"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("¿Deseas eliminar esta imagen?")) {
                          onEliminarImagen(receta.id, img.id);
                        }
                      }}
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

      <Modal
        mostrar={mostrarModalImagen}
        cerrar={() => setMostrarModalImagen(false)}
      >
        <div className="modal-imagen-contenido">
          <h3>Agregar imágenes</h3>
          <p className="nota-pequena">
            Selecciona una o varias imágenes para agregarlas a la receta.
          </p>
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
                  <li key={idx}>
                    {f.name} ({Math.round(f.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-imagen-botones">
            <button
              onClick={manejarCargarImagenes}
              disabled={
                !archivosSeleccionados ||
                archivosSeleccionados.length === 0 ||
                cargandoImagenes
              }
              className="btn-guardar-imagenes"
            >
              {cargandoImagenes ? "Cargando..." : "Guardar Imágenes"}
            </button>
            <button
              onClick={() => setMostrarModalImagen(false)}
              className="btn-cancelar-imagenes"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Lightbox para expandir imágenes */}
      {mostrarLightbox && imagenActual && (
        <div
          className="lightbox-overlay"
          onClick={() => {
            setMostrarLightbox(false);
            setImagenActual(null);
          }}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => {
                setMostrarLightbox(false);
                setImagenActual(null);
              }}
            >
              ✕
            </button>
            <img src={imagenActual.url} alt="Imagen expandida" />
            <p className="lightbox-fecha">
              {new Date(imagenActual.fecha).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
