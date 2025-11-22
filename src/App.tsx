import { useState } from "react";
import "./App.css";
import { Receta } from "./types";
import RecipeList from "./components/RecipeList/RecipeList";
import Modal from "./components/Modal/Modal";
import RecipeForm from "./components/RecipeForm/RecipeForm";

function App() {
  // Estado global donde se guardan TODAS las recetas
  const [recetas, setRecetas] = useState<Receta[]>([]);

  // Controla si el modal (formulario) está visible
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para agregar una nueva receta al estado global
  const agregarReceta = (nuevaReceta: Receta) => {
    setRecetas((prev) => [...prev, nuevaReceta]);
    setMostrarModal(false);
  };

  return (
    <div className="contenedor-app">
      {/* Título principal */}
      <h1 className="titulo-principal">Mis Recetas</h1>

      {/* Botón para abrir el modal */}
      <button className="btn-agregar" onClick={() => setMostrarModal(true)}>
        Agregar Receta
      </button>

      {/* Lista principal de recetas */}
      <RecipeList recetas={recetas} />

      {/* Modal propio */}
      <Modal mostrar={mostrarModal} cerrar={() => setMostrarModal(false)}>
        <RecipeForm agregarReceta={agregarReceta} />
      </Modal>
    </div>
  );
}

export default App;
