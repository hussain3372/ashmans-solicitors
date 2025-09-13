import { DatePicker as AntdDatePicker } from "antd";
import { DatePickerProps } from "antd/es/date-picker";
import withLabelAndError from "../../helpers/withLabelAndError";

import "./DatePicker.scss";

const CustomDatePicker = ({ ...props }) => (
  <AntdDatePicker status={props.error ? "error" : undefined} style={{ width: "100%" }} {...props} />
);

export const DatePicker = withLabelAndError<DatePickerProps>(CustomDatePicker);
