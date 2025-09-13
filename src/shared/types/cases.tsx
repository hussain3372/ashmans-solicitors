import { Dayjs } from "dayjs";

export interface ClientModel {
  title?: string;
  forename?: string;
  surname?: string;
  dateBirth?: string; // ISO date string
  telephoneMobile?: string;
  telephoneHome?: string;
  email?: string;
  address?: string;
  address2?: string | null;
  address3?: string | null;
  address4?: string | null;
  address5?: string | null;
  postCode?: string;
  optMarketingEmails?: boolean;
  gender?: string;
  niNumber?: string;
  ethnicity?: string;
  disability?: string;
  dateFirstContact?: string;
  office?: string;
  venue?: string;
  source?: string;
  funding?: string;
  feeEarner?: string;
  existingProclaimCaseRef?: string | null;
  ufn?: string | null;
  clientCaseNumber?: string | null;
  localCaseId?: string | null;
  'date-birth'?: string | null;
  'date-first-contact'?: string | null;
}

export interface ClientReqI {
  model: ClientData;
  offences: string | null;
}

export interface ClientData {
  model: ClientModel;
  offences?: null;
}

export interface StructureReqI {
  isCourtDuty?: number;
}

export interface Option {
  name: string;
  slug: string;
  form_id: number;
  id: number;
  section_id: number;
}

interface ListItem {
  code: string;
  id: number;
  list_id: number;
  value: string;
  tooltip?: string;
}

export interface List {
  id: number;
  name: string;
  items: ListItem[];
}

export interface CaseFieldI {
  id: number;
  name: string;
  options: Option[];
  required: boolean;
  slug: string;
  sort_order: number;
  type: number;
  hidden: boolean;
  readonly: boolean;
  list_id: number | null;
  attribute: string | null;
  list: List | null;
  field_value: {
    case_id: number;
    field_id: number;
    id: number;
    value: string;
  };
}

export interface PoliceStationOutcomeI {
  code: string;
  description: string | null;
  id: number;
  list_id: number;
  sort_order: number | null;
  value: string;
}

export interface OffenceI {
  definition: string;
  description: string;
  error: boolean;
  id: number;
  ref: string;
  date: string;
  dateEnd?: string;
  dateFormat: string;
  policeStationOutcome: PoliceStationOutcomeI;
  policeStationOutcomeDetails: string;
  [key: string]: string | Dayjs | boolean | number | undefined | PoliceStationOutcomeI;
}

export interface ReqOffence {
  caseId: number;
  offences: OffenceI[];
}

export interface LookupDataI {
  address: string;
  address_2: string;
  address_3: string;
  address_4: string;
  address_5: string;
  agent_email: string;
  client_case_number: string;
  created_at: string;
  date_birth: string;
  date_first_contact: string;
  disability: string;
  e_mail: string;
  ethnicity: string;
  existing_proclaim_case_ref: string;
  fee_earner: string;
  forename: string;
  funding: string;
  gender: string;
  matter_description: string;
  ni_number: string;
  offence_details: string;
  office: string;
  opt_marketing_e_mails: string;
  post_code: string;
  surname: string;
  telephone_home: string;
  telephone_mobile: string;
  title: string;
  ufn: string;
  updated_at: string;
  venue: string;
}

export interface EarnerI {
  code: string;
  description: string | null;
  id: number;
  list_id: number;
  sort_order: string | null;
  value: string;
}

export interface FileI {
  uid: string;
  name: string;
  status: string;
  url: string;
}

export interface File {
  file_name: string;
  file_size: number;
  id: number;
  link: string;
  extention: string;
}
