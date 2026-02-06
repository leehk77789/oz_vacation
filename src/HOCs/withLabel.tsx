import { ComponentType } from "react";
import { CustomTextAreaProps } from "../components/_common/CustomTextArea";
import {
  ErrorMessageComponentWithInput,
  ErrorMessageComponentWithSelect,
} from "./withErrorMessage";

export interface LabelComponentWithInput
  extends ErrorMessageComponentWithInput {
  labelText: string;
  htmlFor: string;
  isRequire?: boolean;
}
export interface LabelComponentWithSelect
  extends ErrorMessageComponentWithSelect {
  labelText: string;
  htmlFor: string;
  isRequire?: boolean;
}
export interface LabelComponentWithTextArea extends CustomTextAreaProps {
  labelText: string;
  htmlFor: string;
  isRequire?: boolean;
}

export const withLabelInput = (
  WrappedComponent: ComponentType<ErrorMessageComponentWithInput>
) => {
  return ({
    labelText,
    htmlFor,
    placeholder,
    isRequire = false,
    ...rest
  }: LabelComponentWithInput) => {
    return (
      <div className="w-full max-w-sm mx-auto">
        <label
          className="block text-md font-semibold text-[color:var(--text)] mb-1"
          htmlFor={htmlFor}
        >
          {labelText}
          {isRequire ? <span className="text-2xl text-red-500">∗</span> : ""}
        </label>
        {
          <WrappedComponent
            htmlFor={htmlFor}
            placeholder={placeholder}
            {...rest}
          />
        }
      </div>
    );
  };
};

export const withLabelSelect = (
  WrappedComponent: ComponentType<ErrorMessageComponentWithSelect>
) => {
  return ({
    labelText,
    htmlFor,
    isRequire,
    ...rest
  }: LabelComponentWithSelect) => {
    return (
      <div className="w-full max-w-sm mx-auto">
        <label
          className="block text-md font-semibold text-[color:var(--text)] mb-1"
          htmlFor={htmlFor}
        >
          {labelText}
          {isRequire ? <span className="text-2xl text-red-500">∗</span> : ""}
        </label>
        {<WrappedComponent htmlFor={htmlFor} {...rest} />}
      </div>
    );
  };
};
export const withLabelTextArea = (
  WrappedComponent: ComponentType<CustomTextAreaProps>
) => {
  return ({
    labelText,
    htmlFor,
    isRequire,
    ...rest
  }: LabelComponentWithTextArea) => {
    return (
      <div className="w-full max-w-sm mx-auto pb-[1.45rem]">
        <label
          className="block text-md font-semibold text-[color:var(--text)] mb-1"
          htmlFor={htmlFor}
        >
          {labelText}
          {isRequire ? <span className="text-2xl text-red-500">∗</span> : ""}
        </label>
        {<WrappedComponent htmlFor={htmlFor} {...rest} />}
      </div>
    );
  };
};
