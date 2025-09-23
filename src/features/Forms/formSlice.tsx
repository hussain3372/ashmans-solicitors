import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { getCaseValues } from "../../crud/cases";
import {
  createForm,
  editForm,
  getConditionalHiddenFields,
  getFormFieldsStructure,
  getFormValues,
  submitForm,
} from "../../crud/forms";
import { AsyncThunkAPI } from "../../shared/types/thunk";
import { FieldType, IField } from "./types";

const calculateAge = (birthDate) => {
  //const birth = dayjs(birthDate, "DD-MM-YYYY");
  const today = dayjs();

  const age = today.diff(birthDate, "year");
  return age;
};

const getValueFromSlug = (values: CaseFieldI[], slug: string) => {
  const value = values.find((elem: CaseFieldI) => elem.slug === slug)?.field_value?.value;

  if (value) {
    return value;
  }
};

interface Section {
  id: number;
  name: string;
  slug: string;
}

interface Field {
  id: number;
  name: string;
}

interface FormState {
  sections: { [id: number]: Section };
  fields: { [id: number]: IField };
  values: { [key: IField["slug"]]: string };
  sectionsIds: number[];
  valuesIds: number[];
  loading: boolean;
  error: string | null;
  conditions: { [key: string]: IField["id"][] };
  payload: any;
}

