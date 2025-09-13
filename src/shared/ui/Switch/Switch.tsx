import { Switch as AntdSwitch } from "antd";
import { SwitchProps } from "antd/es/switch";
import withLabelAndError from "../../helpers/withLabelAndError";

const CustomSwitch = ({ ...props }) => (
  <AntdSwitch
    checked={props.value}
    onChange={props.onChange}
    style={{ width: "100%" }}
    {...props}
  />
);

export const Switch = withLabelAndError<SwitchProps>(CustomSwitch);
