import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import TabScrollLeftMenu from './TabScrollLeftMenu';
import {calendarActions} from "../../_actions/calendar.actions";

class TabScroll extends Component{
    constructor(props) {
        super(props);
        this.state = {
            movingVisit: null,
            movingVisitDuration: 0,
            movingVisitMillis: 0,
            movingVisitStaffId: null,
            prevVisitStaffId: null
        }
        this.startMovingVisit = this.startMovingVisit.bind(this);
        this.moveVisit = this.moveVisit.bind(this);
        this.makeMovingVisitQuery = this.makeMovingVisitQuery.bind(this);
    }
    componentWillReceiveProps(newProps){
        $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'});
        if (newProps.isStartMovingVisit && newProps.isMoveVisit) {
            this.makeMovingVisitQuery()
        }
    }

    startMovingVisit(movingVisit, totalDuration) {
        const activeItemWithStaffId = this.props.appointments.find(item =>
            item.appointments.some(appointment => appointment.appointmentId === movingVisit.appointmentId)
        );
        const prevVisitStaffId = activeItemWithStaffId.staff.staffId
        this.setState({ movingVisit, movingVisitDuration: totalDuration, prevVisitStaffId })
    }

    moveVisit(movingVisitStaffId, time) {
        this.setState({ movingVisitMillis : time, movingVisitStaffId })
    }

