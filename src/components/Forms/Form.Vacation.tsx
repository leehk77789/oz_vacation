import {
  CustomInput,
  Description,
  PageButtons,
  PageButtonsProps,
  Title,
} from "../_common";
import { useModal, useVacation } from "../../context";
import { changeTwoDay, dateFormatting, getDateDiff } from "../../utils";
import { INPUT_CONFIGS, VACATION_DATE_COFIGS } from "../../assets/configs";
import { useVacationValidate } from "../../hooks/form/useVacationValidate";

export const FormVacation = ({
  prevAction,
  nextAction,
}: Pick<PageButtonsProps, "prevAction" | "nextAction">) => {
  const { handleChangeInput, duringFrom, duringTo, writedAt, reason } =
    useVacation();
  const { errorMessage, vacationValidate } = useVacationValidate();

  const { openModal, closeModal } = useModal();

  const handleNextAction = () => {
    const [isValid, invalidMessage] = vacationValidate({
      duringFrom,
      duringTo,
    });
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

  const VACATION_DATE_ELEMENTS = VACATION_DATE_COFIGS.map((config) => ({
    ...config,
    value: { duringFrom, duringTo }[config.htmlFor].toString(),
    onChange(e: React.ChangeEvent<HTMLInputElement>) {
      handleChangeInput<HTMLInputElement>(e);
    },
    errorMessage: errorMessage[config.htmlFor],
  }));
  const INPUT_ELEMENTS = INPUT_CONFIGS.map((config) => ({
    ...config,
    value: config.htmlFor === "writedAt" ? dateFormatting(writedAt) : reason,
    onChange(e: React.ChangeEvent<HTMLInputElement>) {
      handleChangeInput<HTMLInputElement>(e);
    },
  }));

  return (
    <section className="h-screen w-full mx-auto flex flex-col justify-center items-center gap-2 px-2">
      <Title>휴가 정보 입력</Title>
      <Description>해당 정보는 휴가 신청서 작성 시에만 사용됩니다.</Description>
      <div className="w-full flex items-center justify-between gap-10 max-w-sm">
        {VACATION_DATE_ELEMENTS.map((el) => (
          <CustomInput key={el.htmlFor} {...el} />
        ))}
      </div>
      <p className="text-2xl font-semibold pb-2 text-green-600">{`${
        new Date(duringFrom).getFullYear() || "0000"
      }.${changeTwoDay(
        new Date(duringFrom).getMonth() + 1 || -1 + 1
      )}.${changeTwoDay(new Date(duringFrom).getDate() || 0)} ~ ${
        new Date(duringTo).getFullYear() || "0000"
      }.${changeTwoDay(new Date(duringTo).getMonth() + 1 || -1 + 1) || "00"}.${
        changeTwoDay(new Date(duringTo).getDate() || 0) || "00"
      }(${
        Math.floor(
          getDateDiff({
            duringFrom: new Date(duringFrom),
            duringTo: new Date(duringTo),
          })
        ) || "0"
      }일)`}</p>
      {INPUT_ELEMENTS.map((el) => (
        <CustomInput key={el.htmlFor} {...el} />
      ))}
      <PageButtons
        mode="both"
        prevAction={prevAction}
        nextAction={handleNextAction}
      />
    </section>
  );
};
