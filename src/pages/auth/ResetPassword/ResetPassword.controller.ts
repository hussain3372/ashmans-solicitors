import { Form, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { passwordRecovery } from "../../../crud/auth";
import { PasswordsI } from "../../../shared/types/auth";

export default function useResetPasswordController() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPassModal, setIsForgotPassModal] = useState(false);
  const [form] = Form.useForm<PasswordsI>();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const tokenParams = searchParams.get("token");
  messageApi;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (response) => {
        const data: PasswordsI = {
          ...response,
          email: email ? email : "",
          token: tokenParams ? tokenParams : "",
        };
        await passwordRecovery(data);
        await messageApi.success("The password has been successfully changed");
        await navigate("/login");
      })
      .catch((error) => console.log("error", error));
  };

  return {
    handleSubmit,
    togglePasswordVisibility,
    passwordVisible,
    setIsForgotPassModal,
    isForgotPassModal,
    form,
    contextHolder,
  };
}
