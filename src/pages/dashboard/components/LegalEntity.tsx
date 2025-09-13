import { FC } from "react";
import { useNavigate } from "react-router-dom";
import Mask1 from "../../../shared/images/Mask1.svg";
import Mask2 from "../../../shared/images/Mask2.svg";
import Mask3 from "../../../shared/images/Mask3.svg";
import Mask4 from "../../../shared/images/Mask4.svg";
import Mask5 from "../../../shared/images/Mask5.svg";
import "../dashboard.scss";

interface LegalEntityI {
  title: string;
  value: number;
}

export const LegalEntity: FC<LegalEntityI> = ({ title, value }) => {
  const navigate = useNavigate();
  return (
    <div
      className="legalEntity"
      style={{
        background:
          title === "Police Station"
            ? "#306fea"
            : title === "Magistrates Court"
              ? "#4caf50"
              : title === "Youth Court"
                ? "#8bc34a"
                : title === "Court Duty Solicitor File"
                  ? "#fdc353"
                  : title === "Crown Court"
                    ? "#F44336"
                    : "",
      }}
      onClick={() =>
        navigate(
          title === "Police Station"
            ? "/police_station"
            : title === "Magistrates Court"
              ? "/magistrates_court"
              : title === "Youth Court"
                ? "/youth_court"
                : title === "Court Duty Solicitor File"
                  ? "/court_duty"
                  : title === "Crown Court"
                    ? "/crown_court"
                    : ""
        )
      }
    >
      <img
        className="legalEntity__bg"
        src={
          title === "Police Station"
            ? Mask1
            : title === "Magistrates Court"
              ? Mask2
              : title === "Youth Court"
                ? Mask5
                : title === "Court Duty Solicitor File"
                  ? Mask4
                  : title === "Crown Court"
                    ? Mask3
                    : ""
        }
      />
      <div className="legalEntity__title">{title}</div>
      <div className="legalEntity__value">{value}</div>
    </div>
  );
};
