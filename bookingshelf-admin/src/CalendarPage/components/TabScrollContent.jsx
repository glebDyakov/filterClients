import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import TabScrollLeftMenu from './TabScrollLeftMenu';

import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import DragVertController from "./DragVertController";
import BaseCell from "./BaseCell";
import {getCurrentCellTime} from "../../_helpers";
import {staffActions} from "../../_actions";

class TabScroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numbers: [],
            clDate: false
        }
        this.getHours24 = this.getHours24.bind(this);
        this.getIsPresent = this.getIsPresent.bind(this);
        this.isClosed = this.isClosed.bind(this);
    }

    componentDidMount() {
        if (this.props.timetable && this.props.timetable.length) {
            this.getHours24(this.props.timetable);
        }
    }


    componentWillReceiveProps(newProps) {
        $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'});
        if (newProps.timetable && (JSON.stringify(newProps.timetable) !== JSON.stringify(this.props.timetable))) {
            this.getHours24(newProps.timetable);
        }

        if (newProps.selectedDays) {
            this.isClosed(newProps.selectedDays);
        }
    }

    isClosed(selectedDays) {
        const clDate = selectedDays.length === 1 && this.props.closedDates && this.props.closedDates.length > 0 && this.props.closedDates.some((st) => {
            return moment(moment(selectedDays[0]).valueOf()).subtract(-1, "minute").isBetween(moment(st.startDateMillis).startOf("day"), moment(st.endDateMillis).endOf("day"));
        }) || false;

        this.setState({
            clDate
        })
    }

    getHours24(timetable) {
        const {booktimeStep} = this.props.company.settings;
        const step = booktimeStep / 60;
        const numbers = [];

        let minTime = 0
        let maxTime = 0

        timetable.forEach(timetableItem => {
            timetableItem.timetables.forEach(time => {
                if (!minTime || (moment(time.startTimeMillis).format('HH:mm') < moment(minTime).format('HH:mm'))) {
                    minTime = time.startTimeMillis
                }

                if (!maxTime || (moment(time.endTimeMillis).format('HH:mm') > moment(maxTime).format('HH:mm'))) {
                    maxTime = time.endTimeMillis
                }

            })
        })
        if (minTime > 0 && maxTime > 0) {
            let startTime = (parseInt(moment(minTime).format('HH')) * 60) + parseInt(moment(minTime).format('mm'));
            let endTime = (parseInt(moment(maxTime).format('HH')) * 60) + parseInt(moment(maxTime).format('mm'));

            let startNumber = startTime - parseInt(moment(minTime).format('mm'))

            let endNumber = endTime - parseInt(moment(maxTime).format('mm')) + 60

            for (let i = startNumber; i < endNumber; i = i + step) {
                numbers.push(moment().startOf('day').add(i, 'minutes').format('HH:mm'));
            }
        }

        this.setState({numbers});
    }

    getIsPresent(currentCellTime) {
        const { booktimeStep } = this.props.company.settings;
        const step  = booktimeStep / 60;
        return currentCellTime <= moment().format("x") && currentCellTime >= moment().subtract(step, "minutes").format("x")
    }

    render() {
        const {company, availableTimetable, getCellTime, checkForCostaffs, services, moveVisit, type, handleUpdateClient, updateAppointmentForDeleting, changeTime, changeTimeFromCell, selectedDays} = this.props;
        const {numbers} = this.state;
        const {booktimeStep} = company.settings
        const step = booktimeStep / 60;

        // console.log(clDate, moment(selectedDays).format("DD/MMMM"));

        let listClass = 'list-15'
        switch (step) {
            case 5:
                listClass = 'list-5';
                break;

            case 10:
                listClass = 'list-10';
                break;
            default:
        }


        return (
            <div className="tabs-scroll" id="calendar-tabs-scroll">
                <DndProvider backend={Backend}>
                    {numbers && numbers.map((time, key) => {
                        const currentCellTime = getCurrentCellTime(selectedDays, 0, time);
                        const isPresent = this.getIsPresent(currentCellTime);

                        return (
                            <div key={`number-${key}`} className={(selectedDays && this.state.clDate ? "clDate " : '') + "tab-content-list " + listClass + (isPresent ? ' present-line-block' : '')}>
                                {type === 'day'  && isPresent && <span data-time={moment().format("HH:mm")} className="present-time-line"/>}
                                <TabScrollLeftMenu time={time}/>
                                {availableTimetable && selectedDays && !this.state.clDate && availableTimetable.map((workingStaffElement, staffKey) =>
                                    <BaseCell
                                        checkForCostaffs={checkForCostaffs}
                                        getCellTime={getCellTime}
                                        key={`working-staff-${staffKey}`}
                                        numberKey={key}
                                        staffKey={staffKey}
                                        changeTime={changeTime}
                                        changeTimeFromCell={changeTimeFromCell}
                                        handleUpdateClient={handleUpdateClient}
                                        numbers={numbers}
                                        services={services}
                                        workingStaffElement={workingStaffElement}
                                        updateAppointmentForDeleting={updateAppointmentForDeleting}
                                        selectedDaysKey={type === 'day' ? 0 : staffKey}
                                        time={time}
                                        moveVisit={moveVisit}
                                    />
                                )}
                            </div>
                        )}
                    )}
                </DndProvider>
                <DragVertController/>
            </div>
        );
    }

}

export default connect()(TabScroll);
