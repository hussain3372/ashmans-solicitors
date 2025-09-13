import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getCases } from "../../crud/dashboard";
import { CreateNewMode } from "./components/FormMode/CreateNewMode";
import { EditCreatedMode } from "./components/FormMode/EditCreatedMode";
import { ViewCreatedMode } from "./components/FormMode/ViewCreatedMode";
import {
  createFormThunk,
  editFormThunk,
  selectFormValues,
  selectLoading,
  selectSections,
  selectSectionsIds,
  submitFormThunk,
} from "./formSlice";

import "./styles.scss";

export const Forms = () => {
  const navigate = useNavigate();
  const sectionsIds = useSelector(selectSectionsIds);
  const sections = useSelector(selectSections);
  const values = useSelector(selectFormValues);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState([]);
  const formName = searchParams.get("formName");
  const formId = searchParams.get("formId") ?? "0";
  const caseId = searchParams.get("caseId");
  const recordId = searchParams.get("recordId");
  const location = useLocation();
  const path = location.pathname + location.search;
  const isView = location.pathname.includes("view");
  const isEdit = location.pathname.includes("edit");
  const pathToFromCreateToView = path.replace("create", "view");
  const pathFromEditToView = path.replace("edit", "view");
  const pathFromCreateToForm = `${location.pathname.replace("/form/create", "/view")}?caseId=${caseId}`;
  const pathFromViewToEdit = path.replace("view", "edit");
  const pathBackToCaseInfo = `${location.pathname.replace("/form", "")}?caseId=${caseId}`;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = {
          withValues: false,
          search: "",
        };
        const res = await getCases(data);
        setCases(res.data.cases);
      } catch (error) {
        console.error(error);
      }
    };
    if (caseId) fetchCases();
  }, [caseId]);

  const handleSave = async () => {
    if (!caseId || !formId) return;

    try {
      const data = {
        case_id: caseId,
        form_id: formId,
        sections: Object.values(values),
      };
      const { payload } = await dispatch(createFormThunk({ data }));
      navigate(`${pathToFromCreateToView}&recordId=${payload.forms[0].id}`);
    } catch (error) {
      const firstErrorElement = document.querySelector(".ant-input-status-error");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!caseId || !formId) return;

    try {
      const data = {
        case_id: +caseId,
        form_id: +formId,
        record_id: recordId,
        sections: Object.values(values),
      };
      await dispatch(editFormThunk({ data, recordId }));

      navigate(`${pathFromEditToView}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(submitFormThunk({ formIds: [recordId] }));
      navigate(pathBackToCaseInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const render = () => {
    if (isView) {
      return (
        <ViewCreatedMode
          handleSubmit={handleSubmit}
          formName={formName}
          pathBackToCaseInfo={pathBackToCaseInfo}
          pathFromViewToEdit={pathFromViewToEdit}
          caseId={caseId}
          sections={sections}
          sectionsIds={sectionsIds}
          cases={cases}
          formId={formId}
          recordId={recordId}
        />
      );
    }
    if (isEdit) {
      return (
        <EditCreatedMode
          sections={sections}
          sectionsIds={sectionsIds}
          handleUpdate={handleUpdate}
          pathFromEditToView={pathFromEditToView}
          formId={formId}
          caseId={caseId}
          recordId={recordId}
          formName={formName}
        />
      );
    }
    return (
      <CreateNewMode
        formName={formName}
        caseId={caseId}
        cases={cases}
        sections={sections}
        sectionsIds={sectionsIds}
        handleSave={handleSave}
        pathFromCreateToView={pathFromCreateToForm}
        formId={formId}
      />
    );
  };

  return <Spin spinning={loading}>{render()}</Spin>;
};
