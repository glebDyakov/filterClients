import React from 'react';
import { connect } from 'react-redux';
import moment from "moment";
import Appointment from "./Appointment";
import {checkIsOnAnotherVisit} from "../../_helpers/available-time";
import Dustbin from "../../_components/dragAndDrop/Dustbin";

const cellTypes = {
    CELL_APPOINTMENT: 'CELL_APPOINTMENT',
    CELL_RESERVED_TIME: 'CELL_RESERVED_TIME',
    CELL_EMPTY: 'CELL_EMPTY',
}

class BaseCell extends React.Component {
    constructor(props) {
        super(props);
        const commonCheckers = this.getCommonCheckers(props);
        let filledCell = {}

        const cellAppointment = this.isCellFilled({ ...commonCheckers, staffArray: props.appointments, cellType: cellTypes.CELL_APPOINTMENT });
        if (cellAppointment) {
            filledCell = cellAppointment;
        }

        const cellReservedTime = this.isCellFilled({ ...commonCheckers, staffArray: props.reservedTime, cellType: cellTypes.CELL_RESERVED_TIME });
        if (cellReservedTime) {
            filledCell =  cellReservedTime;
        }

        this.state = {
            cellType: cellTypes.CELL_EMPTY,
            currentTime: commonCheckers.currentTime,
            ...filledCell
        };
    }

    shouldComponentUpdate(newProps, newState) {
        return this.state.cellType !== newState.cellType
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.appointments && JSON.stringify(this.props.appointments) !== JSON.stringify(newProps.appointments)) {
            const commonCheckers = this.getCommonCheckers(newProps);
            const cellAppointment = this.isCellFilled({ ...commonCheckers, staffArray: newProps.appointments, cellType: cellTypes.CELL_APPOINTMENT });
            if (cellAppointment) {
                this.setState( { ...cellAppointment });
            } else if (this.state.cellType === cellTypes.CELL_APPOINTMENT) {
                this.setState( { cellType: cellTypes.CELL_EMPTY, cell: null, staffArray: null })
            }
        }

