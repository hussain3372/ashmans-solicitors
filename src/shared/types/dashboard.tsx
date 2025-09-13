import { OffenceI } from "./cases";

export interface CasesReq {
  withValues: boolean;
  search: string;
}

export interface FormI {
  case_id: number;
  client_name: null;
  created_at: string;
  deleted_at: null;
  form: { id: number; name: string };
  form_id: number;
  id: number;
  status: number;
  updated_at: string;
  user_id: number;
  user_name: string;
  _id: string;
}

export interface CaseDetails {
  id: number;
  client_name: string;
  status: number;
  submitted: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  app_case_ref: string;
  title: string;
  is_from_lookup: number;
  is_court_duty: number;
  case_type: string;
  case_id: number;
  offences: OffenceI[];
  form_records: FormI[];
  feeEarner: string;
  "case-status": string;
  "billing-status": string;
}

export interface CasesCount {
  case_type: string;
  total: number;
}
