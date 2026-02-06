/// <reference types="vite/client" />

interface ViteTypeOptions {
  // 아래 라인을 추가하면, ImportMetaEnv 타입을 엄격하게 설정해
  // 알 수 없는 키를 허용하지 않게 할 수 있습니다.
  strictImportEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_APP_TEACHING_5TEAM_SUBMIT_LINK: string;
  readonly VITE_APP_TEACHING_TEAM_DEFAULT_SUBMIT_LINK: string;
  readonly VITE_APP_AH_TRACK_SUBMIT_LINK: string;
  readonly VITE_APP_GAME_DEVELOPER_SUBMIT_LINK: string;
  readonly GA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
