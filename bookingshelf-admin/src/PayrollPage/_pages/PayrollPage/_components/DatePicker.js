import React, { Component } from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import { withTranslation } from 'react-i18next';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.handleCalendar = this.handleCalendar.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.setCalendarRef = this.setCalendarRef.bind(this);
  }

  componentDidMount() {
    // document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    // document.removeEventListener('click', this.handleOutsideClick, false);
  }

  setCalendarRef(node) {
    this.calendarRef = node;
  }

  handleOutsideClick(e) {
    if (this.calendarRef && !this.calendarRef.contains(e.target)) {
      this.setState({
        isOpen: false,
      });
    }
  }

  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleDayMouseEnter(day) {
    const { date, handleSelectDate } = this.props;
    const { from, to } = date;

    if (!this.isSelectingFirstDay(from, to, day)) {
      handleSelectDate({
        ...date,
        enteredTo: day,
      });
    }
  }

  handleDayClick(day) {
    const { date, handleSelectDate } = this.props;
    const { from, to } = date;


    if (from && to && day >= from && day <= to) {
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      handleSelectDate({
        ...date,
        from: day,
        to: null,
        enteredTo: day,
      });
    } else {
      handleSelectDate({
        ...date,
        to: day,
        enteredTo: day,
      }, true);
    }
  }

  handleResetClick() {
    const { date, handleSelectDate } = this.props;

    handleSelectDate({
      ...date,
      from: null,
      to: null,
      enteredTo: null,
    });

  }

  handleCalendar() {
    this.setState((prev) => ({
      isOpen: !prev.isOpen,
    }));
  }

  render() {
    const { date, i18n } = this.props;
    const { from, to, enteredTo } = date;
    const modifiersClosed = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDaysClosed = [from, { from, to: enteredTo }];

    return (
      <div className="calendar">
        <div onClick={this.handleCalendar} className="button-calendar">
          <input type="button" data-range="true"
                 value={
                   (from && from !== 0 ? moment(from).format('dd, DD MMMM YYYY') : '') +
                   (to ? ' - ' + moment(to).format('dd DD MMMM') : '')
                 }
                 data-multiple-dates-separator=" - " name="date"
                 ref={(input) => this.startClosedDate = input}/>
        </div>

        <span ref={this.setCalendarRef} style={{ display: this.state.isOpen ? 'block' : 'none' }}>
          <DayPicker
            className="SelectedWeekExample"
            fromMonth={from}
            selectedDays={selectedDaysClosed}
            disabledDays={[disabledDays, { after: moment().utc().toDate() }]}
            modifiers={modifiersClosed}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
            localeUtils={MomentLocaleUtils}
            locale={i18n.language}
          />
        </span>
      </div>
    );
  }
}

export default withTranslation('common')(DatePicker);
