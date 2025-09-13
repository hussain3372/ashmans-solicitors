import { message, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AzurePost } from "../../crud/auth";
import "./social.scss";

export const Social = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!code) return;
    AzurePost(code)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        return messageApi.success("The account was successfully linked");
      })
      .then(() => {
        navigate("/dashboard");
      });
  }, [code]);

  return (
    <div className="social">
      {contextHolder}
      <Spin size="large"></Spin>
    </div>
  );
};
