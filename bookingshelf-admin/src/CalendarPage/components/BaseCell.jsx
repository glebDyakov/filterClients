import React from 'react';
import { connect } from 'react-redux';
import moment from "moment";
import CellAppointment from "./CellAppointment";
import {checkIsOnAnotherVisit} from "../../_helpers/available-time";
import {appointmentActions} from "../../_actions";
import CellWhite from "./CellWhite";
import CellExpired from "./CellExpired";
import CellReservedTime from "./CellReservedTime";
import {getCurrentCellTime} from "../../_helpers";

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
                filledCell = this.getCellEmpty(props);
            }
        }
        const currentCellTime = getCurrentCellTime(props.selectedDays, props.selectedDaysKey, props.time);
        this.state = {
            isPresent: this.getIsPresent(currentCellTime),
            ...filledCell
        };
    }

    shouldComponentUpdate(newProps, newState) {
        return (this.state.cellType !== newState.cellType)
            || ([cellTypes.CELL_APPOINTMENT, cellTypes.CELL_RESERVED_TIME]
                    .some(cellType => (this.state.cellType === cellType && newState.cellType === cellType))
                && JSON.stringify(this.state.cell) !== JSON.stringify(newState.cell)
            )
            || (this.state.isPresent !== newState.isPresent);
    }

    componentWillReceiveProps(newProps, nextContext) {
        if ((newProps.selectedDays[0] !== this.props.selectedDays[0]) || (newProps.selectedDays.length !== this.props.selectedDays.length)) {
            const currentCellTime = getCurrentCellTime(newProps.selectedDays, newProps.selectedDaysKey, newProps.time);
            if (this.getIsPresent(currentCellTime)) {
                this.setState({ isPresent: true });
            } else if (this.state.isPresent) {
                this.setState({ isPresent: false })
            }
        }
        this.onUpdateWorkingStaff(newProps)
    }

    getIsPresent(currentCellTime) {
        return currentCellTime <= moment().format("x") && currentCellTime >= moment().subtract(15, "minutes").format("x")
    }

    onUpdateWorkingStaff(props) {
        const { cellType } = this.state
        let filledCell;

        console.log('tried to found appointment')
        const cellAppointment = this.getCellFilled({ ...props, cellType: cellTypes.CELL_APPOINTMENT });
        if (cellAppointment) {
            console.log('success found appointment')
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
            filledCell = this.getCellEmpty(props);

            if ((filledCell.cellType === cellTypes.CELL_WHITE) && (cellType !== cellTypes.CELL_WHITE)) {
                this.setState( { ...filledCell });
            } else if (cellType !== cellTypes.CELL_EXPIRED) {
                this.setState( { ...filledCell });
            }
        }
    }

    getCellEmpty(props) {
        const { workingStaffElement, selectedDaysKey, time , selectedDays, appointments, staffKey, checkForCostaffs } = props
        const currentTime = getCurrentCellTime(selectedDays, selectedDaysKey, time);

        let notExpired = workingStaffElement && workingStaffElement.timetables && workingStaffElement.timetables.some(currentTimetable => {
            return (currentTime >= currentTimetable.startTimeMillis && currentTime < currentTimetable.endTimeMillis
                && currentTime>=parseInt(moment().subtract(1, 'week').format('x')))
            && checkForCostaffs({ appointments, staffKey, currentTime })
        });

        if (notExpired) {
            return { cellType: cellTypes.CELL_WHITE, cell: null, staffArray: null };
        } else {
            return { cellType: cellTypes.CELL_EXPIRED, cell: null, staffArray: null };
        }
    }

    getCellFilled(props) {
        const { cellType, workingStaffElement, numbers, numberKey, selectedDaysKey, time, selectedDays } = props

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
            const checkingTime = parseInt(checkingItem[checkingTimeKey])
            const currentCellTime = getCurrentCellTime(selectedDays, selectedDaysKey, time)
            const nextCellTime = getCurrentCellTime(selectedDays, selectedDaysKey, numbers[numberKey + 1])

            return (currentCellTime <= checkingTime) && (nextCellTime > checkingTime)
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
            time,
            workingStaffElement,
            handleUpdateClient,
            updateAppointmentForDeleting,
            closedDates,
            selectedDays
        } = this.props;


        const { cellType, cell, isPresent } = this.state;

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
        const day = getCurrentCellTime(selectedDays, selectedDaysKey, '00:00');
        let clDate = closedDates && closedDates.some((st) =>
            parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
            parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")));
        const wrapperClassName = 'cell col-tab'
            + (notExpired ? '' : ' expired')
            + (clDate ? ' closedDateTick' : '');
        const content = (
            <React.Fragment>
                <span className={(time.split(':')[1] === "00" && notExpired) ? 'visible-fade-time':'fade-time' }>{time}</span>
                {isPresent && <span className="present-time-line" />}
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
        },
        cell: { selectedDays }
    } = state;

    return {
        appointments,
        reservedTime,
        selectedDays
    }
}

export default connect(mapStateToProps)(BaseCell);
