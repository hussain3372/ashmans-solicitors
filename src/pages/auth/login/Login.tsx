import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import { useEffect } from "react";
import CustomModal from "../../../components/CustomModal/CustomModal";
import logo from "../../../shared/images/Logo.svg";
import microsoftLogo from "../../../shared/images/microsoft-logo.webp";
import useLoginController from "./Login.controller";
import "./login.scss";

export const Login = () => {
  const {
    handleSubmit,
    togglePasswordVisibility,
    passwordVisible,
    setIsForgotPassModal,
    isForgotPassModal,
    renderContentForgotPassword,
    form,
    contextHolder,
    microsoftFunc,
    navigate,
  } = useLoginController();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  return (
    <div className="login d-flex-center">
      {contextHolder}
      <div className="login__form d-flex-center">
        <img src={logo} className="login__logo" />
        <Divider />
        <div className="login__container d-flex-start">
          <div className="login__subtitle">Welcome Back,</div>
          <div className="login__title">Sign in to Ashmans.</div>
        </div>

        <Form form={form} onFinish={handleSubmit} validateTrigger="onBlur">
          <Form.Item
            name="email"
            label={<span className="form-label">Email Address</span>}
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "This field is required" },
              {
                type: "email",
                message: "Please enter a valid email: e.g. email@domain.com",
              },
            ]}
          >
            <Input placeholder="Enter Email" maxLength={255} />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span className="form-label">Password</span>}
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input.Password
              placeholder="Enter Password"
              className="password-input"
              suffix={
                <span onClick={togglePasswordVisibility}>
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              }
              maxLength={60}
            />
          </Form.Item>

          <div className="d-flex-end">
            <div className="login__forgot" onClick={() => setIsForgotPassModal(true)}>
              Forgot my password?
            </div>
          </div>
          <div className="login__microsoft d-flex-center" onClick={microsoftFunc}>
            <img src={microsoftLogo} />
            Sign in with Microsoft
          </div>

          <Button className="primary_btn" htmlType="submit">
            Sign in
          </Button>
        </Form>
      </div>
      <CustomModal
        title="Forgot my password?"
        content={renderContentForgotPassword()}
        open={isForgotPassModal}
        onClose={() => setIsForgotPassModal(false)}
      />
    </div>
  );
};