        if (newProps.reservedTime && JSON.stringify(this.props.reservedTime) !== JSON.stringify(newProps.reservedTime)) {
            const commonCheckers = this.getCommonCheckers(newProps);
            const cellReservedTime = this.isCellFilled({ ...commonCheckers, staffArray: newProps.reservedTime, cellType: cellTypes.CELL_RESERVED_TIME });
            if (cellReservedTime) {
                this.setState( { ...cellReservedTime });
            } else if (this.state.cellType === cellTypes.CELL_RESERVED_TIME) {
                this.setState( { cellType: cellTypes.CELL_EMPTY, cell: null, staffArray: null })
            }
        }
    }

    getCommonCheckers({ numbers, numberKey, workingStaffElement, day, time }) {
        let currentTime = this.getTime(day, time)

        return {
            currentTime,
            workingStaffElement: workingStaffElement,
            numbers: numbers,
            numberKey: numberKey,
            day: day,
        }
    }

    isCellFilled({ staffArray, cellType, currentTime, workingStaffElement, numbers, numberKey, day }) {
        let uniqConditions = {}

        switch (cellType) {
            case cellTypes.CELL_APPOINTMENT:
                uniqConditions = {
                    checkingArrayKey: 'appointments',
                    checkingTimeKey: 'appointmentTimeMillis',
                    exists: (appointment) => appointment && !appointment.coAppointmentId,
                };
                break;
            case cellTypes.CELL_RESERVED_TIME:
                uniqConditions = {
                    checkingArrayKey: 'reservedTimes',
                    checkingTimeKey: 'startTimeMillis',
                    exists: (reservedTime) => reservedTime,
                };
                break;
            default:
                return null
        }
        const { checkingArrayKey, checkingTimeKey, exists } = uniqConditions;

        const checkingArray = staffArray && staffArray.find(appointmentStaff =>
            appointmentStaff[checkingArrayKey] && (appointmentStaff.staff && appointmentStaff.staff.staffId) === (workingStaffElement && workingStaffElement.staffId)
        );
        const cell = checkingArray && checkingArray[checkingArrayKey] && checkingArray[checkingArrayKey].find(checkingItem => {
            const checkingTime = checkingItem[checkingTimeKey]
            return currentTime <= parseInt(checkingTime) && this.getTime(day, numbers[numberKey + 1])> parseInt(checkingTime)
        });

        if (exists(cell)) {
            return {
                cell,
                cellType,
                staffArray
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
            appointments,
            changeTime,
            numbers,
            services,
            day,
            time,
            workingStaffElement,
            handleUpdateClient,
            updateAppointmentForDeleting,
            updateReservedId,
            startMovingVisit,
            closedDates,
        } = this.props;

        const { cellType, currentTime, cell, staffArray } = this.state;

        if(cellType === cellTypes.CELL_APPOINTMENT) {
            return (
                <Appointment
                    numberKey={numberKey}
                    staffKey={staffKey}
                    appointment={cell}
                    appointments={appointments}
                    currentTime={currentTime}
                    changeTime={changeTime}
                    handleUpdateClient={handleUpdateClient}
                    numbers={numbers}
                    services={services}
                    startMovingVisit={startMovingVisit}
                    workingStaffElement={workingStaffElement}
                    updateAppointmentForDeleting={updateAppointmentForDeleting}
                />
            );
        }

        if (cellType === cellTypes.CELL_RESERVED_TIME) {
            const reservedTime = cell;
            const textAreaHeight = (parseInt(((moment.utc(reservedTime.endTimeMillis - reservedTime.startTimeMillis, 'x').format('x') / 60000 / 15) - 1) * 20))

            return (
                <div className='cell reserve'>
                    <div className="cell notes color-grey"
                         style={{backgroundColor: "darkgrey"}}>

                        <p className="notes-title" style={{cursor: 'default'}}>
                            <span className="delete"
                                  style={{right: '5px'}}
                                  data-toggle="modal"
                                  data-target=".delete-reserve-modal"
                                  title="Удалить"
                                  onClick={() => updateReservedId(
                                      reservedTime.reservedTimeId,
                                      workingStaffElement.staffId
                                  )}
                            />
                                <span className="" title="Онлайн-запись"/>
                                <span
                                    className="service_time"
                                >
                                    {moment(reservedTime.startTimeMillis, 'x').format('HH:mm')} - {moment(reservedTime.endTimeMillis, 'x').format('HH:mm')}
                                </span>

                        </p>
                        <p className="notes-container" style={{height: textAreaHeight+ "px"}}>
                            <span style={{color: '#5d5d5d', fontSize: '10px'}}>{reservedTime.description}</span>
                        </p>
                    </div>
                </div>
            )
        }

        let clDate = closedDates && closedDates.some((st) =>
            parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
            parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")))

        let notExpired = workingStaffElement && workingStaffElement.timetables && workingStaffElement.timetables.some(currentTimetable => {
            return (currentTime>=parseInt(moment().subtract(1, 'week').format("x")) )
                && currentTime>=parseInt(moment(moment(currentTimetable.startTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(currentTimetable.startTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                && currentTime<parseInt(moment(moment(currentTimetable.endTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(currentTimetable.endTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
        })

        const isOnAnotherVisit = checkIsOnAnotherVisit(staffArray, currentTime)

        const wrapperId = currentTime <= moment().format("x") && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''
        const wrapperClassName = `cell col-tab 
                                                                            ${currentTime < parseInt(moment().format("x")) ? '' : ""}
                                                                            ${isOnAnotherVisit ? 'isOnAnotherVisit' : ''}
                                                                            ${notExpired ? '' : "expired "}
                                                                            ${clDate ? 'closedDateTick' : ""}`
        const content = (
            <React.Fragment>
                <span className={(moment(time, 'x').format("mm") === "00" && notExpired) ? 'visible-fade-time':'fade-time' }>{moment(time, 'x').format("HH:mm")}</span>
                {currentTime <= moment().format("x")
                && currentTime >= moment().subtract(15, "minutes").format("x") && <span className="present-time-line" />}
            </React.Fragment>
        )

        if (notExpired) {
            return <Dustbin
                content={content}
                wrapperId={wrapperId}
                wrapperClassName={wrapperClassName}
                addVisit={() => (!isOnAnotherVisit && changeTime(currentTime, workingStaffElement, numbers, false, null))}
                moveVisit={() => {
                    moveVisit(workingStaffElement.staffId, currentTime)
                }}
                movingVisitMillis={currentTime}
                movingVisitStaffId={workingStaffElement.staffId}
            />
        } else {
            return <div id={wrapperId} className={wrapperClassName}>{content}</div>
        }
    }
}

function mapStateToProps(state) {
    const {
        calendar: {
            appointments,
            reservedTime
        },
    } = state;

    return {
        appointments,
        reservedTime
    }
}

export default connect(mapStateToProps)(BaseCell);
