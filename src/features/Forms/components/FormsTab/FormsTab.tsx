import { Button, Form, Input, message } from "antd";
import { DeleteIcon, PrintIcon, SendEmailIcon } from "../../../../shared/icons";
import emptyForm from "../../../../shared/images/emptyForm.svg";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import {
  deleteForms,
  downloadForm,
  previewForm,
  sendByEmailForm,
  submitForm,
} from "../../../../crud/forms";
import { FormI } from "../../../../shared/types/dashboard";
import { FormAction, FormStatus } from "../../types";
import { FormRowItem } from "./components/FormRowItem/FormRowItem";

const buttonTitle = {
  [FormAction.DELETE]: "Delete",
  [FormAction.PRINT]: "Download",
  [FormAction.SEND]: "Send",
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

export const FormsTab = ({
  selectFormOpen,
  setSelectFormOpen,
  element,
  refActions,
  instance,
  caseId,
  setElement,
}) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editingType, setEditingType] = useState(0);
  const [selectedRow, setSelectedRow] = useState([]);
  const [form] = Form.useForm();
  const { name, email } = useSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();

  const [confirmModal, setConfirmModal] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [printModal, setPrintModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const onValuesChange = async () => {
    try {
      await form.validateFields();
      setIsFormValid(true);
    } catch (error) {
      setIsFormValid(false);
    }
  };
  const handleOpenModal = () => {
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
    setPrintModal(false);
    setFileContent(null);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleClickBulkEdit = (type: FormAction) => {
    setEditingType(type);
    setEditing(!!type);
  };

  const handleDownload = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      const res = await downloadForm(ids, null);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Forms.${ids.length > 1 ? "zip" : "docx"}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFileForPreview = async (ids: number[]) => {
    if (!ids.length) return;
    setPrintModal(true);
    try {
      const res = await previewForm(ids?.[0], null);
      const url = URL.createObjectURL(res.data);
      setFileContent(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async (
    ids: number[],
    emailRecipient: { email: string; recipient: string }
  ) => {
    if (!ids.length) return;
    try {
      await sendByEmailForm(ids, emailRecipient);
      messageApi.success("Email sent successfully");
    } catch (error) {
      console.error(error);
      messageApi.error("Email failed to send");
    }
  };
  const handleSubmitToProclaim = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      await submitForm(ids);
      setElement((prev) => ({
        ...prev,
        form_records: prev.form_records.map((form) =>
          ids.includes(form.id) ? { ...form, status: FormStatus.SUBMITED } : form
        ),
      }));
      messageApi.success("Submitted successfully");
    } catch (error) {
      console.error(error);
      messageApi.success("Submitted failed");
    }
  };
  const handleDelete = async (ids: number[]) => {
    if (!ids.length) return;
    try {
      await deleteForms(ids);
      setElement((prev) => ({
        ...prev,
        form_records: prev.form_records.filter((form) => !ids.includes(form.id)),
      }));
      messageApi.success("Deleted successfully");
    } catch (error) {
      console.error(error);
      messageApi.success("Deleted failed");
    }
  };
  const handleEdit = (form) => {
    navigate(
      `/case/${instance}/form/view?formName=${form.form.name}&formId=${form.form_id}&caseId=${caseId}&recordId=${form.id}`
    );
  };

  const onClickBulkSubmit = async () => {
    if (editingType === FormAction.DELETE) {
      await handleDelete(selectedRow);
      onClickBulkCancel();
    }
    if (editingType === FormAction.PRINT) {
      await handleDownload(selectedRow);
      onClickBulkCancel();
    }
    if (editingType === FormAction.SEND) {
      handleOpenModal();
    }
  };

  const onClickBulkCancel = async () => {
    setEditing(false);
    setEditingType(0);
    setSelectedRow([]);
  };

  const onFinish = (values: any) => {
    handleSend(selectedRow, values);
    onClickBulkCancel();
    handleCloseModal();
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="case__from-content">
      {contextHolder}
      {!!element?.form_records?.length && (
        <div className="controls-wrapper">
          <div>
            <div className="case__form-action-wrapper">
              <span className="case__form-icon">
                <span onClick={() => handleClickBulkEdit(FormAction.PRINT)}>
                  <PrintIcon />
                </span>
              </span>
              <span className="case__form-icon">
                <span onClick={() => handleClickBulkEdit(FormAction.SEND)}>
                  <SendEmailIcon />
                </span>
              </span>
              <span className="case__form-icon">
                <span onClick={() => handleClickBulkEdit(FormAction.DELETE)}>
                  <DeleteIcon />
                </span>
              </span>
            </div>
          </div>
          {!editing ? (
            <Button className="primary_round_btn" onClick={() => setSelectFormOpen(true)}>
              + Add Form
            </Button>
          ) : (
            <div>
              <Button className="secondary_round_btn m-r" onClick={onClickBulkCancel}>
                Cancel
              </Button>

              <Button className="primary_round_btn" onClick={onClickBulkSubmit}>
                {buttonTitle[editingType]}
              </Button>
            </div>
          )}
        </div>
      )}

      {element?.form_records && !!element?.form_records?.length ? (
        element?.form_records.map((form: FormI) => {
          return (
            <FormRowItem
              key={form.id}
              form={form}
              refActions={refActions}
              instance={instance}
              caseId={caseId}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handlePrint={fetchFileForPreview}
              handleDownload={handleDownload}
              handleSend={handleSend}
              handleSubmitToProclaim={handleSubmitToProclaim}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              editing={editing}
            />
          );
        })
      ) : (
        <div className="offences__wrapper" style={{ marginTop: 36 }}>
          <img className="case__forms__img" src={emptyForm} />
          <div className="nothing_title">Nothing in Forms</div>
          <div className="nothing_desc">When you add an form, they'll appear here.</div>
          <Button className="primary_round_btn" onClick={() => setSelectFormOpen(true)}>
            + Add Form
          </Button>
        </div>
      )}
      {printModal && fileContent && (
        <CustomModal
          open={printModal}
          onClose={handleCloseModal}
          title="Preview form"
          width="900px"
          content={
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <Viewer fileUrl={fileContent} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          }
        />
      )}
      {confirmModal && (
        <CustomModal
          open={confirmModal}
          onClose={handleCloseModal}
          title="Email recipient"
          content={
            <div>
              <Form
                name="basic"
                layout="vertical"
                initialValues={{ name, email }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                validateMessages={validateMessages}
                autoComplete="off"
                onValuesChange={onValuesChange}
              >
                <Form.Item
                  label="Name"
                  name="recipient"
                  rules={[{ required: true, message: "Please input name!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please input a valid email!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <Button className="secondary_round_btn m-r" onClick={handleCloseModal}>
                    Cancel
                  </Button>

                  <Button
                    htmlType="submit"
                    disabled={!isFormValid}
                    className="primary_round_btn"
                    onClick={onClickBulkSubmit}
                  >
                    Send
                  </Button>
                </Form.Item>
              </Form>
            </div>
          }
        />
      )}
    </div>
  );
};
