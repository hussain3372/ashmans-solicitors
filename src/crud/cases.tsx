import axios from "axios";
import { ClientData, ReqOffence, StructureReqI } from "../shared/types/cases";
import servise from "./service";
const baseUrl = import.meta.env.VITE_APP_API_URL;

export const createCase = (values: ClientData) => {
  return servise.post(`${baseUrl}/cases`, { data: values });
};

export const editCase = (values: ClientData, id: number) => {
  return servise.put(`${baseUrl}/cases/${id}`, { data: values });
};

export const getStructure = (data: StructureReqI) => {
  return servise.get(`${baseUrl}/cases/structure${data.isCourtDuty === 1 ? "?isCourtDuty=1" : ""}`);
};

export const getStatuses = () => {
  return servise.get(`${baseUrl}/cases/statuses`);
};

export const getCaseValues = (id: number) => {
  return servise.get(`${baseUrl}/cases/${id}/values`);
};

export const deleteCase = (id: number) => {
  return servise.delete(`${baseUrl}/cases/${id}`);
};

export const lookup = (search: string) => {
  return servise.get(`${baseUrl}/cases/lookup/${search}`);
};

export const getFormsOffences = () => {
  return servise.get(`${baseUrl}/forms/offences`);
};

export const createOffence = (data: ReqOffence) => {
  return servise.post(`${baseUrl}/cases/offences`, data);
};

export const getFeeEarners = () => {
  return servise.get(`${baseUrl}/cases/fee-earners`);
};

export const transfer = (id: number, data: string[]) => {
  return servise.put(`${baseUrl}/cases/${id}/fee-earner`, { feeEarnerId: data });
};

export const updateStatuses = (caseId: number, status: string, value: string) => {
  return servise.put(`/cases/${caseId}/update/${status}`, { value: value });
};

export const uploadDocument = (caseId: number, formData: FormData) => {
  return axios({
    method: "post",
    url: `${baseUrl}/cases/${caseId}/file`,
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};

export const deleteFile = (caseId: number, fileId: number) => {
  return servise.delete(`/cases/${caseId}/file/${fileId}`);
};
