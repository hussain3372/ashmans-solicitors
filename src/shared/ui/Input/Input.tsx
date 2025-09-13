import { Input as AntdInput, InputProps } from "antd";
import withLabelAndError from "../../helpers/withLabelAndError";
import "./Input.scss";

interface CustomInputProps extends InputProps {
  // Add any additional props you need here
}

const CustomInput = (props) => {
  return <AntdInput status={props.error ? "error" : undefined} {...props} />;
};

export const Input = withLabelAndError<CustomInputProps>(CustomInput);
