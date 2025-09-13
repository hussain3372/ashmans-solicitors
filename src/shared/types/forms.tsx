import { Dayjs } from "dayjs";
import { List, Option } from "./cases";

export interface FormDataI {
  created_at: string;
  deleted_at: string;
  id: number;
  is_court_duty_form: number;
  is_multiple: number;
  name: string;
  slug: string;
  sort_order: number;
  updated_at: string;
  venue: string[];
  fields: FieldI[];
}

export interface FieldI {
  field_value: { value: string; field_id: number; id: number };
  slug: string;
  type: number;
}

interface FormFieldConditionI {
  action: string;
  condition: string;
  field: string;
  value: string;
}

export interface FormFieldDataI {
  disabled: boolean;
  associated_field_id: number;
  associated_field_value: string;
  // attributes_list: {col_3: true}
  conditions: FormFieldConditionI[];
  current_date: number;
  default_value: string;
  has_conditions: number;
  hidden: number;
  id: number;
  label: string;
  // linked_fields: [];
  list: List | null;
  list_id: number;
  multi_list: number;
  name: string;
  options: Option[];
  position: string;
  readonly: number;
  // repeatable: [];
  required: number;
  section_id: number;
  slug: string;
  sort_order: number;
  static_text: string;
  time_diff: number;
  type: number;
}

export interface FormSectionDataI {
  fields: FormFieldDataI[];
  form_id: number;
  hide_header: number;
  id: number;
  name: string;
  not_applicable_option: number;
  slug: string;
  sort_order: number;
}

export interface sectionItem {
  [key: string]: string | number | Dayjs | undefined;
}

export interface section {
  [key: number]: sectionItem;
}

export interface manageFormReq {
  data: {
    case_id: number;
    form_id: number;
    record_id?: string;
    sections: section[];
  };
}
