import { ArrowDownOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Form, Input, message, Spin } from "antd";
import { SegmentedOptions } from "antd/es/segmented";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  createCase,
  deleteCase,
  editCase,
  getCaseValues,
  getFeeEarners,
  getStatuses,
  getStructure,
  lookup,
  transfer,
  updateStatuses,
} from "../../crud/cases";
import { getCases } from "../../crud/dashboard";
import { getFormsStructure } from "../../crud/forms";
import { getInstanceDataByPath, transformName } from "../../helpers";
import { useClickOutside } from "../../hooks/useClickOutside";
import useDebounce from "../../hooks/useDebounce";
import { EditIcon } from "../../shared/icons";
import { CheckMark } from "../../shared/icons/CheckMark";
import { CourtDutySolicitorFile } from "../../shared/icons/CourtDutySolicitorFile";
import { CrownCourt } from "../../shared/icons/CrownCourt";
import { DashboardIcon } from "../../shared/icons/DashboardIcon";
import { MagistratesCourt } from "../../shared/icons/MagistratesCourt";
import { PoliceStation } from "../../shared/icons/PoliceStation";
import { YouthCourt } from "../../shared/icons/YouthCourt";
import searchIcon from "../../shared/images/search.svg";
import {
  CaseFieldI,
  ClientData,
  ClientModel,
  EarnerI,
  LookupDataI,
} from "../../shared/types/cases";
import { CaseDetails, CasesReq } from "../../shared/types/dashboard";
import { FormDataI } from "../../shared/types/forms";

interface ArrayI {
  title: string;
  value: string | Dayjs;
  type: number;
}

type CaseTabs = "Case Info" | "Offences" | "Forms" | "Documents";

