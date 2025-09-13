import { Select as AntSelect, SelectProps as AntSelectProps } from "antd";
import withLabelAndError from "../../helpers/withLabelAndError";
import "./Select.scss";

interface SelectProps extends AntSelectProps {
  groupBy?: string;
  error?: string | string[];
  name: string;
  onChange?: (e: { target: { name: string; value: any } }, value: any) => void;
}

const CustomSelect = ({ name, onChange, children, ...props }: SelectProps) => {
  return !!children ? (
    <AntSelect
      style={{ width: "100%" }}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      status={props.error ? "error" : undefined}
      // options={props.options}
      onChange={(value) =>
        onChange?.(
          {
            target: {
              name,
              value,
            },
          },
          value
        )
      }
      {...props}
    >
      {children}
    </AntSelect>
  ) : (
    <AntSelect
      style={{ width: "100%" }}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      status={props.error ? "error" : undefined}
      options={props.options}
      allowClear
      onChange={(value) =>
        onChange?.(
          {
            target: {
              name,
              value,
            },
          },
          value
        )
      }
      {...props}
    />
  );
};

export const Select = withLabelAndError<SelectProps>(CustomSelect);
