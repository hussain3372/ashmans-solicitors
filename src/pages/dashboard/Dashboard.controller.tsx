import { Button, Input, message, Spin } from "antd";
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { deleteCase, getFeeEarners, transfer } from "../../crud/cases";
import { getCases, getCasesCount } from "../../crud/dashboard";
import { CheckMark } from "../../shared/icons/CheckMark";
import { EarnerI } from "../../shared/types/cases";
import { CaseDetails, CasesCount, CasesReq } from "../../shared/types/dashboard";
import searchIcon from "../../shared/images/search.svg";

export default function useDashboardController() {
  const [search, setSearch] = useState("");
  const [casesData, setCasesData] = useState<CaseDetails[]>([]);
  const [casesCount, setCasesCount] = useState<CasesCount[]>([]);
  const [page, setPage] = useState<number>(1);
  const totalPages: number = 10;
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [isOpenAddCase, setIsOpenAddCase] = useState(false);
  const [openConfirmationModal, setOpenConfireationModal] = useState(false);
  const [openActions, setOpenActions] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedEarners, setSelectedEarners] = useState<string[]>([]);
  const [feeEarners, setFeeEarnes] = useState<EarnerI[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [transferLoader, setTransferLoader] = useState(false);
  const [searchTransfer, setSearchTransfer] = useState("");

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

  useEffect(() => {
    if (openActions) {
      setId(openActions);
    }
  }, [openActions]);

  const isDashboard = location.pathname.includes("/dashboard");

  const transferFunc = () => {
    if (!id) return;
    setTransferLoader(true);
    transfer(+id, selectedEarners)
      .then(() => {
        messageApi.success("Case has been transferred successfully");
        setIsOpenTransfer(false);
        fetchData();
      })
      .finally(() => {
        setTransferLoader(false);
      });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data: CasesReq = {
      withValues: false,
      search: "",
    };
    try {
      const [casesRes, countRes] = await Promise.all([getCases(data), getCasesCount(data)]);

      const path = location.pathname;

      let filteredData = casesRes.data.cases;

      if (path === "/police_station") {
        filteredData = casesRes.data.cases.filter(
          (caseItem: CaseDetails) => caseItem.case_type === "Police Station"
        );
      }

      if (path === "/magistrates_court") {
        filteredData = casesRes.data.cases.filter(
          (caseItem: CaseDetails) => caseItem.case_type === "Magistrates Court"
        );
      }

      if (path === "/youth_court") {
        filteredData = casesRes.data.cases.filter(
          (caseItem: CaseDetails) => caseItem.case_type === "Youth Court"
        );
      }

      if (path === "/court_duty") {
        filteredData = casesRes.data.cases.filter(
          (caseItem: CaseDetails) => caseItem.case_type === "Court Duty"
        );
      }

      if (path === "/crown_court") {
        filteredData = casesRes.data.cases.filter(
          (caseItem: CaseDetails) => caseItem.case_type === "Crown Court"
        );
      }
      if (path === "/dashboard") {
        filteredData = casesRes.data.cases;
      }

      setCasesData(filteredData);
      setCasesCount(countRes.data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [location.pathname]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const deleteCaseFunc = () => {
    if (!openActions) return;
    deleteCase(openActions).then(() => {
      messageApi.success("Case has been deleted");
      setOpenActions(null);
      setOpenConfireationModal(false);
      fetchData();
    });
  };

  const renderContentDeleteAction = (): ReactNode => {
    return (
      <div className="d-flex-end mt-35">
        <Button
          className="secondary_round_btn"
          onClick={() => setOpenConfireationModal(false)}
          style={{ margin: "0 15px 0 0" }}
        >
          Cancel
        </Button>
        <Button className="red_round_btn" onClick={deleteCaseFunc}>
          Delete
        </Button>
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

  const filteredData = feeEarners.filter((item) =>
    item?.code?.toLowerCase()?.includes(searchTransfer.toLowerCase())
  );

  const setIsCloseTransfer = () => {
    setIsOpenTransfer(false);
    setSearchTransfer("");
  };

  const handleChangeTransfer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTransfer(e.target.value);
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
        <Spin spinning={transferLoader}>
          <div className="earner-modal">
            <div className="earner-modal__list">
              {filteredData?.map((elem: EarnerI) => {
                return (
                  <div
                    className={`earner-modal__earner ${
                      selectedEarners.includes(elem.value) ? "active" : ""
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
                onClick={() => setIsOpenTransfer(false)}
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
    handleChange,
    search,
    casesData,
    casesCount,
    totalPages,
    page,
    handlePageChange,
    loading,
    isDashboard,
    setIsOpenAddCase,
    isOpenAddCase,
    setOpenConfireationModal,
    openConfirmationModal,
    setOpenActions,
    openActions,
    contextHolder,
    renderContentDeleteAction,
    setIsOpenTransfer,
    setIsCloseTransfer,
    isOpenTransfer,
    transferFunc,
    setSelectedEarners,
    renderTransfer,
    fetchData,
    location,
  };
}
