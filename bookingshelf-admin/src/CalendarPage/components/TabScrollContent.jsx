import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import {access} from "../../_helpers/access";
import TabScrollLeftMenu from './TabScrollLeftMenu';
import {calendarActions} from "../../_actions/calendar.actions";

import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Dustbin from "../../_components/dragAndDrop/Dustbin";
import Box from "../../_components/dragAndDrop/Box";
import Appointment from "./Appointment";


class TabScroll extends Component{
    constructor(props) {
        super(props);
        this.state = {
            blickClientId: null,
            movingVisit: null,
            movingVisitDuration: 0,
            movingVisitMillis: 0,
            movingVisitStaffId: null,
            prevVisitStaffId: null,
            selectedNote: null,
            numbers: []
        }
        this.startMovingVisit = this.startMovingVisit.bind(this);
        this.moveVisit = this.moveVisit.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.makeMovingVisitQuery = this.makeMovingVisitQuery.bind(this);
        this.getHours24 = this.getHours24.bind(this);
        this.clearDraggingElem = this.clearDraggingElem.bind(this);
    }
    componentDidMount() {
        if (this.props.timetable && this.props.timetable.length) {
            this.getHours24(this.props.timetable);
        }
    }

    componentWillReceiveProps(newProps){
        $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'});
        if (newProps.isStartMovingVisit && newProps.isMoveVisit) {
            this.makeMovingVisitQuery()
        }
        if (newProps.timetable && (JSON.stringify(newProps.timetable) !== JSON.stringify(this.props.timetable))) {
            this.getHours24(newProps.timetable);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.changingVisit) {
            document.addEventListener('mousemove', this.handleMouseMove, false);
            document.addEventListener('mouseup', this.handleMouseUp, false);
        } else {
            document.removeEventListener('mousemove', this.handleMouseMove, false);
            document.removeEventListener('mouseup', this.handleMouseUp, false);
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

    handleMouseMove(e) {
        const { changingVisit, currentTarget, changingPos, offsetHeight } = this.state
        const textAreaWrapper = `${changingVisit.appointmentId}-textarea-wrapper`
        const node = document.getElementById(textAreaWrapper)

        // 'res' = начальная высота div'a + кол-во пикселов смещения
        const res = offsetHeight + e.pageY - changingPos;
        node.style.height = res+"px";
        currentTarget.style.bottom = -res+"px";
    }
    handleMouseUp() {
        const { appointments } = this.props;
        const { changingVisit, changingPos, offsetHeight } = this.state
        const textAreaWrapper = `${changingVisit.appointmentId}-textarea-wrapper`
        const newOffsetHeight = document.getElementById(textAreaWrapper).offsetHeight
        const offsetDifference = Math.round((newOffsetHeight - offsetHeight) / 20)

        let newDuration = (15 * 60 * offsetDifference)
        if (changingVisit.hasCoAppointments) {


            const coAppointments = []
            appointments.map((staffAppointment) => {

                staffAppointment.appointments.sort((b, a) => a.appointmentId - b.appointmentId).forEach(appointment => {
                    if (appointment.coAppointmentId === changingVisit.appointmentId) {
                        coAppointments.push(appointment)
                    }
                })
            })
            coAppointments.push(changingVisit)

            let shouldUpdateDuration = true
            if (newDuration > 0) {
                this.props.dispatch(calendarActions.updateAppointment(
                    changingVisit.appointmentId,
                    JSON.stringify({ duration: changingVisit.duration + newDuration }),
                    false,
                    true
                ))
            } else {
                let timeout = 0;
                coAppointments.forEach(coAppointment => {
                    if (shouldUpdateDuration) {
                        newDuration = coAppointment.duration + newDuration
                        if (newDuration > 900) {
                            shouldUpdateDuration = false
                            setTimeout(() => {
                                this.props.dispatch(calendarActions.updateAppointment(
                                    coAppointment.appointmentId,
                                    JSON.stringify({duration: newDuration}),
                                    false,
                                    true
                                ))
                            }, 1000 * timeout)
                        } else {
                            newDuration-=900

                            setTimeout(() => {
                                this.props.dispatch(calendarActions.updateAppointment(
                                    coAppointment.appointmentId,
                                    JSON.stringify({duration: 900}),
                                    false,
                                    true
                                ))
                            }, 1000 * timeout)
                            timeout++;
                        }
                    }
                })
            }
        } else {
            this.props.dispatch(calendarActions.updateAppointment(
                changingVisit.appointmentId,
                JSON.stringify({ duration: changingVisit.duration + newDuration }),
                false,
                true
            ))
        }

        this.setState({ changingVisit: null, currentTarget: null, changingPos:null, offsetHeight: null })
    }

    startMovingVisit(movingVisit, totalDuration, draggingAppointmentId) {
        const activeItemWithStaffId = this.props.appointments.find(item =>
            item.appointments.some(appointment => appointment.appointmentId === movingVisit.appointmentId)
        );
        const prevVisitStaffId = activeItemWithStaffId.staff.staffId
        this.setState({ movingVisit, movingVisitDuration: totalDuration, prevVisitStaffId, draggingAppointmentId })
        this.props.dispatch(calendarActions.toggleStartMovingVisit(true))
    }

    clearDraggingElem() {
        this.props.dispatch(calendarActions.toggleMoveVisit(true))
        this.setState({ draggingAppointmentId: false })
    }

    moveVisit(movingVisitStaffId, time) {
        this.setState({ movingVisitMillis : time, movingVisitStaffId })
    }

    makeMovingVisitQuery() {
        const { appointments } = this.props;
        const { movingVisit, movingVisitDuration, movingVisitStaffId, movingVisitMillis, prevVisitStaffId } = this.state;

        let shouldMove = false

        const startDay = moment(movingVisitMillis, 'x').format('D')
        const endDay = moment((movingVisitMillis + (movingVisitDuration * 1000)), 'x').format('D')
        if (startDay !== endDay) {
            shouldMove = false
        }

        if (!shouldMove) {
            const movingVisitEndTime = movingVisitMillis + (movingVisitDuration * 1000);

            const timetableItems = this.props.timetable
                .filter(item => item.staffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === item.staffId)))


            const intervals = []

            for (let i = movingVisitMillis; i < movingVisitEndTime; i += 15 * 60000) {
                intervals.push(i)
            }

            timetableItems.forEach(timetableItem => {
                const newStaff = appointments && appointments.find(item => (item.staff && item.staff.staffId) === timetableItem.staffId)

                timetableItem.timetables.forEach(time => {

                    const isFreeInterval = intervals.every(i => {
                        const isIncludedInTimetable = time.startTimeMillis <= i && time.endTimeMillis > i;
                        const isOnAnotherVisit = newStaff && newStaff.appointments
                            .some(appointment => appointment.appointmentTimeMillis <= i && (appointment.appointmentTimeMillis + (appointment.duration * 1000)) > i)

                        const isOnMovingVisit = (
                            (prevVisitStaffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === newStaff.staff.staffId))) &&
                            movingVisit.appointmentTimeMillis <= i && (movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000)) > i
                        );
                        return ((isIncludedInTimetable && !isOnAnotherVisit) || isOnMovingVisit)
                    });
                    if (isFreeInterval) {
                        shouldMove = true
                    }
                })
            })
        }

        if (shouldMove) {
            this.props.dispatch(calendarActions.makeVisualMove({ ...movingVisit, staffId: prevVisitStaffId }, movingVisitStaffId, movingVisitMillis))
            let coStaffs;
            if (movingVisit.coStaffs && prevVisitStaffId !== movingVisitStaffId) {
                const updatedCoStaff = appointments.find(item => (item.staff && item.staff.staffId) === prevVisitStaffId)
                const oldStaffIndex = movingVisit.coStaffs.findIndex(item => item.staffId === movingVisitStaffId)

                let coStaffsWithRemoved = JSON.parse(JSON.stringify(movingVisit.coStaffs))
                coStaffs = [
                    ...coStaffsWithRemoved,
                ]
                if (oldStaffIndex !== -1) {
                    coStaffsWithRemoved.splice(oldStaffIndex, 1)
                    coStaffs.push(updatedCoStaff.staff)
                }

            }
            this.props.dispatch(calendarActions.updateAppointment(
                movingVisit.appointmentId,
                JSON.stringify({
                    appointmentTimeMillis: movingVisitMillis,
                    staffId: movingVisitStaffId,
                    coStaffs,
                    adminApproved: true,
                    approved: true,
                    moved: true,
                    adminMoved: true,
                    movedOnline: false
                }),
                false,
                false,
                false
                )
            );
        }
        this.props.dispatch(calendarActions.toggleMoveVisit(false))
        this.props.dispatch(calendarActions.toggleStartMovingVisit(false))
        this.setState({
            movingVisit: null,
            movingVisitDuration: 0,
            movingVisitMillis: 0,
            movingVisitStaffId: null,
            prevVisitStaffId: null
        })
    }

    render(){
        const { availableTimetable, services, selectedDays, closedDates, isClientNotComeLoading, appointments,reservedTime: reservedTimeFromProps ,handleUpdateClient, updateAppointmentForDeleting,updateReservedId,changeTime,isLoading, isStartMovingVisit } = this.props;
        const { selectedNote, movingVisit, numbers, draggingAppointmentId, blickClientId } = this.state;

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

                                if(appointment && !appointment.coAppointmentId && !((!draggingAppointmentId && isStartMovingVisit && movingVisit && movingVisit.appointmentId) === appointment.appointmentId)) {

                                    let totalDuration = appointment.duration;
                                    let appointmentServices = [];
                                    let totalCount = 0;
                                    let totalPrice = appointment.price
                                    let totalAmount = appointment.totalAmount
                                    const currentAppointments = [appointment]

                                    const activeService = services && services.servicesList && services.servicesList.find(service => service.serviceId === appointment.serviceId)
                                    appointmentServices.push({ ...activeService, discountPercent: appointment.discountPercent, totalAmount: appointment.totalAmount, price: appointment.price, serviceName: appointment.serviceName, serviceId: appointment.serviceId});

                                    if (appointment.hasCoAppointments) {
                                        appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
                                            if (currentAppointment.coAppointmentId === appointment.appointmentId) {
                                                totalDuration += currentAppointment.duration;
                                                const activeCoService = services && services.servicesList && services.servicesList.find(service => service.serviceId === currentAppointment.serviceId)
                                                appointmentServices.push({...activeCoService, discountPercent: currentAppointment.discountPercent, totalAmount: currentAppointment.totalAmount, serviceName: currentAppointment.serviceName, price: currentAppointment.price, serviceId: currentAppointment.serviceId})
                                                totalCount++;
                                                totalPrice += currentAppointment.price;
                                                totalAmount += currentAppointment.totalAmount;

                                                currentAppointments.push(currentAppointment)
                                            }
                                        }))
                                    }
                                    const resultTextAreaHeight = ((totalDuration / 60 / 15) - 1) * 20;

                                    const content = (
                                        <Appointment
                                            key={key}
                                            appointment={appointment}
                                            isStartMovingVisit={isStartMovingVisit}
                                            currentTime={currentTime}
                                            changeTime={changeTime}
                                            handleUpdateClient={handleUpdateClient}
                                            totalDuration={totalDuration}
                                            totalCount={totalCount}
                                            totalPrice={totalPrice}
                                            totalAmount={totalAmount}
                                            resultTextAreaHeight={resultTextAreaHeight}
                                            currentAppointments={currentAppointments}
                                            appointmentServices={appointmentServices}
                                            numbers={numbers}
                                            services={services}
                                            startMovingVisit={this.startMovingVisit}
                                            workingStaffElement={workingStaffElement}
                                            updateAppointmentForDeleting={updateAppointmentForDeleting}
                                        />
                                    )

                                    const wrapperClassName = 'cell default-width ' +(currentTime <= moment().format("x") && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : '') + (appointment.appointmentId === selectedNote ? 'selectedNote' : '')

                                    const dragVert = currentTime >= parseInt(moment().subtract(1, 'week').format("x")) && (
                                            <p onMouseDown={(e) => {
                                                e.preventDefault()
                                                this.setState({
                                                    currentTarget: e.currentTarget,
                                                    changingVisit: appointment,
                                                    changingPos: e.pageY,
                                                    offsetHeight: document.getElementById(`${appointment.appointmentId}-textarea-wrapper`).offsetHeight
                                                })
                                            }} style={{
                                                cursor: 'ns-resize',
                                                height: '8px',
                                                position: 'absolute',
                                                bottom: -(resultTextAreaHeight + 3) + 'px',
                                                width: '100%',
                                                zIndex: 9990
                                            }}>
                                                {!!resultTextAreaHeight && <span className="drag-vert" />}
                                            </p>
                                    );


                                    if (isMobile) {
                                        return <div style={{ display: 'block', width: '100%', overflow: 'visible', position: 'relative' }}>
                                            <div className={wrapperClassName}>{content}</div>
                                            {dragVert}
                                        </div>
                                    }

                                    return <div style={{ display: 'block', width: '100%', overflow: 'visible', position: 'relative' }}>
                                        <Box
                                            clearDraggingElem={this.clearDraggingElem}
                                            dragVert={dragVert}
                                            startMoving={() => {
                                                this.startMovingVisit(appointment, totalDuration, appointment.appointmentId)
                                            }}
                                            makeMovingVisitQuery={this.makeMovingVisitQuery}
                                            moveVisit={(movingVisitStaffId, movingVisitMillis) => {
                                                this.moveVisit(movingVisitStaffId, movingVisitMillis);
                                            }}
                                            content={content}
                                            wrapperClassName={wrapperClassName}
                                        />
                                        {appointment.appointmentId !== draggingAppointmentId && dragVert}
                                    </div>
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
                                                                                ${notExpired && this.props.isStartMovingVisit ? 'start-moving ' : ''}
                                                                                ${clDate ? 'closedDateTick' : ""}`
                                    const content = (
                                        <React.Fragment>
                                            <span className={(moment(time, 'x').format("mm") === "00" && notExpired) ? 'visible-fade-time':'fade-time' }>{moment(time, 'x').format("HH:mm")}</span>
                                            {currentTime <= moment().format("x")
                                            && currentTime >= moment().subtract(15, "minutes").format("x") && <span className="present-time-line" />}
                                        </React.Fragment>
                                    )

                                    if (notExpired) {
                                        const wrapperClick = () => (this.props.isStartMovingVisit ? this.moveVisit(workingStaffElement.staffId, currentTime) : (!isOnAnotherVisit && changeTime(currentTime, workingStaffElement, numbers, false, null)));

                                        return <Dustbin
                                            isStartMovingVisit={this.props.isStartMovingVisit}
                                            content={content}
                                            wrapperId={wrapperId}
                                            wrapperClassName={wrapperClassName}
                                            wrapperClick={wrapperClick}
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
            </div>
        );
    }

}

function mapStateToProps(state) {
    const { calendar: { isStartMovingVisit, isMoveVisit, appointments, reservedTime } } = state;

    return {
        isStartMovingVisit,
        isMoveVisit,
        appointments,
        reservedTime
    }
}

export default connect(mapStateToProps)(TabScroll);
