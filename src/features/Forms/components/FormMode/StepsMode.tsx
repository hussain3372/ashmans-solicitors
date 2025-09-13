import { Steps } from "antd";
import { useSelector } from "react-redux";
import { selectFormValues, selectIsRequiredSectionByIds } from "../../formSlice";
import { transformName } from "../../helpers";
import { tacticalDetailsSelect } from "../FormBlock/components/FormItemFactory/FormItemFactory";
import { FormBlock } from "../FormBlock/FormBlock";

export const StepsMode = ({
  sectionsIds,
  sections,
  disabled,
  type,
  currentStep = 0,
  setCurrent,
}: {
  sectionsIds: number[];
  sections: number;
  disabled?: boolean;
  type?: string;
  currentStep: number;
  setCurrent: (item: number) => void;
}) => {
  const requiredSections = useSelector((state) =>
    sectionsIds.map((sectionId: number) => selectIsRequiredSectionByIds(sectionId)(state))
  );
  const values = useSelector(selectFormValues);
  const tacticalDetails = tacticalDetailsSelect.includes(values?.[45]?.["tactical-details"]); //need refactor

  const onChange = (value: number) => {
    setCurrent(value);
  };

  const steps = sectionsIds.map((sectionId: number, index: number) => {
    const isRequired = requiredSections[index];
    return {
      content: (
        <div className="form-list">
          <FormBlock sectionId={sectionId} disabled={disabled} type={type} />
        </div>
      ),
      text: truncateString(transformName(sections[sectionId]?.name ?? ""), 15),
      isRequired: isRequired?.length || (tacticalDetails && sectionId === 45) ? true : false,
    };
  });

  const items = steps.map(({ text, isRequired }: { text: string; isRequired: boolean }) => ({
    key: text,
    icon: (
      <span style={{ fontSize: 12, whiteSpace: "nowrap", color: isRequired ? "red" : "" }}>
        {text}
      </span>
    ),
  }));

  return (
    <>
      <Steps
        current={currentStep}
        items={items}
        labelPlacement="vertical"
        type="navigation"
        size="small"
        className="navigation-steps"
        onChange={onChange}
        responsive={false}
      />
      <p style={{ marginTop: 0, fontSize: 24 }}>
        {transformName(sections[sectionsIds[currentStep]]?.name ?? "")}
      </p>
      <div style={{ marginTop: 24 }} className="form-step">
        {steps[currentStep]?.content}
      </div>
    </>
  );
};

export function truncateString(str: string, num: number) {
  if (str?.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}
