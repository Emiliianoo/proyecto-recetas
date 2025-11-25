import { useState } from "react";
import "./App.css";
import type { Receta } from "./types";
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
      />
    </div>
  );
}

export default App;
