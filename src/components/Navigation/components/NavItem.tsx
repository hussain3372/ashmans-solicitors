import { FC, ReactElement } from "react";
import "../navigation.scss";
import { useNavigate } from "react-router-dom";

interface NavI {
  title: string;
  image: ReactElement;
  path: string;
  page: string;
  setOpenMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavItem: FC<NavI> = ({
  title,
  image,
  path,
  page,
  setOpenMenu,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`nav-item ${page === path ? "active" : ""}`}
      onClick={() => {
        navigate(path);
        if (setOpenMenu) {
          setOpenMenu(false);
        }
      }}
    >
      <div className="nav-item__image">{image}</div>
      <div className="nav-item__title">{title}</div>
    </div>
  );
};
