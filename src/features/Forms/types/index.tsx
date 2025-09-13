export enum FieldType {
  SIGNATURE = 10,
  BUTTON = 19,
  INPUT = 1,
  TYPE_PICKER = 6,
  DATE_PICKER = 5,
  SWITCH = 9,
  // RADIO_GROUP = 7,
  TEXT_AREA = 3,
  SELECT = 7,
  SINGLE_SELECT = 15,
  SEPARATOR = 14,
  READONLY_INPUT = 8,
  OFFENCES = 13,
  OFFENCES_INPUT = 17,
  SUB_TITLE = 11,
  STATIC_TEXT = 18,
  REPETEABLE_INPUT = 12,
  TIME_SELECT = 16,
  ATTENDANCE_FIELD_ID = "attendance-time",
  PREPARED_STEATMENT_FIELD_ID = "interview-continuation-form",
}

interface ListItem {
  code: string;
  id: number;
  list_id: number;
  value: string;
}

export interface List {
  id: number;
  name: string;
  items: ListItem[];
}

interface IFieldCondition {
  action: string;
  condition: string;
  field: string;
  value: string;
}
export interface Option {
  name: string;
  slug: string;
  form_id: number;
  id: number;
  section_id: number;
}

export interface IField {
  disabled: boolean;
  associated_field_id: number;
  associated_field_value: string;
  attributes_list: { [key: string]: string };
  conditions: IFieldCondition[];
  current_date: number;
  default_value: string;
  has_conditions: number;
  hidden: number;
  id: number;
  label: string;
  linked_fields: [];
  list: List | null;
  list_id: number;
  multi_list: number;
  name: string;
  options: Option[];
  position: string;
  readonly: number;
  repeatable: [];
  required: number;
  section_id: number;
  slug: string;
  sort_order: number;
  static_text: string;
  time_diff: number;
  type: number;
}

export enum FormStatus {
  SUBMITED = 7,
  TRANSFERED = 9,
}

export enum FormAction {
  PRINT = 1,
  SEND = 2,
  DELETE = 3,
}
