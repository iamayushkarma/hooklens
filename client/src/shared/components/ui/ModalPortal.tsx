import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1.5px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-bg-card border border-border-default p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
export default Modal;
