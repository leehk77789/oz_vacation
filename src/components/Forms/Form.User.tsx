import { useModal, useVacation } from "../../context";

import { dateFormatting } from "../../utils";
import { USER_FORM_CONFIGS } from "../../assets/configs";
import {
  CustomInput,
  CustomDatePicker,
  CustomSelect,
  Description,
  PageButtons,
  PageButtonsProps,
  Title,
} from "../_common";
import { useUserValidate } from "../../hooks/form/useUserValidate";

export const FormUser = ({
  prevAction,
  nextAction,
}: Pick<PageButtonsProps, "prevAction" | "nextAction">) => {
  const { handleChangeInput, ...value } = useVacation();
  const { userValidate, errorMessage: userErrorMessage } = useUserValidate();
  const { openModal, closeModal } = useModal();
  const handleNextAction = () => {
    const [isValid, invalidMessage] = userValidate(value);

    if (isValid) {
      if (nextAction) {
        nextAction();
      }
    } else {
      const userInValidKey = "userInValid";
      openModal({
        modalKey: userInValidKey,
        type: "alert",
        onConfirm: () => closeModal(userInValidKey),
        title: "⚠️ 오류 ⚠️",
        content: invalidMessage,
      });
    }
  };

  const INPUT_ELEMENTS: typeof USER_FORM_CONFIGS = USER_FORM_CONFIGS.map(
    (config) => ({
      ...config,
      value:
        config.htmlFor === "birth"
          ? dateFormatting(value.birth)
          : [value[config.htmlFor as keyof typeof value]].toString(),
      onChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleChangeInput<HTMLInputElement>(e);
      },
      errorMessage:
        userErrorMessage[config.htmlFor as keyof typeof userErrorMessage],
    })
  );
  return (
    <section className="form-card">
      <Title>수강생 정보 입력</Title>
      <Description>해당 정보는 휴가 신청서 작성 시에만 사용됩니다.</Description>
      <CustomSelect
        htmlFor="track"
        labelText="캠프명"
        errorMessage={userErrorMessage.track}
        isRequire={true}
      />
      {INPUT_ELEMENTS.map((el) => (
        el.type === "date" ? (
          <CustomDatePicker key={el.htmlFor} {...el} />
        ) : (
          <CustomInput key={el.htmlFor} {...el} />
        )
      ))}
      <PageButtons
        mode="both"
        prevAction={prevAction}
        nextAction={handleNextAction}
      />
    </section>
  );
};
