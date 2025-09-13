import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { FC, ReactNode } from "react";
import "./customModal.scss";

interface CustomModalProps {
  title: string;
  content: ReactNode;
  open: boolean;
  onClose: () => void;
  subtitle?: string;
  width?: string;
  className?: string;
  zIndex?: number;
  footer?: ReactNode;
}

const CustomModal: FC<CustomModalProps> = ({
  title = "",
  content,
  open,
  onClose,
  subtitle,
  width = 520,
  className,
  zIndex = 1,
  footer = null,
}) => (
  <Modal
    open={open}
    title={
      <div className="modal-header">
        <CloseOutlined onClick={onClose} />
        {title}
      </div>
    }
    width={width}
    centered
    onCancel={onClose}
    footer={footer}
    closable={false}
    className={className}
    zIndex={zIndex}
  >
    <div className="modal-content">
      {subtitle && <div className="modal-content__subtitle">{subtitle}</div>}
      <div>{content}</div>
    </div>
  </Modal>
);

export default CustomModal;
