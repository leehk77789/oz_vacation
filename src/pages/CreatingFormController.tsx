import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";

import Landing from "./Landing";

import { useVacation } from "../context/VacationContext";

import { SignatureCanvasProps } from "../components/Canvas/SignatureCanvas";
import { useModal } from "../context/ModalContext";
import {
  LOCALSTORAGE_KEY,
  blobToBase64,
  buildSheetRow,
  buildVacationPdfProps,
  localStorageUtils,
} from "../utils";
import { FormUser } from "../components/Forms/Form.User";
import { FormVacation } from "../components/Forms/Form.Vacation";
import { FormSign } from "../components/Forms/Form.Sign";
import { useCanvasValidate } from "../hooks/form/useCanvasValidate";
import { appendVacationRow } from "../api/sheets";
import { VacationForm } from "../components/Vacation";

interface CurrentPageProps extends SignatureCanvasProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handleCreateVactionForm: () => void;
  isSubmitting: boolean;
  submitProgress: number;
}

const CurrentPage = ({
  currentPage,
  setCurrentPage,
  reff,
  handleCreateVactionForm,
  isSubmitting,
  submitProgress,
}: CurrentPageProps) => {
  const handlePrevAction = () => {
    setCurrentPage((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };
  const handleNextAction = () => {
    setCurrentPage((prev) => (prev + 1 < 4 ? prev + 1 : prev));
  };
  switch (currentPage) {
    case 1:
      return (
        <FormUser prevAction={handlePrevAction} nextAction={handleNextAction} />
      );
    case 2:
      return (
        <FormVacation
          prevAction={handlePrevAction}
          nextAction={handleNextAction}
        />
      );
    case 3:
      return (
        <FormSign
          reff={reff}
          handleCreateVactionForm={handleCreateVactionForm}
          isSubmitting={isSubmitting}
          submitProgress={submitProgress}
          prevAction={handlePrevAction}
        />
      );

    default:
      return <Landing handleStart={() => setCurrentPage(1)} />;
  }
};

const CreatingFormController = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { handleSignUrl, ...value } = useVacation();
  const { setItemToLocalStorage, removeFromLocalStorage } = localStorageUtils();
  const { canvasValidate } = useCanvasValidate();
  const { openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setSubmitProgress(0);
      setTargetProgress(0);
      return;
    }

    const tick = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= targetProgress) return prev;
        const gap = targetProgress - prev;
        const step = Math.max(0.5, gap * 0.15);
        const next = Math.min(targetProgress, prev + step);
        return Number(next.toFixed(1));
      });
    }, 120);

    return () => clearInterval(tick);
  }, [isSubmitting, targetProgress]);

  useEffect(() => {
    if (!isSubmitting) return;

    const auto = setInterval(() => {
      setTargetProgress((prev) => {
        const cap = 90;
        if (prev >= cap) return prev;
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(auto);
  }, [isSubmitting]);

  const createVacationForm = async () => {
    const canvasCurrent = canvasRef.current;
    if (isSubmitting) return;

    if (canvasCurrent) {
      const [isValid, errorText] = canvasValidate(canvasCurrent);
      if (isValid) {
        const url = canvasCurrent.toDataURL();
        const sheetRow = buildSheetRow(value);
        try {
          setIsSubmitting(true);
          setTargetProgress(8);
          const pdfProps = buildVacationPdfProps(value, url);
          setTargetProgress((prev) => Math.max(prev, 25));
          const pdfBlob = await pdf(<VacationForm {...pdfProps} />).toBlob();
          setTargetProgress((prev) => Math.max(prev, 55));
          const pdfBase64 = await blobToBase64(pdfBlob);
          setTargetProgress((prev) => Math.max(prev, 75));
          await appendVacationRow(sheetRow, {
            pdfBase64,
            fileName: pdfProps.downloadName,
          });
          setTargetProgress(100);

          const { birth, duringFrom, duringTo, flag, name, track } = value;
          const localSavedValue = {
            track,
            birth,
            duringFrom,
            duringTo,
            flag,
            name,
          };
          handleSignUrl(url);
          removeFromLocalStorage(LOCALSTORAGE_KEY.vacationData);
          setItemToLocalStorage(LOCALSTORAGE_KEY.vacationData, {
            ...localSavedValue,
            signUrl: url,
          });
          const fileUrl = URL.createObjectURL(pdfBlob);
          const aTag = document.createElement("a");
          aTag.href = fileUrl;
          aTag.download = pdfProps.downloadName;
          document.body.appendChild(aTag);
          aTag.click();
          document.body.removeChild(aTag);
          URL.revokeObjectURL(fileUrl);

          const doneKey = "vacationSubmitDone";
          openModal({
            modalKey: doneKey,
            type: "alert",
            title: "완료",
            content: "휴가 신청이 완료되었습니다!",
            onConfirm: () => {
              closeModal(doneKey);
              setCurrentPage(0);
            },
          });
        } catch (error) {
          const errorKey = "sheetsSubmitError";
          openModal({
            modalKey: errorKey,
            type: "alert",
            title: "오류",
            content:
              "스프레드시트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
            onConfirm: () => closeModal(errorKey),
          });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        openModal({
          modalKey: "alertCanvas",
          type: "alert",
          title: "오류",
          content: errorText,
          onConfirm: () => closeModal("alertCanvas"),
        });
      }
    } else {
      console.error("canvasCurrent 없음");
    }
  };

  return (
    <main className="app-shell relative">
      <CurrentPage
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        reff={canvasRef}
        handleCreateVactionForm={createVacationForm}
        isSubmitting={isSubmitting}
        submitProgress={submitProgress}
      />
    </main>
  );
};

export default CreatingFormController;
