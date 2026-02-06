import { ComponentType } from "react";
import { ModalProps } from "../components/Modal/Modal";

export const withModalContainer = (
  WrappedComponent: ComponentType<ModalProps>
) => {
  return (rest: ModalProps) => {
    return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-screen bg-black/55">
        <WrappedComponent {...rest} />
      </div>
    );
  };
};
