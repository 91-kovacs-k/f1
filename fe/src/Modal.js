import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, onClick }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.className = "innerModal";
    elRef.current.addEventListener("click", (event) => {
      if (event.currentTarget !== event.target) return;
      onClick();
    });
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    modalRoot.appendChild(elRef.current);

    return () => {
      modalRoot.removeChild(elRef.current);
    };
  }, []);

  return createPortal(
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div>{children}</div>
    </div>,
    elRef.current
  );
};

export default Modal;
