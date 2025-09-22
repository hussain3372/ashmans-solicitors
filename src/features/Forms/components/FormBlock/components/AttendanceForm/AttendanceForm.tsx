import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TimePicker } from "../../../../../../shared/ui/TImePicker/TImePicker";
import "./style.scss";

const sections = ["Travel", "Waiting", "Attendance", "Interview"];

const sectionLimits = {
  Travel: 2,
  Waiting: 2,
  Attendance: 3,
  Interview: 3,
};

const calculateTimeDifference = (from, to) => {
  if (!from || !to) return 0;
  const date = dayjs(to);
  const minutes = date.minute();
  const hours = date.hour();
  if (minutes === 0 && hours === 0) {
    const newDate = date.add(24, "hour");
    const newDateString = newDate.format();
    return dayjs(newDateString).diff(dayjs(from), "minute");
  }
  return dayjs(to).diff(dayjs(from), "minute");
};

export const AttendanceForm = ({ options, handleChange, value, disabled }) => {
  const [selectValue, setSelectValue] = useState(options?.[0]?.label || "");
  const [totals, setTotals] = useState({});
  const [formValues, setFormValues] = useState(value);

  const handleSelect = (value) => {
    setSelectValue(value);
  };

  const handleTimeChange = (section, key, value) => {
    const updatedFields = { ...formValues };

    updatedFields[selectValue] = {
      ...updatedFields[selectValue],
      [section]: {
        ...updatedFields[selectValue]?.[section],
        [key]: value,
      },
    };

    const sectionData = updatedFields[selectValue]?.[section] || {};
    let totalMinutes = 0;
    let totalUnits = 0;

    Object.keys(sectionData).forEach((slotKey) => {
      if (slotKey.startsWith("from") && sectionData[`to-${slotKey.split("-")[1]}`]) {
        const from = sectionData[slotKey];
        const to = sectionData[`to-${slotKey.split("-")[1]}`];

        if (from && to) {
          const minutes = calculateTimeDifference(from, to);
          if (minutes < 0) {
            return;
          }
          totalMinutes += minutes;
          totalUnits += minutes / 6;
        }
      }
    });

    const dataToUpdate = {
      ...updatedFields,
      [selectValue]: {
        ...updatedFields[selectValue],
        [section]: {
          ...updatedFields[selectValue][section],
          totals: totalMinutes,
          units: Math.ceil(totalUnits),
        },
      },
    };

    setFormValues(dataToUpdate);
    handleChange?.(dataToUpdate);

    setTotals({
      ...totals,
      [section]: { totals: totalMinutes, units: Math.ceil(totalUnits) },
    });
  };

  const handleAdd = (section) => {
    const updatedFields = { ...formValues };
    if (!updatedFields[selectValue]) {
      updatedFields[selectValue] = {};
    }
    if (!updatedFields[selectValue][section]) {
      updatedFields[selectValue][section] = {};
    }
    const countFormKeys = (obj) => {
      let count = 1;
      Object.keys(obj).forEach((key) => {
        if (key.startsWith("from")) {
          count++;
        }
      });

      return count;
    };
    const index = countFormKeys(updatedFields[selectValue][section]);
    const newObj = JSON.parse(JSON.stringify(updatedFields));
    newObj[selectValue][section] = {
      ...newObj[selectValue][section],
      [`from-${index}`]: null,
      [`to-${index}`]: null,
    };
    setFormValues(newObj);
  };

  const handleRemove = (section, key) => {
    const updatedFields = JSON.parse(JSON.stringify(formValues));
    if (updatedFields[selectValue] && updatedFields[selectValue][section]) {
      delete updatedFields[selectValue][section][`from-${key}`];
      delete updatedFields[selectValue][section][`to-${key}`];
    }
    setFormValues(updatedFields);

    const sectionData = updatedFields[selectValue]?.[section] || {};
    let totalMinutes = 0;
    let totalUnits = 0;

    Object.keys(sectionData).forEach((slotKey) => {
      if (slotKey.startsWith("from") && sectionData[`to-${slotKey.split("-")[1]}`]) {
        const from = sectionData[slotKey];
        const to = sectionData[`to-${slotKey.split("-")[1]}`];

        if (from && to) {
          const minutes = calculateTimeDifference(from, to);
          if (minutes < 0) {
            return;
          }
          totalMinutes += minutes;
          totalUnits += minutes / 6;
        }
      }
    });

    const dataToUpdate = {
      ...updatedFields,
      [selectValue]: {
        ...updatedFields[selectValue],
        [section]: {
          ...updatedFields[selectValue][section],
          totals: totalMinutes,
          units: Math.ceil(totalUnits),
        },
      },
    };

    setFormValues(dataToUpdate);
    handleChange?.(dataToUpdate);

    setTotals({
      ...totals,
      [section]: { totals: totalMinutes, units: Math.ceil(totalUnits) },
    });
  };

  useEffect(() => {
    if (value) return;
    const initialValues = {};
    options?.forEach((option) => {
      initialValues[option.label] = sections.reduce((acc, section) => {
        acc[section] = { "from-1": null, "to-1": null };
        return acc;
      }, {});
    });

    setFormValues(initialValues);
  }, []);

  const renderAddButton = (section) => {
    const limit = sectionLimits[section];
    const existingSlots = Object.keys(formValues[selectValue]?.[section] || {});
    const slotCount = existingSlots.filter((key) => key.startsWith("from")).length;

    return !disabled && slotCount < limit ? (
      <Button
        onClick={() => handleAdd(section)}
        icon={<PlusOutlined />}
        style={{ marginTop: 16, width: "100%", height: "40px" }}
      >
        Add Time Slot
      </Button>
    ) : null;
  };

  const renderTimeSlots = (formValues, selectValue, section) => {
    const sectionData = formValues[selectValue]?.[section] || {};

    const timeSlots = Object.keys(sectionData).reduce((acc, key) => {
      const [type, index] = key.split("-");
      if (type === "from" || type === "to") {
        if (!acc[index]) acc[index] = {};
        acc[index][type] = sectionData[key];
      }
      return acc;
    }, {});

    const timeSlotIndexes = Object.keys(timeSlots);

    return Object.keys(timeSlots).map((index, idx) => {
      const { from, to } = timeSlots[index];

      return (
        <div key={index} className="time-slot-container">
          <TimePicker
            format="HH:mm"
            value={from ? dayjs(from) : null}
            onChange={(time) =>
              handleTimeChange(section, `from-${index}`, time ? time.format() : null)
            }
            style={{ marginRight: 8 }}
            label="From"
            disabled={disabled}
          />
          <TimePicker
            format="HH:mm"
            value={to ? dayjs(to) : null}
            onChange={(time) =>
              handleTimeChange(section, `to-${index}`, time ? time.format() : null)
            }
            label="To"
            disabled={disabled}
          />
          {Object.keys(timeSlots).length > 1 && !disabled && idx === timeSlotIndexes.length - 1 && (
            <MinusCircleOutlined
              className="remove-slot-icon"
              onClick={() => handleRemove(section, index)}
              style={{ marginLeft: 8, cursor: "pointer", top: "61%" }}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className="container">
      <div className="select-wrapper">
        <p className="form-title">Time Recording</p>
        <Select
          value={selectValue}
          onChange={handleSelect}
          style={{ width: "100%", marginBottom: 16 }}
        >
          {options?.map((option) => (
            <Select.Option key={option.label} value={option.label}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      {sections.map((section) => (
        <div key={section}>
          <p className="form-title">{section}</p>
          <div className="totals-container">
            <div className="totals-container__inner">
              <p className="total-title">Total Minutes</p>
              <p className="total-value">{formValues?.[selectValue]?.[section]?.totals || 0}</p>
            </div>
            <div className="totals-container__inner">
              <p className="total-title">Units</p>
              <p className="total-value">{formValues?.[selectValue]?.[section]?.units || 0}</p>
            </div>
          </div>

          {renderTimeSlots(formValues, selectValue, section)}
          {renderAddButton(section)}

          <Divider />
        </div>
      ))}
    </div>
  );
};
