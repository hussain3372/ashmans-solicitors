import { Tooltip } from "antd";
import { ComponentType, useEffect, useRef, useState } from "react";
import "./style.scss";

interface WithLabelAndErrorProps {
  label?: string;
  error?: string;
  required?: boolean;
  width?: string;
  helperText?: string;
  titleRight?: string;
}

function withLabelAndError<T extends object>(WrappedComponent: ComponentType<T>) {
  return function WithLabelAndError(props: T & WithLabelAndErrorProps) {
    const { label, error, required, helperText, titleRight, ...restProps } = props;
    const labelRef = useRef<HTMLParagraphElement>(null);
    const [isEllipsis, setIsEllipsis] = useState(false);

    useEffect(() => {
      const checkEllipsis = () => {
        if (labelRef.current) {
          const isOverflowing = labelRef.current.scrollWidth > labelRef.current.clientWidth;
          setIsEllipsis(isOverflowing);
        }
      };

      checkEllipsis();
      window.addEventListener("resize", checkEllipsis);

      return () => {
        window.removeEventListener("resize", checkEllipsis);
      };
    }, [label]);

    return (
      <div className="Wrapper">
        {label && isEllipsis ? (
          <Tooltip title={label} placement="topLeft" overlayClassName="LabelTooltip">
            <p className="Label" ref={labelRef}>
              <span>
                {label} {!!required && <span className="Required">*</span>}
              </span>
              {titleRight && <span>{titleRight}</span>}
            </p>
          </Tooltip>
        ) : (
          <p className="Label" ref={labelRef}>
            <span>
              {label} {!!required && <span className="Required">*</span>}
            </span>
            {titleRight && <span>{titleRight}</span>}
          </p>
        )}
        <WrappedComponent {...({ ...restProps, error } as T)} />
        {error ? (
          <span className="Error">{error}</span>
        ) : helperText ? (
          <span className="HelperText">{helperText}</span>
        ) : (
          false
        )}
      </div>
    );
  };
}

export default withLabelAndError;
