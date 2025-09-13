import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  CheckCirleIcon,
  CourtIcon,
  CrownIcon,
  DutyIcon,
  PoliceStationIcon,
  UncheckCircleIcon,
  YoungIcon,
} from "../../../../../../shared/icons";
import calendar from "../../../../../../shared/images/calendar.svg";
import ActionDropdown from "../../../FormBlock/components/FormTableActions/FormTableActions";

const renderIcon = (type: string) => {
  if (type === "police_station") return <PoliceStationIcon />;
  if (type === "magistrates_court") return <CourtIcon />;
  if (type === "crown_court") return <CrownIcon />;
  if (type === "court_duty") return <DutyIcon />;
  if (type === "youth_court") return <YoungIcon />;
};

export const FormRowItem = ({
  form,
  refActions,
  instance,
  caseId,
  handleEdit,
  handleSend,
  handleDelete,
  handlePrint,
  handleDownload,
  handleSubmitToProclaim,
  selectedRow,
  editing,
  setSelectedRow,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="case__form row"
      key={form.id}
      ref={refActions}
      onClick={() => {
        if (editing) return;
        navigate(
          `/case/${instance}/form/view?formName=${form.form.name}&formId=${form.form_id}&caseId=${caseId}&recordId=${form.id}`
        );
      }}
    >
      <div className="row">
        {!editing ? (
          <p className="case__form-logo">{renderIcon(instance)}</p>
        ) : (
          <div
            className="check-actions-block"
            onClick={() => {
              if (selectedRow.includes(form.id)) {
                setSelectedRow((prev) => prev.filter((id) => id !== form.id));
              } else setSelectedRow((prev) => [...prev, form.id]);
            }}
          >
            {selectedRow.includes(form.id) ? <CheckCirleIcon /> : <UncheckCircleIcon />}
          </div>
        )}
        <div className="case__form-info-wrapper">
          <div className="case__form-title">{form.form.name}</div>
          <div className="case__form-subtitle">
            <img src={calendar} />
            {dayjs(form.created_at)
              .add(dayjs(form.created_at).utcOffset(), "minute")
              .format("DD-MM-YYYY HH:hh")}
          </div>
        </div>
      </div>
      <div className="case__item item">
        <div
          className={`item__status  ${form.status === 1 || form.status === 3 ? "pending" : form.status === 5 || form.status === 7 ? "submitted" : form.status === 9 ? "transfered" : ""}`}
        >
          {form.status === 1 || form.status === 3 ? "Form Pending" : ""}
          {form.status === 5 || form.status === 7 ? "Form Submitted " : ""}
        </div>
        {form.status !== 9 && (
          <div onClick={(e) => e.stopPropagation()} className="item__actions-wrapper relative">
            <ActionDropdown
              handleSubmitToProclaim={handleSubmitToProclaim}
              handleSend={handleSend}
              handleEdit={handleEdit}
              handlePrint={handlePrint}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              record={form}
            />
          </div>
        )}
      </div>
    </div>
  );
};
