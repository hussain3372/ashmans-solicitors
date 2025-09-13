import { ReactNode, useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

import { Button } from "antd";
import CustomModal from "../CustomModal/CustomModal";
import "./signature.scss";

export function useSignatureController(setSignature, signature, value) {
  const sigPad = useRef<SignatureCanvas | null>(null);
  const [openPad, setOpenPad] = useState(false);
  const [dataUrl, setDataURL] = useState<string | null>(signature);
  const width = window.innerWidth;
  const [isClear, setIsClear] = useState(false);

  const styles = {
    width: width >= 800 ? 650 : width < 800 && width > 600 ? 445 : 350,
    height: width >= 800 ? 300 : 200,
    className: "sigCanvas",
  };

  useEffect(() => {
    if (value) {
      setDataURL(value);
    }
  }, [value]);

  useEffect(() => {
    if (dataUrl && sigPad && sigPad.current?.isEmpty()) {
      sigPad.current?.fromDataURL(value);
    }
  }, [dataUrl, openPad]);

  const clear = () => {
    if (sigPad.current) {
      sigPad.current.clear();
      const url = sigPad.current?.getTrimmedCanvas().toDataURL("image/png");
      if (url) {
        setDataURL(null);
        setIsClear(false);
        setSignature?.(null);
      }
    }
  };

  const renderClearContent = (): ReactNode => {
    return (
      <div className="d-flex-end mt-35">
        <Button
          className="secondary_round_btn"
          onClick={() => setIsClear(false)}
          style={{ margin: "0 15px 0 0" }}
        >
          Cancel
        </Button>
        <Button className="primary_round_btn" onClick={clear} style={{ margin: "0 0 0 0" }}>
          Clear and Save
        </Button>
      </div>
    );
  };

  const trim = () => {
    const url = sigPad.current?.getTrimmedCanvas().toDataURL("image/png");
    if (sigPad.current?.isEmpty()) {
      setDataURL("");
      setOpenPad(false);
      setSignature?.("");
    } else {
      setDataURL(url);
      setOpenPad(false);
      setSignature?.(url);
    }
  };

  const renderSignatureContent = () => {
    return (
      <div className="signature-modal">
        <div className="signature-modal__wrapper">
          <SignatureCanvas penColor="black" canvasProps={styles} ref={sigPad} />
        </div>
        <div className="signature-modal__btns row">
          <div className="d-flex-end">
            <div className="simple_btn" onClick={() => setOpenPad(false)}>
              Cancel
            </div>
            <div className="simple_btn" onClick={setSignature ? clear : () => setIsClear(true)}>
              Clear
            </div>
            <div className="simple_btn" onClick={trim}>
              Save
            </div>
          </div>
        </div>
        <CustomModal
          title="Clear"
          subtitle="Are you sure you want to clear the signature?"
          content={renderClearContent()}
          open={isClear}
          onClose={() => setIsClear(false)}
        />
      </div>
    );
  };
  return { renderSignatureContent, openPad, setOpenPad, dataUrl };
}
