import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";

const CustomDatePicker = ({ selected, onChange, ...props }) => (
  <div className="custom-date-picker-wrapper">
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={"dd/MM/yyyy"}
      {...props}
      wrapperClassName="custom-datepicker"
      className="custom-datepicker-input"
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="custom-datepicker-header">
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            type="button"
            className="custom-datepicker-nav-button"
          >
            {"<"}
          </button>
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(value)}
          >
            {Array.from(
              { length: 12 },
              (_, i) => new Date().getFullYear() - 1 + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={date.getMonth()}
            onChange={({ target: { value } }) => changeMonth(value)}
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            type="button"
            className="custom-datepicker-nav-button"
          >
            {">"}
          </button>
        </div>
      )}
    />
  </div>
);

export default CustomDatePicker;
