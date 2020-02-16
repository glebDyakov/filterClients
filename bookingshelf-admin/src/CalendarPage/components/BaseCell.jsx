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
        const currentTime = this.getTime(props.day, props.time);
        let filledCell = null

        const cellAppointment = this.getCellFilled({ ...props, cellType: cellTypes.CELL_APPOINTMENT });
        if (cellAppointment) {
            filledCell = cellAppointment;
        }

        if (!filledCell) {
            const cellReservedTime = this.getCellFilled({ ...props, cellType: cellTypes.CELL_RESERVED_TIME });
            if (cellReservedTime) {
                filledCell = cellReservedTime;
            }
        }

        if (!filledCell) {
            filledCell = this.getCellEmpty(props.workingStaffElement, currentTime);
        }

        this.state = {
            currentTime: currentTime,
            ...filledCell
        };
    }

    shouldComponentUpdate(newProps, newState) {
        let shouldUpdate = this.state.currentTime === newProps.currentTime
        if (!shouldUpdate) {
            shouldUpdate = this.state.cellType !== newState.cellType;
        }
        if (!shouldUpdate) {
            const cellTypesForCheking = [cellTypes.CELL_APPOINTMENT, cellTypes.CELL_RESERVED_TIME];
            if (cellTypesForCheking.some(cellType => (this.state.cellType === cellType && newState.cellType === cellType))) {
                shouldUpdate = JSON.stringify(this.state.cell) !== JSON.stringify(newState.cell)
            }
        }

        // console.log('tried to update')
        // if(shouldUpdate) {
        //     console.log('updated')
        // }

        return shouldUpdate;
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.appointments && JSON.stringify(this.props.appointments) !== JSON.stringify(newProps.appointments)) {
            this.updateCell({ ...newProps, cellType: cellTypes.CELL_APPOINTMENT })
        }

        if (newProps.reservedTime && JSON.stringify(this.props.reservedTime) !== JSON.stringify(newProps.reservedTime)) {
            this.updateCell({ ...newProps, cellType: cellTypes.CELL_RESERVED_TIME })
        }

        if (newProps.workingStaffElement && (this.props.workingStaffElement.staffId !== newProps.workingStaffElement.staffId)) {
            this.onUpdateWorkingStaff(newProps)
        }
    }

    onUpdateWorkingStaff(props) {
        let filledCell = null
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
            this.updateCellEmpty(props.workingStaffElement)
        }
    }

    updateCell(props) {
        const cell = this.getCellFilled(props);
        if (cell) {
            this.setState( { ...cell });
        } else if (this.state.cellType === props.cellType) {
            this.updateCellEmpty(props.workingStaffElement)
        }
    }

    getCellEmpty(workingStaffElement, currentTime = this.state.currentTime) {
        let notExpired = workingStaffElement && workingStaffElement.timetables && workingStaffElement.timetables.some(currentTimetable => {
            return (currentTime>=parseInt(moment().subtract(1, 'week').format("x")) )
                && currentTime>=parseInt(moment(moment(currentTimetable.startTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(currentTimetable.startTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                && currentTime<parseInt(moment(moment(currentTimetable.endTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(currentTimetable.endTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
        })


        if (notExpired) {
            return { cellType: cellTypes.CELL_WHITE, cell: null, staffArray: null };
        } else {
            return { cellType: cellTypes.CELL_EXPIRED, cell: null, staffArray: null };
        }
    }

    updateCellEmpty(workingStaffElement) {
        const filledCell = this.getCellEmpty(workingStaffElement);

        const cellType = this.state.cellType
        if ((filledCell.cellType === cellTypes.CELL_WHITE) && (cellType !== cellTypes.CELL_WHITE)) {
            this.setState( { ...filledCell });
        } else if (cellType !== cellTypes.CELL_EXPIRED) {
            this.setState( { ...filledCell });
        }
    }

    getCellFilled(props) {
        const { cellType, workingStaffElement, numbers, numberKey, day, time } = props
        const currentTime = this.getTime(day, time)

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
            return currentTime <= parseInt(checkingTime) && this.getTime(day, numbers[numberKey + 1]) > parseInt(checkingTime)
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

    getTime(day, time) {
        return parseInt(moment(moment(day).format('DD/MM/YYYY')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'));
    }

    render() {
        const {
            numberKey,
            staffKey,
            changeTime,
            numbers,
            services,
            day,
            time,
            workingStaffElement,
            handleUpdateClient,
            updateAppointmentForDeleting,
            closedDates,
        } = this.props;

        const { cellType, currentTime, cell, staffArray } = this.state;

        if (cellType === cellTypes.CELL_APPOINTMENT) {
            return (
                <CellAppointment
                    numberKey={numberKey}
                    staffKey={staffKey}
                    appointment={cell}
                    currentTime={currentTime}
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
        let clDate = closedDates && closedDates.some((st) =>
            parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
            parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")));

        const isOnAnotherVisit = checkIsOnAnotherVisit(staffArray, currentTime)
        const isPresentTime = currentTime <= moment().format("x") && currentTime >= moment().subtract(15, "minutes").format("x");

        const wrapperId = isPresentTime ? 'present-time ' : ''
        const wrapperClassName = 'cell col-tab'
            + (isOnAnotherVisit ? ' isOnAnotherVisit' : '')
            + (notExpired ? '' : ' expired')
            + (clDate ? ' closedDateTick' : '');
        const content = (
            <React.Fragment>
                <span className={(moment(time, 'x').format("mm") === "00" && notExpired) ? 'visible-fade-time':'fade-time' }>{moment(time, 'x').format("HH:mm")}</span>
                {isPresentTime && <span className="present-time-line" />}
            </React.Fragment>
        );

        if (notExpired) {
            return <CellWhite
                content={content}
                wrapperId={wrapperId}
                wrapperClassName={wrapperClassName}
                addVisit={() => (!isOnAnotherVisit && changeTime(currentTime, workingStaffElement, numbers, false, null))}
                moveVisit={() => this.props.dispatch(appointmentActions.togglePayload({ movingVisitMillis : currentTime, movingVisitStaffId: workingStaffElement.staffId }))}
                movingVisitMillis={currentTime}
                movingVisitStaffId={workingStaffElement.staffId}
            />
        }

        return <CellExpired wrapperId={wrapperId} wrapperClassName={wrapperClassName} content={content} />
    }
}

function mapStateToProps(state) {
    const {
        calendar: {
            appointments,
            reservedTime,
            currentTime
        },
    } = state;

    return {
        appointments,
        reservedTime,
        currentTime
    }
}

export default connect(mapStateToProps)(BaseCell);
