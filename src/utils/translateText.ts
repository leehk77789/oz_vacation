import { InputValueType } from "../context/VacationContext";

export const translateTrack = (track: InputValueType["track"]) => {
  switch (track) {
    case "초격차 캠프 프론트엔드 코스":
      return track;
    case "초격차 캠프 백엔드 코스":
      return track;
    case "1인 창업가 개발부트캠프":
      return "IT스타트업 실무형 풀스택 웹 개발 부트캠프 (React + Node.js)";
    default:
      return track;
  }
};

export const translateTrackInfo = (
  track: InputValueType["track"],
  flag: InputValueType["flag"]
) => {
  if (track === "초격차 캠프 프론트엔드 코스") {
    if (Number(flag) >= 15) {
      return { track, flag: (Number(flag) + 2).toString() };
    }
    if (Number(flag) >= 9) {
      return { track, flag: (Number(flag) + 1).toString() };
    }
    return { track, flag };
  }
  if (track === "1인 창업가 개발부트캠프") {
    if (Number(flag) < 3) {
      return {
        track: "IT스타트업 실무형 풀스택 웹 개발 부트캠프 (React + Node.js)",
        flag: (Number(flag) + 1).toString(),
      };
    }
    if (Number(flag) === 3) {
      return { track: "초격차 캠프 프론트엔드 코스", flag: "16" };
    }
    return { track, flag };
  }

  return { track, flag };
};

export const useTranslateText = () => {
  return { translateTrackInfo, translateTrack };
};
