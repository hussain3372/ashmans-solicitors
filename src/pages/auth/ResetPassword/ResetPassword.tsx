import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import logo from "../../../shared/images/Logo.svg";
import "../login/login.scss";
import useResetPasswordController from "./ResetPassword.controller";

export const ResetPassword = () => {
  const { handleSubmit, togglePasswordVisibility, passwordVisible, form, contextHolder } =
    useResetPasswordController();

  return (
    <div className="login d-flex-center">
      {contextHolder}
      <div className="login__form d-flex-center">
        <img src={logo} className="login__logo" />
        <Divider />
        <div className="login__container d-flex-start">
          <div className="login__subtitle">Welcome Back,</div>
          <div className="login__title">Reset Password</div>
        </div>

        <Form form={form} onFinish={handleSubmit} validateTrigger="onBlur">
          <Form.Item
            name="password"
            label={<span className="form-label">Password</span>}
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "This field is required" },
              { min: 8, message: "Enter at least 8 characters" },
            ]}
          >
            <Input.Password
              placeholder="Enter Password"
              suffix={
                <span onClick={togglePasswordVisibility}>
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
              maxLength={60}
            />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label={<span className="form-label">Confirm Password</span>}
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "This field is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Your passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              suffix={
                <span onClick={togglePasswordVisibility}>
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
              maxLength={60}
            />
          </Form.Item>

          <Button className="primary_btn" htmlType="submit">
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
};
