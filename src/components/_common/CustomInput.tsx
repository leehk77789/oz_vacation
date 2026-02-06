import { ComponentPropsWithoutRef } from "react";
import { withErrorMessageInput, withLabelInput } from "../../HOCs";

export interface CustomInputProps extends ComponentPropsWithoutRef<"input"> {
  htmlFor: string;
}

const CInput = ({ htmlFor, ...rest }: CustomInputProps) => {
  return (
    <input
      className="w-full text-center px-4 py-2 rounded-xl border border-[color:var(--stroke)] bg-[color:var(--field)] text-[color:var(--text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/35 focus:border-[color:var(--accent)]/50 duration-200 placeholder:text-[color:var(--muted)]"
      id={htmlFor}
      {...rest}
    />
  );
};

export const CustomInput = withLabelInput(withErrorMessageInput(CInput));
