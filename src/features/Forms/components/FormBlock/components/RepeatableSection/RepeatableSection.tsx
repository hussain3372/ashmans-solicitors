import { MinusCircleOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { Input } from "../../../../../../shared/ui/Input/Input";
import "./style.scss";

interface RepeatableFieldProps {
  field: { repeatable: { slug: string }[] };
  value: { [key: string]: string }[];
  onChange: (updatedFields: { [key: string]: string }[]) => void;
  disabled: boolean;
}

const prepareInitValue = (repeatableFields: { slug: string }[], isHidePreffiledValue) => {
  if (repeatableFields.length > 1) {
    return [
      {
        [repeatableFields[0].slug]: "",
        [repeatableFields[1].slug]: isHidePreffiledValue ? "" : "No Comment",
      },
    ];
  } else {
    return repeatableFields.map((item) => ({ [item.slug]: "" }));
  }
};

export const RepeatableSection: FC<RepeatableFieldProps> = ({
  field,
  value,
  onChange,
  disabled,
  formValues,
}) => {
  const isHidePreffiledValue =
    formValues?.[45]?.["case-specific-and-tactical-advise"] === "fully-commented-interview";
  const items = Array.isArray(value) ? value : Object.values(value);
  const [fields, setFields] = useState(
    value && !items?.filter((item) => item?.slug)?.length
      ? items
      : prepareInitValue(field.repeatable, isHidePreffiledValue)
  );

  const fieldKeys = Object.keys(fields[0]);

  const handleAdd = () => {
    const newField = fieldKeys.reduce(
      (acc, key) => {
        acc[key] = "";
        return acc;
      },
      {} as { [key: string]: string }
    );
    const updatedFields = [...fields, newField];

    setFields(updatedFields);
    onChange(updatedFields);
  };

  const handleRemove = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const handleChange = (index: number, key: string, value: string) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setFields(updatedFields);
    onChange(updatedFields);

    const lastField = updatedFields[updatedFields.length - 1];
    const allFieldsFilled = fieldKeys.every((key) => lastField[key].trim() !== "");
    if (allFieldsFilled) {
      const newField = fieldKeys.reduce(
        (acc, key, idx) => {
          acc[key] = idx && !isHidePreffiledValue ? "No Comment" : "";
          return acc;
        },
        {} as { [key: string]: string }
      );
      const updatedField = [...updatedFields, newField];
      setFields(updatedField);
      onChange(updatedField);
    }
  };

  useEffect(() => {
    if (isHidePreffiledValue) {
      const updateFields = fields.map((item) => {
        return Object.keys(item).reduce((acc, key, idx) => {
          if (idx === 1) {
            acc[key] = "";
          } else {
            acc[key] = item[key];
          }

          return acc;
        }, {});
      });

      setFields(updateFields);
    } else {
      const updateFields = fields.map((item) => {
        return Object.keys(item).reduce((acc, key, idx) => {
          if (idx === 1) {
            acc[key] = "No comment";
          } else {
            acc[key] = item[key];
          }
          return acc;
        }, {});
      });

      setFields(updateFields);
    }
  }, [isHidePreffiledValue]);

  return (
    <>
      {" "}
      <div style={{ display: "grid", gap: 16 }}>
        {fields.map((item, index) =>
          fieldKeys.length > 1 ? (
            <div className="repeatable-section">
              {fieldKeys.map((key) => (
                <Input
                  key={key}
                  label={`${key} ${index + 1}`}
                  placeholder={`Enter ${key} ${index + 1}`}
                  value={item[key]}
                  onChange={(e) => handleChange(index, key, e.target.value)}
                  disabled={disabled}
                />
              ))}

              {fields.length > 1 && !disabled && (
                <MinusCircleOutlined
                  className="repedable-minus-icon"
                  onClick={() => handleRemove(index)}
                  style={{ marginLeft: 8, cursor: "pointer", marginTop: 16 }}
                />
              )}
            </div>
          ) : (
            <div
              style={{ position: "relative", marginBottom: fields?.length !== index + 1 ? 24 : 0 }}
            >
              {fieldKeys.map((key, idx) => (
                <Input
                  key={key}
                  label={`${field?.repeatable?.[idx]?.name} ${index + 1}`}
                  placeholder={`Enter ${key} ${index + 1}`}
                  value={item[key]}
                  onChange={(e) => handleChange(index, key, e.target.value)}
                  disabled={disabled}
                />
              ))}

              {fields.length > 1 && !disabled && (
                <MinusCircleOutlined
                  className="repedable-minus-icon"
                  style={{ top: "60%" }}
                  onClick={() => handleRemove(index)}
                />
              )}
            </div>
          )
        )}
      </div>
      {/* {!disabled && (
        <Button
          type="dashed"
          onClick={handleAdd}
          icon={<PlusOutlined />}
          style={{ marginTop: 16, width: "100%" }}
        >
          Add
        </Button>
      )} */}
    </>
  );
};
