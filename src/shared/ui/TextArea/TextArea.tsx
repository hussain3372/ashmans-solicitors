import { Input } from "antd";
import { TextAreaProps } from "antd/lib/input";
import withLabelAndError from "../../helpers/withLabelAndError";
import "./TextArea.scss";

const { TextArea: TextAreaAnt } = Input;

const CustomTextArea = ({ ...props }) => (
  <TextAreaAnt autoSize status={props.error ? "error" : undefined} {...props} />
);

export const TextArea = withLabelAndError<TextAreaProps>(CustomTextArea);
