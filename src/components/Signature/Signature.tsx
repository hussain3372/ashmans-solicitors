import { Button } from "antd";
import CustomModal from "../CustomModal/CustomModal";
import { useSignatureController } from "./Signature.controller";

export const Signature = ({
  setSignature,
  signature,
  value,
  name = "",
  disabled = false,
  type = "",
}) => {
  const { renderSignatureContent, openPad, setOpenPad, dataUrl } = useSignatureController(
    setSignature,
    signature,
    value
  );
  const width = window.innerWidth;
  const shouldShowName =
    (!!name && type !== "view") || (!!name && disabled && dataUrl && value && type === "view");

  return (
    <div style={{ width: "100%" }}>
      {shouldShowName && <p className="signature-title">{name}</p>}
      {((type === "edit" && !!value) || (!!disabled && !!value)) && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "220px",
            marginBottom: "24px",
          }}
        >
          <img
            style={{ display: "block", margin: "0 auto", width: "-webkit-fill-available" }}
            src={value}
            height={65}
            alt="Signature"
          />
        </div>
      )}

      {!disabled ? (
        <Button
          className={`${dataUrl || value ? "primary_round_btn" : "red_round_btn"}`}
          onClick={() => setOpenPad(true)}
          style={{ marginBottom: "24px" }}
        >
          Signature Pad
        </Button>
      ) : null}

      <CustomModal
        title="Sign Your Name"
        content={renderSignatureContent()}
        open={openPad}
        onClose={() => setOpenPad(false)}
        width={width >= 800 ? "700px" : width < 800 && width > 600 ? "500px" : "400px"}
        className="sign-modal"
      />
    </div>
  );
};
