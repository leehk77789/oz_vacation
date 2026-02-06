import { InputValueType } from "../context/VacationContext";
import { changeTwoDay } from "./chageTwoDay";
import { dateFormatting } from "./dateFormat";
import { translateTrackInfo } from "./translateText";

type SheetInput = Pick<
  InputValueType,
  | "name"
  | "birth"
  | "track"
  | "flag"
  | "duringFrom"
  | "duringTo"
  | "reason"
  | "writedAt"
>;

type SheetRowValue = string | number | boolean | null;

const ISSUE_TYPE = "일정 불참 공유";
const ISSUE_REASON = "휴가(프로덕트 디자이너, 사업개발, AI리더 사용불가)";

const toKoreanDateTime = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const kst = new Date(utc + 9 * 60 * 60 * 1000);
  const year = kst.getFullYear();
  const month = kst.getMonth() + 1;
  const day = kst.getDate();
  const hours = kst.getHours();
  const ampm = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const pad = (num: number) => String(num).padStart(2, "0");
  const minute = pad(kst.getMinutes());
  const second = pad(kst.getSeconds());
  return `${year}. ${month}. ${day} ${ampm} ${hour12}:${minute}:${second}`;
};

export const buildPdfFileName = ({
  duringFrom,
  track,
  flag,
  name,
}: Pick<SheetInput, "duringFrom" | "track" | "flag" | "name">) => {
  const df = new Date(duringFrom ?? "");
  if (Number.isNaN(df.getTime())) {
    return `${name || "vacation"}.pdf`;
  }

  const year = df.getFullYear().toString();
  const month = changeTwoDay(df.getMonth() + 1);
  const day = df.getDate();
  const translated = translateTrackInfo(track, flag);
  const flagText = translated.flag ? `${translated.flag}기` : "";
  const safeTrack = (translated.track || "").replace(/\s+/g, " ").trim();
  return `${year}${month}${day}_${safeTrack}_${flagText}_${name}_휴가신청서.pdf`;
};

export const buildSheetRow = (value: SheetInput): SheetRowValue[] => {
  const sheetTrack =
    value.track === "1인 창업가 개발부트캠프" ? "1인 창업가" : value.track;
  const row: SheetRowValue[] = Array.from({ length: 30 }, () => "");
  row[0] = sheetTrack || ""; // 캠프 (원본)
  row[1] = value.flag || ""; // 기수 (원본)
  row[2] = value.name || ""; // 이름
  row[3] = ISSUE_TYPE; // 이슈 유형
  row[4] = ISSUE_REASON; // 일정 불참 사유
  row[6] = dateFormatting(value.duringFrom) || ""; // 일정 불참 시작일
  row[7] = dateFormatting(value.duringTo) || ""; // 일정 불참 종료일
  row[22] = ""; // 휴가신청서 제출 (Drive 다운로드 링크는 서버에서 채움)
  row[29] = toKoreanDateTime(new Date()); // Submitted At

  return row;
};
