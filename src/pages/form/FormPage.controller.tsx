import { Form, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getCaseValues } from "../../crud/cases";
import { createForm, editForm, getFormFieldsStructure, getFormValues } from "../../crud/forms";
import { CaseFieldI } from "../../shared/types/cases";
import { FieldI, FormDataI, FormSectionDataI, manageFormReq } from "../../shared/types/forms";
import { getExtendedDefaultValue } from "./helpers";

export default function useFormPageController() {
  const [slug, setSlug] = useState("");
  const [serchParams] = useSearchParams();
  const formName = serchParams.get("formName");
  const formId = serchParams.get("formId") ?? "0";
  const caseId = serchParams.get("caseId");
  const recordId = serchParams.get("recordId");
  const [sections, setSections] = useState<FormSectionDataI[]>([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const isView = location.pathname.includes("view");
  const isEdit = location.pathname.includes("edit");
  const navigate = useNavigate();
  const path = location.pathname + location.search;
  const pathToFromCreateToView = path.replace("create", "view");
  const pathFromEditToView = path.replace("edit", "view");
  const pathFromCreateToView = path.replace("create", "view");
  const pathFromViewToEdit = path.replace("view", "edit");
  const pathBackToCaseInfo = `${location.pathname.replace("/form", "")}?caseId=${caseId}`;
  const [messageApi, contextHolder] = message.useMessage();
  const initialValues: { [key: string]: string | string[] } = {};
  sections.forEach(({ id: sectionId, fields }) => {
    fields.forEach(({ id: fieldId, default_value, multi_list, slug }) => {
      const defaultValue = getExtendedDefaultValue(default_value, formId, sectionId, fieldId);
      initialValues[slug] = multi_list ? (defaultValue ? [defaultValue] : []) : defaultValue;
    });
  });

  const getValueFromSlug = (values: CaseFieldI[], slug: string) => {
    const value = values.find((elem: CaseFieldI) => elem.slug === slug)?.field_value?.value;

    if (value) {
      return value;
    }
  };

  useEffect(() => {
    if ((isView || isEdit) && recordId) {
      getFormValues(+recordId).then((res) => {
        res.data.values.forEach((elem: FormDataI) => {
          const obj: { [key: string]: string | Dayjs } = {};
          elem.fields.forEach((field: FieldI) => {
            if (field.type === 5 || field.type === 6) {
              if (field?.field_value?.value) {
                obj[field.slug as keyof typeof obj] = dayjs(field.field_value.value);
              }
            } else {
              if (field?.field_value?.value) {
                obj[field.slug as keyof typeof obj] = field.field_value.value;
              } else {
                obj[field.slug as keyof typeof obj] = "";
              }
            }
            form.setFieldsValue(obj);
          });
        });
      });
    }
  }, [isView, isEdit, recordId, form]);

  useEffect(() => {
    if (formId && caseId) {
      getFormFieldsStructure(formId, caseId)
        .then((res) => {
          setSections(res.data.formFieldsStructure.sections);
          setTimeout(() => form.resetFields(), 0);
          return res.data.formFieldsStructure.sections;
        })
        .then((sections) => {
          getCaseValues(caseId).then((values) => {
            const valuesData = values.data.values;

            if (!isEdit && !isView) {
              if (sections?.find((elem: FormSectionDataI) => elem.id === 131)) {
                form.setFieldsValue({
                  "file-name": `${getValueFromSlug(valuesData, "forename")} ${getValueFromSlug(valuesData, "surname")}`,
                  "fee-earner": getValueFromSlug(valuesData, "fee-earner"),
                  date: dayjs(),
                });
              }
            }
          });
        });
    }
  }, [formName, formId, caseId, form, isEdit, isView]);

  const saveFormFunc = () => {
    form.validateFields().then((values) => {
      if (!caseId || !formId) return;
      const data: manageFormReq = {
        data: {
          case_id: +caseId,
          form_id: +formId,
          sections: [values],
        },
      };
      if (isEdit && recordId && caseId) {
        data.data.record_id = recordId;
        editForm(data, +caseId).then(() => {
          messageApi.success("Form has been successfuly updated");
          navigate(`${pathFromEditToView}`);
        });
      } else {
        createForm(data).then((res) => {
          messageApi.success("Form has been successfuly created");
          navigate(`${pathToFromCreateToView}&recordId=${res.data.forms[0].id}`);
        });
      }
    });
  };

  return {
    slug,
    setSlug,
    formName,
    formId,
    sections,
    setSections,
    form,
    initialValues,
    saveFormFunc,
    contextHolder,
    pathFromViewToEdit,
    pathFromEditToView,
    pathFromCreateToView,
    navigate,
    isView,
    pathBackToCaseInfo,
    isEdit,
  };
}
