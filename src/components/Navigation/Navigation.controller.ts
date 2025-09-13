import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useNavigationController() {
  const [title, setTitle] = useState("Dashboard");
  const navigate = useNavigate();

  const logoutFunc = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return {
    title,
    setTitle,
    logoutFunc,
  };
}
