import React, {Component} from 'react';

import '../../public/scss/calendar.scss'
import '../../public/scss/styles.scss'

import 'moment/locale/ru';
import 'moment-duration-format';

import 'react-day-picker/lib/style.css';
import DayPicker from "react-day-picker";
import MomentLocaleUtils from 'react-day-picker/moment';
import '../../public/css_admin/date.css'
import classNames from "classnames";


class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: false,
            hoverRange: undefined,
        };
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleDayEnter = this.handleDayEnter.bind(this);
        this.handleDayLeave = this.handleDayLeave.bind(this);
    }

    componentDidUpdate() {
        if(this.state.opacity) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
    }

    showCalendar(opacity) {
        this.setState({
            opacity: opacity
        });
    }

    handleOutsideClick(e) {
        if (e.target.parentElement.className !== 'DayPicker-NavBar') {
            this.showCalendar(false);
        }
    }

    handleDayClick(date) {
        this.showCalendar(false);
        this.props.onDayClick(date);
    }

    handleLeftArrowClick() {
        this.showCalendar(false);
        this.props.onLeftArrowClick();
    }

    handleRightArrowClick() {
        this.showCalendar(false);
        this.props.onRightArrowClick();
    }

    handleDayEnter (date) {
        this.setState({
            hoverRange: this.props.getWeekRange(date),
        });
    };

    handleDayLeave () {
        this.setState({
            hoverRange: undefined,
        });
    };

    render() {
        const { type, selectedDays, selectedDaysText } = this.props;
        const { opacity, hoverRange } = this.state;
        let weekProps = {};
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
                onWeekClick: this.props.onWeekClick
            };
        }


        return (
            <div className="select-date">
                <div className="select-inner">
                    <span className="arrow-left" onClick={() => this.handleLeftArrowClick()}/>
                        <div className="button-calendar">
                            <span className="dates-full-width text-capitalize date-num" onClick={()=>this.showCalendar(true)}>
                                {selectedDaysText}
                            </span>
                            <div className={classNames('SelectedWeekExample', { 'visibility': !opacity })}>
                                <i className="datepicker--pointer"></i>
                                <DayPicker
                                    selectedDays={selectedDays}
                                    onDayClick={(date) => this.handleDayClick(date)}
                                    localeUtils={MomentLocaleUtils}
                                    showOutsideDays
                                    locale={'ru'}
                                    {...weekProps}
                                />
                            </div>
                        </div>
                    <span className="arrow-right" onClick={() => this.handleRightArrowClick()}/>
                </div>
            </div>
        );
    }
}

export {DatePicker};