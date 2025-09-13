import { FC, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAppSelector } from "../../redux/store";
import { CourtDutySolicitorFile } from "../../shared/icons/CourtDutySolicitorFile";
import { CrownCourt } from "../../shared/icons/CrownCourt";
import { DashboardIcon } from "../../shared/icons/DashboardIcon";
import { MagistratesCourt } from "../../shared/icons/MagistratesCourt";
import { PoliceStation } from "../../shared/icons/PoliceStation";
import { YouthCourt } from "../../shared/icons/YouthCourt";
import burger from "../../shared/images/burger.png";
import defaultPhoto from "../../shared/images/default-photo.jpg";
import logout from "../../shared/images/logout.svg";
import { NavItem } from "../Navigation/components/NavItem";
import { useNavigationController } from "../Navigation/Navigation.controller";
import "./header.scss";

interface HeaderI {
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: FC<HeaderI> = ({ setOpenProfile }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openMenu, setOpenMenu] = useState(false);
  const [page, setPage] = useState("/dashboard");
  const location = useLocation();
  const path = location.pathname;
  const ref = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth);

  useClickOutside(ref, () => setOpenMenu(false));

  const { logoutFunc } = useNavigationController();

  useEffect(() => setPage(path), [path, setPage]);

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
    <div className="header">
      <div ref={ref}>
        {window.innerWidth <= 1024 && (
          <img src={burger} className="header__burger" onClick={() => setOpenMenu(true)} />
        )}
        {openMenu && (
          <div className="header__navigation-wrapper">
            <NavItem
              title="Dashboard"
              image={<DashboardIcon />}
              path="/dashboard"
              page={page}
              setOpenMenu={setOpenMenu}
            />
            <NavItem
              title="Police Station"
              image={<PoliceStation />}
              path="/police_station"
              page={page}
              setOpenMenu={setOpenMenu}
            />
            <NavItem
              title="Magistrates Court"
              image={<MagistratesCourt />}
              path="/magistrates_court"
              page={page}
              setOpenMenu={setOpenMenu}
            />
            <NavItem
              title="Youth Court"
              image={<YouthCourt />}
              path="/youth_court"
              page={page}
              setOpenMenu={setOpenMenu}
            />
            <NavItem
              title="Court Duty"
              image={<CourtDutySolicitorFile />}
              path="/court_duty"
              page={page}
              setOpenMenu={setOpenMenu}
            />
            <NavItem
              title="Crown Court"
              image={<CrownCourt />}
              path="/crown_court"
              page={page}
              setOpenMenu={setOpenMenu}
            />
            <div className="header__profile row">
              <div className="d-flex-center relative">
                <img
                  src={user?.profilePicture ? user?.profilePicture : defaultPhoto}
                  className="profile-image"
                  onClick={() => {
                    setOpenMenu(false);
                    setOpenProfile(true);
                  }}
                />
                <div className="profile-name">{user?.name}</div>
                {isOnline && <div className="profile-status" />}
              </div>
              <div className="profile-logout" onClick={logoutFunc}>
                <img src={logout} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
