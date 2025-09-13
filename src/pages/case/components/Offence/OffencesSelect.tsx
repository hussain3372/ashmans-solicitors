import { Input, Radio, Select, Spin, Tooltip } from "antd";
import { ReactNode, useEffect, useState } from "react";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import { getFormsOffences } from "../../../../crud/cases";
import i from "../../../../shared/images/i.svg";
import searchIcon from "../../../../shared/images/search.svg";
import { OffenceI } from "../../../../shared/types/cases";

const { Option } = Select;

const OffencesSelect = (props) => {
  const { value, handleChange, disabled, label } = props || {};
  const [search, setSearch] = useState("");
  const [offenceList, setOffenceList] = useState<OffenceI[]>([]);
  const [loading, setLoading] = useState(false);
  const [openSelectOffenses, setOpenSelectOffenses] = useState(false);

  const fetchOffences = async () => {
    setLoading(true);
    try {
      const res = await getFormsOffences();
      setOffenceList(res.data.offences);
    } catch (error) {
      console.error("Failed to fetch offences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownVisibleChange = (open) => {
    if (offenceList.length === 0) {
      fetchOffences();
    }
  };

  const onChange = (item: OffenceI) => {
    const newValue = value || [];

    const itemIndex = newValue?.findIndex((val) => val.id === item.id);

    if (itemIndex > -1) {
      handleChange(newValue?.filter((val) => val.id !== item.id));
    } else {
      handleChange([...newValue, item]);
    }
  };

  const onChangeSelect = (value: number[]) => {
    handleChange(offenceList.filter((item) => value?.includes(item?.id)));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchOffences();
  }, []);

  const handleClear = () => {
    onChangeSelect([]);
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
          onChange={handleSearch}
          value={search}
          allowClear
        />
        <div className="select-modal__selector">
          {filteredItems.map((item: OffenceI) => (
            <div key={item.id} className="row select-modal__row">
              <Radio
                key={item.id}
                className="select-modal__radio"
                onClick={() => onChange(item)}
                value={""}
                checked={Array.isArray(value) && !!value?.find((elem) => elem.id === item.id)}
              >
                {item.description}
              </Radio>
              <Tooltip title={item.definition}>
                <img src={i} />
              </Tooltip>
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
      <p className="Label">
        <span>{label}</span>
      </p>
      <Select
        showSearch
        placeholder="Select an offence"
        onDropdownVisibleChange={handleDropdownVisibleChange}
        notFoundContent={loading ? <Spin size="small" /> : null}
        dropdownStyle={{ display: "none" }}
        style={{ width: "100%" }}
        mode="multiple"
        value={value?.length ? value?.map((item) => item?.id) : []}
        onChange={onChangeSelect}
        loading={loading}
        allowClear
        onClick={(e) => {
          e.stopPropagation();
          !disabled && setOpenSelectOffenses(true);
        }}
        disabled={disabled}
      >
        {offenceList.map((offence) => (
          <Option key={offence.id} value={offence.id}>
            {offence.description}
          </Option>
        ))}
      </Select>
      <CustomModal
        title="Select Offence"
        content={renderOffences()}
        open={openSelectOffenses}
        onClose={() => setOpenSelectOffenses(false)}
        width="700px"
      />
    </>
  );
};

export default OffencesSelect;
