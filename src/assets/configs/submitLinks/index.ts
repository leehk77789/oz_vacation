import { InputValueType } from "../../../context";

type SubmitLinkType = Record<InputValueType["track"], string>;

const ENV = import.meta.env as ImportMetaEnv;

export const SUBMIT_LINKS: SubmitLinkType = {
  "------ 트랙 선택 ------": "",
  "초격차 캠프 프론트엔드 코스":
    ENV.REACT_APP_TEACHING_TEAM_DEFAULT_SUBMIT_LINK ?? "",
  "초격차 캠프 백엔드 코스":
    ENV.REACT_APP_TEACHING_TEAM_DEFAULT_SUBMIT_LINK ?? "",
  "1인 창업가 개발부트캠프": ENV.REACT_APP_TEACHING_5TEAM_SUBMIT_LINK ?? "",
  "AI를 활용한 차세대 스마트 게임 개발자 양성과정":
    ENV.REACT_APP_GAME_DEVELOPER_SUBMIT_LINK ?? "",
  "헬스케어 데이터 기반 인공지능 디지털 의료 웹 서비스 개발자 양성과정":
    ENV.REACT_APP_AH_TRACK_SUBMIT_LINK ?? "",
};
