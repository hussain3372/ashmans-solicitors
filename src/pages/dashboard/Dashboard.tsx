import { Button, Input, Pagination, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/CustomModal/CustomModal";
import { useClickOutside } from "../../hooks/useClickOutside";
import { CourtDutySolicitorFile } from "../../shared/icons/CourtDutySolicitorFile";
import { CrownCourt } from "../../shared/icons/CrownCourt";
import { MagistratesCourt } from "../../shared/icons/MagistratesCourt";
import { PoliceStation } from "../../shared/icons/PoliceStation";
import { YouthCourt } from "../../shared/icons/YouthCourt";
import Action from "../../shared/images/Action.svg";
import calendar from "../../shared/images/calendar.svg";
import searchIcon from "../../shared/images/search.svg";
import { CaseDetails, CasesCount } from "../../shared/types/dashboard";
import { LegalEntity } from "./components/LegalEntity";
import useDashboardController from "./Dashboard.controller";
import "./dashboard.scss";

export const Dashboard = () => {
  const {
    handleChange,
    search,
    casesData,
    casesCount,
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
    renderContentDeleteAction,
    contextHolder,
    setIsOpenTransfer,
    setIsCloseTransfer,
    isOpenTransfer,
    renderTransfer,
    fetchData,
    location,
  } = useDashboardController();

  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const refActions = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpenAddCase(false));
  useClickOutside(refActions, () => setOpenActions(null));

  useEffect(() => {
    fetchData();
  }, [location]);

  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCases = casesData?.slice(startIndex, endIndex);

  const filteredItems = currentCases.filter((item) => {
    return item.client_name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Spin size="large" spinning={loading}>
      {contextHolder}
      <div className="dashboard">
        {isDashboard && (
          <div className="dashboard__entity-list row">
            {[
              "Police Station",
              "Magistrates Court",
              "Youth Court",
              "Court Duty Solicitor File",
              "Crown Court",
            ].map((title) => {
              const elem = casesCount?.find((elem: CasesCount) => title.includes(elem.case_type));
              return <LegalEntity key={title} title={title} value={elem?.total ?? 0} />;
            })}
          </div>
        )}
        <div className="row">
          {isDashboard ? (
            <div ref={ref} className="relative">
              <Button
                className="small_btn primary_round_btn"
                onClick={() => setIsOpenAddCase(true)}
              >
                + Create Case
              </Button>
              {isOpenAddCase && (
                <div className="dashboard__selector">
                  <div
                    className="dashboard__case-name"
                    onClick={() => navigate("/case/police_station/create")}
                  >
                    Police Station
                  </div>
                  <div
                    className="dashboard__case-name"
                    onClick={() => navigate("/case/magistrates_court/create")}
                  >
                    Magistrates Court
                  </div>
                  <div
                    className="dashboard__case-name"
                    onClick={() => navigate("/case/youth_court/create")}
                  >
                    Youth Court
                  </div>
                  <div
                    className="dashboard__case-name"
                    onClick={() => navigate("/case/court_duty/create")}
                  >
                    Court Duty
                  </div>
                  <div
                    className="dashboard__case-name"
                    onClick={() => navigate("/case/crown_court/create")}
                  >
                    Crown Court
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              className="small_btn primary_round_btn"
              onClick={() => navigate(`/case/${location.pathname.split("/")[1]}/create`)}
              style={{ minWidth: 110 }}
            >
              + Create Case
            </Button>
          )}
          <div className="dashboard__serach-wrapper">
            <Input
              className="search-input"
              suffix={<img src={searchIcon} />}
              placeholder="Search here.."
              maxLength={15}
              onChange={handleChange}
              value={search}
              allowClear
            />
          </div>
        </div>
        <div className="dashboard__list list" ref={refActions}>
          {filteredItems.length ? (
            filteredItems.map((elem: CaseDetails) => {
              return (
                <div
                  key={elem.id}
                  className="list__item item"
                  onClick={() =>
                    navigate(
                      `/case/${elem.case_type.toLowerCase().split(" ").join("_")}/view?caseId=${elem.id}`,
                      { state: { from: location.pathname } }
                    )
                  }
                >
                  <div className="item__image-wrapper">
                    {elem.case_type === "Youth Court" && (
                      <div className="item__color light-green">
                        <YouthCourt fill="white" />
                      </div>
                    )}
                    {elem.case_type === "Police Station" && (
                      <div className="item__color blue">
                        <PoliceStation fill="white" />
                      </div>
                    )}
                    {elem.case_type === "Magistrates Court" && (
                      <div className="item__color green">
                        <MagistratesCourt fill="white" />
                      </div>
                    )}
                    {elem.case_type === "Court Duty" && (
                      <div className="item__color orange">
                        <CourtDutySolicitorFile fill="white" />
                      </div>
                    )}
                    {elem.case_type === "Crown Court" && (
                      <div className="item__color red">
                        <CrownCourt fill="white" />
                      </div>
                    )}
                  </div>
                  <div className="item__main-info main-info">
                    <div className="main-info__title">{elem.client_name}</div>
                    <div className="main-info__grey">
                      <img src={calendar} />
                      {dayjs(elem.updated_at).format("MMMM D, YYYY")}
                    </div>
                  </div>
                  <div className="item__main-info main-info">
                    <div className="main-info__grey">Fee Earner</div>
                    <div className="main-info__subtitle">{elem.feeEarner}</div>
                  </div>
                  <div className="item__main-info main-info">
                    <div className="main-info__grey">Case Reference</div>
                    <div className="main-info__subtitle">{elem.app_case_ref}</div>
                  </div>

                  <div className="item__main-info main-info">
                    <div className="main-info__grey">Case Status</div>
                    <div className="main-info__subtitle">
                      {elem.case_type === "Court Duty" ? "-" : elem["case-status"]}{" "}
                    </div>
                  </div>
                  {/* <div className="item__main-info main-info">
                    <div className="main-info__grey">Billing Status</div>
                    <div className="main-info__subtitle">
                      {elem.case_type === "Court Duty" ? "-" : elem["billing-status"]}
                    </div>
                  </div> */}
                  <div
                    className={`item__status  ${elem.status === 1 || elem.status === 3 ? "pending" : elem.status === 5 || elem.status === 7 ? "submitted" : elem.status === 9 ? "transfered" : ""}`}
                  >
                    {elem.status === 1 || elem.status === 3 ? "Form Pending" : ""}
                    {elem.status === 9 ? "Transfered" : ""}
                    {elem.status === 7 || elem.status === 5 ? "Form Submitted " : ""}
                  </div>
                  <div className="relative">
                    {elem.status === 9 ? (
                      <div className="item__actions" />
                    ) : (
                      <>
                        <div
                          className="item__actions"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActions(elem.id);
                          }}
                        >
                          <img src={Action} />
                        </div>
                        {openActions === elem.id && (
                          <div className="item__opens-menu">
                            <div
                              className="item__item-menu"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/case/${elem.case_type.toLowerCase().split(" ").join("_")}/edit?caseId=${elem.id}`
                                );
                              }}
                            >
                              Edit
                            </div>

                            <div
                              className="item__item-menu"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpenTransfer(true);
                              }}
                            >
                              Transfer
                            </div>

                            <div
                              className="item__item-menu"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenConfireationModal(true);
                              }}
                            >
                              Delete
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="list__nodata d-flex-center">
              The term "{search}" Not Found in Case List
            </div>
          )}
        </div>
        {currentCases?.length ? (
          <div className="dashboard__pagination row">
            <div className="dashboard__total-pages">
              Showing {currentCases?.length} from {casesData?.length} cases
            </div>
            <Pagination
              current={page}
              total={casesData?.length}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {openConfirmationModal && (
        <CustomModal
          title="Delete action"
          subtitle="Do you wish to delete case?"
          content={renderContentDeleteAction()}
          open={openConfirmationModal}
          onClose={() => setOpenConfireationModal(false)}
        />
      )}
      <CustomModal
        title={"Transfer Case"}
        subtitle={""}
        content={renderTransfer()}
        open={isOpenTransfer}
        onClose={setIsCloseTransfer}
        width="350px"
        className="transfer-modal"
      />
    </Spin>
  );
};
