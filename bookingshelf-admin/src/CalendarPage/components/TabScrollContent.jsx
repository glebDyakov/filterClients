import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {access} from "../../_helpers/access";
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
            prevVisitStaffId: null,
            selectedNote: null
        }
        this.startMovingVisit = this.startMovingVisit.bind(this);
        this.moveVisit = this.moveVisit.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.makeMovingVisitQuery = this.makeMovingVisitQuery.bind(this);
    }
    componentWillReceiveProps(newProps){
        $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'});
        if (newProps.isStartMovingVisit && newProps.isMoveVisit) {
            this.makeMovingVisitQuery()
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

    handleMouseMove(e) {
        const { changingVisit, changingPos, offsetHeight } = this.state
        const textAreaWrapper = `${changingVisit.appointmentId}-textarea-wrapper`
        const res = offsetHeight + e.pageY - changingPos;
// 'rez' = ширина div'a + кол-во пикселов смещения
        document.getElementById(textAreaWrapper).style.height = res+"px";
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
                    JSON.stringify({ duration: changingVisit.duration + newDuration })
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
                                    JSON.stringify({duration: newDuration})
                                ))
                            }, 1000 * timeout)
                        } else {
                            newDuration-=900

                            setTimeout(() => {
                                this.props.dispatch(calendarActions.updateAppointment(
                                    coAppointment.appointmentId,
                                    JSON.stringify({duration: 900})
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
                JSON.stringify({ duration: changingVisit.duration + newDuration })
            ))
        }

        this.setState({ changingVisit: null, changingPos:null, offsetHeight: null })
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
        const { appointments } = this.props;
        const { movingVisit, movingVisitDuration, movingVisitStaffId, movingVisitMillis, prevVisitStaffId } = this.state;

        let shouldMove = false
        const movingVisitEndTime = movingVisitMillis + (movingVisitDuration * 1000);

        const availableTimetableItems = this.props.availableTimetable
            .filter(item => item.staffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === item.staffId)))

        availableTimetableItems.forEach(availableTimetableItem => {
            availableTimetableItem.availableDays.forEach(item => {
                item.availableTimes.forEach(time => {
                    if (time.startTimeMillis <= movingVisitEndTime && time.startTimeMillis <= movingVisitMillis
                        && time.endTimeMillis >= movingVisitEndTime && time.endTimeMillis >= movingVisitMillis) {
                        shouldMove = true
                    }
                })
            })
        })


        if (!shouldMove && (prevVisitStaffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === movingVisitStaffId)))) {
            // if (movingVisit.appointmentTimeMillis <= movingVisitEndTime
            //     && (movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000)) >= movingVisitEndTime) {
            //     shouldMove = true
            // }
            //
            // if (movingVisit.appointmentTimeMillis <= movingVisitMillis && movingVisitMillis <= (movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000))) {
            //     shouldMove = true
            // }
            const intervals = []

            for(let i = movingVisitMillis; i < movingVisitEndTime; i+= 15 * 60000) {
                intervals.push(i)
            }

            const activeAvailableTimetableItem = availableTimetableItems.find(item => item.staffId === movingVisitStaffId);
            activeAvailableTimetableItem.availableDays.forEach(item => {
                item.availableTimes.forEach(time => {
                    const isFreeInterval = intervals.every(i => {
                        return ((time.startTimeMillis <= i && time.endTimeMillis > i)
                            || (movingVisit.appointmentTimeMillis <= i && (movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000)) > i))
                    });
                    if (isFreeInterval) {
                        shouldMove = true
                    }

                })
            })

            const startDay = moment(movingVisitMillis, 'x').format('D')
            const endDay = moment((movingVisitMillis + (movingVisitDuration * 1000)), 'x').format('D')
            if (startDay !== endDay) {
                shouldMove = false
            }
        }

        if (shouldMove) {
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
                }))
            );

            // if (movingVisit.hasCoAppointments) {
            //     const staffAppointments = appointments.find(appointment => appointment.staff.staffId === prevVisitStaffId);
            //     if (staffAppointments) {
            //         staffAppointments.appointments.forEach(appointment => {
            //             if (appointment.coAppointmentId === movingVisit.appointmentId) {
            //                 appointmentsToMove.push(appointment)
            //             }
            //         })
            //         appointmentsToMove.sort((a,b) => a.appointmentId - b.appointmentId).forEach((appointment, i) => {
            //             setTimeout(() => {
            //                 this.props.dispatch(calendarActions.updateAppointment(
            //                     appointment.appointmentId,
            //                     JSON.stringify({
            //                         appointmentTimeMillis: appointment.appointmentTimeMillis + (movingVisitMillis - movingVisit.appointmentTimeMillis),
            //                         staffId: movingVisitStaffId,
            //                         adminApproved: true,
            //                         approved: true,
            //                         moved: true,
            //                         adminMoved: true
            //                     }))
            //                 );
            //             }, 1000 * (i + 1))
            //         })
            //     }
            // }
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
        const { authentication, numbers, services, availableTimetable,selectedDays, closedDates, isClientNotComeLoading, appointments,reservedTime: reservedTimeFromProps ,handleUpdateClient, approveAppointmentSetter,updateReservedId,changeTime,isLoading, isStartMovingVisit } = this.props;
        const { selectedNote, movingVisit, movingVisitDuration, prevVisitStaffId } = this.state;

        return(
            <div className="tabs-scroll"
                // style={{'minWidth': (120*parseInt(workingStaff.availableTimetable && workingStaff.availableTimetable.length))+'px'}}
            >
                {numbers && numbers.map((time, key) =>
                    <div className={'tab-content-list ' + (isLoading && 'loading')} key={key}>
                        <TabScrollLeftMenu time={time}/>
                        {!isLoading && availableTimetable && selectedDays.map((day) => availableTimetable.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((workingStaffElement, staffKey) => {
                            let currentTime= parseInt(moment(moment(day).format('DD/MM/YYYY')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'));
                            let appointment = appointments &&
                                appointments.map((appointmentStaff) =>
                                    appointmentStaff.appointments &&
                                    (appointmentStaff.staff && appointmentStaff.staff.staffId) === (workingStaffElement && workingStaffElement.staffId) &&
                                    appointmentStaff.appointments.filter((appointment)=>{
                                        return currentTime <= parseInt(appointment.appointmentTimeMillis)
                                            && parseInt(moment(moment(day).format('DD/MM/YYYY')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x')) > parseInt(appointment.appointmentTimeMillis)
                                    })
                                );

                            let reservedTime = reservedTimeFromProps &&
                                reservedTimeFromProps.map((reserve) =>
                                    reserve.reservedTimes &&
                                    reserve.staff.staffId === workingStaffElement.staffId &&
                                    reserve.reservedTimes.filter((localReservedTime)=>{
                                        return currentTime <= parseInt(localReservedTime.startTimeMillis)
                                            && parseInt(moment(moment(day).format('DD/MM/YYYY')+' '+moment(numbers[key + 1], 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x')) > parseInt(localReservedTime.startTimeMillis)
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
                                    parseInt(moment(moment(availableDay.dayMillis, 'x').format('DD/MM/YYYY')+' '+moment(time, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))===currentTime &&
                                    availableDay.availableTimes && availableDay.availableTimes.some((workingTime)=>{
                                        workingTimeEnd=workingTime.endTimeMillis;
                                        if (isStartMovingVisit && movingVisit && (workingStaffElement.staffId === prevVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(item => item.staffId === workingStaffElement.staffId)))) {
                                            const movingVisitStart = parseInt(moment(moment(movingVisit.appointmentTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(movingVisit.appointmentTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                            const movingVisitEnd = parseInt(moment(moment(movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000), 'x').format('DD/MM/YYYY')+' '+moment(movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000), 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))

                                            if (currentTime>=movingVisitStart && currentTime<movingVisitEnd) {
                                                return true
                                            }
                                        }
                                        return currentTime>=parseInt(moment().format("x"))
                                            && currentTime>=parseInt(moment(moment(workingTime.startTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(workingTime.startTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                            && currentTime<parseInt(moment(moment(workingTime.endTimeMillis, 'x').format('DD/MM/YYYY')+' '+moment(workingTime.endTimeMillis, 'x').format('HH:mm'), 'DD/MM/YYYY HH:mm').format('x'))
                                    }

                                    ));

                            let resultMarkup;
                            if(appointment && appointment[0] && appointment[0].length > 0 && !appointment[0][0].coAppointmentId && !((isStartMovingVisit && movingVisit && movingVisit.appointmentId) === appointment[0][0].appointmentId)) {
                                let totalDuration = appointment[0][0].duration;
                                let appointmentServices = [];
                                let totalCount = 0;
                                let totalPrice = appointment[0][0].price
                                let totalAmount = appointment[0][0].totalAmount
                                const currentAppointments = [appointment[0][0]]
                                const activeService = services && services.servicesList && services.servicesList.find(service => service.serviceId === appointment[0][0].serviceId)
                                appointmentServices.push({ ...activeService, discountPercent: appointment[0][0].discountPercent, totalAmount: appointment[0][0].totalAmount, price: appointment[0][0].price, serviceName: appointment[0][0].serviceName, serviceId: appointment[0][0].serviceId});
                                if (appointment[0][0].hasCoAppointments) {
                                    appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
                                        if (currentAppointment.coAppointmentId === appointment[0][0].appointmentId) {
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
                                const serviceDetails = services && services.servicesList && (services.servicesList.find(service => service.serviceId === appointment[0][0].serviceId) || {}).details
                                const resultTextArea = `${appointment[0][0].clientName ? ('Клиент: ' + appointment[0][0].clientName) + '\n' : ''}${appointment[0][0].serviceName} ${serviceDetails ? `(${serviceDetails})` : ''} ${extraServiceText} ${('\nЦена: ' + totalPrice + ' ' + appointment[0][0].currency)} ${totalPrice !== totalAmount ? ('(' + totalAmount + ' ' + appointment[0][0].currency + ')') : ''} ${appointment[0][0].description ? `\nЗаметка: ${appointment[0][0].description}` : ''}`;
                                // const appointment[0][0] = clients && clients.find((client) => client.clientId === appointment[0][0].clientId)
                                resultMarkup = (
                                    <div
                                        className={(currentTime <= moment().format("x")
                                        && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : '') + (appointment[0][0].appointmentId === selectedNote ? 'selectedNote' : '')}
                                    >
                                        {!appointment[0][0].coAppointmentId && (
                                            <div
                                                className={"notes " + appointment[0][0].appointmentId + " " + appointment[0][0].color.toLowerCase() + "-color " + (parseInt(moment(currentTime + appointment[0][0].duration * 1000 ).format("H")) >= 20 && 'notes-bottom' + ' ' + (parseInt(moment(currentTime).format("H")) === 23 && ' last-hour-notes')) + (appointment[0][0].appointmentId === selectedNote ? ' selected' : '')}
                                                key={appointment[0][0].appointmentId + "_" + key}
                                                id={appointment[0][0].appointmentId + "_" + workingStaffElement.staffId + "_" + appointment[0][0].duration + "_" + appointment[0][0].appointmentTimeMillis + "_" + moment(appointment[0][0].appointmentTimeMillis, 'x').add(appointment[0][0].duration, 'seconds').format('x')}
                                            >
                                                <p className="notes-title" onClick={()=> this.setState({ selectedNote: appointment[0][0].appointmentId === selectedNote ? null : appointment[0][0].appointmentId})}>
                                                    <span className="delete"
                                                          data-toggle="modal"
                                                          data-target=".delete-notes-modal"
                                                          title="Отменить встречу"
                                                          onClick={() => approveAppointmentSetter(appointment[0][0].appointmentId)}/>
                                                    {!appointment[0][0].online &&
                                                    <span className="pen"
                                                          title="Запись через журнал"/>}
                                                    {/*<span className="men"*/}
                                                    {/*title="Постоянный клиент"/>*/}
                                                    {appointment[0][0].online &&
                                                    <span className="globus"
                                                          title="Онлайн-запись"/>}


                                                    {/*{clients && clients.map(client => {*/}
                                                    {/*    const isOldClient = client.appointments.some(item => item.appointmentTimeMillis < parseInt(moment().format('x')))*/}
                                                    {/*    return ((client.clientId === appointment[0][0].clientId) &&*/}
                                                    {/*        <React.Fragment>*/}
                                                    {/*        <span*/}
                                                    {/*            className={`${isOldClient? 'old' : 'new'}-client-icon`}*/}
                                                    {/*            title={isOldClient ? 'Подтвержденный клиент' : 'Новый клиент'}/>*/}
                                                    {/*        </React.Fragment>)*/}
                                                    {/*})}*/}

                                                            <span
                                                                className={`${true? 'old' : 'new'}-client-icon`}
                                                                title={true ? 'Подтвержденный клиент' : 'Новый клиент'}/>

                                                    {!appointment[0][0] &&
                                                            <span
                                                                className="no-client-icon"
                                                                title="Визит от двери"/>
                                                    }

                                                    {!!appointment[0][0].discountPercent &&
                                                    <span className="percentage"
                                                          title={`${appointment[0][0].discountPercent}%`}
                                                    />}

                                                    {appointment[0][0].hasCoAppointments && <span className="super-visit" title="Мультивизит"/>}
                                                    <span className="service_time">
                                                                                    {moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                        {moment(appointment[0][0].appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}
                                                                                </span>
                                                </p>
                                                <p id={`${appointment[0][0].appointmentId}-textarea-wrapper`} className="notes-container"
                                                   style={{
                                                       minHeight: ((currentAppointments.length - 1) ? 20 * (currentAppointments.length - 1) : 2) + "px",
                                                       height: ((totalDuration / 60 / 15) - 1) * 20 + "px"
                                                   }}>
                                                    <span className="notes-container-message">
                                                        {resultTextArea}
                                                    </span>
                                                    {currentTime >= parseInt(moment().subtract(1, 'week').format("x")) &&
                                                    <p onMouseDown={(e) => {
                                                        this.setState({
                                                            changingVisit: appointment[0][0],
                                                            changingPos: e.pageY,
                                                            offsetHeight: document.getElementById(`${appointment[0][0].appointmentId}-textarea-wrapper`).offsetHeight
                                                        })
                                                    }} style={{
                                                        cursor: 'ns-resize',
                                                        height: '8px',
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        width: '100%',
                                                        zIndex: 9990
                                                    }}/>
                                                    }
                                                </p>
                                                {!this.props.isStartMovingVisit && <div className="msg-client-info">
                                                    <div className="msg-inner">
                                                        <p>
                                                            <p className="new-text">Запись</p>
                                                            <button type="button" onClick={()=> {
                                                                this.setState({ selectedNote: null })
                                                                this.props.dispatch(calendarActions.toggleStartMovingVisit(false))
                                                            }} className="close" />
                                                        </p>


                                                        {appointment[0][0] && <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="client-name-book">
                                                            <span style={{ textAlign: 'left'}}>Клиент</span>
                                                            {(access(4) || (access(12) && (authentication && authentication.user && authentication.user.profile && authentication.user.profile.staffId) === workingStaffElement.staffId)) && appointment[0][0] &&
                                                            <span
                                                                className="clientEye clientEye-info"
                                                                data-target=".client-detail"
                                                                title="Просмотреть клиента"
                                                                onClick={(e) => {
                                                                    $('.client-detail').modal('show')
                                                                    handleUpdateClient(appointment[0][0])
                                                                }} />
                                                            }
                                                        </p>}
                                                        {appointment[0][0] && <p className="name">{appointment[0][0].clientName}</p>}
                                                        {access(4) && appointment[0][0] && <p>{appointment[0][0].clientPhone}</p>}
                                                        {appointment[0][0] && <p style={{ height: '30px' }}>
                                                            <div style={{ height: '28px', display: 'flex', justifyContent: 'space-between' }} className="check-box calendar-client-checkbox">
                                                                Клиент не пришел

                                                                {isClientNotComeLoading ?
                                                                    <div style={{ margin: '0 0 0 auto', left: '15px' }} className="loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>
                                                                    :
                                                                    <label>
                                                                        <input className="form-check-input" checked={appointment[0][0].clientNotCome} onChange={()=>this.props.dispatch(calendarActions.updateAppointmentCheckbox(appointment[0][0].appointmentId, JSON.stringify({ clientNotCome: !appointment[0][0].clientNotCome } )))}
                                                                               type="checkbox"/>
                                                                        <span style={{ width: '20px', margin: '-3px 0 0 11px'}} className="check" />
                                                                    </label>
                                                                }
                                                            </div>
                                                        </p>}


                                                        <p className="client-name-book">{appointmentServices.length > 1 ? 'Список услуг' : 'Услуга'}</p>
                                                        {appointmentServices.map(service => {
                                                            const details = services && services.servicesList && (services.servicesList.find(service => service.serviceId === appointment[0][0].serviceId) || {}).details
                                                            return <p>

                                                                {service.serviceName} {details ? `(${details})` : ''}

                                                                <span style={{display: 'inline-block', textAlign: 'left', fontWeight: 'bold'}}>
                                                                {service.price ? service.price : service.priceFrom} {service.currency} {!!service.discountPercent && <span style={{ display: 'inline', textAlign: 'left', fontWeight: 'bold', color: 'rgb(212, 19, 22)'}}>
                                                                        ({service.totalAmount} {service.currency})
                                                                    </span>}
                                                                </span>
                                                                {!!service.discountPercent && <span style={{ textAlign: 'left', fontSize: '13px', color: 'rgb(212, 19, 22)'}}>{`${(service.discountPercent === (appointment[0][0] && appointment[0][0].discountPercent)) ? 'Скидка клиента': 'Единоразовая скидка' }: ${service.discountPercent}%`}</span>}


                                                            </p>
                                                        })
                                                        }
                                                        <p>{moment(appointment[0][0].appointmentTimeMillis, 'x').format('HH:mm')} -
                                                            {moment(appointment[0][0].appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}</p>
                                                        <p style={{ fontWeight: 'bold', color: '#000'}}>{workingStaffElement.firstName} {workingStaffElement.lastName ? workingStaffElement.lastName : ''}</p>
                                                        {appointment[0][0].description && <p>Заметка: {appointment[0][0].description}</p>}

                                                        {/*{(access(4) || (access(12) && (authentication && authentication.user && authentication.user.profile && authentication.user.profile.staffId) === workingStaffElement.staffId)) && appointment[0][0] && <a*/}
                                                        {/*    className="a-client-info"*/}
                                                        {/*    data-target=".client-detail"*/}
                                                        {/*    title="Просмотреть клиента"*/}
                                                        {/*    onClick={(e) => {*/}
                                                        {/*        $('.client-detail').modal('show')*/}
                                                        {/*        handleUpdateClient(appointment[0][0])*/}
                                                        {/*    }}><p>Просмотреть клиента</p>*/}
                                                        {/*</a>}*/}

                                                        {currentTime >= parseInt(moment().subtract(1, 'week').format("x")) && (
                                                            <React.Fragment>
                                                                <div style={{
                                                                    marginTop: '2px',
                                                                }}
                                                                     data-toggle="modal"
                                                                     data-target=".start-moving-modal"
                                                                     onClick={() => this.startMovingVisit(appointment[0][0], totalDuration)}
                                                                     className="msg-inner-button-wrapper"
                                                                >
                                                                    <button className="button"
                                                                            style={{backgroundColor: '#f3a410', border: 'none', margin: '0 auto', display: 'block', width: '150px', minHeight: '32px', height: '32px', fontSize: '14px'}}>
                                                                        Перенести визит
                                                                    </button>
                                                                    {/*<span className="move-white"/>*/}
                                                                </div>
                                                                <div style={{
                                                                    marginTop: '5px',
                                                                }}
                                                                     onClick={() => changeTime(currentTime, workingStaffElement, numbers, true, currentAppointments)}
                                                                     className="msg-inner-button-wrapper"
                                                                >
                                                                    <button className="button"
                                                                            style={{backgroundColor: '#909090', border: 'none', margin: '0 auto', display: 'block', width: '150px', minHeight: '32px', height: '32px', fontSize: '14px'}}>
                                                                        Изменить визит
                                                                    </button>
                                                                    {/*<span className="move-white"/>*/}
                                                                </div>
                                                                <div style={{
                                                                    marginTop: '5px',
                                                                }}
                                                                     className="msg-inner-button-wrapper"
                                                                     data-toggle="modal"
                                                                     data-target=".delete-notes-modal"
                                                                     onClick={() => approveAppointmentSetter(appointment[0][0].appointmentId)}
                                                                >
                                                                    <button className="button"
                                                                            style={{backgroundColor: '#d41316', border: 'none', margin: '0 auto', display: 'block', width: '150px', minHeight: '32px', height: '32px', fontSize: '14px'}}
                                                                    >
                                                                        Удалить визит
                                                                    </button>
                                                                    {/*<span className="cancel-white"/>*/}
                                                                </div>

                                                            </React.Fragment>)
                                                        }
                                                    </div>
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
                                                                            <span
                                                                                style={{color: '#5d5d5d', fontSize: '10px'}}>{reservedTime[0][0].description}</span>
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
