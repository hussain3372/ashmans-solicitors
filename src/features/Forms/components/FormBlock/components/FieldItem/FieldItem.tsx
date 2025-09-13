import { memo } from "react";
import { useSelector } from "react-redux";
import { selectFieldById } from "../../../../formSlice";
import { FieldContainer } from "../FieldContainer/FieldContainer";
import { FormItemFactory } from "../FormItemFactory/FormItemFactory";

interface FieldItemProps {
  fieldId: number;
  sectionId: number;
  disabled: boolean;
  index: number;
  type?: string;
}

const FieldItemComponent: React.FC<FieldItemProps> = ({ disabled, fieldId, sectionId, index, type }) => {
  const field = useSelector(selectFieldById(fieldId));

  return (
    <FieldContainer
      type={field.type}
      hidden={!!field?.hidden}
      attributesList={field.attributes_list}
      fieldId={field.id}
      slug={field.slug}
    >
      <FormItemFactory disabled={disabled} field={field} sectionId={sectionId} index={index} type={type} />
    </FieldContainer>
  );
};

export const FieldItem = memo(FieldItemComponent);
