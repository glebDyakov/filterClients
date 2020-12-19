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
  }

  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleCalendar() {
    this.setState((prev) => ({
      isOpen: !prev.isOpen,
    }));
  }

  render() {
    const { from, enteredTo, i18n } = this.props;
    const modifiersClosed = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDaysClosed = [from, { from, to: enteredTo }];

    return (
      <div className="calendar">
        <div onClick={this.handleOpenCalendar} className="button-calendar">
          <input type="button" data-range="true"
                 value={
                   (from && from !== 0 ? moment(from).format('dd, DD MMMM YYYY') : '') +
                   (to ? ' - ' + moment(to).format('dd DD MMMM') : '')
                 }
                 data-multiple-dates-separator=" - " name="date"
                 ref={(input) => this.startClosedDate = input}/>
        </div>

        {this.state.isOpenedDatePicker &&
        <DayPicker
          className="SelectedWeekExample"
          fromMonth={from}
          selectedDays={selectedDaysClosed}
          disabledDays={[disabledDays, { after: moment().utc().toDate() }]}
          modifiers={modifiersClosed}
          onDayClick={handleDayClick}
          onDayMouseEnter={handleDayMouseEnter}
          localeUtils={MomentLocaleUtils}
          locale={i18n.language}
        />}
      </div>
    );
  }
}

export default withTranslation('common')(DatePicker);
