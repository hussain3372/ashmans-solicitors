import { Input, Radio } from "antd";
import { ReactNode, useState } from "react";
import { Select } from "../../../../../../shared/ui/Select/Select";

import CustomModal from "../../../../../../components/CustomModal/CustomModal";
import searchIcon from "../../../../../../shared/images/search.svg";

interface SelectWithModalProps {
  value: string | string[];
  options: { value: string }[];
  handleChange: (value: any) => void;
  mode: "single" | "multiple";
  label?: string;
}

const SelectWithModal = ({
  value,
  options = [],
  handleChange,
  mode,
  label,
  disabled,
}: SelectWithModalProps) => {
  const [search, setSearch] = useState("");
  const [openSelectOffenses, setOpenSelectOffenses] = useState(false);

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
    }
  };

  const onChangeSelect = (selectedValues: string[]) => {
    handleChange(selectedValues);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClear = () => {
    if (mode === "multiple") {
      onChangeSelect([]);
      setOpenSelectOffenses(false);
    } else {
      onChangeSelect("");
      setOpenSelectOffenses(false);
    }
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
        <div className="d-flex-end">
          <div className="simple_btn" onClick={handleClear}>
            Clear
          </div>

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
          if (!disabled) {
            setOpenSelectOffenses(true);
          }
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
    </>
  );
};

export default SelectWithModal;
