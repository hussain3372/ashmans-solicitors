import { TimePicker as AntdTimePicker } from "antd";
import { TimePickerProps } from "antd/es/time-picker";
import withLabelAndError from "../../helpers/withLabelAndError";
import "./TimePicker.scss";

const CustomTimePicker = ({ ...props }) => (
  <AntdTimePicker status={props.error ? "error" : undefined} style={{ width: "100%" }} {...props} />
);

export const TimePicker = withLabelAndError<TimePickerProps>(CustomTimePicker);
