import { useEffect, useRef, FunctionComponent, MutableRefObject } from "react";
import { createPortal } from "react-dom";

interface IProps {
  children: React.ReactNode;
  onClick: () => void;
}

const Modal: FunctionComponent<IProps> = ({ children, onClick }) => {
  const elRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.className = "innerModal";
    elRef.current.addEventListener("click", (event) => {
      if (event.currentTarget !== event.target) {
        return;
      }
      onClick();
    });
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    if (!modalRoot || !elRef.current) {
      return;
    }
    modalRoot.appendChild(elRef.current);

    return () => {
      if (elRef.current) {
        modalRoot.removeChild(elRef.current);
      }
    };
  }, []);

  return createPortal(
    <div>
      <div>{children}</div>
    </div>,
    elRef.current
  );
};

export default Modal;
