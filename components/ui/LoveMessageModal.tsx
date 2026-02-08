type LoveMessageModalProps = {
  message: string;
  onClose: () => void;
};

export function LoveMessageModal({ message, onClose }: LoveMessageModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p className="modal-kicker">Mensaje para ti 💌</p>
        <h3>Lo lograste ❤️</h3>
        <p>{message}</p>
        <button type="button" onClick={onClose}>
          Seguir jugando 🎮
        </button>
      </div>
    </div>
  );
}
