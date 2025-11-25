import "./Modal.css";

interface Props {
  mostrar: boolean;
  cerrar: () => void;
  children: React.ReactNode;
}

export default function Modal({ mostrar, cerrar, children }: Props) {
  if (!mostrar) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-contenedor">
        {/* Botón cerrar */}
        <button className="modal-cerrar" onClick={cerrar}>
          X
        </button>

        {children}
      </div>
    </div>
  );
}
