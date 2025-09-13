import { manageFormReq } from "../shared/types/forms";
import servise from "./service";
const baseUrl = import.meta.env.VITE_APP_API_URL;

export const getFormsStructure = (id: string) => {
  return servise.get(`${baseUrl}/forms/types/${id}`);
};

export const getFormFieldsStructure = (id: number, caseId: number) => {
  return servise.get(`${baseUrl}/forms/structure/${id}?caseId=${caseId}`);
};

export const createForm = (data: manageFormReq) => {
  return servise.post("/forms", data);
};

export const editForm = (data: manageFormReq, id: number) => {
  return servise.put(`/forms/${id}`, data);
};

export const getFormValues = (id: number) => {
  return servise.get(`/forms/${id}`);
};

export const getConditionalHiddenFields = () => {
  return servise.get(`/getConditionalHiddenFields`);
};

export const submitForm = (formsIds: number[]) => {
  return servise.post(`/forms/proclaim`, {
    formsIds,
  });
};

export const deleteForms = (selectedForms: number[]) => {
  return servise.post(`/forms/deleteMany`, {
    selectedForms,
  });
};

export const downloadForm = (formsIds: number[], clientName: string) => {
  return servise.post(
    `/forms/print`,
    {
      formsIds,
      clientName,
    },
    {
      responseType: "blob",
    }
  );
};

export const previewForm = (formId: number[], clientName: string) => {
  return servise.post(
    `/forms/preview `,
    {
      formId,
      clientName,
    },
    {
      responseType: "blob",
    }
  );
};

export const sendByEmailForm = (
  formsIds: number[],
  emailRecipient: { email: string; recepient: string }
) => {
  return servise.post(`/forms/email`, {
    formsIds,
    emailRecipient,
  });
};

export const sendSteatment = (data) => {
  return servise.post(`/forms/send-prepared-statement`, data);
};

export const downloadSteatment = (data) => {
  return servise.post(`/forms/download-prepared-statement`, data, {
    responseType: "blob",
  });
};

export const sendByEmailSteatment = (data) => {
  return servise.post(`/forms/send-prepared-statement`, data);
};
