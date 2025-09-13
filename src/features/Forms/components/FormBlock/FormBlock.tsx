import React from "react";
import { useSelector } from "react-redux";
import { selectSectionById } from "../../formSlice";
import { FieldItem } from "./components/FieldItem/FieldItem";

interface FormBlockProps {
  sectionId: number;
  disabled?: boolean;
  type?: string
}

const FormBlockComponent: React.FC<FormBlockProps> = ({ disabled, sectionId, type }) => {
  const section = useSelector(selectSectionById(sectionId));

  return section?.fields?.map((fieldId, idx) => (
    <FieldItem
      disabled={disabled}
      key={fieldId}
      index={idx}
      sectionId={sectionId}
      fieldId={fieldId}
      type={type}
    />
  ));
};

export const FormBlock = React.memo(FormBlockComponent);
