import React, { PureComponent } from "react";
import PropTypes from 'prop-types';

import "../../public/scss/calendar.scss";

import moment from "moment";
import "react-day-picker/lib/style.css";
import DayPicker from "react-day-picker";
import MomentLocaleUtils from "react-day-picker/moment";
import "../../public/css_admin/date.css";
import classNames from "classnames";
import { getWeekRange } from "../_helpers/time";
import { cloneWithRef } from "react-dnd/lib/utils/cloneWithRef";

class DatePicker extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      opacity: false,
      hoverRange: undefined,
      language: "ru",
    };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleLocalDayClick = this.handleLocalDayClick.bind(this);
    this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this);
    this.handleRightArrowClick = this.handleRightArrowClick.bind(this);
    this.handleDayEnter = this.handleDayEnter.bind(this);
    this.handleDayLeave = this.handleDayLeave.bind(this);
    this.getPercent = this.getPercent.bind(this);
  }

  componentDidUpdate() {
    if (this.state.opacity) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
  }

  showCalendar(opacity) {
    this.setState({
      opacity: opacity,
    });
  }

  handleOutsideClick(e) {
    if (e.target.parentElement.className !== "DayPicker-NavBar") {
      this.showCalendar(false);
    }
  }

  handleLocalDayClick(date) {
    const { type } = this.props;
    this.showCalendar(false);

    if (
      this.props.calendar &&
      moment(this.props.selectedDay).format("YYYY-MM") !==
        moment(date).format("YYYY-MM")
    ) {
      if (this.props.typeSelected && this.props.selectedStaff) {
        this.props.updateAnalytic(date, this.props.selectedStaff, true);
      }
    }

    if (type === "day") {
      this.props.handleDayClick(date);
    } else {
      this.props.handleDayChange(date);
    }
  }

  handleLeftArrowClick() {
    const { type, selectedDay } = this.props;
    this.showCalendar(false);
    if (
      this.props.calendar &&
      moment(this.props.selectedDay).format("YYYY-MM") !==
        moment(moment(selectedDay).subtract(1, "day")).format("YYYY-MM")
    ) {
      if (this.props.typeSelected && this.props.selectedStaff) {
        this.props.updateAnalytic(
          moment(selectedDay).subtract(1, "day"),
          this.props.selectedStaff,
          true
        );
      }
    }

    if (type === "day") {
      this.props.handleDayClick(moment(selectedDay).subtract(1, "day"), {});
    } else {
      this.props.showPrevWeek();
    }
  }

  handleRightArrowClick() {
    const { type, selectedDay } = this.props;
    this.showCalendar(false);

    if (
      this.props.calendar &&
      moment(this.props.selectedDay).format("YYYY-MM") !==
        moment(moment(selectedDay).add(1, "day")).format("YYYY-MM")
    ) {
      if (this.props.typeSelected && this.props.selectedStaff) {
        this.props.updateAnalytic(
          moment(selectedDay).add(1, "day"),
          this.props.selectedStaff,
          true
        );
      }
    }

    if (type === "day") {
      this.props.handleDayClick(moment(selectedDay).add(1, "day"), {});
    } else {
      this.props.showNextWeek();
    }
  }

  handleDayEnter(date) {
    const hoverRange = getWeekRange(date);
    this.setState({
      hoverRange,
    });
  }

  handleDayLeave() {
    this.setState({
      hoverRange: undefined,
    });
  }

  getPercent(day) {
    const { analytic } = this.props;

    if (analytic && day && Object.keys(analytic).length > 0) {
      const analyticDay = analytic[moment(day).format("YYYY-MM-DD")];
      if (!analyticDay || !analyticDay.availableTime) {
        return null;
      }

      return (
        Math.ceil(((analyticDay && analyticDay.percentWorkload) || 0) * 10) / 10
      );
    }
    return 0;
  }

  render() {
    const {
      analytic,
      type,
      selectedDay,
      selectedDays,
      closedDates,
      dayPickerProps = {},
      disabled,
      showArrows
    } = this.props;
    const { opacity, hoverRange } = this.state;
    let weekProps = {};
    let selectedDaysText;
    // let newSelectedDays = [];
    //
    //
    // if (this.props.staff && this.props.typeSelected === true && this.props.selectedStaff && this.props.staff.timetable && this.props.authentication) {
    //   const currentStaff = this.props.staff.timetable.find((timetable) => timetable.staffId === this.props.selectedStaff);
    //
    //   newSelectedDays = newSelectedDays.concat(currentStaff.timetables.map((item) => moment(item.endTimeMillis).utc().startOf('day').toDate()));
    // }

    if (type === "day") {
      const clDates =
        closedDates &&
        closedDates.some(
          (st) =>
            parseInt(
              moment(st.startDateMillis, "x")
                .startOf("day")
                .format("x")
            ) <=
              parseInt(
                moment(selectedDays[0])
                  .startOf("day")
                  .format("x")
              ) &&
            parseInt(
              moment(st.endDateMillis, "x")
                .endOf("day")
                .format("x")
            ) >=
              parseInt(
                moment(selectedDays[0])
                  .endOf("day")
                  .format("x")
              )
        );

      selectedDaysText = (
        <React.Fragment>
          {moment(selectedDay).format("dd, DD MMMM YYYY")}
          {clDates && (
            <span
              className="closedDate-color"
              style={{ textTransform: "none", marginLeft: "5px" }}
            >
              {" "}
              (????????????????)
            </span>
          )}
        </React.Fragment>
      );
    } else {
      selectedDaysText =
        moment(selectedDays[0])
          .startOf("day")
          .format("DD.MM.YYYY") +
        " - " +
        moment(selectedDays[6])
          .endOf("day")
          .format("DD.MM.YYYY");
    }

    const days = [];

    if (this.props.typeSelected && analytic) {
      Object.entries(analytic).forEach(([key, value]) => {
        if (!value.availableTime) {
          days.push(
            moment(key, "YYYY-MM-DD")
              .endOf("day")
              .toDate()
          );
        }
      });
    }

    if (type === "week") {
      const daysAreSelected = selectedDays && selectedDays.length > 0;

      const modifiers = {
        hoverRange,
        notWorking: days,
        selectedRange: daysAreSelected && {
          from: selectedDays[0],
          to: selectedDays[6],
        },
        hoverRangeStart: hoverRange && hoverRange.from,
        hoverRangeEnd: hoverRange && hoverRange.to,
        selectedRangeStart: daysAreSelected && selectedDays[0],
        selectedRangeEnd: daysAreSelected && selectedDays[6],
      };

      weekProps = {
        modifiers,
        onDayMouseEnter: this.handleDayEnter,
        onDayMouseLeave: this.handleDayLeave,
        onWeekClick: this.props.handleWeekClick,
      };
    }

    let modifiers;

    if (this.props.typeSelected === true && type !== "week") {
      modifiers = {
        notWorking: days,
      };
    } else if (type !== "week") {
      modifiers = {
        notWorking: days,
      };
    }

    modifiers = {
      ...modifiers,
      selected: selectedDay,
    };

    const renderDay = (day, dayModifiers) => {
      const date = day.getDate();
      const percent = this.getPercent(day);

      return (
        <React.Fragment>
          {date}
          {this.props.typeSelected &&
            this.props.calendar &&
            percent !== null && (
              <span
                className={
                  "percent" +
                  (percent === 0
                    ? " default-percent"
                    : percent <= 40
                    ? " green-percent"
                    : percent <= 80
                    ? " orange-percent"
                    : " red-percent")
                }
              >
                {percent}%
              </span>
            )}
        </React.Fragment>
      );
    };

    return (
      <div className="select-date">
        <div className="select-inner">
          {disabled && <div className="date-picker-disable" />}
          {showArrows && (
            <span
              className="arrow-left"
              onClick={() => this.handleLeftArrowClick()}
            />
          )}
          <div
            className={`${showArrows && "button-calendar"} button-wrap`}
            onClick={() => this.showCalendar(true)}
          >
            {showArrows && (
              <span className="dates-full-width text-capitalize date-num">
                {selectedDaysText}
              </span>
            )}
            <div
              className={classNames("SelectedWeekExample", {
                visibility: !opacity,
              })}
            >
              <DayPicker
                selectedDays={selectedDays}
                modifiers={modifiers}
                onDayClick={(date) => this.handleLocalDayClick(date)}
                localeUtils={MomentLocaleUtils}
                showOutsideDays
                locale={this.props.language.toLowerCase()}
                renderDay={renderDay}
                {...weekProps}
                {...dayPickerProps}
              />
            </div>
          </div>
          {showArrows && (
            <span
              className="arrow-right"
              onClick={() => this.handleRightArrowClick()}
            />
          )}
        </div>
      </div>
    );
  }
}

DatePicker.defaultProps = {
  showArrows: true,
};

export { DatePicker };
