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

  // Helper para actualizar recetas en ambos estados (recetas y recetaSeleccionada)
  const actualizarReceta = (
    recetaId: string,
    transformar: (receta: Receta) => Receta
  ) => {
    setRecetas((prev) =>
      prev.map((r) => (r.id === recetaId ? transformar(r) : r))
    );

    setRecetaSeleccionada((prev) =>
      prev && prev.id === recetaId ? transformar(prev) : prev
    );
  };

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

    actualizarReceta(recetaId, (r) => ({
      ...r,
      notas: [...(r.notas ?? []), nuevaNota],
    }));
  };

  const manejarEliminarNota = (recetaId: string, notaId: string) => {
    actualizarReceta(recetaId, (r) => ({
      ...r,
      notas: (r.notas ?? []).filter((n) => n.id !== notaId),
    }));
  };

  const manejarActualizarNota = (
    recetaId: string,
    notaId: string,
    nuevoTexto: string
  ) => {
    const nuevaFecha = new Date().toISOString();

    actualizarReceta(recetaId, (r) => ({
      ...r,
      notas: (r.notas ?? []).map((n) =>
        n.id === notaId ? { ...n, texto: nuevoTexto, fecha: nuevaFecha } : n
      ),
    }));
  };

  const manejarGuardarImagenes = (
    recetaId: string,
    imagenes: ImagenReceta[]
  ) => {
    actualizarReceta(recetaId, (r) => ({
      ...r,
      imagenes: [...(r.imagenes ?? []), ...imagenes],
    }));
  };

  const manejarEliminarImagen = (recetaId: string, imagenId: string) => {
    actualizarReceta(recetaId, (r) => ({
      ...r,
      imagenes: (r.imagenes ?? []).filter((img) => img.id !== imagenId),
    }));
  };

  const manejarReemplazarImagen = (
    recetaId: string,
    imagenId: string,
    nuevaImagen: ImagenReceta
  ) => {
    actualizarReceta(recetaId, (r) => ({
      ...r,
      imagenes: (r.imagenes ?? []).map((img) =>
        img.id === imagenId
          ? { ...img, url: nuevaImagen.url, fecha: nuevaImagen.fecha }
          : img
      ),
    }));
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
        onEliminarImagen={manejarEliminarImagen}
        onReemplazarImagen={manejarReemplazarImagen}
      />
    </div>
  );
}

export default App;
