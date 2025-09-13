import { DatePicker, Form, Input, message, Radio, Select, Switch, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { createOffence, getFormsOffences } from "../../../../crud/cases";
import { getCases } from "../../../../crud/dashboard";
import { updateFormValue } from "../../../../features/Forms/formSlice";
import { setOffences } from "../../../../redux/slices/offencesSlice";
import { CalendarImage } from "../../../../shared/icons/CalendarImage";
import DeleteBtn from "../../../../shared/images/DeleteBtn.svg";
import courtImage from "../../../../shared/images/courtImage.svg";
import i from "../../../../shared/images/i.svg";
import searchIcon from "../../../../shared/images/search.svg";
import { OffenceI, PoliceStationOutcomeI, ReqOffence } from "../../../../shared/types/cases";
import { CaseDetails, CasesReq } from "../../../../shared/types/dashboard";

export default function useOffenceController(isForms, showOutcome, showOutcomeInput) {
  const [search, setSearch] = useState("");
  const [openSelectOffenses, setOpenSelectOffenses] = useState(false);
  const [offenceList, setOffenceList] = useState([]);
  const [selectedOffense, setSelectedOffence] = useState<OffenceI[]>([]);
  const [serchParams] = useSearchParams();
  const [addOffenceModal, setAddOffenceModal] = useState(false);
  const [editOffenceModal, setEditOffenceModal] = useState(false);
  const id = serchParams.get("caseId");
  const location = useLocation();

  const [messageApi, contextHolder] = message.useMessage();
  const [elementCase, setElementCase] = useState<CaseDetails>();
  const [policeStationOutcomeList, setPoliceStationOutcomeList] = useState<PoliceStationOutcomeI[]>(
    []
  );

  const [policeStationOutcome, setPoliceStationOutcome] = useState([]);

  const dispatch = useDispatch();
  const isCreate = location.pathname.includes("create");

  const fetchCases = useCallback(
    (isUpdating) => {
      const data: CasesReq = {
        withValues: false,
        search: "",
      };
      getCases(data).then((res) => {
        if (!id) return;

        const elementCase = res.data.cases.find((elem: CaseDetails) => elem.id === +id);
        if (elementCase) {
          setElementCase(elementCase);
          dispatch(
            setOffences(
              elementCase?.offences?.map((item) => ({
                ...item,
                date: dayjs(item.date).toISOString(),
              }))
            )
          );

          if (isCreate && !isUpdating) {
            setTimeout(() => {
              dispatch(
                updateFormValue({
                  sectionId: 45,
                  slug: "substantive-elements-offence",
                  value: elementCase?.offences
                    .map((item) => {
                      let text = `${item.description}`;
                      if (!item.hideDefinitionInSubstantive) {
                        text += `\n${item.definition}`;
                      }
                      return text;
                    })
                    .join("\n\n"),
                })
              );
            }, 2000);
          }
        }
      });
    },
    [id]
  );

  useEffect(() => {
    fetchCases(false);
  }, [fetchCases]);

  // useEffect(() => {
  //   if (!openSelectOffenses && !addOffenceModal && !editOffenceModal) {
  //     setSelectedOffence([]);
  //   }
  // }, [openSelectOffenses]);

  useEffect(() => {
    if (editOffenceModal && elementCase) {
      setSelectedOffence(elementCase?.offences);
    }
  }, [editOffenceModal, elementCase]);

  const manageOffenceFunc = (type: string) => {
    let isValid = true;
    const newArray: OffenceI[] = selectedOffense.map((elem) => {
      if (!elem.dateFormat || !elem.date || (elem.dateFormat === "Between" && !elem.dateEnd)) {
        isValid = false;
        return { ...elem, error: true };
      } else {
        return { ...elem, error: false };
      }
    });
    setSelectedOffence(newArray);

    if (!isValid || !id) return;

    let offences: OffenceI[] = [];

    if (type === "create") {
      offences = [...(elementCase?.offences ?? []), ...newArray];
    } else {
      offences = [...newArray];
    }

    const data: ReqOffence = { caseId: +id, offences };
    createOffence(data)
      .then(() => {
        setAddOffenceModal(false);
        setOpenSelectOffenses(false);
        setEditOffenceModal(false);
        messageApi.success("Offence has been successfully updated");
      })
      .then(() => {
        return fetchCases(true);
      });
  };

  const periodOptions = [
    { value: "On", Labe: "On" },
    { value: "Between", Labe: "Between" },
    { value: "After", Labe: "After" },
    { value: "Before", Labe: "Before" },
    { value: "In", Labe: "In" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getFormsOffences().then((res) => {
      setOffenceList(res.data.offences);
      setPoliceStationOutcomeList(res.data.policeStationOutcome);
      setPoliceStationOutcome(res.data.policeStationOutcome);
    });
  }, []);

  const selectOffence = (item: OffenceI) => {
    const index = selectedOffense.findIndex((elem) => elem.id === item.id);
    if (index >= 0) {
      const copy = [...selectedOffense];
      copy.splice(index, 1);
      setSelectedOffence(copy);
    }
    if (index === -1) {
      setSelectedOffence((prev) => [...prev, item]);
    }
  };

  const handleClear = () => {
    setSelectedOffence([]);
    setOpenSelectOffenses(false);
  };

  const renderOffences = (): ReactNode => {
    const filteredItems: OffenceI[] = offenceList.filter((item: OffenceI) =>
      item.description.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="select-modal">
        <Input
          className="search-input"
          suffix={<img src={searchIcon} />}
          placeholder="Search here.."
          maxLength={15}
          onChange={handleChange}
          value={search}
          allowClear
        />
        <div className="select-modal__selector">
          {filteredItems.map((item: OffenceI) => (
            <div key={item.id} className="row select-modal__row">
              <Radio
                key={item.id}
                className="select-modal__radio"
                onClick={() => selectOffence(item)}
                value={""}
                checked={!!selectedOffense.find((elem) => elem.id === item.id)}
              >
                {item.description}
              </Radio>
              <Tooltip title={item.definition}>
                <img src={i} />
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="d-flex-end select-modal__btns">
          <div className="simple_btn" onClick={handleClear} style={{ margin: "0 15px 0 0" }}>
            Clear
          </div>
          <div
            className="simple_btn"
            onClick={() => setOpenSelectOffenses(false)}
            style={{ margin: "0 15px 0 0" }}
          >
            Close
          </div>
          <div
            className="simple_btn"
            onClick={() => {
              if (selectedOffense.length) {
                setAddOffenceModal(true);
              }
            }}
            style={selectedOffense.length ? {} : { opacity: 0.5, cursor: "not-allowed" }}
          >
            Next
          </div>
        </div>
      </div>
    );
  };

  const handleChangeOffence = (
    id: number,
    value: string | PoliceStationOutcomeI | undefined | null,
    name: string
  ) => {
    const updatedOffences = selectedOffense.map((offence) => {
      if (offence.id === id) {
        // Create a new object with updated values
        return {
          ...offence,
          [name]: value,
          // Handle conditional fields
          ...(offence.dateFormat !== "Between" ? { dateEnd: undefined } : {}),
          // Calculate error status
          error:
            !offence.dateFormat ||
            !offence.date ||
            (offence.dateFormat === "Between" && !offence.dateEnd)
              ? true
              : false,
        };
      }
      return offence;
    });

    setSelectedOffence(updatedOffences);
  };

  const deleteOffence = (index: number) => {
    const copy = [...selectedOffense];
    if (index >= 0) {
      copy.splice(index, 1);
      setSelectedOffence(copy);
    }
  };

  const renderFormOffences = (): ReactNode => {
    return (
      <div className="offence-modal__container">
        <div className="offence-modal__form">
          {selectedOffense.length > 0 ? (
            selectedOffense.map((elem: OffenceI, index: number) => {
              return (
                <div key={index} className="offence-modal__item">
                  <div className="row offence-modal__discription">
                    {elem.description} <img src={DeleteBtn} onClick={() => deleteOffence(index)} />
                  </div>
                  <Form className="form-wrapper">
                    <Form.Item
                      label={<span className="form-label">Date Format</span>}
                      labelCol={{ span: 24 }}
                      className="form-item"
                    >
                      <Select
                        className="offence-modal__formItem"
                        placeholder="Select"
                        options={periodOptions}
                        onChange={(value) => handleChangeOffence(elem.id, value, "dateFormat")}
                        value={elem.dateFormat}
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item
                      label={<span className="form-label">Start Date</span>}
                      labelCol={{ span: 24 }}
                      className="form-item"
                    >
                      <DatePicker
                        className="offence-modal__formItem"
                        format="DD-MM-YYYY"
                        onChange={(date) => {
                          handleChangeOffence(
                            elem.id,
                            date ? dayjs(date).format("DD-MM-YYYY") : null,
                            "date"
                          );
                        }}
                        suffixIcon={<CalendarImage />}
                        value={elem.date ? dayjs(elem.date, "DD-MM-YYYY") : ""}
                      />
                    </Form.Item>
                    {elem.dateFormat === "Between" && (
                      <Form.Item
                        label={<span className="form-label">End Date</span>}
                        labelCol={{ span: 24 }}
                        className="form-item"
                      >
                        <DatePicker
                          className="offence-modal__formItem"
                          format="DD-MM-YYYY"
                          onChange={(date) =>
                            handleChangeOffence(
                              elem.id,
                              date ? dayjs(date).format("DD-MM-YYYY") : null,
                              "dateEnd"
                            )
                          }
                          suffixIcon={<CalendarImage />}
                          value={elem.dateEnd ? dayjs(elem.dateEnd, "DD-MM-YYYY") : ""}
                        />
                      </Form.Item>
                    )}
                    {(showOutcome || !isForms) && showOutcomeInput && (
                      <>
                        <Form.Item
                          label={<span className="form-label">Police Station Outcome</span>}
                          labelCol={{ span: 24 }}
                          className="form-item-5"
                          required={false}
                        >
                          <Select
                            className="offence-modal__formItem"
                            allowClear
                            options={policeStationOutcomeList.map(({ code }) => ({
                              label: code,
                              value: code,
                            }))}
                            onChange={(value: string) => {
                              handleChangeOffence(
                                elem.id,
                                policeStationOutcomeList.find(({ code }) => code === value),
                                "policeStationOutcome"
                              );
                              // if (!value?.includes("Other")) {
                              //   handleChangeOffence(
                              //     elem.id,
                              //     undefined,
                              //     "policeStationOutcomeDetails"
                              //   );
                              // }
                            }}
                            value={elem.policeStationOutcome?.code}
                          />
                        </Form.Item>
                        {elem.policeStationOutcome?.code?.includes("Other") && (
                          <Form.Item
                            label={
                              <span className="form-label">
                                Police Station Outcome - Other Details
                              </span>
                            }
                            labelCol={{ span: 24 }}
                            className="form-item-5"
                          >
                            <TextArea
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                handleChangeOffence(
                                  elem.id,
                                  e.target.value,
                                  "policeStationOutcomeDetails"
                                )
                              }
                              value={elem.policeStationOutcomeDetails}
                            />
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Form>
                  {elem.error ? (
                    <div className="error-text">All these fields are required</div>
                  ) : (
                    ""
                  )}
                  <div className="offence-modal__switch-wrapper">
                    <Switch
                      size="small"
                      onChange={(value) =>
                        handleChangeOffence(elem.id, value, "hideDefinitionInSubstantive")
                      }
                    />
                    Hide definition in Substantive (Elements of offence)
                  </div>
                </div>
              );
            })
          ) : (
            <div className="offences__wrapper" style={{ height: 130, margin: "25px 0px" }}>
              <img src={courtImage} />

              <div className="offences__title">Nothing in Offences</div>
              {/* <div className="offences__subtitle">
                When you add an offence, they'll appear here.
              </div> */}
            </div>
          )}
        </div>

        <div className="d-flex-end offence-modal__btns">
          <div
            className="simple_btn"
            onClick={() => {
              setAddOffenceModal(false);
              setEditOffenceModal(false);
            }}
            style={{ margin: "0 15px 0 0" }}
          >
            Back
          </div>
          <div
            className="simple_btn"
            onClick={() => {
              if ((addOffenceModal && selectedOffense.length) || !addOffenceModal) {
                manageOffenceFunc(addOffenceModal ? "create" : "edit");
              }
            }}
            style={
              (addOffenceModal && selectedOffense.length) || !addOffenceModal
                ? {}
                : { opacity: 0.5, cursor: "not-allowed" }
            }
          >
            Update Offence
          </div>
        </div>
      </div>
    );
  };

  return {
    renderOffences,
    setOpenSelectOffenses,
    openSelectOffenses,
    addOffenceModal,
    setAddOffenceModal,
    renderFormOffences,
    contextHolder,
    setEditOffenceModal,
    editOffenceModal,
    elementCase,
    policeStationOutcome,
    setSelectedOffence,
  };
}
