import { twMerge } from "tailwind-merge";
import { Description, Title } from "../_common";

interface InfromationProps {
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const CLASSNAME = {
  hilight: "font-semibold text-[color:var(--accent)]",
  subLight: "text-[color:var(--muted)]",
};

export const Information = ({
  className,
  descriptionClassName,
  titleClassName,
}: InfromationProps) => {
  return (
    <div
      className={twMerge(
        "flex flex-col justify-center items-center max-w-[30rem] border border-[color:var(--stroke)] rounded-2xl py-4 px-4 gap-2 mx-2 bg-[color:var(--field)]",
        className
      )}
    >
      <Title className={twMerge("text-xl", titleClassName)}>
        알려드립니다
      </Title>
      <Description
        className={twMerge(
          "text-sm leading-relaxed pb-0 text-[color:var(--muted)] ",
          descriptionClassName
        )}
      >
        <span className={CLASSNAME.hilight}>휴가신청서 제작기</span>는 입력하신
        내용을 기반으로{" "}
        <span className={CLASSNAME.hilight}>
          HRD 시스템에 등록된 공식 명칭과 회차 정보로 자동 변환
        </span>
        됩니다.
        <br />
        <br />
        <span className={CLASSNAME.subLight}>
          현재 수강 중인 과정과 기수를 선택
        </span>
        해 주시면, 해당 정보를 바탕으로{" "}
        <span className={CLASSNAME.subLight}>휴가신청서가 자동으로 변환</span>
        되므로, 직접 작성하신 내용과 일부 다를 수 있더라도 착오 없으시기
        바랍니다.
      </Description>
    </div>
  );
};
