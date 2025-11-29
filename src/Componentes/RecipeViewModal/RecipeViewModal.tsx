import { useState, useRef, useEffect, useCallback } from "react";
import type { MouseEvent, ChangeEvent } from "react";
import "./RecipeViewModal.css";
import type { Receta, ImagenReceta } from "../../types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Modal from "../Modal/Modal";
import { validateImageFile } from "../../validation/imageValidation";

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
  readonly onGuardarImagenes: (
    recetaId: string,
    imagenes: ImagenReceta[]
  ) => void;
  readonly onEliminarImagen: (recetaId: string, imagenId: string) => void;
  readonly onReemplazarImagen: (
    recetaId: string,
    imagenId: string,
    nuevaImagen: ImagenReceta
  ) => void;
}

export default function RecipeViewModal({
  receta,
  cerrar,
  onGuardarNota,
  onEliminarNota,
  onActualizarNota,
  onGuardarImagenes,
  onEliminarImagen,
  onReemplazarImagen,
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
  const [errorImagenes, setErrorImagenes] = useState<string | null>(null);
  const [errorReemplazo, setErrorReemplazo] = useState<string | null>(null);
  const [imagenExito, setImagenExito] = useState<string | null>(null);

  // Estado para lightbox de imágenes expandidas
  const [mostrarLightbox, setMostrarLightbox] = useState(false);
  const [imagenActual, setImagenActual] = useState<ImagenReceta | null>(null);
  const [imagenAReemplazar, setImagenAReemplazar] = useState<string | null>(
    null
  );
  const reemplazarInputRef = useRef<HTMLInputElement | null>(null);
  const viewDialogRef = useRef<HTMLDialogElement | null>(null);
  const lightboxDialogRef = useRef<HTMLDialogElement | null>(null);

  const cerrarLightbox = useCallback(() => {
    setMostrarLightbox(false);
    setImagenActual(null);
  }, []);

  useEffect(() => {
    // Focus the main view dialog when component mounts so keyboard handlers are on an interactive element
    if (viewDialogRef.current) {
      try {
        viewDialogRef.current.focus();
      } catch {
        /* ignore focus errors */
      }
    }
  }, []);

  useEffect(() => {
    // When lightbox opens, move focus into it
    if (mostrarLightbox && lightboxDialogRef.current) {
      try {
        lightboxDialogRef.current.focus();
      } catch {
        /* ignore focus errors */
      }
    }
  }, [mostrarLightbox]);

  // Add global handlers while lightbox is open: Escape key and outside clicks
  useEffect(() => {
    if (!mostrarLightbox) return;

    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") cerrarLightbox();
    };

    const handleDocClick = (ev: globalThis.MouseEvent) => {
      const dialog = lightboxDialogRef.current;
      if (!dialog) return;
      const target = ev.target as Node | null;
      if (target && !dialog.contains(target)) {
        cerrarLightbox();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("click", handleDocClick);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("click", handleDocClick);
    };
  }, [mostrarLightbox, cerrarLightbox]);

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
    if (!archivosSeleccionados?.length) return;

    for (const f of archivosSeleccionados) {
      const validation = validateImageFile(f);
      if (!validation.ok) {
        setErrorImagenes(`${f.name}: ${validation.reason}`);
        return;
      }
    }

    setErrorImagenes(null);
    setCargandoImagenes(true);
    const nuevasImagenes: ImagenReceta[] = [];

    for (const file of archivosSeleccionados) {
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
    mostrarExito("Imágenes subidas correctamente.");
    setMostrarModalImagen(false);
    setArchivosSeleccionados(null);
  };

  const mostrarExito = (mensaje: string) => {
    setImagenExito(mensaje);
    setTimeout(() => setImagenExito(null), 3000);
  };

  return (
    <>
      <div className="view-overlay">
        <dialog ref={viewDialogRef} className="view-content" open>
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
                {receta.imagenes?.map((img) => (
                  <button
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
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        if (
                          globalThis.confirm("¿Deseas eliminar esta imagen?")
                        ) {
                          onEliminarImagen(receta.id, img.id);
                        }
                      }}
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>
                    <button
                      className="galeria-btn-reemplazar"
                      onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setImagenAReemplazar(img.id);
                        reemplazarInputRef.current?.click();
                      }}
                      title="Reemplazar imagen"
                    >
                      ↻
                    </button>
                  </button>
                ))}
              </div>
              {errorReemplazo && (
                <p className="error-imagenes">{errorReemplazo}</p>
              )}
              {imagenExito && <p className="success-imagenes">{imagenExito}</p>}
            </div>
          )}

          <button className="view-close-btn" onClick={cerrar}>
            Cerrar
          </button>
        </dialog>
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (!files?.length) {
                setArchivosSeleccionados(null);
                return;
              }

              // validar cada archivo con la función centralizada
              for (const f of files) {
                const res = validateImageFile(f);
                if (!res.ok) {
                  setErrorImagenes(`${f.name}: ${res.reason}`);
                  setArchivosSeleccionados(null);
                  return;
                }
              }

              setErrorImagenes(null);
              setArchivosSeleccionados(files);
            }}
          />

          {errorImagenes && <p className="error-imagenes">{errorImagenes}</p>}

          {archivosSeleccionados?.length && (
            <div className="lista-archivos">
              <p>Archivos seleccionados:</p>
              <ul>
                {Array.from(archivosSeleccionados).map((f) => (
                  <li key={f.name}>
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
          {imagenExito && <p className="success-imagenes">{imagenExito}</p>}
        </div>
      </Modal>

      {/* Lightbox para expandir imágenes */}
      {mostrarLightbox && imagenActual && (
        <div className="lightbox-overlay">
          <dialog
            ref={lightboxDialogRef}
            className="lightbox-content"
            open
            aria-modal="true"
          >
            <button className="lightbox-close" onClick={cerrarLightbox}>
              ✕
            </button>
            <img src={imagenActual.url} alt="Imagen expandida" />
            <p className="lightbox-fecha">
              {new Date(imagenActual.fecha).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </dialog>
        </div>
      )}

      {/* hidden input para reemplazar imagen */}
      <input
        ref={reemplazarInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const files = e.target.files;
          if (!files || files.length === 0 || !imagenAReemplazar) return;

          const file = files[0];

          // validar archivo antes de leer
          const resultado = validateImageFile(file);
          if (!resultado.ok) {
            setErrorReemplazo(resultado.reason || "Error desconocido");
            // limpiar input
            if (reemplazarInputRef.current)
              reemplazarInputRef.current.value = "";
            return;
          }

          setErrorReemplazo(null);

          const reader = new FileReader();
          reader.onload = (ev) => {
            const url = ev.target?.result as string;
            const nuevaImagen: ImagenReceta = {
              id: imagenAReemplazar,
              url,
              fecha: new Date().toISOString(),
            };

            onReemplazarImagen(receta.id, imagenAReemplazar, nuevaImagen);
            setImagenAReemplazar(null);
            mostrarExito("Imagen reemplazada correctamente.");
            // limpiar input
            if (reemplazarInputRef.current)
              reemplazarInputRef.current.value = "";
          };
          reader.readAsDataURL(file);
        }}
      />
    </>
  );
}
