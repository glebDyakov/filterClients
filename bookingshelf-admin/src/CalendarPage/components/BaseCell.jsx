import React from 'react';
import { connect } from 'react-redux';
import moment from "moment";
import CellAppointment from "./CellAppointment";
import {checkIsOnAnotherVisit} from "../../_helpers/available-time";
import {appointmentActions} from "../../_actions";
import CellWhite from "./CellWhite";
import CellExpired from "./CellExpired";
import CellReservedTime from "./CellReservedTime";

const cellTypes = {
    CELL_APPOINTMENT: 'CELL_APPOINTMENT',
    CELL_RESERVED_TIME: 'CELL_RESERVED_TIME',
    CELL_WHITE: 'CELL_WHITE',
    CELL_EXPIRED: 'CELL_EXPIRED',
}

class BaseCell extends React.Component {
    constructor(props) {
        super(props);
        let filledCell;

        const cellAppointment = this.getCellFilled({ ...props, cellType: cellTypes.CELL_APPOINTMENT });
        if (cellAppointment) {
            filledCell = cellAppointment;
        } else {
            const cellReservedTime = this.getCellFilled({ ...props, cellType: cellTypes.CELL_RESERVED_TIME });
            if (cellReservedTime) {
                filledCell = cellReservedTime;
            } else {
                filledCell = this.getCellEmpty(props.workingStaffElement, { selectedDaysKey: props.selectedDaysKey, time: props.time }, props.getCellTime);
            }
        }

        this.state = {
            ...filledCell
        };
    }

    shouldComponentUpdate(newProps, newState) {
        return (this.state.cellType !== newState.cellType)
            || ([cellTypes.CELL_APPOINTMENT, cellTypes.CELL_RESERVED_TIME]
                    .some(cellType => (this.state.cellType === cellType && newState.cellType === cellType))
                && JSON.stringify(this.state.cell) !== JSON.stringify(newState.cell)
            );
    }

    componentWillReceiveProps(newProps, nextContext) {
        this.onUpdateWorkingStaff(newProps)
    }

    onUpdateWorkingStaff(props) {
        const { cellType } = this.state
        let filledCell;

        const cellAppointment = this.getCellFilled({ ...props, cellType: cellTypes.CELL_APPOINTMENT });
        if (cellAppointment) {
            filledCell = cellAppointment;
        }

        if (!filledCell) {
            const cellReservedTime = this.getCellFilled({...props, cellType: cellTypes.CELL_RESERVED_TIME});
            if (cellReservedTime) {
                filledCell = cellReservedTime;
            }
        }

        if (filledCell) {
            this.setState({ ...filledCell })
        } else {
            filledCell = this.getCellEmpty(props.workingStaffElement, { selectedDaysKey: props.selectedDaysKey, time: props.time}, props.getCellTime);

            if ((filledCell.cellType === cellTypes.CELL_WHITE) && (cellType !== cellTypes.CELL_WHITE)) {
                this.setState( { ...filledCell });
            } else if (cellType !== cellTypes.CELL_EXPIRED) {
                this.setState( { ...filledCell });
            }
        }
    }

    getCellEmpty(workingStaffElement, timeProps, getCellTime) {
        const { selectedDaysKey, time } = timeProps;
        const currentTime = getCellTime({ selectedDaysKey, time });
        let notExpired = workingStaffElement && workingStaffElement.timetables && workingStaffElement.timetables.some(currentTimetable => {
            return (currentTime >= currentTimetable.startTimeMillis && currentTime < currentTimetable.endTimeMillis
                && currentTime>=parseInt(moment().subtract(1, 'week').format('x')))
        });

        if (notExpired) {
            return { cellType: cellTypes.CELL_WHITE, cell: null, staffArray: null };
        } else {
            return { cellType: cellTypes.CELL_EXPIRED, cell: null, staffArray: null };
        }
    }

