import { Button, DatePicker, Divider, Form, Input, Radio, Select, Switch, TimePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import { Dispatch, FC } from "react";
import { DATE_FORMAT } from "../../shared/constants/dateFormat";
import { CaseFieldI } from "../../shared/types/cases";
import { FormFieldDataI } from "../../shared/types/forms";
import { Signature } from "../Signature/Signature";

export interface FromOtherItemsI {
  type: "disabled" | "setFieldValue";
  slug: string;
  value: string;
  fieldValue?: string;
}

export interface ItemsDataI {
  slug: string;
  label?: string;
  className?: string;
  hasWrapper?: boolean;
  disabled?: boolean;
  isTextArea?: boolean;
  fromOtherItems?: FromOtherItemsI[];
  forceNotRequired?: boolean; // 👈 add this

}

export const FormItems: FC<{
  itemsData: ItemsDataI[];
  fields: (CaseFieldI | FormFieldDataI)[] | undefined;
  setSlug: Dispatch<React.SetStateAction<string>>;
  itemDisabled?: boolean | string;
}> = ({ itemsData, fields, setSlug, itemDisabled }) =>
    itemsData.map((itemData) => {
      const {
        slug,
        label: itemLabel,
        className,
        hasWrapper,
        disabled: disabledSingleItem,
        isTextArea,
        fromOtherItems,
      } = itemData;
      const elem = fields?.find((field) => field.slug === slug);
      if (!elem) return null;
      const { id, name, required, readonly, type, list, options } = elem;
      const label = (elem as FormFieldDataI)?.label;
      const { field, value } = (elem as FormFieldDataI)?.conditions?.[0] ?? {};
      const multiList = (elem as FormFieldDataI)?.multi_list;
      const staticText = (elem as FormFieldDataI)?.static_text;
      const dsbld =
        typeof itemDisabled === "boolean"
          ? itemDisabled
          : disabledSingleItem
            ? disabledSingleItem
            : !!readonly;

      const getFormItem = () => (
        <Form.Item
          key={id}
          dependencies={[field, ...(fromOtherItems?.map(({ slug }) => slug) ?? [])]}
          noStyle
        >
          {({ getFieldValue, setFieldValue }) => {
            let disabled = dsbld;
            fromOtherItems?.every(({ type: t, slug: s, value: v, fieldValue }) => {
              if (t === "disabled" && getFieldValue(s) === v) {
                disabled = true;
                return false;
              }
              if (t === "setFieldValue" && getFieldValue(s) === v) {
                setFieldValue(slug, fieldValue ?? "");
                return true;
              }
              return true;
            });
            const disabledDate = (current: Dayjs | null) => {
              if (slug === "date-birth") {
                return current && current > dayjs().endOf("day");
              }
              return false;
            };
            return !field || getFieldValue(field) === value.toLowerCase().split(" ").join("-") ? (
              <Form.Item
                name={slug}
                className={className ?? "form-item"}
                colon={false}
                label={
                  type !== 19 && (
                    <span className="form-label">
                      {itemLabel ?? (label ? label : name)}
                      {/* Show * only if required AND not forceNotRequired */}
                      {required && !itemData.forceNotRequired && (
                        <span style={{ color: "red", marginLeft: 4 }}>*</span>
                      )}
                    </span>
                  )
                }
                labelAlign="left"
                labelCol={type === 9 ? {} : { span: 24 }}
                rules={
                  required && !itemData.forceNotRequired
                    ? [{ required: true, message: "This field is required" }]
                    : []
                }
                required={false} // prevent AntD default star
                valuePropName={type === 9 ? "checked" : "value"}
              >
                {[1, 3, 8].includes(type) && !isTextArea && (
                  <Input
                    placeholder={itemLabel ?? (label ? label : name)}
                    disabled={disabled}
                  />
                )}

                {[1, 3].includes(type) && isTextArea && (
                  <TextArea disabled={disabled} autoSize={{ minRows: 2 }} />
                )}

                {type === 5 && (
                  <DatePicker
                    disabled={disabled}
                    format={DATE_FORMAT}
                    disabledDate={disabledDate}
                  />
                )}

                {type === 6 && (
                  <TimePicker disabled={disabled} format="HH:mm" needConfirm={false} />
                )}

                {type === 7 && !options.length && !!list && (
                  <Select
                    mode={multiList ? "multiple" : undefined}
                    disabled={disabled}
                    onDropdownVisibleChange={() => setSlug(elem.slug)}
                    dropdownStyle={{ visibility: "hidden" }}
                    allowClear
                    placeholder={itemLabel ?? (label ? label : name)}
                  />
                )}

                {type === 7 && !!options.length && (
                  <Radio.Group
                    options={options.map(({ slug, name }) => ({
                      value: slug,
                      label: name,
                    }))}
                    disabled={disabled}
                  />
                )}

                {type === 9 && <Switch disabled={disabled} size="small" />}

                {type === 15 && options.length > 0 && (
                  <Select
                    options={options.map(({ slug, name }) => ({
                      value: slug,
                      label: name,
                    }))}
                    disabled={disabled}
                    allowClear
                    placeholder={itemLabel ?? (label ? label : name)}
                  />
                )}

                {type === 10 && <Signature />}

                {type === 19 && (
                  <Button className="primary_round_btn">
                    {label ? label : name}
                  </Button>
                )}
              </Form.Item>

            ) : (
              <div key={id} className={className ?? "form-item"} />
            );
          }}
        </Form.Item>
      );
      switch (type) {
        case 11:
          return (
            <div key={id} className="form-title form-item-wrapper">
              {label ? label : name}
            </div>
          );
        case 14:
          return (
            <div key={id} className="form-item-wrapper">
              <Divider />
            </div>
          );
        case 18:
          return (
            <div key={id} className="form-item-wrapper">
              <div
                className="form-item-static-text"
                dangerouslySetInnerHTML={{ __html: staticText }}
              />
            </div>
          );
        default:
          return hasWrapper ? (
            <div key={id} className="form-item-wrapper">
              {getFormItem()}
            </div>
          ) : (
            getFormItem()
          );
      }
    });
