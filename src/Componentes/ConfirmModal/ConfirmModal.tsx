import "./ConfirmModal.css";

interface Props {
  mostrar: boolean;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  mostrar,
  mensaje,
  onConfirmar,
  onCancelar,
}: Props) {
  if (!mostrar) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="confirm-mensaje">{mensaje}</p>

        <div className="confirm-botones">
          <button className="confirm-btn cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="confirm-btn eliminar" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
