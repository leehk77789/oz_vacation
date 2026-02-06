import { useEffect, useRef } from "react";

import { useModal } from "../../context";
import { CustomButton } from "../_common";
import { withModalContainer } from "../../HOCs";

export interface ModalProps {
  type: "alert" | "confirm";
  modalKey: string;
  title?: string;
  titleClassName?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmMessage?: string;
  cancelMessage?: string;
  modalRef?: React.RefObject<HTMLElement>;
}

const AlertModal = ({
  title,
  content,
  confirmMessage,
  onConfirm,
  modalRef,
  titleClassName,
}: Omit<ModalProps, "type" | "onCancel" | "cancelMessage" | "modalKey">) => {
  return (
    <article
      ref={modalRef}
      className="p-6 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.25)] bg-[#f6f7f9] text-[#1a1f24] flex flex-col justify-center items-center min-w-[18rem]"
    >
      <h1
        className={
          titleClassName ??
          "font-semibold text-lg border-b border-black/10 w-full text-center pb-2"
        }
      >
        {title}
      </h1>
      <p className="py-6 px-4 text-center">{content}</p>
      <CustomButton mode="default" onClick={onConfirm}>
        {confirmMessage ?? "확인"}
      </CustomButton>
    </article>
  );
};
const ConfirmModal = ({
  title,
  content,
  onConfirm,
  onCancel,
  confirmMessage,
  cancelMessage,
  modalRef,
}: Omit<ModalProps, "type" | "modalKey">) => {
  return (
    <article
      className="p-6 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.25)] bg-[#f6f7f9] text-[#1a1f24] flex flex-col justify-center items-center min-w-[18rem]"
      ref={modalRef}
    >
      <h1 className="font-semibold text-lg border-b border-black/10 w-full text-center pb-2">
        {title}
      </h1>
      <p className="py-6 px-4 text-center">{content}</p>
      <div className="flex items-center justify-center gap-3">
        <CustomButton mode="outline" onClick={onCancel}>
          {cancelMessage ?? "취소"}
        </CustomButton>
        <CustomButton mode="default" onClick={onConfirm}>
          {confirmMessage ?? "확인"}
        </CustomButton>
      </div>
    </article>
  );
};

const ModalContent = ({ type, modalKey, ...modalContents }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { openList, closeModal } = useModal();
  useEffect(() => {
    const modalCloseClick = (event: MouseEvent) => {
      const ref = modalRef.current;
      if (ref && openList.some((v) => v.modalKey === modalKey)) {
        if (!ref.contains(event.target as Node)) {
          closeModal(modalKey);
        }
      }
    };
    document.addEventListener("mousedown", modalCloseClick);
    return () => {
      document.removeEventListener("mousedown", modalCloseClick);
    };
  }, [closeModal, modalKey, openList]);

  switch (type) {
    case "confirm":
      return (
        <ConfirmModal
          title={modalContents.title}
          content={modalContents.content}
          confirmMessage={modalContents.confirmMessage}
          onConfirm={modalContents.onConfirm}
          cancelMessage={modalContents.cancelMessage}
          onCancel={modalContents.onCancel}
          modalRef={modalRef}
        />
      );
    default:
      return (
        <AlertModal
          title={modalContents.title}
          content={modalContents.content}
          confirmMessage={modalContents.confirmMessage}
          onConfirm={modalContents.onConfirm}
          modalRef={modalRef}
        />
      );
  }
};

const Modal = withModalContainer(ModalContent);

export default Modal;
