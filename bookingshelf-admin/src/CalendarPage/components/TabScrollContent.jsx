import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import TabScrollLeftMenu from './TabScrollLeftMenu';

import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Dustbin from "../../_components/dragAndDrop/Dustbin";
import Appointment from "./Appointment";
import { appointmentActions } from "../../_actions";
import DragVertController from "./DragVertController";


class TabScroll extends Component{
    constructor(props) {
        super(props);
        this.state = {
            numbers: []
        }
        this.startMovingVisit = this.startMovingVisit.bind(this);
        this.moveVisit = this.moveVisit.bind(this);
        this.getHours24 = this.getHours24.bind(this);
    }
    componentDidMount() {
        if (this.props.timetable && this.props.timetable.length) {
            this.getHours24(this.props.timetable);
        }
    }

    componentWillReceiveProps(newProps){
        $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'});
        if (newProps.timetable && (JSON.stringify(newProps.timetable) !== JSON.stringify(this.props.timetable))) {
            this.getHours24(newProps.timetable);
        }
    }

    getHours24 (timetable){
        const numbers =[];

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

            let startNumber = startTime % 60
                ? (startTime - parseInt(moment(minTime).format('mm')))
                : (startTime - 60);

            let endNumber = endTime % 60
                ? (endTime - parseInt(moment(maxTime).format('mm')) + 60)
                : (endTime + 60);

            for (let i = startNumber; i < endNumber; i = i + 15) {
                numbers.push(moment().startOf('day').add(i, 'minutes').format('x'));
            }
        }

