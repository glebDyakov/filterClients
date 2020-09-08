import React, { PureComponent } from 'react';

import '../../public/scss/calendar.scss';

import moment from 'moment';

import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import '../../public/css_admin/date.css';
import classNames from 'classnames';
import { getWeekRange } from '../_helpers/time';

class DatePicker extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      opacity: false,
      hoverRange: undefined,
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

    if (type === 'day') {
      const clDates = closedDates && closedDates.some((st) =>
        parseInt(moment(st.startDateMillis, 'x').startOf('day').format('x')) <= parseInt(moment(selectedDays[0]).startOf('day').format('x')) &&
                parseInt(moment(st.endDateMillis, 'x').endOf('day').format('x')) >= parseInt(moment(selectedDays[0]).endOf('day').format('x')));

      selectedDaysText = (
        <React.Fragment>
          {moment(selectedDay).format('dd, DD MMMM YYYY')}
          {clDates && <span className="closedDate-color" style={{ textTransform: 'none', marginLeft: '5px' }}> (выходной)</span>}
        </React.Fragment>
      );
    } else {
      selectedDaysText = (
        moment(selectedDays[0]).startOf('day').format('DD.MM.YYYY') +' - '+ moment(selectedDays[6]).endOf('day').format('DD.MM.YYYY')
      );
    }


    if (type === 'week') {
      const daysAreSelected = selectedDays && selectedDays.length > 0;

      const modifiers = {
        hoverRange,
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


    return (
      <div className="select-date">
        <div className="select-inner">
          <span className="arrow-left" onClick={() => this.handleLeftArrowClick()}/>
          <div className="button-calendar" onClick={()=>this.showCalendar(true)}>
            <span className="dates-full-width text-capitalize date-num" >
              {selectedDaysText}
            </span>
            <div className={classNames('SelectedWeekExample', { 'visibility': !opacity })}>
              <DayPicker
                selectedDays={selectedDays}
                onDayClick={(date) => this.handleLocalDayClick(date)}
                localeUtils={MomentLocaleUtils}
                showOutsideDays
                locale={'ru'}
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
