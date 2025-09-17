import { Button, Divider, Radio } from "antd";
import dayjs from "dayjs";
import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Signature } from "../../../../../../components/Signature/Signature";
import { Offences } from "../../../../../../pages/case/components/Offence/Offences";
import OffencesSelect from "../../../../../../pages/case/components/Offence/OffencesSelect";
import { useAppDispatch } from "../../../../../../redux/store";
import { DATE_FORMAT } from "../../../../../../shared/constants/dateFormat";
import { PickerIcon } from "../../../../../../shared/icons";
import { DatePicker } from "../../../../../../shared/ui/DatePicker/DatePicker";
import { Input } from "../../../../../../shared/ui/Input/Input";
import { InputNumber } from "../../../../../../shared/ui/InputNumber/InputNumber";
import { Select } from "../../../../../../shared/ui/Select/Select";
import { Switch } from "../../../../../../shared/ui/Switch/Switch";
import { TextArea } from "../../../../../../shared/ui/TextArea/TextArea";
import { TimePicker } from "../../../../../../shared/ui/TImePicker/TImePicker";
import {
  selectConditions,
  selectFormValues,
  selectPayload,
  updateFormValue,
} from "../../../../formSlice";
import { FieldType, IField } from "../../../../types";
import { AttendanceForm } from "../AttendanceForm/AttendanceForm";
import { InterviewContinuationForm } from "../InterviewContinuationForm/InterviewContinuationForm";
import NameOfPoliceSelect from "../NameOfPoliceSelect/NameOfPoliceSelect";
import { PreparedStatmentForm } from "../PreparedStatmentForm/PreparedStatmentForm";
import { RepeatableSection } from "../RepeatableSection/RepeatableSection";
import SelectWithModal from "../SelectWithModal/SelectWithModal";

