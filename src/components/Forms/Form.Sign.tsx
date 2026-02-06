import { CustomButton, Description, PageButtonsProps, Title } from "../_common";
import SignatureCanvas, {
  SignatureCanvasProps,
} from "../Canvas/SignatureCanvas";
import CreateButton from "../Controllers/CreateButton";

interface FormSignProps
  extends SignatureCanvasProps,
    Pick<PageButtonsProps, "prevAction"> {
  handleCreateVactionForm: () => void;
  isSubmitting?: boolean;
  submitProgress?: number;
}

export const FormSign = ({
  reff,
  handleCreateVactionForm,
  prevAction,
  isSubmitting = false,
  submitProgress = 0,
}: FormSignProps) => {
  return (
    <section className="form-card">
      <Title>휴가 확인 서명</Title>
      <Description>휴가 신청서를 작성하기 위한 서명을 해주세요.</Description>
      <SignatureCanvas reff={reff} />
      <div className="flex items-center justify-center gap-4">
        <CustomButton
          mode="outline"
          onClick={prevAction}
          className="w-40 h-12 border border-[color:var(--stroke)]"
        >
          이전
        </CustomButton>
        <CreateButton
          onClick={handleCreateVactionForm}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-40 h-12 py-0"
        />
      </div>
      {isSubmitting ? (
        <div className="w-full max-w-sm pt-2" aria-live="polite">
          <p className="text-sm text-[color:var(--muted)]">
            휴가를 신청중입니다...
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-black/20">
            <div
              className="vacation-progress-bar h-2 rounded-full bg-[color:var(--accent)] transition-[width] duration-500 ease-out"
              style={{ width: `${submitProgress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            {Math.round(submitProgress)}%
          </p>
        </div>
      ) : null}
    </section>
  );
};
