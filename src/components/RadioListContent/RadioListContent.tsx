import { FormInstance, Input, Radio, Tooltip } from "antd";
import { Dispatch, FC, ReactNode, useState } from "react";
import i from "../../shared/images/i.svg";
import searchIcon from "../../shared/images/search.svg";
import { CaseFieldI } from "../../shared/types/cases";
import { FormFieldDataI } from "../../shared/types/forms";
import useRadioListContentController from "./RadioListContent.controller";

export const RadioListContent: FC<{
  fields: (CaseFieldI | FormFieldDataI)[] | undefined;
  form: FormInstance;
  slug: string;
  setSlug: Dispatch<React.SetStateAction<string>>;
  onBlur?: (slug: string, value: string) => void;
}> = ({ fields, form, slug, setSlug, onBlur }): ReactNode => {
  const { search, handleChange } = useRadioListContentController();
  const element = fields?.find((elem) => elem.slug === slug);
  const [localValue, setLocalValue] = useState("");

  if (!element || !element.list) return null;

  const filteredItems = element.list.items.filter((item) =>
    item.value.toLowerCase().includes(search.toLowerCase())
  );
  const hasMultiList = !!(element as FormFieldDataI)?.multi_list;
  const formValue = form.getFieldValue(slug);

  const isRequired = element?.required;

  const value = localValue ? localValue : formValue;

  const handleClear = () => {
    form.setFieldsValue({ [slug]: null });
    setSlug("");
  };
  return (
    <div>
      <Input
        className="search-input"
        suffix={<img src={searchIcon} />}
        placeholder="Search here.."
        maxLength={15}
        onChange={handleChange}
        value={search}
        allowClear
      />
      <div className="select-modal__selector">
        {filteredItems.map((item) => (
          <div className="row">
            <Radio
              key={item.id}
              className="select-modal__radio"
              onClick={() => {
                if (hasMultiList) {
                  setLocalValue(
                    formValue?.includes(item.value)
                      ? formValue?.filter((v: string) => v !== item.value)
                      : [...(formValue ?? []), item.value]
                  );
                } else {
                  setLocalValue(item.value);
                  form.setFieldsValue({ [slug]: item.value ? item.value : value });
                  setSlug("");
                }
              }}
              checked={hasMultiList ? value?.includes(item.value) : value === item.value}
            >
              {item.value}
            </Radio>
            {item?.tooltip && (
              <Tooltip title={item?.tooltip}>
                <img src={i} style={{ margin: "0 20px 0 0", cursor: "pointer" }} />
              </Tooltip>
            )}
          </div>
        ))}
      </div>
      <div className="d-flex-end">
        <div className="simple_btn" onClick={handleClear}>
          Clear
        </div>
        <div
          className="simple_btn"
          onClick={() => {
            setSlug("");
          }}
        >
          Close
        </div>
        {hasMultiList && (
          <div
            className="simple_btn"
            onClick={() => {
              if (hasMultiList) {
                form.setFieldsValue({
                  [slug]: localValue,
                });
              } else {
                form.setFieldsValue({ [slug]: localValue ? localValue : value });
                setSlug("");
              }
              if (slug === "case-status" || slug === "billing-status") {
                onBlur && onBlur(slug, localValue);
              }
            }}
          >
            Save
          </div>
        )}
      </div>
    </div>
  );
};
