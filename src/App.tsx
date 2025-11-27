import { useState } from "react";
import "./App.css";
import type { Receta, NotaReceta } from "./types";
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
      prev?.id === recetaId
        ? { ...prev, notas: [...(prev.notas ?? []), nuevaNota] }
        : prev
    );
  };

  const quitarNotaDeReceta = (receta: Receta, notaId: string): Receta => {
    const notasActualizadas = (receta.notas ?? []).filter(
      (n) => n.id !== notaId
    );
    return { ...receta, notas: notasActualizadas };
  };

  const actualizarNotaDeReceta = (
    receta: Receta,
    notaId: string,
    nuevoTexto: string,
    nuevaFecha: string
  ): Receta => {
    const notasActualizadas = (receta.notas ?? []).map((n) =>
      n.id === notaId ? { ...n, texto: nuevoTexto, fecha: nuevaFecha } : n
    );
    return { ...receta, notas: notasActualizadas };
  };

  const manejarEliminarNota = (recetaId: string, notaId: string) => {
    setRecetas((prev) =>
      prev.map((r) => (r.id === recetaId ? quitarNotaDeReceta(r, notaId) : r))
    );

    setRecetaSeleccionada((prev) => {
      if (prev?.id !== recetaId) return prev;
      return quitarNotaDeReceta(prev, notaId);
    });
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
          ? actualizarNotaDeReceta(r, notaId, nuevoTexto, nuevaFecha)
          : r
      )
    );

    setRecetaSeleccionada((prev) => {
      if (prev?.id !== recetaId) return prev;
      return actualizarNotaDeReceta(prev, notaId, nuevoTexto, nuevaFecha);
    });
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
      />
    </div>
  );
}

export default App;
