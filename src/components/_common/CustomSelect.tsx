import { ComponentPropsWithoutRef } from "react";

import { useVacation } from "../../context";
import { withErrorMessageSelect, withLabelSelect } from "../../HOCs";

const TRACKS = [
  {
    id: "default",
    value: "------ 트랙 선택 ------",
  },
  {
    id: "FE",
    value: "초격차 캠프 프론트엔드 코스",
  },
  { id: "BE", value: "초격차 캠프 백엔드 코스" },
  { id: "IH", value: "1인 창업가 개발부트캠프" },
  { id: "GM", value: "AI를 활용한 차세대 스마트 게임 개발자 양성과정" },
  {
    id: "AH",
    value:
      "헬스케어 데이터 기반 인공지능 디지털 의료 웹 서비스 개발자 양성과정",
  },
];

export interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  htmlFor: string;
}

export const Select = ({ htmlFor, ...rest }: SelectProps) => {
  const { track, handleChangeInput } = useVacation();
  return (
    <select
      defaultValue={track}
      onChange={handleChangeInput}
      className="w-full px-4 py-2 text-center text-[color:var(--text)] transition-all duration-200 bg-[color:var(--field)] border border-[color:var(--stroke)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/35 focus:border-[color:var(--accent)]/50"
      name={htmlFor}
      id={htmlFor}
      {...rest}
    >
      {TRACKS.map((track) => (
        <option key={track.id} id={track.value}>
          {track.value}
        </option>
      ))}
    </select>
  );
};

export const CustomSelect = withLabelSelect(withErrorMessageSelect(Select));
