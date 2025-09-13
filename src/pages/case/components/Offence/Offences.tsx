import { Button, Spin } from "antd";
import dayjs from "dayjs";
import { FC } from "react";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import courtImage from "../../../../shared/images/courtImage.svg";
import Edit from "../../../../shared/images/Edit.svg";
import useOffenceController from "./Offence.controller";
import "./offences.scss";

export const Offences: FC<{
  withoutBtns?: boolean;
  isForms?: boolean;
  disabled?: boolean;
  showOutcome?: boolean;
  showOutcomeInput?: boolean;
}> = ({
  withoutBtns = false,
  isForms = false,
  disabled = false,
  showOutcome = false,
  showOutcomeInput = true,
}) => {
  const {
    renderOffences,
    setOpenSelectOffenses,
    openSelectOffenses,
    addOffenceModal,
    setAddOffenceModal,
    renderFormOffences,
    contextHolder,
    setEditOffenceModal,
    editOffenceModal,
    elementCase,
    setSelectedOffence,
  } = useOffenceController(isForms, showOutcome, showOutcomeInput);

  const addOffence = () => {
    setOpenSelectOffenses(true);
    setSelectedOffence([]);
  };

  return (
    <div className="offences">
      {contextHolder}
      {!withoutBtns && !!elementCase?.offences?.length && (
        <div className="d-flex-end" style={{ margin: "0 0 20px 0" }}>
          {!isForms && (
            <Button className="primary_round_btn" onClick={addOffence}>
              + Add Offence
            </Button>
          )}

          {!disabled && (
            <div
              className="simple_btn_round"
              onClick={() => setEditOffenceModal(true)}
              style={{ margin: "0 0 0 15px" }}
            >
              <img src={Edit} /> Edit Offence
            </div>
          )}
        </div>
      )}
      <div className="d-flex-column">
        {!elementCase && <Spin size="large"></Spin>}

        {elementCase && (
          <>
            {elementCase?.offences?.length ? (
              <>
                {elementCase?.offences?.map((elem, i) => {
                  return (
                    <div key={`id: ${elem.id}, index: ${i}`} className="offence">
                      <div className="row offence__top-row">
                        <div>Description</div>
                        {showOutcome && <div>Outcome</div>}
                        <div style={{ textAlign: "right" }}>Date</div>
                      </div>
                      <div className="row offence__bottom-row">
                        <div className="offence__description">{elem.description}</div>
                        {showOutcome && <div>{elem.policeStationOutcome?.code || "-"}</div>}

                        <div style={{ textAlign: "right" }}>
                          {elem.dateFormat} {dayjs(convertDate(elem.date)).format("MMM DD, YYYY")}{" "}
                          {elem.dateEnd && "-"}
                          {elem.dateEnd
                            ? dayjs(convertDate(elem.dateEnd)).format("MMM DD, YYYY")
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="offences__wrapper">
                <img src={courtImage} />

                <div className="offences__title">Nothing in Offences</div>
                <div className="offences__subtitle">
                  When you add an offence, they'll appear here.
                </div>
                {!withoutBtns && (
                  <Button className="primary_round_btn" onClick={() => setOpenSelectOffenses(true)}>
                    + Add Offence
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <CustomModal
        title="Select Offence"
        content={renderOffences()}
        open={openSelectOffenses}
        onClose={() => setOpenSelectOffenses(false)}
        width="700px"
      />
      <CustomModal
        title={addOffenceModal ? "Add Offences" : "Edit Offences"}
        subtitle={""}
        content={renderFormOffences()}
        open={addOffenceModal || editOffenceModal}
        onClose={() => {
          setAddOffenceModal(false);
          setEditOffenceModal(false);
        }}
        width={"890px"}
        className="offence-modal"
        zIndex={2}
      />
    </div>
  );
};

const convertDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  const formattedDate = `${month}-${day}-${year}`;

  return formattedDate;
};