export default function useCaseController() {
  const [activeTab, setActiveTab] = useState<CaseTabs>("Case Info");
  const [fields, setFields] = useState<CaseFieldI[]>([]);
  const [slug, setSlug] = useState("");
  const [searchLookup, setSearchLookup] = useState("");
  const [searchTransfer, setSearchTransfer] = useState("");
  const [form] = Form.useForm<ClientModel>();
  const [selectFormOpen, setSelectFormOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [serchParams] = useSearchParams();
  const location = useLocation();
  const isView = location.pathname.includes("view");
  const isEdit = location.pathname.includes("edit");
  const isCreateCase = location.pathname.includes("create");
  const instance = location.pathname.split("/")[2];
  const id = serchParams.get("caseId");
  const [isCreate, setIsCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDiscardModal, setIsDiscardModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [forms, setForms] = useState<FormDataI[]>([]);
  const [values, setValues] = useState<CaseFieldI[]>([]);
  const [openLookup, setOpenLookup] = useState(false);
  const from = location?.state?.from;
  const path = location.pathname;
  const [lookupData, setLookupData] = useState<LookupDataI[]>([]);
  const [moreArray, setMoreArray] = useState<number[]>([]);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedEarners, setSelectedEarners] = useState<string[]>([]);
  const [feeEarners, setFeeEarnes] = useState<EarnerI[]>([]);
  const [loader, setLoader] = useState(false);
  const [element, setElement] = useState<CaseDetails>();
  const [openActions, setOpenActions] = useState<number | null>(null);
  const refActions = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(searchLookup);
  const [loading, setLoading] = useState(false);
  const [btnClicked, setBtnClicked] = useState<boolean>(false);

  useClickOutside(refActions, () => setOpenActions(null));

  const updateStatusFunc = (slug: string, value: string) => {
    if (!id || !isView) return;
    updateStatuses(+id, slug, value).then(() => {
      const status = slug === "case-status" ? "Case status" : "Billing Status";
      messageApi.success(`${status} has been successfuly changed`);
    });
  };

  useEffect(() => {
    const data: CasesReq = {
      withValues: false,
      search: "",
    };
    getCases(data).then((res) => {
      if (!id) return;
      const element = res.data.cases.find((elem: CaseDetails) => elem.id === +id);
      if (element) {
        setElement(element);
      }
    });
  }, []);

  useEffect(() => {
    if (isOpenTransfer && !feeEarners.length) {
      getFeeEarners().then((res) => {
        setFeeEarnes(res.data);
      });
    }

    if (!isOpenTransfer) {
      setSelectedEarners([]);
    }
  }, [isOpenTransfer]);

  const segmentOptions: SegmentedOptions<SetStateAction<CaseTabs>> = [
    { value: "Case Info", label: "Case Info" },
    { value: "Offences", label: "Offences" },
    { value: "Forms", label: "Forms" },
    { value: "Documents", label: "Documents" },
  ];

  // const formSegmentOptions: SegmentedOptions<SetStateAction<SegmentForm>> = [
  //   { value: "Offences", label: getImageBySvg(printImage) },
  //   {
  //     value: "Case Info",
  //     label: getImageBySvg(mailImage),
  //   },
  //   { value: "Forms", label: getImageBySvg(image) },
  // ];

  if (instance === "court_duty") {
    segmentOptions.splice(1, 1);
  }

  const handleChangeLookup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLookup(e.target.value);
  };
  const handleChangeTransfer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTransfer(e.target.value);
  };

  const icons = {
    dashboard: <DashboardIcon />,
    police_station: <PoliceStation />,
    magistrates_court: <MagistratesCourt />,
    youth_court: <YouthCourt />,
    court_duty: <CourtDutySolicitorFile />,
    crown_court: <CrownCourt />,
  };

  const instObj = getInstanceDataByPath(window.location.pathname);

  const items = [
    {
      href: from,
      title: (
        <div className="case__bread active">
          <span>{icons[instObj?.path]}</span>
          <span>{instObj?.title}</span>
        </div>
      ),
    },

    {
      title: (
        <div className="case__bread">
          <span>
            <EditIcon />
          </span>
          <span>{element?.client_name}</span>
        </div>
      ),
    },
  ];

  if (isCreateCase) {
    items.splice(2);
  }

  useEffect(() => {
    const data = {
      isCourtDuty: 0,
    };

    if (location.pathname.includes("court_duty")) {
      data.isCourtDuty = 1;
    }

    if (isView || isEdit) {
      if (!id) return;
      getCaseValues(id).then((res) => {
        setValues(res.data.values);
        const data = res.data.values;
        const array: ArrayI[] = [];
        data.forEach((element: CaseFieldI) => {
          return array.push({
            title: element.slug,
            value: element.field_value?.value ? element.field_value.value : "",
            type: element.type,
          });
        });
        const obj: { [key: string]: string | Dayjs } = {};
        array.forEach((elem: ArrayI) => {
          if (elem.type === 5) {
            obj[elem.title as keyof typeof obj] = dayjs(elem.value);
          } else {
            obj[elem.title as keyof typeof obj] = elem.value;
          }
        });
        form.setFieldsValue(obj);
      });
    }
    if (isCreateCase) {
      form.setFieldsValue({
        venue: instance === "court_duty" ? "Court Duty" : getInstanceDataByPath(instance).title,
        funding: "Legal Aid",
        "billing-status": "Ongoing",
      });
    }
    getStatuses().then((statuses) => {
      getStructure(data).then((res) => {
        const fields = structuredClone(res.data.caseStructure);

        if (!location.pathname.includes("court_duty")) {
          const elementCaseStatus = fields.find((elem: CaseFieldI) => elem.slug === "case-status");
          const elementCategoryStatus = fields.find(
            (elem: CaseFieldI) => elem.slug === "case-category"
          );
          const elementBillingStatus = fields.find(
            (elem: CaseFieldI) => elem.slug === "billing-status"
          );
          const instanceNew = getInstanceDataByPath(instance);

          const array = [];
          for (const key in statuses?.data?.case_statuses?.[instanceNew.title]) {
            array.push({
              value: key,
              tooltip: statuses?.data?.case_statuses?.[instanceNew.title][key],
            });
          }

          const array1 = [];
          for (const key in statuses?.data?.billing_statuses) {
            array1.push({
              value: key,
              tooltip: statuses?.data?.billing_statuses[key],
            });
          }
          const array2 = [];
          for (const key in statuses?.data?.category_statuses?.[instanceNew.title]) {
            array2.push({
              value: key,
              tooltip: statuses?.data?.category_statuses?.[instanceNew.title][key],
            });
          }

          elementCaseStatus.list.items = array;
          elementCategoryStatus.list.items = array2;
          elementBillingStatus.list.items = array1;
        }
        setFields(fields);
      });
    });
  }, [form, id, instance, isCreateCase, isEdit, isView, location]);

  useEffect(() => {
    if (id && selectFormOpen) {
      getFormsStructure(id!).then((res) => setForms(res.data.formsStructure));
    }
  }, [id, selectFormOpen]);

  const lookupFunc = () => {
    setLoading(true);
    lookup(debouncedValue)
      .then((res) => {
        setLookupData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (debouncedValue.length < 3) return;
    lookupFunc();
  }, [debouncedValue]);

  const convertExcelDate = (excelDate) => {
    const baseDate = dayjs("1899-12-30");
    return baseDate.add(excelDate, "day");
  };

  const formatDate = (date_birth, format = "MMM D, YYYY") => {
    let date;

    if (!isNaN(date_birth)) {
      date = convertExcelDate(Number(date_birth));
    } else {
      date = dayjs(date_birth);
    }

    const year = date.year();

    const month = date.month();
    const day = date.day();

    const newDate = dayjs(new Date(year, month - 1, day));

    return newDate.isValid() ? newDate.format(format) : date_birth;
  };

  const formatCaseItem = (caseItem) => {
    const {
      title,
      forename,
      surname,
      date_birth,
      telephone_mobile,
      telephone_home,
      address,
      post_code,
      gender,
      e_mail,
      opt_marketing_e_mails,
    } = caseItem;

    return {
      title,
      forename,
      surname,
      "date-birth": dayjs(formatDate(date_birth)),
      "tel-mobile": telephone_mobile,
      "tel-home": telephone_home,
      "email-address": e_mail,
      address,
      "post-code": post_code,
      gender: gender.toLowerCase(),
      "opt-marketing-email-addresss": opt_marketing_e_mails,
    };
  };

  const handleOpenExistingCase = (caseItem) => {
    const formattedCaseItem = formatCaseItem(caseItem);

    form.setFieldsValue({
      ...formattedCaseItem,
      "fee-earner": [caseItem.fee_earner],
      "date-first-contact": caseItem.date_first_contact
        ? dayjs(caseItem.date_first_contact, "DD/MM/YYYY")
        : null,
      "ni-number": caseItem.ni_number,
      office: [caseItem.office],
      ethnicity: [caseItem.ethnicity],
      disability: [caseItem.disability],
    });
    setOpenLookup(false);
    setSearchLookup("");
  };
  const handleOpenNewCase = (caseItem) => {
    const formattedCaseItem = formatCaseItem(caseItem);
    form.setFieldsValue(formattedCaseItem);
    setOpenLookup(false);
    setSearchLookup("");
  };

  const renderLookup = (): ReactNode => {
    return (
      <div className="lookup-modal">
        <form>
          <Input
            className="search-input"
            suffix={<img src={searchIcon} />}
            placeholder="Search here.."
            maxLength={15}
            onChange={handleChangeLookup}
            value={searchLookup}
            allowClear
          />
        </form>
        <Spin spinning={loading}>
          <div className="lookup-modal__wrapper">
            {lookupData.length && searchLookup ? (
              lookupData.map((elem: LookupDataI, index) => {
                const changed = {} as LookupDataI;
                Object.entries(elem).forEach(([key, value]) => {
                  changed[key as keyof LookupDataI] = !value ? "-" : value;
                });
                const {
                  address,
                  address_2,
                  address_3,
                  address_4,
                  address_5,
                  agent_email,
                  date_birth,
                  date_first_contact,
                  disability,
                  e_mail,
                  ethnicity,
                  existing_proclaim_case_ref,
                  fee_earner,
                  forename,
                  funding,
                  gender,
                  matter_description,
                  ni_number,
                  office,
                  opt_marketing_e_mails,
                  post_code,
                  surname,
                  telephone_home,
                  telephone_mobile,
                  ufn,
                } = changed;
                const fullAddress = [address_2, address_3, address_4, address_5, post_code].reduce(
                  (acc, curr, i) => (curr !== "-" && i < 5 ? `${acc}, ${curr}` : acc),
                  address
                );
                return (
                  <div key={existing_proclaim_case_ref} className="lookup-modal__card relative">
                    <Card
                      title={
                        <div className="lookup-modal__card-title">
                          {`${forename} ${surname}`}
                          <div>
                            <Dropdown
                              className="lookup-modal__card-btn"
                              menu={{
                                items: [
                                  {
                                    label: (
                                      <p onClick={() => handleOpenExistingCase(changed)}>
                                        Open an existing case{" "}
                                      </p>
                                    ),
                                    key: "1",
                                  },
                                  {
                                    label: (
                                      <p onClick={() => handleOpenNewCase(changed)}>
                                        Create a new case
                                      </p>
                                    ),
                                    key: "2",
                                  },
                                ],
                              }}
                              placement="bottomLeft"
                            >
                              <Button>Select Case</Button>
                            </Dropdown>
                            {/* <Button
                              className="lookup-modal__card-btn"
                              onClick={() => {
                                form.setFieldsValue(elem);
                                setOpenLookup(false);
                                setSearchLookup("");
                                navigate(`/case/${instance}/view?caseId=${id}`);
                              }}
                            >
                              Select Case
                            </Button> */}
                            <span
                              className="lookup-modal__card-more"
                              onClick={() => {
                                const found = moreArray.find((i) => i === index);
                                if (typeof found === "number") {
                                  setMoreArray([...moreArray.filter((i) => i !== index)]);
                                } else {
                                  setMoreArray([...moreArray, index]);
                                }
                              }}
                            >
                              more
                              <ArrowDownOutlined
                                rotate={
                                  typeof moreArray.find((i) => i === index) === "number" ? 180 : 0
                                }
                              />
                            </span>
                          </div>
                        </div>
                      }
                    >
                      <div className="lookup-modal__card-content">
                        <div className="lookup-modal__card-section">
                          {[
                            { label: "Case Number", value: existing_proclaim_case_ref },
                            {
                              label: "Date of Birth",
                              value: formatDate(date_birth),
                            },
                            { label: "Fee Earner", value: fee_earner },
                          ].map(({ label, value }, i) => (
                            <div key={i} className="row">
                              <div className="lookup-modal__card-label">{label}</div>
                              <div className="lookup-modal__card-value">{value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="lookup-modal__card-section">
                          {[
                            {
                              label: "Date of First Contact",
                              value: formatDate(date_first_contact, "DD.MM.YYYY"),
                            },
                            { label: "NI Number", value: ni_number },
                            { label: "Address", value: fullAddress },
                          ].map(({ label, value }, i) => (
                            <div key={i} className="row">
                              <div className="lookup-modal__card-label">{label}</div>
                              <div className="lookup-modal__card-value">{value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="lookup-modal__card-row">
                          <div className="lookup-modal__card-label">Matter Description</div>
                          <div className="lookup-modal__card-value">{matter_description}</div>
                        </div>
                        {typeof moreArray.find((i) => i === index) === "number" && (
                          <>
                            <div className="lookup-modal__card-section">
                              {[
                                { label: "Telephone Number", value: telephone_home },
                                { label: "email-address", value: e_mail },
                                { label: "Gender", value: gender },
                                { label: "Disability", value: disability },
                                { label: "Funding", value: funding },
                              ].map(({ label, value }, i) => (
                                <div key={i} className="row">
                                  <div className="lookup-modal__card-label">{label}</div>
                                  <div className="lookup-modal__card-value">{value}</div>
                                </div>
                              ))}
                            </div>
                            <div className="lookup-modal__card-section">
                              {[
                                { label: "Mobile Number", value: telephone_mobile },
                                {
                                  label: "Opt-in to marketing email-addresss?",
                                  value: opt_marketing_e_mails,
                                },
                                { label: "Ethnicity", value: ethnicity },
                                { label: "Office", value: office },
                                { label: "UFN", value: ufn },
                              ].map(({ label, value }, i) => (
                                <div key={i} className="row">
                                  <div className="lookup-modal__card-label">{label}</div>
                                  <div className="lookup-modal__card-value">{value}</div>
                                </div>
                              ))}
                            </div>
                            <div className="lookup-modal__card-row">
                              <div className="lookup-modal__card-label">Agent email-address</div>
                              <div className="lookup-modal__card-value">{agent_email}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })
            ) : (
              <p className="search-result">
                {searchLookup && !loading
                  ? `The term ${searchLookup} Not Found in Case List`
                  : "No result"}
              </p>
            )}
          </div>
        </Spin>
        <button style={{ visibility: "hidden" }} type="submit"></button>
      </div>
    );
  };

  const ClickOnCreate = () => {
    form.validateFields().then(() => {
      setIsCreate(true);
    });
  };
  const ClickOnSave = () => {
    form.validateFields().then(() => {
      setIsEditModal(true);
    });
  };

  const HendleSubmit = (type: string) => {
    form.validateFields().then((values) => {
      const payload: ClientData = {
        model: {
          ...values,
          "date-birth": dayjs(values["date-birth"]).format("YYYY-MM-DD"),
          "date-first-contact": dayjs(values["date-first-contact"]).format("YYYY-MM-DD"),
        },
        offences: null,
      };
      if (type === "create") {
        createCase(payload).then((item) => {
          messageApi.success("Case has been successfuly created!");
          if (item?.data?.case?.id) {
            navigate(`/case/${instance}/view?caseId=${item?.data?.case?.id}`);
          } else {
            navigate("/dashboard");
          }
          setIsCreate(false);
          setBtnClicked(false);
        });
      }
      if (type === "edit") {
        if (!id) return;
        editCase(payload, +id).then(() => {
          messageApi.success("Case has been successfuly updated!");
          setIsEditModal(false);
          navigate(`/case/${instance}/view?caseId=${id}`);
        });
      }
    });
  };

  const deleteCaseFunc = () => {
    if (!id) return;
    deleteCase(+id).then(() => {
      messageApi.success("Case has been deleted");
      setOpenDelete(false);
      navigate("/dashboard");
    });
  };

  const renderSelectForm = () => {
    const { Icon } = getInstanceDataByPath(instance);
    const filterForms = forms.filter(
      (form) => !element?.form_records?.some((item) => item?.form?.id === form?.id)
    );
    return (
      <div>
        {filterForms.map(({ id: formId, name }) => (
          <div
            key={formId}
            className="select-modal__form-list-item"
            onClick={() =>
              navigate(
                `/case/${instance}/form/create?formName=${name}&formId=${formId}&caseId=${id}`
              )
            }
          >
            <div className="select-modal__form-list-item-image d-flex-center">
              <Icon />
            </div>
            {transformName(name)}
          </div>
          
        ))}
      </div>
    );
  };

  const renderDeleteAction = () => {
    return (
      <div className="d-flex-end mt-35">
        <div
          className="simple_btn"
          onClick={() => setOpenDelete(false)}
          style={{ margin: "0 15px 0 0" }}
        >
          Cancel
        </div>
        <div className="simple_btn" onClick={deleteCaseFunc}>
          Delete
        </div>
      </div>
    );
  };

  const renderDiscardAction = () => {
    return (
      <div className="d-flex-end mt-35">
        <button
          className="secondary_round_btn cursor-pointer"
          onClick={() => setIsDiscardModal(false)}
          style={{ margin: "0 15px 0 0" }}
        >
          Cancel
        </button>
        <button className="red_round_btn" onClick={() => navigate("/dashboard")}>
          Discard
        </button>
      </div>
    );
  };

  const renderEditAction = () => {
    return (
      <div className="d-flex-end mt-35">
        <div
          className="simple_btn"
          onClick={() => setIsEditModal(false)}
          style={{ margin: "0 15px 0 0" }}
        >
          Cancel
        </div>
        <div className="simple_btn" onClick={() => HendleSubmit("edit")}>
          Save
        </div>
      </div>
    );
  };

  const renderCreateAction = () => {
    return (
      <div className="d-flex-end mt-35">
        <div
          className="simple_btn"
          onClick={() => setIsCreate(false)}
          style={{ margin: "0 15px 0 0" }}
        >
          Cancel
        </div>
        <div
          className="simple_btn"
          onClick={() => {
            if (!btnClicked) {
              HendleSubmit("create");
              setBtnClicked(true);
            }
          }}
          style={!btnClicked ? {} : { opacity: 0.5, cursor: "not-allowed" }}
        >
          Yes
        </div>
      </div>
    );
  };

  const selectEarner = (id: string) => {
    const copy = [...selectedEarners];
    if (copy.includes(id)) {
      const index = copy.findIndex((elem) => elem === id);
      if (index >= 0) {
        copy.splice(index, 1);
        setSelectedEarners(copy);
      }
    } else {
      setSelectedEarners((prev) => [...prev, id]);
    }
  };

  const transferFunc = () => {
    if (!id) return;
    setLoader(true);
    transfer(+id, selectedEarners)
      .then(() => {
        return messageApi.success("Case has been transferred successfully");
      })
      .then(() => {
        navigate("/dashboard");
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const filteredData = feeEarners.filter((item) =>
    item?.code?.toLowerCase()?.includes(searchTransfer.toLowerCase())
  );

  const setIsCloseTransfer = () => {
    setIsOpenTransfer(false);
    setSearchTransfer("");
  };

  const renderTransfer = () => {
    return (
      <>
        <form style={{ padding: "0 20px" }}>
          <Input
            className="search-input"
            suffix={<img src={searchIcon} />}
            placeholder="Search here.."
            maxLength={15}
            onChange={handleChangeTransfer}
            value={searchTransfer}
            allowClear
          />
        </form>
        <Spin spinning={loader}>
          <div className="earner-modal">
            <div className="earner-modal__list">
              {filteredData?.map((elem: EarnerI) => {
                return (
                  <div
                    className={`earner-modal__earner ${selectedEarners.includes(elem.value) ? "active" : ""
                      }`}
                    onClick={() => selectEarner(elem.value)}
                  >
                    {elem.code}
                    {selectedEarners.includes(elem.value) && (
                      <div>
                        <CheckMark />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="d-flex-end earner-modal__btns">
              <div
                className="simple_btn"
                onClick={setIsCloseTransfer}
                style={{ margin: "0 15px 0 0" }}
              >
                Cancel
              </div>
              <div className="simple_btn" onClick={transferFunc}>
                Transfer
              </div>
            </div>
          </div>
        </Spin>
      </>
    );
  };

  return {
    activeTab,
    setActiveTab,
    fields,
    setSlug,
    slug,
    form,
    setIsCreate,
    isCreate,
    ClickOnCreate,
    HendleSubmit,
    contextHolder,
    selectFormOpen,
    setSelectFormOpen,
    renderSelectForm,
    isView,
    navigate,
    instance,
    id,
    setOpenDelete,
    openDelete,
    deleteCaseFunc,
    isEdit,
    isCreateCase,
    setIsDiscardModal,
    isDiscardModal,
    setIsEditModal,
    isEditModal,
    ClickOnSave,
    renderDeleteAction,
    renderDiscardAction,
    renderEditAction,
    renderCreateAction,
    values,
    items,
    renderLookup,
    setOpenLookup,
    openLookup,
    segmentOptions,
    setIsOpenTransfer,
    setIsCloseTransfer,
    isOpenTransfer,
    renderTransfer,
    element,
    setOpenActions,
    openActions,
    refActions,
    setElement,
    updateStatusFunc,
  };
}