    getCellFilled(props) {
        const { cellType, workingStaffElement, numbers, numberKey, selectedDaysKey, time, getCellTime } = props

        let uniqConditions = {}

        switch (cellType) {
            case cellTypes.CELL_APPOINTMENT:
                uniqConditions = {
                    staffArrayKey: 'appointments',
                    checkingArrayKey: 'appointments',
                    checkingTimeKey: 'appointmentTimeMillis',
                    exists: (appointment) => appointment && !appointment.coAppointmentId,
                };
                break;
            case cellTypes.CELL_RESERVED_TIME:
                uniqConditions = {
                    staffArrayKey: 'reservedTime',
                    checkingArrayKey: 'reservedTimes',
                    checkingTimeKey: 'startTimeMillis',
                    exists: (reservedTime) => reservedTime,
                };
                break;
            default:
                return null
        }
        const { staffArrayKey, checkingArrayKey, checkingTimeKey, exists } = uniqConditions;
        const staffArray = props[staffArrayKey];

        const checkingArray = staffArray && staffArray.find(appointmentStaff =>
            appointmentStaff[checkingArrayKey] && (appointmentStaff.staff && appointmentStaff.staff.staffId) === (workingStaffElement && workingStaffElement.staffId)
        );
        const cell = checkingArray && checkingArray[checkingArrayKey] && checkingArray[checkingArrayKey].find(checkingItem => {
            const checkingTime = checkingItem[checkingTimeKey]
            return getCellTime({ selectedDaysKey, time }) <= parseInt(checkingTime) && getCellTime({ selectedDaysKey, time: numbers[numberKey + 1] }) > parseInt(checkingTime)
        });

        if (exists(cell)) {
            return {
                cell,
                cellType,
                staffArray: checkingArray
            }
        }

        return null
    }

    render() {
        const {
            numberKey,
            staffKey,
            changeTime,
            changeTimeFromCell,
            numbers,
            moveVisit,
            services,
            selectedDaysKey,
            selectedDays,
            time,
            workingStaffElement,
            handleUpdateClient,
            updateAppointmentForDeleting,
            closedDates,
            getCellTime
        } = this.props;


        const { cellType, cell } = this.state;

        if (cellType === cellTypes.CELL_APPOINTMENT) {
            return (
                <CellAppointment
                    selectedDaysKey={selectedDaysKey}
                    moveVisit={moveVisit}
                    numberKey={numberKey}
                    staffKey={staffKey}
                    appointment={cell}
                    changeTime={changeTime}
                    handleUpdateClient={handleUpdateClient}
                    numbers={numbers}
                    services={services}
                    workingStaffElement={workingStaffElement}
                    updateAppointmentForDeleting={updateAppointmentForDeleting}
                />
            );
        }

        if (cellType === cellTypes.CELL_RESERVED_TIME) {
            return <CellReservedTime cell={cell} workingStaffElement={workingStaffElement}/>
        }

        let notExpired = cellType === cellTypes.CELL_WHITE;
        const day = getCellTime({ selectedDaysKey, time: '00:00' });
        let clDate = closedDates && closedDates.some((st) =>
            parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
            parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")));

        //const isPresentTime = currentTime <= moment().format("x") && currentTime >= moment().subtract(15, "minutes").format("x");

        const wrapperClassName = 'cell col-tab'
            + (notExpired ? '' : ' expired')
            + (clDate ? ' closedDateTick' : '');
        const content = (
            <React.Fragment>
                <span className={(time.split(':')[1] === "00" && notExpired) ? 'visible-fade-time':'fade-time' }>{time}</span>
                {/*{isPresentTime && <span className="present-time-line" />}*/}
            </React.Fragment>
        );

        if (notExpired) {
            return <CellWhite
                time={time}
                staffKey={staffKey}
                selectedDaysKey={selectedDaysKey}
                content={content}
                wrapperClassName={wrapperClassName}
                addVisit={() => (changeTimeFromCell({ staffKey, selectedDaysKey, time }, numbers, false, null))}
                moveVisit={() => {this.props.dispatch(appointmentActions.togglePayload({ staffKey, selectedDaysKey, time }))}}
            />
        }

        return <CellExpired wrapperClassName={wrapperClassName} content={content} />
    }
}

function mapStateToProps(state) {
    const {
        calendar: {
            appointments,
            reservedTime,
        }
    } = state;

    return {
        appointments,
        reservedTime
    }
}

export default connect(mapStateToProps)(BaseCell);
