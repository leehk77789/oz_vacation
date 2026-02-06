import { lazy, Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import { CustomButton } from "../_common";
import { useModal } from "../../context";
const VacationPreview = lazy(() => import("../Vacation/Vacation.Preview"));

interface VacationPDFPreviewProps {
  handlePrevAction: () => void;
  href: string;
}
export const VacationPDFPreview = ({
  handlePrevAction,
  href,
}: VacationPDFPreviewProps) => {
  const { openModal, closeModal, openList } = useModal();
  const handleSubmitClick = () => {
    const modalKey = "submitDone";
    if (openList.some((modal) => modal.modalKey === modalKey)) return;
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
    openModal({
      modalKey,
      type: "alert",
      title: "완료",
      content: "휴가 신청이 완료되었습니다.",
      onConfirm: () => closeModal(modalKey),
    });
  };
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VacationPreview />
      <div>
        <CustomButton
          mode="custom"
          className="absolute bottom-4 left-4  bg-dark p-3 rounded-md shadow-md outline-white outline-1 outline hover:bg-gray-700"
          onClick={handlePrevAction}
        >
          뒤로가기
        </CustomButton>
        <CustomButton
          mode="default"
          className="absolute bottom-4 left-28  bg-purple-600 p-3 rounded-md shadow-md hover:bg-purple-800"
          onClick={handleSubmitClick}
        >
          제출하기
        </CustomButton>
      </div>
    </Suspense>
  );
};

export * from "./Vacation.Form";
export * from "./Vacation.Mobile";
export * from "./Vacation.Preview";
export * from "./Vacation.Style";
