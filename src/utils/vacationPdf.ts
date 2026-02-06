import { InputValueType } from "../context/VacationContext";
import { changeTwoDay } from "./chageTwoDay";
import { getDateDiff } from "./getDateDiff";
import { translateTrackInfo } from "./translateText";
import { buildPdfFileName } from "./sheetRow";

const now = new Date();
const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
const koreaTimeDiff = 32400000;

export const buildVacationPdfProps = (
  value: InputValueType,
  overrideSignUrl?: string
) => {
  const {
    name,
    birth: birthDay,
    flag,
    reason,
    track,
    duringFrom,
    duringTo,
    signUrl,
    writedAt: strWritedAt,
  } = value;

  const df = new Date(duringFrom ?? "");
  const dt = new Date(duringTo ?? "");
  const bd = new Date(birthDay ?? "");
  const wa = new Date(strWritedAt ?? utc + koreaTimeDiff);

  const during = `${df.getFullYear()}.${changeTwoDay(
    df.getMonth() + 1
  )}.${changeTwoDay(df.getDate())} ~ ${dt.getFullYear()}.${changeTwoDay(
    dt.getMonth() + 1
  )}.${changeTwoDay(dt.getDate())}(${Math.floor(
    getDateDiff({
      duringFrom: df,
      duringTo: dt,
    })
  )}일)`;
  const birth = `${changeTwoDay(bd.getFullYear() % 100)}.${changeTwoDay(
    bd.getMonth() + 1
  )}.${changeTwoDay(bd.getDate())}`;
  const writedAt = `${wa.getFullYear()}년   ${
    wa.getMonth() + 1
  }월   ${wa.getDate()}일`;

  const { track: translatedTrack, flag: translatedFlag } = translateTrackInfo(
    track,
    flag
  );

  const downloadName = buildPdfFileName({
    duringFrom,
    track,
    flag,
    name,
  });

  return {
    name,
    birth,
    track: translatedTrack,
    flag: translatedFlag,
    during,
    reason,
    signUrl: overrideSignUrl ?? signUrl,
    writedAt,
    downloadName,
  };
};