const initialState: FormState = {
  sections: {},
  fields: {},
  values: {},
  conditions: {},
  sectionsIds: [],
  valuesIds: [],
  loading: true,
  error: null,
  payload: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateFormValue: (
      state,
      action: PayloadAction<{ sectionId: number; slug: string; value: string }>
    ) => {
      if (
        state.values &&
        state.values[action?.payload?.sectionId] &&
        action.payload &&
        action.payload.slug
      ) {
        state.values[action.payload.sectionId][action.payload.slug] = action.payload.value;
      }
    },
    clearForm: (state) => {
      state.sections = {};
      state.fields = {};
      state.values = {};
      state.sectionsIds = [];
      state.fieldsIds = [];
      state.valuesIds = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFormFieldsStructureThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFormFieldsStructureThunk.fulfilled,
        (state, action: PayloadAction<FormFieldsStructureResponse>) => {
          const sections = action.payload.formFieldsStructure.sections;

          const sectionsMap: { [id: number]: Section } = {};
          const sectionsIds: number[] = [];
          const fieldsMap: { [id: number]: Field } = {};
          const fieldsIds: number[] = [];
          const values: { [key: string]: string } = {};
          const conditionsMap: { [id: number]: Field } = {};

          sections.forEach((section: Section) => {
            sectionsMap[section.id] = section;
            sectionsIds.push(section.id);
            const sectionFieldsIds: number[] = [];
            section.fields.forEach((field) => {
              fieldsMap[field.id] = field;
              if (!fieldsIds.includes(field.id)) {
                fieldsIds.push(field.id);
              }
              if (field?.conditions?.length) {
                field?.conditions.forEach((fieldCondition) => {
                  conditionsMap[fieldCondition.field] = { ...fieldCondition, ...field };
                });
              }

              values[section?.id] = {
                ...(values[section?.id] || {}),
                [field?.slug]: state.values?.[field.slug]
                  ? state.values?.[field.slug]
                  : field.repeatable.length
                    ? field.repeatable
                    : field?.associated_field_value?.value
                      ? (() => {
                        //const dateValue = dayjs(field?.associated_field_value?.value || "");
                        // return dateValue.isValid()
                        //   ? dateValue
                        //   : field?.associated_field_value?.value;
                        return field?.associated_field_value?.value || "";
                      })()
                      : field?.default_value,
              };

              sectionFieldsIds.push(field.id);
            });
            sectionsMap[section.id].fields = sectionFieldsIds;
          });
          state.conditions = conditionsMap;
          state.values = values;
          state.sections = sectionsMap;
          state.sectionsIds = sectionsIds;
          state.fields = fieldsMap;
          state.loading = false;
        }
      )
      .addCase(getFormFieldsStructureThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getFormValuesThunk.fulfilled, (state, { payload }) => {
        const sectionsMap: { [id: number]: Section } = {};
        const sectionsIds: number[] = [];
        const fieldsMap: { [id: number]: Field } = {};
        const fieldsIds: number[] = [];
        const values: { [key: string]: string } = {};
        const conditionsMap: { [id: number]: Field } = {};
        payload.values.forEach((section: Section) => {
          sectionsMap[section.id] = section;
          sectionsIds.push(section.id);
          const sectionFieldsIds: number[] = [];
          section.fields.forEach((field) => {
            fieldsMap[field.id] = { ...state.fields[field.id], ...field };
            if (!fieldsIds.includes(field.id)) {
              fieldsIds.push(field.id);
            }
            if (field?.conditions?.length) {
              field?.conditions.forEach((fieldCondition) => {
                conditionsMap[fieldCondition.field] = { ...fieldCondition, ...field };
              });
            }

            values[section?.id] = {
              ...(values[section?.id] || {}),
              [field?.slug]: [FieldType.TYPE_PICKER, FieldType.DATE_PICKER].includes(field.type)
                ? field?.field_value?.value
                  ? field.field_value.value
                  : ""
                : field?.field_value?.value,
            };

            sectionFieldsIds.push(field.id);
          });
          sectionsMap[section.id].fields = sectionFieldsIds;
        });
        state.conditions = conditionsMap;
        state.values = values;
        state.sections = sectionsMap;
        state.sectionsIds = sectionsIds;
        state.fields = fieldsMap;
        state.loading = false;
      })
      .addCase(getFormValuesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getValuesThunk.fulfilled, (state, { payload }) => {
        const fields = {
          "client-name": `${getValueFromSlug(payload, "forename")} ${getValueFromSlug(payload, "surname")}`,
          "clients-name-3": `${getValueFromSlug(payload, "forename")} ${getValueFromSlug(payload, "surname")}`,
          "clients-name": `${getValueFromSlug(payload, "forename")} ${getValueFromSlug(payload, "surname")}`,
          "full-name": `${getValueFromSlug(payload, "forename")} ${getValueFromSlug(payload, "surname")}`,
          surname: getValueFromSlug(payload, "surname"),
          forename: getValueFromSlug(payload, "forename"),
          "file-name": `${getValueFromSlug(payload, "forename")} ${getValueFromSlug(payload, "surname")}`,
          "fee-earner": getValueFromSlug(payload, "fee-earner"),
          date: getValueFromSlug(payload, "date") || dayjs().format("YYYY-MM-DD"),
          "date-birth": getValueFromSlug(payload, "date-birth"),
          gender: getValueFromSlug(payload, "gender"),
          age: calculateAge(getValueFromSlug(payload, "date-birth")),
          address: getValueFromSlug(payload, "address"),
          "post-code": getValueFromSlug(payload, "post-code"),
          "tel-mobile": getValueFromSlug(payload, "tel-mobile"),
          "tel-home": getValueFromSlug(payload, "tel-home"),
          "email-address": getValueFromSlug(payload, "email-address"),
          "ni-number": getValueFromSlug(payload, "ni-number"),
          ufn: getValueFromSlug(payload, "ufn"),
          ethnicity: getValueFromSlug(payload, "ethnicity"),
          disability: getValueFromSlug(payload, "disability"),
          source: getValueFromSlug(payload, "source"),
          office: getValueFromSlug(payload, "office"),
          "billing-status": getValueFromSlug(payload, "billing-status"),
          venue: getValueFromSlug(payload, "police-station"),
          "police-station": getValueFromSlug(payload, "police-station"),
          "file-ref": getValueFromSlug(payload, "file-ref"),
          funding: getValueFromSlug(payload, "funding"),
          time: getValueFromSlug(payload, "time") || "",
          "providers-laa-account-number":
            getValueFromSlug(payload, "providers-laa-account-number") || "",
        };

        state.values = fields;
        state.payload = fields;
      })
      .addCase(getValuesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFormValue } = formSlice.actions;

const sectionsIdsSelector = (state) => state.form.sectionsIds;
const sectionsSelector = (state) => state.form.sections;
const fieldsSelector = (state) => state.form.fields;

const loadingSelector = (state) => state.form.loading;

const valuesSelector = (state) => state.form.values;
const conditionSelector = (state) => state.form.conditions;
const valuesPayload = (state) => state.form.payload;

export const selectConditions = createSelector(conditionSelector, (fields) => fields);
export const selectDependencies = createSelector(conditionSelector, (fields) =>
  Object.keys(fields)
);

export const selectSectionsIds = createSelector(sectionsIdsSelector, (ids) => ids);

export const selectFormValues = createSelector(valuesSelector, (values) => values);

export const selectSections = createSelector(sectionsSelector, (ids) => ids);

export const selectPayload = createSelector(valuesPayload, (payload) => payload);

export const selectSectionById = (sectionId) =>
  createSelector(sectionsSelector, (sections) => sections[sectionId]);

export const selectIsRequiredSectionByIds = (sectionId) =>
  createSelector([sectionsSelector, fieldsSelector, valuesSelector], (sections, fields, values) => {
    const fieldsMap = sections?.[sectionId]?.fields;

    const requiredFields = fieldsMap
      .map((id) => fields?.[id])
      .filter((field) => field?.required && !values[sectionId]?.[field?.slug]);

    return requiredFields;
  });

export const isValidForm = createSelector([fieldsSelector, valuesSelector], (fields, values) => {
  const requiredFields = Object.values(fields).filter((field) => field?.required);
  const isFieldFilled = requiredFields
    .map((item) => values?.[item?.section_id]?.[item?.slug])
    .filter(Boolean);

  return requiredFields.length === isFieldFilled.length;
});

export const selectFieldById = (fieldId) =>
  createSelector(fieldsSelector, (fields) => fields[fieldId]);

export const selectLoading = createSelector(loadingSelector, (loading) => loading);

interface GetFormFieldsStructureArgs {
  formId: number;
  caseId: number;
}

interface FormFieldsStructureResponse {
  formFieldsStructure: {
    sections: [];
  };
}

interface ValuesResponse {
  values: {
    [key: string]: string;
  };
}

interface GetValuesArgs {
  caseId: number;
}

export interface ManageFormReq {
  data: {
    case_id: number;
    form_id: number;
    sections: any[];
    record_id?: number;
  };
}

interface CreateFormArgs {
  data: ManageFormReq;
}

interface EditFormArgs {
  data: ManageFormReq;
  recordId: number;
  pathFromEditToView: string;
}
interface CreateFormResponse {
  data: {
    forms: { id: number }[];
  };
}

interface FetchFormValuesArgs {
  recordId: number;
}

const THUNK_NAME = {
  GET_STRUCTURE: `${formSlice.name}/getStructure`,
  GET_VALUES: `${formSlice.name}/getValues`,
  GET_FORM_VALUES: `${formSlice.name}/getFormValues`,

  CREATE_FORM: `${formSlice.name}/createForm`,
  UPDATE_FORM: `${formSlice.name}/editForm`,
  GET_CINDITION_FIELDS: `${formSlice.name}/getConditionalFields`,
  SUBMIT_FORM: `${formSlice.name}/submitForm`,
};

export const getFormFieldsStructureThunk = createAsyncThunk<
  FormFieldsStructureResponse,
  GetFormFieldsStructureArgs,
  AsyncThunkAPI
>(THUNK_NAME.GET_STRUCTURE, async ({ formId, caseId }, { rejectWithValue }) => {
  try {
    const response = await getFormFieldsStructure(formId, caseId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getValuesThunk = createAsyncThunk<ValuesResponse, GetValuesArgs, AsyncThunkAPI>(
  THUNK_NAME.GET_VALUES,
  async ({ caseId }, _) => {
    try {
      const valuesResponse = await getCaseValues(caseId);
      const valuesData = valuesResponse.data.values;

      return valuesData;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching sections and values");
    }
  }
);

export const createFormThunk = createAsyncThunk<CreateFormResponse, CreateFormArgs, AsyncThunkAPI>(
  THUNK_NAME.CREATE_FORM,
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await createForm({ data });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editFormThunk = createAsyncThunk<void, EditFormArgs, AsyncThunkAPI>(
  THUNK_NAME.UPDATE_FORM,
  async ({ data, recordId }, { rejectWithValue }) => {
    try {
      await editForm({ data }, recordId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getFormValuesThunk = createAsyncThunk<
  ValuesResponse,
  FetchFormValuesArgs,
  AsyncThunkAPI
>(THUNK_NAME.GET_FORM_VALUES, async ({ recordId }, { rejectWithValue }) => {
  try {
    const response = await getFormValues(recordId);

    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getConditionalFields = createAsyncThunk<ValuesResponse, null, AsyncThunkAPI>(
  THUNK_NAME.GET_CINDITION_FIELDS,
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConditionalHiddenFields();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const submitFormThunk = createAsyncThunk<
  ValuesResponse,
  { formIds: number[] },
  AsyncThunkAPI
>(THUNK_NAME.SUBMIT_FORM, async ({ formIds }, { rejectWithValue }) => {
  try {
    await submitForm(formIds);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export default formSlice;
