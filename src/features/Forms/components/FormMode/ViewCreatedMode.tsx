import { Breadcrumb, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getInstanceDataByPath } from "../../../../helpers";
import fileIcon from "../../../../shared/images/fileIcon.svg";

import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { EditIcon } from "../../../../shared/icons";
import { CourtDutySolicitorFile } from "../../../../shared/icons/CourtDutySolicitorFile";
import { CrownCourt } from "../../../../shared/icons/CrownCourt";
import { DashboardIcon } from "../../../../shared/icons/DashboardIcon";
import { MagistratesCourt } from "../../../../shared/icons/MagistratesCourt";
import { PoliceStation } from "../../../../shared/icons/PoliceStation";
import { YouthCourt } from "../../../../shared/icons/YouthCourt";
import { getFormFieldsStructureThunk, getFormValuesThunk } from "../../formSlice";
import { transformName } from "../../helpers";
import { FormBlock } from "../FormBlock/FormBlock";
import { StepsMode } from "./StepsMode";

export const ViewCreatedMode = ({
  sections,
  sectionsIds,
  cases,
  caseId,
  formName,
  pathFromViewToEdit,
  pathBackToCaseInfo,
  handleSubmit,
  formId,
  recordId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isPoliceStation = formName === "POLICE STATION ATTENDANCE REPORT";

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getFormFieldsStructureThunk({ formId, caseId }));
      await dispatch(getFormValuesThunk({ recordId }));
    };
    if (recordId) {
      fetchData();
    }
  }, [recordId]);

  const icons = {
    dashboard: <DashboardIcon />,
    police_station: <PoliceStation />,
    magistrates_court: <MagistratesCourt />,
    youth_court: <YouthCourt />,
    court_duty: <CourtDutySolicitorFile />,
    crown_court: <CrownCourt />,
  };

  const instObj = getInstanceDataByPath(window.location.pathname);

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const caseUser = cases.find((item) => item.id === +caseId);
  const items = [
    {
      href: `/${instObj?.path}`,
      title: (
        <div className="case__bread active">
          <span>{icons[instObj?.path]}</span>
          <span>{instObj?.title}</span>
        </div>
      ),
    },
    {
      href: `/case/${instObj?.path}/view?caseId=${+caseId}`,
      title: (
        <div className="case__bread">
          <span>
            <EditIcon />
          </span>
          <span>{`${caseUser?.title || ""} ${caseUser?.client_name || ""}`} </span>
        </div>
      ),
    },

    {
      title: (
        <div className="case__bread">
          <img src={fileIcon} />
          {formName && <span>{formName} </span>}
        </div>
      ),
    },
  ];
  return (
    <div>
      <div>
        <div>
          <Breadcrumb items={items} />

          <Button
            style={{ marginLeft: "auto", display: "block" }}
            onClick={() => navigate(pathFromViewToEdit)}
            className="primary_round_btn"
          >
            Edit
          </Button>
        </div>
        {isPoliceStation ? (
          <StepsMode
            sectionsIds={sectionsIds}
            sections={sections}
            disabled={true}
            currentStep={current}
            type="view"
            setCurrent={setCurrent}
          />
        ) : (
          sectionsIds.map((sectionId) => {
            return (
              <div className="preview-container">
                <p className="preview-block-title">{transformName(sections[sectionId].name)}</p>
                <div className="form-list">
                  <FormBlock disabled={true} sectionId={sectionId} type="view" />
                </div>
              </div>
            );
          })
        )}
      </div>{" "}
      <div className="row__btns">
        {isPoliceStation && (
          <div className="d-flex-center">
            <Button
              className="secondary_round_btn m-r"
              onClick={prev}
              style={{ marginRight: 15 }}
              disabled={current <= 0}
            >
              <DownOutlined rotate={90} />
            </Button>

            <Button
              className="secondary_round_btn"
              onClick={next}
              disabled={current >= sectionsIds.length - 1}
            >
              <DownOutlined rotate={-90} />
            </Button>
          </div>
        )}
        <div className="d-flex-end">
          <Button className="secondary_round_btn m-r" onClick={() => navigate(pathBackToCaseInfo)}>
            Back
          </Button>
          <Button onClick={handleSubmit} className="primary_round_btn">
            Submit to Proclaim
          </Button>
        </div>
      </div>
    </div>
  );
};
