import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import { MainLayoutContainer } from "../features/main-layout/MainLayoutContainer";
import Pages from "./pages.ts";
import { PrivateRoute } from "./PrivateRoute";

const commonRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Pages.Login />,
  },
  {
    path: "/reset-password",
    element: <Pages.ResetPassword />,
  },
  {
    path: "/social",
    element: <Pages.Social />,
  },
];

const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Pages.Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Pages.Dashboard />,
  },
  {
    path: "/police_station",
    element: <Pages.Dashboard />,
  },
  {
    path: "/magistrates_court",
    element: <Pages.Dashboard />,
  },
  {
    path: "/youth_court",
    element: <Pages.Dashboard />,
  },
  {
    path: "/court_duty",
    element: <Pages.Dashboard />,
  },
  {
    path: "/crown_court",
    element: <Pages.Dashboard />,
  },
  {
    path: "/case/:instance/form/:mode",
    element: <Pages.FormPage />,
  },
  {
    path: "/case/:instance/:mode",
    element: <Pages.Case />,
  },
];

const routes = [
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayoutContainer />,
        children: privateRoutes,
      },
    ],
  },
  ...commonRoutes,
  {
    path: "*",
    element: <Pages.Login />,
  },
];

const router = createBrowserRouter(routes);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
