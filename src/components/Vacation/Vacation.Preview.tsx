import { PDFViewer } from "@react-pdf/renderer";
import { useVacation } from "../../context/VacationContext";
import { styles } from "./Vacation.Style";

import { VacationMobile } from "./Vacation.Mobile";
import { VacationForm } from "./Vacation.Form";
import { useIsMobile } from "../../hooks";
import { buildVacationPdfProps } from "../../utils";

const VacationPreview = () => {
  const isMobile = useIsMobile();
  const value = buildVacationPdfProps(useVacation());

  return (
    <>
      {isMobile ? (
        <VacationMobile
          documentS={<VacationForm {...value} />}
          downloadName={value.downloadName}
        />
      ) : (
        <PDFViewer style={styles.previewContainer} showToolbar>
          <VacationForm {...value} />
        </PDFViewer>
      )}
    </>
  );
};

export default VacationPreview;