        this.setState({ numbers });
    }

    startMovingVisit(movingVisit, totalDuration, draggingAppointmentId) {
        const activeItemWithStaffId = this.props.appointments.find(item =>
            item.appointments.some(appointment => appointment.appointmentId === movingVisit.appointmentId)
        );
        const prevVisitStaffId = activeItemWithStaffId.staff.staffId
        this.props.dispatch(appointmentActions.togglePayload({ movingVisit, movingVisitDuration: totalDuration, prevVisitStaffId, draggingAppointmentId }));
        this.props.dispatch(appointmentActions.toggleStartMovingVisit(true))
    }

    moveVisit(movingVisitStaffId, time) {
        this.props.dispatch(appointmentActions.togglePayload({ movingVisitMillis : time, movingVisitStaffId }));
    }

    render(){
        const { availableTimetable, services, selectedDays, closedDates, appointments,reservedTime: reservedTimeFromProps ,handleUpdateClient, updateAppointmentForDeleting,updateReservedId,changeTime,isLoading } = this.props;
        const { numbers } = this.state;

        return(
            <div className="tabs-scroll"
                // style={{'minWidth': (120*parseInt(workingStaff.timetable && workingStaff.timetable.length))+'px'}}
            >
                <DndProvider backend={Backend}>
                    {numbers && numbers.map((time, key) =>
                        <div className={'tab-content-list ' + (isLoading && 'loading')} key={key}>
                            <TabScrollLeftMenu time={time}/>
                            {!isLoading && availableTimetable && selectedDays.map((day) => availableTimetable.map((workingStaffElement, staffKey) => {
                                let currentTime= parseInt(moment(moment(day).format('DD/MM/YYYY')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'));
                                const staffAppointments = appointments && appointments.find(appointmentStaff => appointmentStaff.appointments &&
                                    (appointmentStaff.staff && appointmentStaff.staff.staffId) === (workingStaffElement && workingStaffElement.staffId)
                                );
                                let appointment = staffAppointments && staffAppointments.appointments.find((appointment)=>
                                    currentTime <= parseInt(appointment.appointmentTimeMillis)
                                    && parseInt(moment(moment(day).format('DD/MM/YYYY')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x')) > parseInt(appointment.appointmentTimeMillis)
                                );

                                if(appointment && !appointment.coAppointmentId) {
                                    return (
                                        <Appointment
                                            appointment={appointment}
                                            appointments={appointments}
                                            currentTime={currentTime}
                                            changeTime={changeTime}
                                            handleUpdateClient={handleUpdateClient}
                                            numbers={numbers}
                                            services={services}
                                            startMovingVisit={this.startMovingVisit}
                                            workingStaffElement={workingStaffElement}
                                            updateAppointmentForDeleting={updateAppointmentForDeleting}
                                        />
                                    );
                                }

                                const staffReservedTimes = reservedTimeFromProps && reservedTimeFromProps.find((reserve) => reserve.reservedTimes && reserve.staff.staffId === workingStaffElement.staffId);

                                let reservedTime = staffReservedTimes && staffReservedTimes.reservedTimes && staffReservedTimes.reservedTimes.find((localReservedTime)=>
                                    currentTime <= parseInt(localReservedTime.startTimeMillis)
                                    && parseInt(moment(moment(day).format('DD/MM/YYYY')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x')) > parseInt(localReservedTime.startTimeMillis)
                                )

                                if (reservedTime) {
                                    const textAreaHeight = (parseInt(((moment.utc(reservedTime.endTimeMillis - reservedTime.startTimeMillis, 'x').format('x') / 60000 / 15) - 1) * 20))

                                    return (
                                        <div className='cell reserve'>
                                            <div className="cell notes color-grey"
                                                 style={{backgroundColor: "darkgrey"}}>

                                                <p className="notes-title"
                                                   style={{cursor: 'default'}}>
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
                                                        {moment(reservedTime.startTimeMillis, 'x').format('HH:mm')}
                                                        -
                                                        {moment(reservedTime.endTimeMillis, 'x').format('HH:mm')}
                                                    </span>

                                                </p>
                                                <p className="notes-container"
                                                   style={{height: textAreaHeight+ "px"}}>
                                                                                <span
                                                                                    style={{color: '#5d5d5d', fontSize: '10px'}}>{reservedTime.description}</span>
                                                </p>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    let clDate = closedDates && closedDates.some((st) =>
                                        parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
                                        parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")))


                                    // let workingTimeEnd=null;
                                    // let notExpired = workingStaffElement && workingStaffElement.availableDays && workingStaffElement.availableDays.length!==0 &&
                                    //     workingStaffElement.availableDays.some((availableDay)=>
                                    //         parseInt(moment(moment(availableDay.dayMillis, 'x').format('DD/MM/YYYY')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))===currentTime &&
                                    //         availableDay.availableTimes && availableDay.availableTimes.some((workingTime)=>{
                                    //             workingTimeEnd=workingTime.endTimeMillis;
                                    //             if (isStartMovingVisit && movingVisit && (workingStaffElement.staffId === prevVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(item => item.staffId === workingStaffElement.staffId)))) {
                                    //                 const movingVisitStart = parseInt(moment(moment(movingVisit.appointmentTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(movingVisit.appointmentTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                    //                 const movingVisitEnd = parseInt(moment(moment(movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000), 'x').format('DD/MM/YYYY')+' '+moment(movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000), 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                    //
                                    //                 if (currentTime>=movingVisitStart && currentTime<movingVisitEnd) {
                                    //                     return true
                                    //                 }
                                    //             }
                                    //             return (currentTime>=parseInt(moment().subtract(1, 'week').format("x")) )
                                    //                 && currentTime>=parseInt(moment(moment(workingTime.startTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(workingTime.startTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                    //                 && currentTime<parseInt(moment(moment(workingTime.endTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(workingTime.endTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                    //         }
                                    //
                                    //         ));
                                    // const activeStaffTimetable = timetable.find(item => item.staffId === workingStaffElement.staffId);
                                    let notExpired2 = workingStaffElement && workingStaffElement.timetables && workingStaffElement.timetables.some(currentTimetable => {
                                        return (currentTime>=parseInt(moment().subtract(1, 'week').format("x")) )
                                            && currentTime>=parseInt(moment(moment(currentTimetable.startTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(currentTimetable.startTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                            && currentTime<parseInt(moment(moment(currentTimetable.endTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(currentTimetable.endTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                    })
                                    let notExpired = notExpired2

                                    const isOnAnotherVisit = staffAppointments && staffAppointments.appointments
                                        .some(appointment => appointment.appointmentTimeMillis <= currentTime && (appointment.appointmentTimeMillis + (appointment.duration * 1000)) > currentTime)

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
                                            moveVisit={() => this.moveVisit(workingStaffElement.staffId, currentTime)}
                                            movingVisitMillis={currentTime}
                                            movingVisitStaffId={workingStaffElement.staffId}
                                        />
                                    } else {
                                        return <div id={wrapperId} className={wrapperClassName}>{content}</div>
                                    }
                                }

                            }))
                            }

                        </div>
                    )}
                </DndProvider>
                <DragVertController appointments={appointments} />
            </div>
        );
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

export default connect(mapStateToProps)(TabScroll);