const formatMinutes = (minutes) => {
  if (isNaN(minutes) || minutes < 0) {
    return "Invalid input";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} hours ${remainingMinutes} minutes`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else if (remainingMinutes > 0) {
    return `${remainingMinutes} minutes`;
  } else {
    return "0 minutes";
  }
};
export const tacticalDetailsSelect = [
  "Client advised to proceed by way of No Comment Interview ",
  "Client advised to proceed by way of Fully Commented Interview ",
  "Client advised to proceed by way of Prepared Statement ",
]; //need refactor
const objText = {
  "no-comment": `You were advised in relation to the different methods in which you could conduct the interview, namely, to provide a no comment interview, provide a full account in interview or to provide a prepared statement.

You were advised that in your circumstances you should provide a no comment interview.

A no comment interview prevents any further incrimination and could prevent the police from strengthening the evidence against you.  This approach also puts the police/prosecution to proof as it is for them to prove the case against you. However, adverse inferences could be drawn against you at a potential trial at court if you choose to take this approach.`,

  "fully-commented": `You were advised in relation to the different methods in which you could conduct the interview, namely, to provide a no comment interview, provide a full account in interview or to provide a prepared statement.

You were advised that in your circumstances you should provide a fully commented interview.

The advantage of providing a full account in interview is that allows you to state your defence/mitigation at the earliest opportunity and avoid any potential adverse inferences if charged.  The disadvantages of providing a full account are that you may incriminate yourself and/or provide additional evidence to the police`,
  "prepared-statement": `You were advised in relation to the different methods in which you could conduct the interview, namely, to provide a no comment interview, provide a full account in interview or to provide a prepared statement.

You were advised that in your circumstances you should provide a prepared statement.

A prepared statement would allow you to register your defence and you would avoid incriminating yourself further or avoid providing additional information that the police may not currently possess.  However, adverse inferences could still be drawn if you are charged and brought to trial.`,
};
interface IProps {
  field: IField;
  sectionId: number;
  disabled: boolean;
  type?: string;
}

type ChangeHandler = (value: any) => void;

const ATTENDANCE_FIELD_ID = "attendance-time";
const PREPARED_STEATMENT_FIELD_ID = "prepared-statement";
const INTERVIEW_CONTINUATION_FORM = "interview-continuation-form";
const POLICE_NAME_SELECT = "name-police-station-bailed";
const NAME_COURT = "name-court";

const OUTCOME = "what-outcome";

export const getField = (
  field: IField,
  props,
  sectionId: number,
  handleChange: ChangeHandler,
  type?: string
) => {
  if (!field) return;
  if (field.slug === POLICE_NAME_SELECT || field.slug === NAME_COURT) {
    return <NameOfPoliceSelect {...props} handleChange={(e) => handleChange(e)} />;
  }
  if (field.slug === ATTENDANCE_FIELD_ID) {
    return (
      <AttendanceForm
        {...props}
        sectionId={sectionId}
        field={field}
        handleChange={(value) => handleChange(value)}
      />
    );
  }
  if (field.slug === INTERVIEW_CONTINUATION_FORM) {
    return (
      <InterviewContinuationForm
        sectionId={sectionId}
        handleChange={(value) => handleChange(value)}
        type={type}
        {...props}
      />
    );
  }
  if (field.slug === PREPARED_STEATMENT_FIELD_ID) {
    return <PreparedStatmentForm sectionId={sectionId} handleChange={handleChange} {...props} />;
  }
  if ([FieldType.INPUT].includes(field.type) && !field.options?.length) {
    const { value, required } = props || {};
    return (
      <Input
        {...props}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        style={{
          border: !value && required ? "1px solid red" : "",
        }}
      />
    );
  }
  if ([FieldType.READONLY_INPUT].includes(field.type) && !field.options?.length) {
    const { value, required } = props || {};
    return (
      <InputNumber
        {...props}
        onChange={(e) => {
          handleChange(e);
        }}
        style={{
          border: !value && required ? "1px solid red" : "",
        }}
      />
    );
  }
  if ([FieldType.INPUT].includes(field.type) && !!field.options?.length) {
    return <Select {...props} onChange={(e) => handleChange(e.target.value)} />;
  }

  if ([FieldType.REPETEABLE_INPUT].includes(field.type)) {
    return <RepeatableSection {...props} field={field} onChange={(value) => handleChange(value)} />;
  }
  if ([FieldType.TYPE_PICKER].includes(field.type)) {
    const change = (value) => {
      if (value) {
        const date = value.$d;
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        const isoString = formattedTime;
        handleChange(isoString);
      }
    };
    return <TimePicker {...props} suffixIcon={<PickerIcon />} onChange={change} />;
  }
  if ([FieldType.DATE_PICKER].includes(field.type)) {
    const change = (value) => {
      if (value) {
        const selectedDate = new Date(value);
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
        const day = selectedDate.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        handleChange(formattedDate);
      }
    };
    return <DatePicker {...props} suffixIcon={<PickerIcon />} onChange={change} />;
  }
  if ([FieldType.BUTTON].includes(field.type)) {
    return <Button {...props}>{field.name}</Button>;
  }
  if ([FieldType.SWITCH].includes(field.type)) {
    return (
      <div>
        <Switch {...props} width="50" onChange={(checked) => handleChange(checked)} />
      </div>
    );
  }
  if ([FieldType.RADIO_GROUP].includes(field.type)) {
    return <Radio.Group {...props} onChange={(e) => handleChange(e.target.value)} />;
  }
  if ([FieldType.TEXT_AREA].includes(field.type)) {
    const { value, required } = props || {};

    const borders = field.slug === "tactical-details" && tacticalDetailsSelect.includes(value); //need refactor
    return (
      <TextArea
        {...props}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          border: (!value && required) || borders ? "1px solid red" : "",
        }}
      />
    );
  }
  if ([FieldType.SINGLE_SELECT, FieldType.TIME_SELECT].includes(field.type)) {
    const { value, required } = props || {};
    return (
      <Select
        {...props}
        onChange={(e) => handleChange(e.target.value)}
        error={!value?.length && !!required}
        allowClear
      />
    );
  }
  if ([FieldType.SELECT].includes(field.type)) {
    const { value, required } = props || {};
    return (
      <SelectWithModal
        {...props}
        handleChange={(e) => handleChange(e)}
        error={!value?.length && !!required}
      />
    );
  }

  if ([FieldType.SIGNATURE].includes(field.type)) {
    return <Signature {...props} setSignature={handleChange} />;
  }
  if ([FieldType.SEPARATOR].includes(field.type)) {
    return <Divider />;
  }
  if ([FieldType.OFFENCES].includes(field.type)) {
    return (
      <Offences
        withoutBtns={props?.disabled || !!props.readonly || field.slug === "outcome"}
        isForms={OUTCOME !== field.slug}
        showOutcome={OUTCOME === field.slug}
        {...props}
        disabled={props?.disabled || !!props.readonly}
      />
    );
  }
  if ([FieldType.OFFENCES_INPUT].includes(field.type)) {
    return <OffencesSelect handleChange={handleChange} {...props} />;
  }
  if ([FieldType.SUB_TITLE].includes(field.type)) {
    return (
      <div className="form-title form-item-wrapper">{field.label ? field.label : field.name}</div>
    );
  }
  if ([FieldType.STATIC_TEXT].includes(field.type)) {
    return (
      <div className="form-item-wrapper">
        <div
          className="form-item-static-text"
          dangerouslySetInnerHTML={{ __html: field.static_text }}
        />
      </div>
    );
  }
};

export const getFieldProps = (field: IField, value, disabled, values, type) => {
  if (!field) return;
  if ([FieldType.INPUT, FieldType.READONLY_INPUT].includes(field.type) && !field?.options?.length) {
    return {
      disabled: disabled || field.readonly,
      defaultValue: field.default_value,
      placeholder: !field.readonly ? "Type here..." : "",
      label: field.label || field.name,
      value: value,
      required: field.required,
    };
  }
  if ([FieldType.INPUT].includes(field.type) && !!field?.options?.length) {
    return {
      mode: field.multi_list ? "multiple" : undefined,
      disabled: disabled || field.readonly,
      allowClear: true,
      placeholder: <p>Choose option...</p>,
      // value: value,
      label: field.label || field.name,
      required: field.required,
      value: Array.isArray(value) && !!value?.length ? value : field.multi_list ? [] : value,

      options: field?.options?.length
        ? field.options.map(({ slug, name }) => ({ value: slug, label: name }))
        : field.list?.items.map((item) => ({ value: item.value, label: item.value })),
    };
  }
  if ([FieldType.TYPE_PICKER].includes(field.type)) {
    return {
      disabled: disabled || field.readonly,
      format: "HH:mm",
      value: value ? dayjs(value, "HH:mm") : null,
      label: field.label || field.name,
      required: field.required,
    };
  }
  if ([FieldType.BUTTON].includes(field.type)) {
    return { disabled: disabled || field.readonly, value: value, label: field.name };
  }
  if ([FieldType.SWITCH].includes(field.type)) {
    return { disabled: disabled || field.readonly, value: value, label: field.label };
  }
  if ([FieldType.RADIO_GROUP].includes(field.type)) {
    return { disabled: disabled || field.readonly, value: value };
  }
  if ([FieldType.TEXT_AREA].includes(field.type)) {
    return {
      disabled: disabled || field.readonly,
      defaultValue: field?.default_value,
      placeholder: "Type here...",
      value: value,
      label: field.label || field.name,
      required: field.required,
    };
  }
  if ([FieldType.SINGLE_SELECT].includes(field.type)) {
    return {
      mode: field.multi_list ? "multiple" : undefined,
      disabled: disabled || field.readonly,
      initialValue: field.default_value ? [field.default_value] : field.default_value,
      allowClear: true,
      label: field.label || field.name,
      required: field.required,

      placeholder: <p>Choose option...</p>,
      value: value?.length ? value : [],

      options: field?.options?.length
        ? field.options.map(({ slug, name }) => ({ value: slug, label: name }))
        : field.list?.items.map((item) => ({ value: item.value, label: item.value })),
    };
  }
  if ([FieldType.SELECT].includes(field.type)) {
    return {
      mode: field.multi_list ? "multiple" : undefined,
      disabled: disabled || !!field.readonly,
      initialValue: field.default_value ? [field.default_value] : field.default_value,
      allowClear: true,
      label: field.label || field.name,
      required: field.required,
      placeholder: <p>Choose option...</p>,
      value:
        field.multi_list && Array.isArray(value) && !!value?.length
          ? value
          : field.multi_list
            ? []
            : value,

      options: field?.options?.length
        ? field.options.map(({ slug, name }) => ({ value: slug, label: name }))
        : field.list?.items.map((item) => ({ value: item.value, label: item.value })),
    };
  }
  if ([FieldType.SELECT, FieldType.SINGLE_SELECT, FieldType.TIME_SELECT].includes(field.type)) {
    return {
      mode: field.multi_list ? "multiple" : undefined,
      disabled: disabled || !!field.readonly,
      initialValue: field.default_value ? [field.default_value] : field.default_value,
      allowClear: true,
      label: field.label || field.name,
      required: field.required,

      placeholder: <p>Choose option...</p>,
      value:
        field.multi_list && Array.isArray(value) && !!value?.length
          ? value
          : field.multi_list
            ? []
            : value,

      options: field?.options?.length
        ? field.options.map(({ slug, name }) => ({ value: slug, label: name }))
        : field.list?.items.map((item) => ({ value: item.value, label: item.value })),
    };
  }
  if ([FieldType.DATE_PICKER].includes(field.type)) {
    return {
      disabled: disabled || field.readonly,
      format: DATE_FORMAT,
      value: value ? dayjs(value) : null,
      label: field.label || field.name,
      required: field.required,
    };
  }
  if ([FieldType.SIGNATURE].includes(field.type)) {
    return { disabled: disabled || field.readonly, value: value, name: field?.name, type: type };
  }
  if ([FieldType.REPETEABLE_INPUT].includes(field.type)) {
    return {
      disabled: disabled || field.readonly,
      value: value,
      label: field.label || field.name,
      required: field.required,
      formValues: values,
    };
  }
  if ([FieldType.OFFENCES_INPUT].includes(field.type)) {
    return {
      disabled: disabled || field.readonly,
      value: value,
      label: field.label || field.name,
      required: field.required,
    };
  }
  if ([FieldType.OFFENCES].includes(field.type)) {
    return {
      disabled: disabled || field.readonly,
      value: value,
      label: field.label || field.name,
      required: field.required,
    };
  }
};

const getFieldStates = (values: any) => {
  const isVoluntaryAttendanceYes = values?.["voluntary-attendance"] === "yes";
  const isUnderArrestYes = values?.["under-arrest"] === "yes";
  const isVoluntaryAttendanceNA = values?.["voluntary-attendance"] === "na";
  const isUnderArrestNA = values?.["under-arrest"] === "na";

  return {
    timeFieldsDisabled: (isVoluntaryAttendanceNA && isUnderArrestNA) || isVoluntaryAttendanceYes,
    // Custody fields should be disabled if Voluntary Attendance is "Yes"
    custodyFieldsDisabled: isVoluntaryAttendanceYes,
    // Under Arrest should be disabled if Voluntary Attendance is "Yes"
    underArrestDisabled: isVoluntaryAttendanceYes,
  };
};

const clearDisabledFields = (values, setFieldValue) => {
  if (values?.["voluntary-attendance"] === "yes") {
    [
      "under-arrest",
      // "time-arrival-2",
      // "relevant-time",
      // "time-detention-authorised",
      "custody-record-number",
      "custody-record-reviewed",
    ].forEach((field) => {
      setFieldValue("under-arrest", "na");

      setFieldValue(field, null);
    });
  } else if (values?.["voluntary-attendance"] === "na") {
    if (values["voluntary-attendance"] === "na") {
      setFieldValue("under-arrest", "yes");
    }
    setFieldValue("custody-record-reviewed", values?.["under-arrest"]);
    // if (values?.["under-arrest"] === "na") {
    //   ["time-arrival-2", "relevant-time", "time-detention-authorised"].forEach((field) => {
    //     setFieldValue(field, null);
    //   });
    // }
  }
};

const clearDisabledUnderArrest = (values, setFieldValue) => {
  setFieldValue("custody-record-reviewed", values?.["under-arrest"]);
};

const changeFields = (values, fields, setFieldValue) => {
  if (values?.["interview-response-type-advised"]) {
    ["advice-paragraph-letter"].forEach((field) => {
      if (values[field] !== undefined) {
        const text = fields?.options?.find(
          (item) => item.slug === values?.["interview-response-type-advised"]
        )?.slug;

        if (text) {
          setFieldValue(field, objText[text]);
        }
      }
    });
  }
};

const changeFieldsCaseSpecific = (values, fields, value, setFieldValue) => {
  if (value) {
    ["tactical-details"].forEach((field) => {
      if (values[field] !== undefined) {
        const text = fields?.options?.find((item) => item.slug === value)?.name;

        if (text) {
          setFieldValue(field, `Client advised to proceed by way of ${text} `);
        }
      }
    });
  }
};

export const FormItemFactory: FC<IProps> = ({ disabled, field, sectionId, type }) => {
  const dispatch = useAppDispatch();
  const conditions = useSelector(selectConditions);
  const fieldConditions = conditions[field.slug];
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId") ?? "0";
  const values = useSelector(selectFormValues);
  const payload = useSelector(selectPayload);

  const { underArrestDisabled, timeFieldsDisabled, custodyFieldsDisabled } = getFieldStates(
    values?.[sectionId] || {}
  );

  const fundingChangeFields = (values2, fields, setFieldValue) => {
    if (payload?.funding === "Private – Fixed Fee") {
      setFieldValue("cost-band", "Private – Fixed Fee");
    } else if (payload?.funding === "Legal Aid") {
      if (formId === "9") {
        setFieldValue("cost-band", "S22 Police Station Tel");
        return;
      }
      setFieldValue("cost-band", "S22 Police Station Advice");
    } else if (payload?.funding === "Private – Hourly Rate") {
      setFieldValue("cost-band", "Private B");
    }
  };

  const isDisabled =
    field.slug === "time-arrival-2" ||
      field.slug === "relevant-time" ||
      field.slug === "time-detention-authorised"
      ? timeFieldsDisabled
      : field.slug === "custody-record-number" || field.slug === "custody-record-reviewed"
        ? custodyFieldsDisabled
        : field.slug === "under-arrest"
          ? underArrestDisabled
          : disabled;

  const handleChange: ChangeHandler = (value) => {
    dispatch(updateFormValue({ sectionId, slug: field.slug, value }));
    if (field.slug === "disclosure") {
      dispatch(updateFormValue({ sectionId: 140, slug: "disclosure-paragraph-letter", value }));
    }
    changeFieldsCaseSpecific(values?.[sectionId], field, value, (field, value) =>
      dispatch(updateFormValue({ sectionId, slug: field, value }))
    );
  };

  const handleChangeFieldCondition: ChangeHandler = (value) => {
    dispatch(updateFormValue({ sectionId, slug: fieldConditions.slug, value }));
  };

  useEffect(() => {
    clearDisabledFields(values?.[sectionId], (field, value) =>
      dispatch(updateFormValue({ sectionId, slug: field, value }))
    );
  }, [values?.[sectionId]?.["voluntary-attendance"]]);

  useEffect(() => {
    clearDisabledUnderArrest(values?.[sectionId], (field, value) =>
      dispatch(updateFormValue({ sectionId, slug: field, value }))
    );
  }, [values?.[sectionId]?.["under-arrest"]]);

  useEffect(() => {
    changeFields(values?.[sectionId], field, (field, value) =>
      dispatch(updateFormValue({ sectionId, slug: field, value }))
    );
  }, [
    values?.[sectionId]?.["case-specific-and-tactical-advise"],
    values?.[sectionId]?.["interview-response-type-advised"],
  ]);

  useEffect(() => {
    fundingChangeFields(values?.[sectionId], field, (field, value) =>
      dispatch(updateFormValue({ sectionId, slug: field, value }))
    );
  }, [values?.[sectionId]?.["funding"]]);

  if (!!field?.linked_fields?.length) {
    const state = values?.[sectionId];

    const value = field?.linked_fields.reduce((acc, item) => {
      const fieldValue = state?.[item?.slug];

      if (fieldValue != null && !isNaN(Number(fieldValue))) {
        acc += Number(fieldValue);
      }

      return acc;
    }, 0);

    dispatch(updateFormValue({ sectionId, slug: field?.slug, value: formatMinutes(value) }));
    dispatch(updateFormValue({ sectionId, slug: "total-units", value: Math.ceil(value / 6).toString() }));

    return getField(
      field,
      getFieldProps(
        field,
        values?.[sectionId]?.[field?.slug],
        isDisabled || disabled,
        values,
        type
      ),
      sectionId,
      handleChange
    );
  }

  if (
    field.slug === ATTENDANCE_FIELD_ID ||
    field.slug === INTERVIEW_CONTINUATION_FORM ||
    field.slug === POLICE_NAME_SELECT ||
    field.slug === NAME_COURT
  ) {
    return getField(
      field,
      getFieldProps(
        field,
        values?.[sectionId]?.[field.slug] || "",
        isDisabled || disabled,
        values,
        type
      ),
      sectionId,
      handleChange,
      type
    );
  }
  if (field.slug === PREPARED_STEATMENT_FIELD_ID) {
    return getField(
      field,
      getFieldProps(
        field,
        values?.[sectionId]?.[field.slug] || "",
        isDisabled || disabled,
        values,
        type
      ),
      sectionId,
      handleChange
    );
  }

  if (
    [FieldType.SEPARATOR, FieldType.OFFENCES, FieldType.SUB_TITLE, FieldType.STATIC_TEXT].includes(
      field.type
    )
  ) {
    return getField(
      field,
      getFieldProps(
        field,
        values?.[sectionId]?.[field.slug] || "",
        isDisabled || disabled,
        values,
        type
      ),
      sectionId,
      handleChange
    );
  }

  if (fieldConditions) {
    const condFieldValue = values?.[sectionId]?.[field.slug]?.toLowerCase();

    const isDisplayConditionField =
      condFieldValue === fieldConditions.slug ||
      condFieldValue === fieldConditions.value?.toLowerCase();

    return (
      <>
        {" "}
        <div className="condition-field">
          {getField(
            field,
            getFieldProps(
              field,
              values?.[sectionId]?.[field.slug] || "",
              isDisabled || disabled,
              type
            ),
            sectionId,
            handleChange
          )}
        </div>
        <div className="condition-field">
          {isDisplayConditionField &&
            getField(
              fieldConditions,
              getFieldProps(
                fieldConditions,
                values?.[sectionId]?.[fieldConditions.slug] || "",
                isDisabled,
                type
              ),
              sectionId,
              handleChangeFieldCondition
            )}
        </div>
      </>
    );
  }

  if (!field?.conditions?.filter((item) => !!item.field).length) {
    return getField(
      field,
      getFieldProps(
        field,
        values?.[sectionId]?.[field.slug] || "",
        isDisabled || disabled,
        values,
        type
      ),
      sectionId,
      handleChange
    );
  }
};
