import { useState } from "react";
import type { Receta, Ingrediente, Instruccion } from "../../types";
import "./RecipeForm.css";
import IngredientList from "../IngredientList/IngredientList";

interface Props {
  agregarReceta: (receta: Receta) => void;
}

export default function RecipeForm({ agregarReceta }: Props) {
  // Campos principales
  const [nombre, setNombre] = useState("");
  const [tipoCocina, setTipoCocina] = useState("");

  // Listas dinámicas
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [listaInstrucciones, setListaInstrucciones] = useState<Instruccion[]>(
    []
  );

  // Inputs individuales
  const [nuevoIngrediente, setNuevoIngrediente] = useState("");
  const [nuevaInstruccion, setNuevaInstruccion] = useState("");

  // Mensaje de validación
  const [error, setError] = useState("");

  const agregarIngredienteALista = () => {
    if (nuevoIngrediente.trim() === "") return;

    setIngredientes([
      ...ingredientes,
      { id: crypto.randomUUID(), nombre: nuevoIngrediente },
    ]);

    setNuevoIngrediente("");
  };

  const eliminarIngrediente = (id: string) => {
    setIngredientes(ingredientes.filter((i) => i.id !== id));
  };

  const agregarInstruccionALista = () => {
    if (nuevaInstruccion.trim() === "") return;

    setListaInstrucciones([
      ...listaInstrucciones,
      { id: crypto.randomUUID(), texto: nuevaInstruccion },
    ]);

    setNuevaInstruccion("");
  };

  const eliminarInstruccion = (id: string) => {
    setListaInstrucciones(listaInstrucciones.filter((i) => i.id !== id));
  };

  const guardarReceta = () => {
    if (
      !nombre ||
      !tipoCocina ||
      ingredientes.length === 0 ||
      listaInstrucciones.length === 0
    ) {
      setError(
        "Debes completar todos los campos y agregar al menos un ingrediente e instrucción."
      );
      return;
    }

    const nuevaReceta: Receta = {
      id: crypto.randomUUID(),
      nombre,
      tipoCocina,
      ingredientes,
      instrucciones: listaInstrucciones,
    };

    agregarReceta(nuevaReceta);
  };

  return (
    <div className="formulario">
      <h2>Nueva Receta</h2>

      {error && <p className="error">{error}</p>}

      {/* Nombre */}
      <label>Nombre de la receta</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* Tipo de cocina */}
      <label>Tipo de cocina</label>
      <input
        type="text"
        value={tipoCocina}
        onChange={(e) => setTipoCocina(e.target.value)}
      />

      {/* Ingredientes */}
      <label>Ingredientes</label>
      <div className="fila-agregar">
        <input
          type="text"
          value={nuevoIngrediente}
          onChange={(e) => setNuevoIngrediente(e.target.value)}
        />
        <button className="btn-add" onClick={agregarIngredienteALista}>
          Agregar
        </button>
      </div>

      <IngredientList
        ingredientes={ingredientes}
        eliminarIngrediente={eliminarIngrediente}
      />

      {/* Instrucciones */}
      <label>Instrucciones</label>
      <div className="fila-agregar">
        <input
          type="text"
          value={nuevaInstruccion}
          onChange={(e) => setNuevaInstruccion(e.target.value)}
        />
        <button className="btn-add" onClick={agregarInstruccionALista}>
          Agregar
        </button>
      </div>

      <ul className="lista">
        {listaInstrucciones.map((i) => (
          <li key={i.id}>
            {i.texto}
            <button
              className="btn-eliminar"
              onClick={() => eliminarInstruccion(i.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <button className="btn-guardar" onClick={guardarReceta}>
        Guardar Receta
      </button>
    </div>
  );
}
