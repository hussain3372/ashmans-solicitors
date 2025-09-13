import { ErrorBoundary } from "react-error-boundary";
import { Navigate, Outlet } from "react-router-dom";
// import { NotFound } from "../pages/not-found/index";

export const PrivateRoute = () => {
  const authToken = localStorage.getItem("token");

  return (
    <ErrorBoundary fallback={<>{/* <NotFound title="" subTitle="Something Error" /> */}</>}>
      {authToken ? <Outlet /> : <Navigate to="/login" />}
    </ErrorBoundary>
  );
};
