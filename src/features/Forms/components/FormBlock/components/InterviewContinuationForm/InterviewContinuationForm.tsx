import { MinusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select, Tabs } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import CustomModal from "../../../../../../components/CustomModal/CustomModal";
import { Signature } from "../../../../../../components/Signature/Signature";
import { DATE_FORMAT } from "../../../../../../shared/constants/dateFormat";
import { DatePicker } from "../../../../../../shared/ui/DatePicker/DatePicker";
import { Input } from "../../../../../../shared/ui/Input/Input";
import { TimePicker } from "../../../../../../shared/ui/TImePicker/TImePicker";
import { TextArea } from "../../../../../../shared/ui/TextArea/TextArea";
import "./style.scss";

export const InterviewContinuationForm = (props) => {
  const { value, type, disabled } = props || {};
  const [modal, setModal] = useState(false);
  const [valueSelect, setValueSelect] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const [formValues, setFormValues] = useState(
    value
      ? value
      : {
        sections: [
          {
            "further-disclosure": "",
            "further-consultation": "",
            "further-advice": "",
            "interview-signature": "",
            "interview-date": "",
            "case-specific": "",
          },
          {
            "interview-interviewing-officers": "",
            "interview-date-2": "",
            "interview-start-time-2": null,
            "interview-end-time-2": null,
            "interview-other-persons-present": "",
            "interview-details": "",
            "interview-question-answer-repeater": [{ question2: "", answer: "" }],
          },
        ],
      }
  );

  const handleOpenModal = () => {
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleFieldChange = (sectionIndex, field, value) => {
    setButtonActive(true);
    setFormValues((prevState) => {
      const updatedSections = [...prevState.sections];
      const updatedFieldValues = {
        ...updatedSections[sectionIndex],
        [field]: value,
      };

      // Check if the section is 'interview-question-answer-repeater'
      if (field === "interview-question-answer-repeater") {
        const questionsAnswers = updatedFieldValues[field] || [];
        const lastPairIndex = questionsAnswers.length - 1;
        const lastPair = questionsAnswers[lastPairIndex] || {};
        const isLastPairFilled = lastPair.question2 && lastPair.answer;

        // If the last pair is filled and there's no pair after it, add a new pair
        if (isLastPairFilled && lastPairIndex === questionsAnswers.length - 1) {
          updatedFieldValues[field] = [
            ...questionsAnswers,
            {
              question2: "",
              answer: valueSelect !== "fully-commented-interview" ? "No Comment" : "",
            }, // Add a new empty pair
          ];
        }
      }

      updatedSections[sectionIndex] = updatedFieldValues;
      return { sections: updatedSections };
    });
  };

  const handleChange = (sectionIndex, field, value) => {
    setValueSelect(value);
    setButtonActive(true);
    setFormValues((prevState) => {
      const updatedSections = [...prevState.sections];
      const updatedFieldValues = {
        ...updatedSections[sectionIndex],
        [field]: value,
      };

      if (
        Array.isArray(updatedSections) &&
        updatedSections[1]?.["interview-question-answer-repeater"]
      ) {
        const updatedRepeater = updatedSections[1]["interview-question-answer-repeater"].map(
          (item) => {
            return {
              ...item,
              answer: value !== "fully-commented-interview" ? "No Comment" : "", // Ensure field is present
            };
          }
        );

        updatedSections[1] = {
          ...updatedSections[1],
          "interview-question-answer-repeater": updatedRepeater, // Include the updated repeater
        };
      }

      updatedSections[sectionIndex] = updatedFieldValues;
      return { sections: updatedSections };
    });
  };

  const handleAddQA = (sectionIndex) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex]["interview-question-answer-repeater"].push({
      question2: "",
      answer: "",
    });
    setFormValues({ sections: updatedSections });
  };

  const handleRemoveQA = (sectionIndex, index) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex]["interview-question-answer-repeater"].splice(index, 1);
    setFormValues({ sections: updatedSections });
  };

  const onFinish = () => {
    const transformedValues = {
      sections: formValues.sections.map((section) => ({
        ...section,
        "interview-start-time-2": section?.["interview-start-time-2"]
          ? section?.["interview-start-time-2"]?.format("HH:mm")
          : "",
        "interview-end-time-2": section?.["interview-end-time-2"]
          ? section?.["interview-end-time-2"]?.format("HH:mm")
          : "",
      })),
    };

    props?.handleChange(transformedValues);
    setButtonActive(false);
    handleCloseModal();
  };
  const isSignatureExist = formValues?.sections[0]?.["interview-signature"];
  const answerRepiter = formValues?.sections[1]?.["interview-question-answer-repeater"] || [
    { question2: "", answer: "" },
  ];
  const answer = Array.isArray(answerRepiter) ? answerRepiter : Object.values(answerRepiter);

  const items = [
    {
      key: "1",
      label: "Interview Continuation Form",
      children: (
        <div className="wrapper-form">
          <TextArea
            rows={6}
            value={formValues.sections[0]?.["further-disclosure"]}
            onChange={(e) => handleFieldChange(0, "further-disclosure", e.target.value)}
            placeholder="FURTHER DISCLOSURE"
            label="FURTHER DISCLOSURE"
            disabled={disabled}
            style={{ minHeight: "200px" }}
          />
          <TextArea
            rows={6}
            value={formValues.sections[0]?.["further-consultation"]}
            onChange={(e) => handleFieldChange(0, "further-consultation", e.target.value)}
            placeholder="FURTHER CONSULTATION"
            label="FURTHER CONSULTATION"
            disabled={disabled}
            style={{ minHeight: "200px" }}
          />
          <TextArea
            rows={6}
            value={formValues.sections[0]?.["further-advice"]}
            onChange={(e) => handleFieldChange(0, "further-advice", e.target.value)}
            placeholder="FURTHER ADVICE"
            label="FURTHER ADVICE"
            disabled={disabled}
            style={{ minHeight: "200px" }}
          />
          <p className="Label" style={{ marginBottom: 0 }}>
            <span>Case Specific and Tactical Advise</span>
          </p>
          <Select
            value={formValues.sections[0]?.["case-specific"]}
            onChange={(e) => handleChange(0, "case-specific", e)}
            style={{ width: "50%" }}
            disabled={disabled}
            placeholder="Choose an option..."
            allowClear
            options={[
              {
                value: "no-comment-interview",
                label: "No Comment Interview",
              },
              {
                value: "fully-commented-interview",
                label: "Fully Commented Interview",
              },
              {
                value: "prepared-statement",
                label: "Prepared Statement",
              },
            ]}
          />

          <p className="title" style={{ margin: 0 }}>
            Please acknowledge advice by signing below
          </p>

          <div className="bottom-elements" style={{ padding: 0 }}>
            <Signature
              name="Client signature"
              disabled={disabled}
              value={isSignatureExist}
              setSignature={(url) => handleFieldChange(0, "interview-signature", url)}
              type={type}
            />
            <DatePicker
              style={{ maxWidth: "333px" }}
              format={DATE_FORMAT}
              value={
                formValues.sections[0]?.["interview-date"]
                  ? dayjs(formValues.sections[0]["interview-date"], "DD-MM-YYYY")
                  : null
              }
              onChange={(date) => {
                handleFieldChange(
                  0,
                  "interview-date",
                  date ? dayjs(date).format("DD-MM-YYYY") : null
                );
              }}
              label="Dates"
              disabled={disabled}
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Interview Notes",
      children: (
        <div className="wrapper-form">
          <Row gutter={16}>
            <Col span={12}>
              <Input
                value={formValues?.sections[1]?.["interview-interviewing-officers"]}
                onChange={(e) =>
                  handleFieldChange(1, "interview-interviewing-officers", e.target.value)
                }
                placeholder="Interviewing Officer(s)"
                label="Interviewing Officer(s)"
                disabled={disabled}
              />
            </Col>
            <Col span={12}>
              <DatePicker
                format="DD-MM-YYYY"
                value={
                  formValues?.sections[1]?.["interview-date-2"]
                    ? dayjs(formValues.sections[1]["interview-date-2"], "DD-MM-YYYY")
                    : null
                }
                onChange={(date) =>
                  handleFieldChange(1, "interview-date-2", dayjs(date).format("DD-MM-YYYY"))
                }
                label="Date"
                disabled={disabled}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <TimePicker
                format="HH:mm"
                value={
                  formValues?.sections[1]?.["interview-start-time-2"]
                    ? dayjs(formValues.sections[1]["interview-start-time-2"], "HH:mm")
                    : null
                }
                onChange={(time) => handleFieldChange(1, "interview-start-time-2", time)}
                label="Interview Start Time"
                disabled={disabled}
              />
            </Col>
            <Col span={12}>
              <TimePicker
                format="HH:mm"
                value={
                  formValues?.sections[1]?.["interview-end-time-2"]
                    ? dayjs(formValues.sections[1]["interview-end-time-2"], "HH:mm")
                    : null
                }
                onChange={(time) => handleFieldChange(1, "interview-end-time-2", time)}
                label="Interview End Time"
                disabled={disabled}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Input
                value={formValues?.sections[1]?.["interview-other-persons-present"]}
                onChange={(e) =>
                  handleFieldChange(1, "interview-other-persons-present", e.target.value)
                }
                placeholder="Other Persons Present"
                label="Other Persons Present"
                disabled={disabled}
              />
            </Col>
            <Col span={12}>
              <Input
                value={formValues.sections[1]?.["interview-details"]}
                onChange={(e) => handleFieldChange(1, "interview-details", e.target.value)}
                placeholder="Introduction"
                label="Introduction"
                disabled={disabled}
              />
            </Col>
          </Row>
          <div className="wrapper-form">
            {answer?.map((pair, index, arr) => (
              <Row gutter={16} key={index} style={{ marginTop: 12 }}>
                <Col span={12}>
                  <Input
                    value={pair.question2}
                    onChange={(e) => {
                      const updatedQA = JSON.parse(
                        JSON.stringify([
                          ...formValues.sections[1]["interview-question-answer-repeater"],
                        ])
                      );
                      updatedQA[index].question2 = e.target.value;
                      handleFieldChange(1, "interview-question-answer-repeater", updatedQA);
                    }}
                    placeholder={`Question ${index + 1}`}
                    label={`Question ${index + 1}`}
                    disabled={disabled}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    value={pair.answer}
                    onChange={(e) => {
                      const updatedQA = JSON.parse(
                        JSON.stringify([
                          ...formValues.sections[1]["interview-question-answer-repeater"],
                        ])
                      );
                      updatedQA[index].answer = e.target.value;
                      handleFieldChange(1, "interview-question-answer-repeater", updatedQA);
                    }}
                    placeholder={`Reply ${index + 1}`}
                    label={`Reply ${index + 1}`}
                    disabled={disabled}
                  />
                  {arr.length !== 1 && (
                    <MinusCircleOutlined
                      className="repedable-minus-icon"
                      onClick={() => handleRemoveQA(1, index)}
                      style={{
                        marginLeft: "-8px",
                        cursor: "pointer",
                        right: "-10px",
                        top: "60%",
                      }}
                    />
                  )}
                </Col>

                {/* {formValues.sections[1]["interview-question-answer-repeater"]?.length > 1 &&
                  !props.disabled && (
                    <Col span={24}>
                      <Button
                        type="dashed"
                        onClick={() => handleRemoveQA(1, index)}
                        style={{ width: "100%", marginBottom: "8px", marginTop: "8px" }}
                      >
                        Remove
                      </Button>
                    </Col>
                  )} */}
              </Row>
            ))}
            {/* {!props.disabled && (
              <Button type="dashed" onClick={() => handleAddQA(1)} style={{ width: "100%" }}>
                Add Question/Reply
              </Button>
            )} */}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="prepared-steatment-container">
      <Button onClick={handleOpenModal} className="ps-button">
        Continue Interview (If Required)
      </Button>
      <CustomModal
        open={modal}
        onClose={handleCloseModal}
        title="Interview Continuation"
        width={"90vw"}
        content={<Tabs defaultActiveKey="1" items={items} />}
        footer={
          !disabled ? (
            <div style={{ padding: "10px 24px" }}>
              <Button
                onClick={onFinish}
                className={buttonActive ? "primary_round_btn" : "secondary_round_btn"}
              >
                Save
              </Button>
            </div>
          ) : null
        }
      />
    </div>
  );
};
