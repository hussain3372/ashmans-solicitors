import { Button, Form, Input, message } from "antd";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Azure, login, sendRecoveryEmail } from "../../../crud/auth";
import { setUser } from "../../../redux/slices/authSlice";
import { useAppDispatch } from "../../../redux/store";
import { EmailI, LoginData } from "../../../shared/types/auth";
import { ErrorResponseI } from "../../../shared/types/errors";

export default function useLoginFuncController() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPassModal, setIsForgotPassModal] = useState(false);
  const [form] = Form.useForm<LoginData>();
  const [formEmail] = Form.useForm<EmailI>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const microsoftFunc = () => {
    Azure().then((res) => {
      const url = res.data.url;
      window.open(url, "_blank");
    });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (response) => {
        try {
          const res = await login(response);
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            dispatch(setUser(res.data.user));
            navigate("/dashboard");
          }
        } catch (error) {
          if (
            error instanceof Error &&
            (error as unknown as ErrorResponseI).response?.status === 401
          ) {
            form.setFields([
              {
                name: "password",
                errors: ["Wrong email address or password"],
              },
              {
                name: "email",
                errors: [""],
              },
            ]);
          } else {
            console.log("error", error);
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  const forgotPassword = () => {
    formEmail.validateFields().then((res) => {
      sendRecoveryEmail(res)
        .then(() => {
          messageApi.success(
            `If the email address ${formEmail.getFieldValue("email")}  is associated with an account, you will receive the email with the password recovery link`
          );
          setIsForgotPassModal(false);
        })

        .catch((err) => {
          if (err.message === "Request failed with status code 400") {
            messageApi.success(
              `If the email address ${formEmail.getFieldValue("email")}  is associated with an account, you will receive the email with the password recovery link`
            );
            setIsForgotPassModal(false);
          } else {
            messageApi.error("Something went wrong. please try again.");
          }
        });
    });
  };

  const renderContentForgotPassword = (): ReactNode => {
    return (
      <div className="modal-content">
        <Form form={formEmail}>
          <Form.Item
            label={<span className="form-label">Enter your email</span>}
            labelCol={{ span: 24 }}
            name="email"
            rules={[
              { required: true, message: "This field is required" },
              {
                type: "email",
                message: "Please enter a valid email: e.g. email@domain.com",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Button
            className="primary_btn"
            onClick={() => forgotPassword()}
            style={{ margin: "15px 0 0 0" }}
          >
            Send
          </Button>
        </Form>
      </div>
    );
  };

  return {
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
  };
}
