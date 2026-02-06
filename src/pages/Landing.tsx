import LogoImage from "../assets/images/oz.png";
import { CustomButton } from "../components/_common";
import { Information } from "../components/Landing";

// import GithubIcon from "../assets/icons/ic_github.svg";

interface LandingProps {
  handleStart: () => void;
}

const Landing = ({ handleStart }: LandingProps) => {
  return (
    <div className="app-shell">
      <div className="glass-panel flex flex-col items-center text-center gap-6">
        <div className="logo-badge">
          <img
            src={LogoImage}
            alt="로고"
            className="logo-image"
          />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            휴가 신청서 제작 폼
          </h1>
        </div>
        <Information className="mt-2" />
        <div className="flex items-center justify-between gap-3">
        {/* <CustomButton
          mode="link"
          href="https://github.com/L1m3Kun/oz_vacation_form"
          className=" w-8 h-8"
        >
          <img
            src={GithubIcon}
            alt="Github 바로가기"
            width={40}
            height={40}
            className="object-center w-full h-full bg-white rounded-full"
          />
        </CustomButton> */}
        <CustomButton
          href="https://github.com/L1m3Kun/oz_vacation_form/issues/2"
          mode="link"
          className="text-sm"
        >
          💬 여러분의 의견을 들려주세요.
        </CustomButton>
        </div>
        <CustomButton mode="default" onClick={handleStart}>
          시작하기
        </CustomButton>
      </div>
    </div>
  );
};

export default Landing;
