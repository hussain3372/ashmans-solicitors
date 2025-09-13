import { Input as AntdInput, Button, DatePicker, Divider, Form, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CustomModal from "../../../../../../components/CustomModal/CustomModal";
import { Signature } from "../../../../../../components/Signature/Signature";
import { getCaseValues } from "../../../../../../crud/cases";
import { getCases } from "../../../../../../crud/dashboard";
import { downloadSteatment, sendByEmailSteatment } from "../../../../../../crud/forms";
import { Offences } from "../../../../../../pages/case/components/Offence/Offences";
import { DATE_FORMAT } from "../../../../../../shared/constants/dateFormat";
import { Input } from "../../../../../../shared/ui/Input/Input";
import { TextArea } from "../../../../../../shared/ui/TextArea/TextArea";

import "./style.scss";

const generateSteatment = (name, data) => {
  return `I, ${name}, ${data}, make this statement of my own free will. I understand that I do not have to say anything, but it may harm my defence if I do not mention when questioned something which I later rely on in court. This statement may be given in evidence.I understand that I am being questioned in relation to an allegation(s) `;
};

const getKeyValuePairs = (data, keys) => {
  const result = {};

  data.forEach((item) => {
    if (keys.includes(item.slug)) {
      result[item.slug] = item?.field_value?.value;
    }
  });

  return result;
};

const keys = ["forename", "surname", "date-first-contact"];

export const PreparedStatmentForm = (props) => {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get("caseId");
  const { disabled } = props;

  const inittialState = {
    date: null,
    "interview-date": null,
    details: "1.",
    signature: "",
    statement: "",
    "print-name": "",
    caseId,
  };

  const [state, setState] = useState(props.value ? props.value : inittialState);
  const authUser = useSelector((state) => state.auth);
  const textAreaRef = useRef();

  const [modal, setModal] = useState(false);
  const [caseValues, setCaseValues] = useState([]);
  const [elementCase, setElementCase] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handleOpenModal = () => {
    setModal(true);
  };
  const handleCloseModal = () => {
    setConfirmModal(false);
  };
  const handleClose = () => {
    setModal(false);
  };

  const onValuesChange = (name, value) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (formValues) => {
    const requiredFields = [
      "date",
      "interview-date",
      "details",
      "signature",
      "statement",
      "print-name",
      "allegations",
    ];

    for (const field of requiredFields) {
      if (!formValues[field] || Array.isArray(formValues[field] && !formValues[field].length)) {
        return { valid: false, message: `Field ${field} is invalid or required.` };
      }
    }

    return { valid: true, message: "" };
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await getCaseValues(caseId);
      setCaseValues(res.data.values);
      const result = getKeyValuePairs(res.data.values, keys);
      const firstName = result.forename;
      const lastName = result.surname;
      const fullName = `${firstName} ${lastName}`;
      const data = result["date-first-contact"];
      const text = generateSteatment(fullName, dayjs(data).format("MMM D, YYYY"));

      const reqData = {
        statement: text,
        "print-name": fullName,
      };

      setState((prev) => ({
        ...prev,
        ...reqData,
      }));
    };
    if (caseId && modal) fetch();
  }, [modal]);

  useEffect(() => {
    const fetchCases = () => {
      const data = {
        withValues: false,
        search: "",
      };
      getCases(data).then((res) => {
        const elementCase = res.data.cases
          .filter((elem) => elem.id === +caseId)
          .flatMap((item) => item.offences);
        if (elementCase) {
          setElementCase(elementCase);

          setState((prev) => ({
            ...prev,
            allegations: elementCase,
          }));
        }
      });
    };
    if (caseId) fetchCases();
  }, [caseId]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      statement: prev.statement + ": " + elementCase?.map((item) => item.description).join(","),
    }));
  }, [elementCase, elementCase?.length]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const textarea = textAreaRef.current.resizableTextArea.textArea;
      const text = textarea.value;
      const cursorPosition = textarea.selectionStart;

      const beforeCursor = text.slice(0, cursorPosition);
      const afterCursor = text.slice(cursorPosition);

      const lines = beforeCursor.split("\n");
      const lastLine = lines[lines.length - 1];
      const lineNumber = lastLine.match(/^(\d+)\./)
        ? parseInt(lastLine.match(/^(\d+)\./)[1], 10) + 1
        : 1;

      const newText = beforeCursor + `\n${lineNumber}. ` + afterCursor;

      textarea.value = newText;
      textarea.setSelectionRange(
        cursorPosition + `\n${lineNumber}. `.length,
        cursorPosition + `\n${lineNumber}. `.length
      );

      setState((prev) => ({
        ...prev,
        details: newText,
      }));
    }
  };

  const formatRequestData = (fields) => {
    const req = {
      ...fields,
      caseId: +caseId,
      "recipient-email": { email: authUser.email, recipient: authUser.name },
      allegations: elementCase,
      date: fields.date ? fields.date : null,
      "interview-date": fields["interview-date"] ? fields["interview-date"] : null,
    };

    return req;
  };

  const handleDownload = async () => {
    try {
      const { valid, message } = validateForm(state);

      if (!valid) return messageApi.error(message);

      const req = formatRequestData(state);

      const res = await downloadSteatment({ data: req });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "PreparedSteatment.docx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };
  const handleCancel = async () => {
    props?.handleChange(inittialState);
    setModal(false);
  };

  const handleSave = async () => {
    try {
      props?.handleChange(state);
      setModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [confirmModal, setConfirmModal] = useState(false);

  const onFinish = async (values: any) => {
    try {
      const { valid, message } = validateForm(state);
      if (!valid) return messageApi.error(message);
      if (!authUser.email) return messageApi.error("User email is required");
      if (!caseValues.length) return messageApi.error("Choose offences!");
      if (!valid) return messageApi.error(message);

      const req = {
        ...formatRequestData(state),
        "recipient-email": { email: values.email, recipient: values.recipient },
      };
      await sendByEmailSteatment({ data: req })
        .then(() => {
          setConfirmModal(false);
          messageApi.success("Email sent successfully");
        })
        .catch(() => {
          messageApi.error("Email failed to send");
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="prepared-steatment-container">
      {contextHolder}
      <Button onClick={handleOpenModal} className="ps-button">
        Prepared Statement
      </Button>
      <CustomModal
        open={modal}
        onClose={handleClose}
        title="Prepared statement"
        width={"70vw"}
        content={
          <div className="modal-content">
            <>
              {" "}
              <p className="Label">Date</p>
              <DatePicker
                value={state?.date ? dayjs(state.date, "DD-MM-YYYY") : ""}
                style={{ maxWidth: "333px", marginBottom: "24px" }}
                format="DD-MM-YYYY"
                onChange={(value) => {
                  onValuesChange("date", value ? dayjs(value).format("DD-MM-YYYY") : null);
                }}
                disabled={disabled}
              />
              <Offences withoutBtns={true} />
              <Divider />
              <TextArea
                onChange={(e) => {
                  onValuesChange("statement", e.target.value);
                }}
                label="Steatment"
                value={state?.statement}
                style={{ overflow: "scroll", minHeight: "200px" }}
                disabled={disabled}
              />
              <div style={{ marginTop: "10px" }}>
                <p className="Label">Details</p>
                <AntdInput.TextArea
                  value={state?.details}
                  label="Details"
                  ref={textAreaRef}
                  onKeyDown={handleKeyDown}
                  style={{ overflow: "scroll", minHeight: "200px" }}
                  onChange={(e) => {
                    onValuesChange("details", e.target.value);
                  }}
                  disabled={disabled}
                />
              </div>
              <div className="bottom-elements">
                <div className="signature-block">
                  <p className="signature-label">Signature</p>
                  <Signature
                    signature={state?.signature}
                    value={state?.signature}
                    disabled={disabled}
                    setSignature={(url) => {
                      setState((prev) => ({
                        ...prev,
                        signature: url,
                      }));
                    }}
                  />
                </div>

                <Input
                  value={state?.["print-name"]}
                  label="Print Name"
                  placeholder="Type here..."
                  onChange={(e) => {
                    onValuesChange("print-name", e.target.value);
                  }}
                  disabled={disabled}
                />
                <div className="Wrapper">
                  <p className="Label">Date</p>
                  <DatePicker
                    onChange={(e) => {
                      onValuesChange("interview-date", e ? dayjs(e).format("DD-MM-YYYY") : null);
                    }}
                    value={
                      state?.["interview-date"]
                        ? dayjs(state?.["interview-date"], "DD-MM-YYYY")
                        : null
                    }
                    format={DATE_FORMAT}
                    disabled={disabled}
                  />
                </div>
              </div>
            </>

            <div className="ps-controls">
              <Button onClick={handleDownload} className="primary_round_btn">
                Download
              </Button>
              <Button onClick={() => setConfirmModal(true)} className="secondary_round_btn">
                Email
              </Button>
              <Button onClick={handleCancel} className="secondary_round_btn">
                Cancel
              </Button>
              <Button onClick={handleSave} className="secondary_round_btn">
                Save
              </Button>
            </div>
            {confirmModal && (
              <CustomModal
                open={confirmModal}
                onClose={handleCloseModal}
                title="Email recipient"
                content={
                  <div>
                    <Form
                      name="email_send"
                      layout="vertical"
                      onFinish={onFinish}
                      validateMessages={validateMessages}
                      autoComplete="off"
                      initialValues={{ email: authUser.email, recipient: "" }}
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
                          //disabled={!isFormValid}
                          className="primary_round_btn"
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
        }
      />
    </div>
  );
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};