    makeMovingVisitQuery() {
        const { movingVisit, movingVisitDuration, movingVisitStaffId, movingVisitMillis, prevVisitStaffId } = this.state;

        let shouldMove = false
        const movingVisitTime = movingVisitMillis + (movingVisitDuration * 1000);

        const availableTimetableItem = this.props.availableTimetable.find(item => item.staffId === movingVisitStaffId);
        availableTimetableItem.availableDays.forEach(item => {
            item.availableTimes.forEach(time => {
                if (time.startTimeMillis <= movingVisitTime && time.endTimeMillis >= movingVisitTime) {
                    shouldMove = true
                }
            })
        })

        if (prevVisitStaffId === movingVisitStaffId && movingVisit.appointmentTimeMillis <= movingVisitTime
            && (movingVisit.appointmentTimeMillis + (movingVisit.duration * 1000)) >= movingVisitTime) {
            shouldMove = true
        }

        if (shouldMove) {
            this.props.dispatch(calendarActions.updateAppointment(
                movingVisit.appointmentId,
                JSON.stringify({appointmentTimeMillis: movingVisitMillis, staffId: movingVisitStaffId}))
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
        const {numbers, availableTimetable,selectedDays, closedDates, clients, appointments,reservedTime: reservedTimeFromProps ,handleUpdateClient, approveAppointmentSetter,updateReservedId,changeTime,isLoading } = this.props;

        return(
            <div className="tabs-scroll"
                // style={{'minWidth': (120*parseInt(workingStaff.availableTimetable && workingStaff.availableTimetable.length))+'px'}}
            >
                {numbers && numbers.map((time, key) =>
                    <div className={'tab-content-list ' + (isLoading && 'loading')} key={key}>
                        <TabScrollLeftMenu time={time}/>
                        {!isLoading && availableTimetable && selectedDays.map((day) => availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((workingStaffElement, staffKey) => {
                            let currentTime= parseInt(moment(moment(day).format('DD/MM')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'));
                            let appointment = appointments &&
                                appointments.map((appointmentStaff) =>
                                    appointmentStaff.appointments &&
                                    (appointmentStaff.staff && appointmentStaff.staff.staffId) === (workingStaffElement && workingStaffElement.staffId) &&
                                    appointmentStaff.appointments.filter((appointment)=>{
                                        return currentTime <= parseInt(appointment.appointmentTimeMillis)
                                            && parseInt(moment(moment(day).format('DD/MM')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) > parseInt(appointment.appointmentTimeMillis)
                                    })
                                );

                            let reservedTime = reservedTimeFromProps &&
                                reservedTimeFromProps.map((reserve) =>
                                    reserve.reservedTimes &&
                                    reserve.staff.staffId === workingStaffElement.staffId &&
                                    reserve.reservedTimes.filter((localReservedTime)=>{
                                        return currentTime <= parseInt(localReservedTime.startTimeMillis)
                                            && parseInt(moment(moment(day).format('DD/MM')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) > parseInt(localReservedTime.startTimeMillis)
                                    })
                                );

                            appointment = appointment && appointment.filter(Boolean)
                            reservedTime = reservedTime && reservedTime.filter(Boolean)

                            let clDate = closedDates && closedDates.some((st) =>
                                parseInt(moment(st.startDateMillis, 'x').startOf('day').format("x")) <= parseInt(moment(day).startOf('day').format("x")) &&
                                parseInt(moment(st.endDateMillis, 'x').endOf('day').format("x")) >= parseInt(moment(day).endOf('day').format("x")))


                            let workingTimeEnd=null;
                            let notExpired = workingStaffElement && workingStaffElement.availableDays && workingStaffElement.availableDays.length!==0 &&
                                workingStaffElement.availableDays.some((availableDay)=>
                                    parseInt(moment(moment(availableDay.dayMillis, 'x').format('DD/MM')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'))===currentTime &&
                                    availableDay.availableTimes && availableDay.availableTimes.some((workingTime)=>{
                                        workingTimeEnd=workingTime.endTimeMillis;
                                        return currentTime>=parseInt(moment().format("x")) &&
                                            currentTime>=parseInt(moment(moment(workingTime.startTimeMillis, 'x').format('DD/MM')+' '+moment(workingTime.startTimeMillis, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x')) &&
                                            currentTime<parseInt(moment(moment(workingTime.endTimeMillis, 'x').format('DD/MM')+' '+moment(workingTime.endTimeMillis, 'x').format('HH:mm'), 'DD/MM HH:mm').format('x'))}

                                    ));
                            let resultMarkup;
                            if(appointment && appointment[0] && appointment[0].length > 0) {
                                let totalDuration = appointment[0][0].duration;
                                let appointmentServices = [];
                                let totalCount = 0;
                                appointmentServices.push(appointment[0][0].serviceName);
                                if (appointment[0][0].hasCoAppointments) {
                                    appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
                                        if (currentAppointment.coAppointmentId === appointment[0][0].appointmentId) {
                                            totalDuration += currentAppointment.duration;
                                            appointmentServices.push(currentAppointment.serviceName)
                                            totalCount++;
                                        }
                                    }))
                                }
                                let extraServiceText;
                                switch (totalCount) {
                                    case 0:
                                        extraServiceText = '';
                                        break;
                                    case 1:
                                        extraServiceText = 'и ещё 1 услуга';
                                        break;
                                    case 2:
                                    case 3:
                                    case 4:
                                        extraServiceText = `и ещё ${totalCount} услуги`;
                                        break;
                                    default:
                                        extraServiceText = `и ещё 5+ услуг`;
                                }
                                const resultTextArea = `${appointment[0][0].serviceName} ${extraServiceText}`;
                                resultMarkup = (
                                    <div
                                        className={currentTime <= moment().format("x")
                                        && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                                    >
                                        {!appointment[0][0].coAppointmentId && (
                                            <div
                                                className={"notes " + appointment[0][0].appointmentId + " " + appointment[0][0].color.toLowerCase() + "-color " + (parseInt(moment(currentTime + appointment[0][0].duration * 1000 ).format("H")) >= 20 && 'notes-bottom' + ' ' + (parseInt(moment(currentTime).format("H")) === 23 && ' last-hour-notes'))}
                                                key={appointment[0][0].appointmentId + "_" + key}
                                                id={appointment[0][0].appointmentId + "_" + workingStaffElement.staffId + "_" + appointment[0][0].duration + "_" + appointment[0][0].appointmentTimeMillis + "_" + moment(appointment[0][0].appointmentTimeMillis, 'x').add(appointment[0][0].duration, 'seconds').format('x')}
                                            >
                                                <p className="notes-title" onClick={()=> $(`.${appointment[0][0].appointmentId}`).toggleClass('selected')}>
                                                    {!appointment[0][0].online &&
                                                    <span className="pen"
                                                          title="Запись через журнал"/>}
                                                    {/*<span className="men"*/}
                                                    {/*title="Постоянный клиент"/>*/}
                                                    {appointment[0][0].online &&
                                                    <span className="globus"
                                                          title="Онлайн-запись"/>}

                                                    <span className="delete"
                                                          data-toggle="modal"
                                                          data-target=".delete-notes-modal"
                                                          title="Отменить встречу"
                                                          onClick={() => approveAppointmentSetter(appointment[0][0].appointmentId)}/>
                                                    {appointment[0][0].hasCoAppointments && <span className="super-visit" title="Мультивизит"/>}
                                                    <span className="service_time">
                                                                                    {moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                        {moment(appointment[0][0].appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}
                                                                                </span>
                                                </p>
                                                <p className="notes-container"
                                                   style={{height: ((totalDuration / 60 / 15) - 1) * 20 + "px"}}>
                                                    <textarea disabled>{resultTextArea}</textarea>
                                                </p>
                                                {!this.props.isStartMovingVisit && <div className="msg-client-info">
                                                    { clients && clients.map((client) => (
                                                        client.clientId === appointment[0][0].clientId &&
                                                        <div className="msg-inner">
                                                            <p>
                                                                <p className="new-text">Запись</p>
                                                                <button type="button" onClick={()=> {
                                                                    $(`.${appointment[0][0].appointmentId}`).removeClass('selected')
                                                                    this.props.dispatch(calendarActions.toggleStartMovingVisit(false))
                                                                }} className="close" />
                                                            </p>
                                                            <p className="client-name-book">Клиент</p>
                                                            <p className="name">{client.firstName} {client.lastName}</p>
                                                            <p>{client.phone}</p>

                                                            <p className="client-name-book">{appointmentServices.length > 1 ? 'Список услуг' : 'Услуга'}</p>
                                                            {appointmentServices.map(service =>
                                                                <p>{service}</p>)}
                                                            <p>{moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                                {moment(appointment[0][0].appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}</p>
                                                            <p>{workingStaffElement.firstName} {workingStaffElement.lastName}</p>

                                                            <a
                                                                className="a-client-info"
                                                                data-target=".client-detail"
                                                                title="Просмотреть клиента"
                                                                onClick={(e) => {
                                                                    $('.client-detail').modal('show')
                                                                    handleUpdateClient(client)


                                                                }}><p>Просмотреть клиента</p>
                                                            </a>
                                                            {currentTime >= parseInt(moment().format("x")) && <button data-toggle="modal"
                                                                    data-target=".start-moving-modal"
                                                                    onClick={() => this.startMovingVisit(appointment[0][0], totalDuration)} className="button" style={{margin: '0 auto', display: 'block'}}>
                                                                Перенести визит
                                                            </button>
                                                            }
                                                        </div>))
                                                    }
                                                </div> }
                                            </div>
                                        )}
                                    </div>
                                )
                            } else if ( reservedTime && reservedTime[0] && reservedTime[0].length > 0 ) {
                                const textAreaHeight = (parseInt(((moment.utc(reservedTime[0][0].endTimeMillis - reservedTime[0][0].startTimeMillis, 'x').format('x') / 60000 / 15) - 1) * 20))

                                resultMarkup = (
                                    <div className='reserve'>
                                        <div className="notes color-grey"
                                             style={{backgroundColor: "darkgrey"}}>

                                            <p className="notes-title"
                                               style={{cursor: 'default'}}>
                                                {textAreaHeight === 0 && <span className="delete"
                                                                             style={{right: '5px'}}
                                                                             data-toggle="modal"
                                                                             data-target=".delete-reserve-modal"
                                                                             title="Удалить"
                                                                             onClick={() => updateReservedId(
                                                                                 reservedTime[0][0].reservedTimeId,
                                                                                 workingStaffElement.staffId
                                                                             )}
                                                />}
                                                <span className="" title="Онлайн-запись"/>
                                                <span
                                                    className="service_time"
                                                >
                                                    {moment(reservedTime[0][0].startTimeMillis, 'x').format('HH:mm')}
                                                    -
                                                    {moment(reservedTime[0][0].endTimeMillis, 'x').format('HH:mm')}
                                                </span>

                                            </p>
                                            <p className="notes-container"
                                               style={{height: textAreaHeight+ "px"}}>
                                                                            <textarea
                                                                                style={{color: '#5d5d5d'}}>{reservedTime[0][0].description}</textarea>
                                                {textAreaHeight > 0 && <span className="delete-notes"
                                                      style={{right: '5px'}}
                                                      data-toggle="modal"
                                                      data-target=".delete-reserve-modal"
                                                      title="Удалить"
                                                      onClick={() => updateReservedId(
                                                          reservedTime[0][0].reservedTimeId,
                                                          workingStaffElement.staffId
                                                      )}
                                                />}
                                            </p>
                                        </div>
                                    </div>
                                )
                            } else {
                                resultMarkup = (
                                    <div
                                        id={currentTime <= moment().format("x") && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                                        className={`col-tab ${currentTime <= moment().format("x")
                                        && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                                                                            ${currentTime < parseInt(moment().format("x")) ? '' : ""}
                                                                            ${notExpired ? '' : "expired "}
                                                                            ${notExpired && this.props.isStartMovingVisit ? 'start-moving ' : ''}
                                                                            ${clDate ? 'closedDateTick' : ""}`}
                                        time={currentTime}
                                        data-toggle={notExpired && this.props.isStartMovingVisit && "modal"}
                                        data-target={notExpired && this.props.isStartMovingVisit && ".move-visit-modal"}
                                        timeEnd={workingTimeEnd}
                                        staff={workingStaffElement.staffId}
                                        onClick={() => notExpired && (this.props.isStartMovingVisit ? this.moveVisit(workingStaffElement.staffId, currentTime) : changeTime(currentTime, workingStaffElement, numbers, false, null))}
                                    ><span
                                        className={moment(time, 'x').format("mm") === "00" && notExpired ? 'visible-fade-time':'fade-time' }>{moment(time, 'x').format("HH:mm")}</span>
                                    </div>
                                )
                            }
                            return resultMarkup;

                        }))
                        }

                    </div>
                )}

            </div>
        );
    }

}

function mapStateToProps(state) {
    const { calendar: { isStartMovingVisit, isMoveVisit } } = state;

    return {
        isStartMovingVisit,
        isMoveVisit
    }
}

export default connect(mapStateToProps)(TabScroll);
