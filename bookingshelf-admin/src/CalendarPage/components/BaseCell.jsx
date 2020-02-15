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
        const currentTime = this.getTime(props.day, props.time);
        let filledCell = {}

        const cellAppointment = this.getCellFilled({ ...props, cellType: cellTypes.CELL_APPOINTMENT });
        if (cellAppointment) {
            filledCell = cellAppointment;
        }

        const cellReservedTime = this.getCellFilled({ ...props, cellType: cellTypes.CELL_RESERVED_TIME });
        if (cellReservedTime) {
            filledCell =  cellReservedTime;
        }

        this.state = {
            cellType: cellTypes.CELL_EMPTY,
            currentTime: currentTime,
            ...filledCell
        };
    }

    shouldComponentUpdate(newProps, newState) {
        const cellTypeChanged = this.state.cellType !== newState.cellType;
        let cellDataChanged;
        if ((this.state.cellType === cellTypes.CELL_APPOINTMENT && newState.cellType === cellTypes.CELL_APPOINTMENT)
            || (this.state.cellType === cellTypes.CELL_RESERVED_TIME && newState.cellType === cellTypes.CELL_RESERVED_TIME)
        ) {
            cellDataChanged = JSON.stringify(this.state.cell) !== JSON.stringify(newState.cell)
        }

        return cellTypeChanged || cellDataChanged
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.appointments && JSON.stringify(this.props.appointments) !== JSON.stringify(newProps.appointments)) {
            this.updateCell({ ...newProps, cellType: cellTypes.CELL_APPOINTMENT })
        }

        if (newProps.reservedTime && JSON.stringify(this.props.reservedTime) !== JSON.stringify(newProps.reservedTime)) {
            this.updateCell({ ...newProps, cellType: cellTypes.CELL_RESERVED_TIME })
        }
    }

    updateCell(props) {
        const cell = this.getCellFilled(props);
        if (cell) {
            this.setState( { ...cell });
        } else if (this.state.cellType === props.cellType) {
            this.setState( { cellType: cellTypes.CELL_EMPTY, cell: null, staffArray: null })
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
