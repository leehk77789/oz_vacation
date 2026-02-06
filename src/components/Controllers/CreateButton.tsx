import { ComponentPropsWithoutRef } from "react";
import { CustomButton } from "../_common";

interface CreateButtonProps extends ComponentPropsWithoutRef<"button"> {}

const CreateButton = ({ className = "", ...rest }: CreateButtonProps) => {
  return (
    <CustomButton
      mode="default"
      className={`max-w-sm ${className}`.trim()}
      {...rest}
    >
      휴가 신청하기
    </CustomButton>
  );
};

export default CreateButton;
