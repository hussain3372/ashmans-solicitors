import { Radio } from "antd";
import { ReactNode, useState } from "react";
import { Input } from "../../../../../../shared/ui/Input/Input";
import { Select } from "../../../../../../shared/ui/Select/Select";

import CustomModal from "../../../../../../components/CustomModal/CustomModal";
import searchIcon from "../../../../../../shared/images/search.svg";

const { Option } = Select;

interface SelectWithModalProps {
  value: string | string[];
  options: { value: string }[];
  handleChange: (value: string | string[]) => void;
  mode: "single" | "multiple";
  label?: string;
}

const NameOfPoliceSelect = ({
  value,
  options = [],
  handleChange,
  mode,
  label,
  disabled,
}: SelectWithModalProps) => {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [openSelectOffenses, setOpenSelectOffenses] = useState(false);
  const [modal, setModal] = useState(false);

  const onChange = (item: string) => {
    if (mode === "multiple") {
      const newValue = Array.isArray(value) ? [...value] : [];
      const itemIndex = newValue.findIndex((val) => val === item);

      if (itemIndex > -1) {
        newValue.splice(itemIndex, 1);
      } else {
        newValue.push(item);
      }
      handleChange(newValue);
    } else {
      handleChange(item);
      setOpenSelectOffenses(false);
      setModal(true);
    }
  };

  const onChangeSelect = (selectedValues: string[]) => {
    handleChange(selectedValues);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const renderOffences = (): ReactNode => {
    const filteredItems = options.filter((item) =>
      item.value.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="select-modal">
        <Input
          className="search-input"
          suffix={<img src={searchIcon} />}
          placeholder="Search here.."
          maxLength={15}
          onChange={handleSearch}
          value={search}
          allowClear
        />
        <div className="select-modal__selector">
          {filteredItems.map((item) => (
            <div key={item.value} className="row select-modal__row">
              <Radio
                className="select-modal__radio"
                onClick={() => onChange(item.value)}
                value={item.value}
                checked={
                  mode === "multiple"
                    ? Array.isArray(value) && value.includes(item.value)
                    : item.value === value
                }
              >
                {item.value}
              </Radio>
            </div>
          ))}
        </div>
        <div className="d-flex-end select-modal__btns">
          <div
            className="simple_btn"
            onClick={() => setOpenSelectOffenses(false)}
            style={{ margin: "0 15px 0 0" }}
          >
            Close
          </div>
        </div>
      </div>
    );
  };

  const onChangeName = () => {
    handleChange(`${name} ${value}`);
    if (name) {
      handleChange(`${name} ${value}`);
    } else {
      handleChange(value);
    }
    setModal(false);
    setOpenSelectOffenses(false);
    setName("");
  };

  const renderName = () => {
    return (
      <div>
        <Input
          className="search-input"
          //suffix={<img src={searchIcon} />}
          placeholder="Type here.."
          maxLength={15}
          onChange={(e) => setName(e.target.value)}
          value={name}
          label="Name of court / Name of police / Venue"
        />
        <div className="d-flex-end select-modal__btns">
          <div
            className="simple_btn"
            onClick={() => setModal(false)}
            style={{ margin: "0 15px 0 0" }}
          >
            Cancel
          </div>
          <div className="simple_btn" onClick={onChangeName} style={{ margin: "0 15px 0 0" }}>
            Ok
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Select
        showSearch
        placeholder={`Choose option${mode === "multiple" ? "s" : ""}`}
        dropdownStyle={{ display: "none" }}
        style={{ width: "100%" }}
        mode={mode === "multiple" ? "multiple" : undefined}
        value={value || (mode === "multiple" ? [] : undefined)}
        label={label}
        onChange={onChangeSelect}
        allowClear
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setOpenSelectOffenses(true);
        }}
      />

      {openSelectOffenses && (
        <CustomModal
          title={`Select ${label}`}
          content={renderOffences()}
          open={openSelectOffenses}
          onClose={() => setOpenSelectOffenses(false)}
          width="700px"
        />
      )}
      {modal && (
        <CustomModal
          title={`Select ${label}`}
          content={renderName()}
          open={modal}
          onClose={() => setModal(false)}
          width="700px"
        />
      )}
    </>
  );
};

export default NameOfPoliceSelect;
