import { useState } from "react";
import "./App.css";
import type { Receta, NotaReceta, ImagenReceta } from "./types";
import RecipeList from "./Componentes/RecipeList/RecipeList";
import Modal from "./Componentes/Modal/Modal";
import RecipeForm from "./Componentes/RecipeForm/RecipeForm";
import RecipeViewModal from "./Componentes/RecipeViewModal/RecipeViewModal";

function App() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(
    null
  );

  const agregarReceta = (nuevaReceta: Receta) => {
    setRecetas((prev) => [...prev, nuevaReceta]);
    setMostrarModal(false);
  };

  const manejarGuardarNota = (recetaId: string, texto: string) => {
    const nuevaNota: NotaReceta = {
      id: crypto.randomUUID(),
      texto,
      fecha: new Date().toISOString(),
    };

    // 1) Actualizar la receta dentro del arreglo de recetas
    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaId
          ? {
              ...r,
              notas: [...(r.notas ?? []), nuevaNota],
            }
          : r
      )
    );

    // 2) Actualizar también la receta seleccionada (para que el modal se refresque)
    setRecetaSeleccionada((prev) =>
      prev && prev.id === recetaId
        ? { ...prev, notas: [...(prev.notas ?? []), nuevaNota] }
        : prev
    );
  };

  const manejarEliminarNota = (recetaId: string, notaId: string) => {
    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaId
          ? {
              ...r,
              notas: (r.notas ?? []).filter((n) => n.id !== notaId),
            }
          : r
      )
    );

    setRecetaSeleccionada((prev) =>
      prev && prev.id === recetaId
        ? {
            ...prev,
            notas: (prev.notas ?? []).filter((n) => n.id !== notaId),
          }
        : prev
    );
  };

  const manejarActualizarNota = (
    recetaId: string,
    notaId: string,
    nuevoTexto: string
  ) => {
    const nuevaFecha = new Date().toISOString();

    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaId
          ? {
              ...r,
              notas: (r.notas ?? []).map((n) =>
                n.id === notaId
                  ? { ...n, texto: nuevoTexto, fecha: nuevaFecha }
                  : n
              ),
            }
          : r
      )
    );

    setRecetaSeleccionada((prev) =>
      prev && prev.id === recetaId
        ? {
            ...prev,
            notas: (prev.notas ?? []).map((n) =>
              n.id === notaId
                ? { ...n, texto: nuevoTexto, fecha: nuevaFecha }
                : n
            ),
          }
        : prev
    );
  };

  const manejarGuardarImagenes = (
    recetaId: string,
    imagenes: ImagenReceta[]
  ) => {
    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaId
          ? {
              ...r,
              imagenes: [...(r.imagenes ?? []), ...imagenes],
            }
          : r
      )
    );

    setRecetaSeleccionada((prev) =>
      prev && prev.id === recetaId
        ? {
            ...prev,
            imagenes: [...(prev.imagenes ?? []), ...imagenes],
          }
        : prev
    );
  };

  return (
    <div className="contenedor-app">
      <div className="encabezado">
        <h1 className="titulo-principal">Mis Recetas</h1>

        <button className="btn-agregar" onClick={() => setMostrarModal(true)}>
          Agregar Receta
        </button>
      </div>

      <RecipeList recetas={recetas} onVer={setRecetaSeleccionada} />

      <Modal mostrar={mostrarModal} cerrar={() => setMostrarModal(false)}>
        <RecipeForm agregarReceta={agregarReceta} />
      </Modal>

      <RecipeViewModal
        receta={recetaSeleccionada}
        cerrar={() => setRecetaSeleccionada(null)}
        onGuardarNota={manejarGuardarNota}
        onEliminarNota={manejarEliminarNota}
        onActualizarNota={manejarActualizarNota}
        onGuardarImagenes={manejarGuardarImagenes}
      />
    </div>
  );
}

export default App;
