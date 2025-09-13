import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getInstanceDataByPath } from "../../helpers";
import { useAppSelector } from "../../redux/store";
import { CourtDutySolicitorFile } from "../../shared/icons/CourtDutySolicitorFile";
import { CrownCourt } from "../../shared/icons/CrownCourt";
import { DashboardIcon } from "../../shared/icons/DashboardIcon";
import { MagistratesCourt } from "../../shared/icons/MagistratesCourt";
import { PoliceStation } from "../../shared/icons/PoliceStation";
import { YouthCourt } from "../../shared/icons/YouthCourt";
import defaultPhoto from "../../shared/images/default-photo.jpg";
import logo from "../../shared/images/Logo.svg";
import logout from "../../shared/images/logout.svg";
import { NavItem } from "./components/NavItem";
import { useNavigationController } from "./Navigation.controller";
import "./navigation.scss";

interface NavigationI {
  setOpenProfile: Dispatch<SetStateAction<boolean>>;
}

export const Navigation: FC<NavigationI> = ({ setOpenProfile }) => {
  const [page, setPage] = useState("/dashboard");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const path = location.pathname;
  const user = useAppSelector((state) => state.auth);

  const { setTitle, logoutFunc } = useNavigationController();

  useEffect(() => {
    setPage(path);
    setTitle(getInstanceDataByPath(path).title);
  }, [path, setTitle]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="navigation">
      <div className="d-flex-center">
        <img src={logo} className="navigation__logo" />
      </div>
      <div className="navigation__list">
        <NavItem title="Dashboard" image={<DashboardIcon />} path="/dashboard" page={page} />
        <NavItem
          title="Police Station"
          image={<PoliceStation />}
          path="/police_station"
          page={page}
        />
        <NavItem
          title="Magistrates Court"
          image={<MagistratesCourt />}
          path="/magistrates_court"
          page={page}
        />
        <NavItem title="Youth Court" image={<YouthCourt />} path="/youth_court" page={page} />
        <NavItem
          title="Court Duty"
          image={<CourtDutySolicitorFile />}
          path="/court_duty"
          page={page}
        />
        <NavItem title="Crown Court" image={<CrownCourt />} path="/crown_court" page={page} />
      </div>
      <div className="navigation__profile row">
        <div className="d-flex-center relative">
          <img
            src={user?.profilePicture ? user?.profilePicture : defaultPhoto}
            className="profile-image"
            onClick={() => setOpenProfile(true)}
          />
          <div className="profile-name">{user?.name}</div>
          {isOnline && <div className="profile-status" />}
        </div>
        <div className="profile-logout" onClick={logoutFunc}>
          <img src={logout} />
        </div>
      </div>
    </div>
  );
};
