import { DownOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { Button } from "antd/lib";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { InfoIcon } from "../../../../shared/icons";
import {
  getFormFieldsStructureThunk,
  getValuesThunk,
  isValidForm,
  selectFormValues,
  selectIsRequiredSectionByIds,
} from "../../formSlice";
import { transformName } from "../../helpers";
import { tacticalDetailsSelect } from "../FormBlock/components/FormItemFactory/FormItemFactory";
import { FormBlock } from "../FormBlock/FormBlock";
import { StepsMode } from "./StepsMode";
export const CreateNewMode = ({
  handleSave,
  pathFromCreateToView,
  sectionsIds,
  sections,
  cases,
  caseId,
  formName,
  formId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isValid = useSelector(isValidForm);
  const isPoliceStation = formName === "POLICE STATION ATTENDANCE REPORT";
  const CustomExpandIcon = ({ isActive, sectionsId }) => {
    const isRequired = useSelector(selectIsRequiredSectionByIds(sectionsId));

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!!isRequired?.length && <InfoIcon />}
        <DownOutlined rotate={isActive ? 180 : 0} />
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (formId && caseId) {
        await dispatch(getValuesThunk({ caseId }));
        await dispatch(getFormFieldsStructureThunk({ formId, caseId }));
      }
    };
    if (formId && caseId) {
      fetchData();
    }
  }, [formId, caseId]);
  const values = useSelector(selectFormValues);
  const tacticalDetails = tacticalDetailsSelect.includes(values?.[45]?.["tactical-details"]); //need refactor

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  if (!sectionsIds.length) {
    return;
  }
  return (
    <div>
      {isPoliceStation ? (
        <StepsMode
          sectionsIds={sectionsIds}
          sections={sections}
          currentStep={current}
          setCurrent={setCurrent}
        />
      ) : (
        <Collapse
          expandIcon={({ isActive, panelKey }) => (
            <CustomExpandIcon isActive={isActive} sectionsId={+panelKey} />
          )}
          expandIconPosition="end"
          defaultActiveKey={sectionsIds?.length === 1 ? [sectionsIds[0]] : []}
          items={sectionsIds?.map((sectionId, idx) => {
            return {
              forceRender: true,
              key: sectionId,
              label: transformName(sections[sectionId].name),
              children: (
                <div className="form-list">
                  <FormBlock sectionId={sectionId} />
                </div>
              ),
            };
          })}
        />
      )}
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
          <Button
            className="secondary_round_btn m-r"
            onClick={() => {
              navigate(pathFromCreateToView);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid || tacticalDetails}
            className="primary_round_btn"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
