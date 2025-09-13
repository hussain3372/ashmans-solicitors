import React from "react";
import { getClassNames } from "../../../../helpers";
import { FieldType } from "../../../../types";

export interface AttributesList {
  [key: string]: boolean;
}

export type FieldContainerProps = {
  attributesList: AttributesList;
  children: React.ReactNode;
  type: FieldType;
  hidden: boolean;
  fieldId: number;
  slug: string;
};

const additionalClass = {
  [FieldType.SEPARATOR]: "separator",
  [FieldType.OFFENCES]: "offences",
  [FieldType.SUB_TITLE]: "sub_title",
  [FieldType.SIGNATURE]: "sub_title",
  [FieldType.SWITCH]: "switch",
};
const additionalClassById = {
  [FieldType.ATTENDANCE_FIELD_ID]: "ATTENDANCE_FIELD",
  [FieldType.PREPARED_STEATMENT_FIELD_ID]: "PREPARED_STEATMENT_FIELD_ID",
};

export const FieldContainer: React.FC<FieldContainerProps> = ({
  attributesList,
  type,
  children,
  hidden,
  fieldId,
  slug,
}) => {
  return (
    <div
      className={`${getClassNames(attributesList || {})} fieldContainer ${additionalClass[type] || ""}  ${additionalClassById[slug] || ""}${hidden ? "hidden" : ""}`}
    >
      {children}
    </div>
  );
};
