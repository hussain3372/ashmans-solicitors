import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, Menu } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomModal from "../../../../../../components/CustomModal/CustomModal";
interface ActionDropdownProps {
  record: any;
}

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  record,
  handleEdit,
  handleDelete,
  handlePrint,
  handleDownload,
  handleSend,
  handleSubmitToProclaim,
}) => {
  const [form] = Form.useForm();
  const { name, email } = useSelector((state) => state.auth);

  const [confirmModal, setConfirmModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const onValuesChange = async () => {
    try {
      await form.validateFields();
      setIsFormValid(true);
    } catch (error) {
      setIsFormValid(false);
    }
  };
  const handleOpenModal = () => {
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  const onFinish = (values: any) => {
    handleSend([record.id], values);
    handleCloseModal();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const menu = (record: any) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleEdit(record)}>
        Edit
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handlePrint([record.id])}>
        Print
      </Menu.Item>
      <Menu.Item key="6" onClick={() => handleDownload([record.id])}>
        Download
      </Menu.Item>
      <Menu.Item key="3" onClick={handleOpenModal}>
        Email
      </Menu.Item>
      <Menu.Item key="4" onClick={() => handleSubmitToProclaim([record.id])}>
        Submit to Proclaim
      </Menu.Item>
      <Menu.Item key="5" onClick={() => handleDelete([record.id])}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {" "}
      <Dropdown overlay={menu(record)} trigger={["click"]}>
        <Button
          onClick={(e) => e.stopPropagation()}
          type="text"
          icon={<EllipsisOutlined style={{ fontSize: "16px", transform: "rotate(90deg)" }} />}
        />
      </Dropdown>
      {confirmModal && (
        <CustomModal
          open={confirmModal}
          onClose={handleCloseModal}
          title="Email recipient"
          content={
            <div>
              <Form
                name="basic"
                layout="vertical"
                initialValues={{ name, email }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                validateMessages={validateMessages}
                autoComplete="off"
                onValuesChange={onValuesChange}
              >
                <Form.Item
                  label="Name"
                  name="recipient"
                  rules={[{ required: true, message: "Please input name!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please input a valid email!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <Button className="secondary_round_btn m-r" onClick={handleCloseModal}>
                    Cancel
                  </Button>

                  <Button htmlType="submit" disabled={!isFormValid} className="primary_round_btn">
                    Send
                  </Button>
                </Form.Item>
              </Form>
            </div>
          }
        />
      )}
    </>
  );
};

export default ActionDropdown;
