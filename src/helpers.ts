import { FC } from "react";
import { CourtDutySolicitorFile } from "./shared/icons/CourtDutySolicitorFile";
import { CrownCourt } from "./shared/icons/CrownCourt";
import { DashboardIcon } from "./shared/icons/DashboardIcon";
import { MagistratesCourt } from "./shared/icons/MagistratesCourt";
import { PoliceStation } from "./shared/icons/PoliceStation";
import { YouthCourt } from "./shared/icons/YouthCourt";

export const getInstanceDataByPath = (
  path: string
): { path: string; title: string; Icon: FC<{ fill?: string }> } => {
  switch (true) {
    case path?.includes("police_station"):
      return { title: "Police Station", Icon: PoliceStation, path: "police_station" };
    case path?.includes("magistrates_court"):
      return { title: "Magistrates Court", Icon: MagistratesCourt, path: "magistrates_court" };
    case path?.includes("youth_court"):
      return { title: "Youth Court", Icon: YouthCourt, path: "youth_court" };
    case path?.includes("court_duty"):
      return {
        title: "Court Duty Solicitor File",
        Icon: CourtDutySolicitorFile,
        path: "court_duty",
      };
    case path?.includes("crown_court"):
      return { title: "Crown Court", Icon: CrownCourt, path: "crown_court" };
    default:
      return { title: "Dashboard", Icon: DashboardIcon, path: "dashboard" };
  }
};

export const transformName = (name: string) => {
  return name
    ?.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Bmc", "BMC")
    .replace("Dscc", "DSCC");
};
