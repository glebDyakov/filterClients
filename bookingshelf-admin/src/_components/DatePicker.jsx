import React, { PureComponent } from 'react';

import '../../public/scss/calendar.scss';

import moment from 'moment';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import '../../public/css_admin/date.css';
import classNames from 'classnames';
import { getWeekRange } from '../_helpers/time';
import { cloneWithRef } from 'react-dnd/lib/utils/cloneWithRef';

class DatePicker extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      opacity: false,
      hoverRange: undefined,
      language: 'ru',
    };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleLocalDayClick = this.handleLocalDayClick.bind(this);
    this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this);
    this.handleRightArrowClick = this.handleRightArrowClick.bind(this);
    this.handleDayEnter = this.handleDayEnter.bind(this);
    this.handleDayLeave = this.handleDayLeave.bind(this);
  }

  componentDidUpdate() {
    if (this.state.opacity) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
  }

  showCalendar(opacity) {
    this.setState({
      opacity: opacity,
    });
  }

  handleOutsideClick(e) {
    if (e.target.parentElement.className !== 'DayPicker-NavBar') {
      this.showCalendar(false);
    }
  }

  handleLocalDayClick(date) {
    const { type } = this.props;
    this.showCalendar(false);
    if (type === 'day') {
      this.props.handleDayClick(date);
    } else {
      this.props.handleDayChange(date);
    }
  }

  handleLeftArrowClick() {
    const { type, selectedDay } = this.props;
    this.showCalendar(false);
    if (type === 'day') {
      this.props.handleDayClick(moment(selectedDay).subtract(1, 'day'), {});
    } else {
      this.props.showPrevWeek();
    }
  }

  handleRightArrowClick() {
    const { type, selectedDay } = this.props;
    this.showCalendar(false);
    if (type === 'day') {
      this.props.handleDayClick(moment(selectedDay).add(1, 'day'), {});
    } else {
      this.props.showNextWeek();
    }
  }

  handleDayEnter(date) {
    console.log('DATE: ', date);
    const hoverRange = getWeekRange(date);
    this.setState({
      hoverRange,
    });
  };

  handleDayLeave() {
    this.setState({
      hoverRange: undefined,
    });
  };

  render() {
    const { type, selectedDay, selectedDays, closedDates, dayPickerProps = {} } = this.props;
    const { opacity, hoverRange } = this.state;
    let weekProps = {};
    let selectedDaysText;
    let newSelectedDays = [];


    if (this.props.staff && this.props.typeSelected === true && this.props.selectedStaff && this.props.staff.timetable && this.props.authentication) {
      const currentStaff = this.props.staff.timetable.find((timetable) => timetable.staffId === this.props.selectedStaff);

      newSelectedDays = newSelectedDays.concat(currentStaff.timetables.map((item) => moment(item.startTimeMillis).utc().startOf('day').toDate()));
    }


    if (type === 'day') {
      const clDates = closedDates && closedDates.some((st) =>
        parseInt(moment(st.startDateMillis, 'x').startOf('day').format('x')) <= parseInt(moment(selectedDays[0]).startOf('day').format('x')) &&
        parseInt(moment(st.endDateMillis, 'x').endOf('day').format('x')) >= parseInt(moment(selectedDays[0]).endOf('day').format('x')));

      selectedDaysText = (
        <React.Fragment>
          {moment(selectedDay).format('dd, DD MMMM YYYY')}
          {clDates && <span className="closedDate-color"
            style={{ textTransform: 'none', marginLeft: '5px' }}> (выходной)</span>}
        </React.Fragment>
      );
    } else {
      selectedDaysText = (
        moment(selectedDays[0]).startOf('day').format('DD.MM.YYYY') + ' - ' + moment(selectedDays[6]).endOf('day').format('DD.MM.YYYY')
      );
    }

    const startOfMonth = moment(newSelectedDays[0]).startOf('month');
    const endOfMonth = moment(newSelectedDays[newSelectedDays.length-1]).endOf('month');

    const days = [];
    let day = startOfMonth;

    while (day <= endOfMonth) {
      if (!newSelectedDays.some(item => moment(item).utc().startOf('day').format('x') === day.utc().utc().startOf('day').format("x"))) {
        days.push(day.utc().toDate());
      }
      day = day.clone().add(1, 'd');
    }

    if (type === 'week') {
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

    if (this.props.typeSelected === true && type !== 'week') {
      modifiers = {
        notWorking: days,
      };
    } else if (type !== 'week') {
      modifiers = {
        notWorking: days,
      };
    }


    return (
      <div className="select-date">
        <div className="select-inner">
          <span className="arrow-left" onClick={() => this.handleLeftArrowClick()}/>
          <div className="button-calendar" onClick={() => this.showCalendar(true)}>
            <span className="dates-full-width text-capitalize date-num">
              {selectedDaysText}
            </span>
            <div className={classNames('SelectedWeekExample', { 'visibility': !opacity })}>
              <DayPicker
                selectedDays={selectedDays}
                modifiers={modifiers}
                onDayClick={(date) => this.handleLocalDayClick(date)}
                localeUtils={MomentLocaleUtils}
                showOutsideDays
                locale={this.props.language.toLowerCase()}
                {...weekProps}
                {...dayPickerProps}
              />
            </div>
          </div>
          <span className="arrow-right" onClick={() => this.handleRightArrowClick()}/>
        </div>
      </div>
    );
  }
}

export { DatePicker };
