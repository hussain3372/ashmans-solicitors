import { CasesReq } from "../shared/types/dashboard";
import servise from "./service";
const baseUrl = import.meta.env.VITE_APP_API_URL;

export const getCases = (data: CasesReq) => {
  return servise.get(
    `${baseUrl}/cases?withValues=${data.withValues}&count=100000&page=1&searchTerm=${data.search}`
  );
};

export const getCasesCount = (data: CasesReq) => {
  return servise.get(`${baseUrl}/casesCount?withValues=${data.withValues}&count=100000&page=1`);
};

export const uploadProfilePicture = (data: { id: string; profile_picture: string }) => {
  return servise.post(`${baseUrl}/upload`, data);
};
