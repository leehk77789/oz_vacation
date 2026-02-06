import { RefObject } from "react";
import { CustomButton } from "../_common";
import { useDraw, useResize } from "../../hooks";

export interface SignatureCanvasProps {
  reff: RefObject<HTMLCanvasElement>;
}

const SignatureCanvas = ({ reff }: SignatureCanvasProps) => {
  const { canvasRef, clearCanvas, draw, startDrawing, stopDrawing } = useDraw({
    canvasRef: reff,
  });
  const { windowWidthSize } = useResize();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto gap-4 pb-10 touch-none">
      <CustomButton mode="outline" type="button" onClick={clearCanvas}>
        서명 다시하기
      </CustomButton>
      <canvas
        className="border-solid w-64 sm:w-[26rem] h-72 border cursor-crosshair bg-sign-img bg-cover bg-center bg-no-repeat"
        ref={canvasRef}
        width={windowWidthSize}
        height={288}
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchEnd={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchCancel={stopDrawing}
      ></canvas>
    </div>
  );
};

export default SignatureCanvas;
