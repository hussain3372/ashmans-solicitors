import { DownOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { Button } from "antd/lib";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getConditionalFields,
  getFormFieldsStructureThunk,
  getFormValuesThunk,
  isValidForm,
  selectFormValues,
} from "../../formSlice";
import { transformName } from "../../helpers";
import { tacticalDetailsSelect } from "../FormBlock/components/FormItemFactory/FormItemFactory";
import { FormBlock } from "../FormBlock/FormBlock";
import { StepsMode } from "./StepsMode";

export const EditCreatedMode = ({
  caseId,
  formId,
  handleUpdate,
  pathFromEditToView,
  sectionsIds,
  sections,
  recordId,
  formName,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isPoliceStation = formName === "POLICE STATION ATTENDANCE REPORT";
  const isValid = useSelector(isValidForm);

  useEffect(() => {
    const fetchData = async () => {
      // await dispatch(getValuesThunk({ caseId }));
      await dispatch(getConditionalFields());
      await dispatch(getFormFieldsStructureThunk({ formId, caseId }));

      await dispatch(getFormValuesThunk({ recordId }));
    };
    if (formId && caseId && recordId) {
      fetchData();
    }
  }, [formId, caseId, recordId]);

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const values = useSelector(selectFormValues);
  const tacticalDetails = tacticalDetailsSelect.includes(values?.[45]?.["tactical-details"]); //need refactor

  return (
    <div>
      {isPoliceStation ? (
        <StepsMode
          sectionsIds={sectionsIds}
          sections={sections}
          type="edit"
          currentStep={current}
          setCurrent={setCurrent}
        />
      ) : (
        <Collapse
          expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
          expandIconPosition="end"
          defaultActiveKey={"1"}
          items={sectionsIds?.map((sectionId, idx) => {
            return {
              key: idx + 1,
              label: transformName(sections[sectionId].name),
              children: (
                <div className="form-list">
                  <FormBlock sectionId={sectionId} type="edit" />
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
              navigate(pathFromEditToView);
            }}
          >
            Cancel
          </Button>
          <Button
            className="primary_round_btn"
            onClick={handleUpdate}
            disabled={!isValid || tacticalDetails}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
