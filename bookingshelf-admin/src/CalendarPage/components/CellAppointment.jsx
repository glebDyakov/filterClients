import React from 'react';
import {connect} from 'react-redux';

import {appointmentActions, calendarActions} from "../../_actions";
import {access} from "../../_helpers/access";

import moment from 'moment';
import {isMobile} from "react-device-detect";
import Box from "../../_components/dragAndDrop/Box";
import {getNearestAvailableTime} from "../../_helpers/available-time";
import {getCurrentCellTime} from "../../_helpers";
import Popover from "../../_components/Popover";

const CellAppointment = (props) => {
    const {
        company,
        dispatch,
        moveVisit,
        movingVisit,
        numberKey,
        staffKey,
        appointment,
        appointments,
        reservedTime,
        timetable,
        blickClientId,
        isStartMovingVisit,
        numbers,
        selectedNote,
        isClientNotComeLoading,
        workingStaffElement,
        handleUpdateClient,
        services,
        changeTime,
        selectedDays,
        selectedDaysKey,
        time,
        staff,
        updateAppointmentForDeleting
    } = props;


    let totalDuration = appointment.duration;
    let appointmentServices = [];
    let totalCount = 0;
    let totalPrice = appointment.price
    let totalAmount = appointment.totalAmount
    const currentAppointments = [appointment]
    const currentTime = getCurrentCellTime(selectedDays, selectedDaysKey, time)
    const activeService = services && services.servicesList && services.servicesList.find(service => service.serviceId === appointment.serviceId)
    appointmentServices.push({
        ...activeService,
        discountPercent: appointment.discountPercent,
        totalAmount: appointment.totalAmount,
        price: appointment.price,
        serviceName: appointment.serviceName,
        serviceId: appointment.serviceId
    });


    if (appointment.hasCoAppointments) {
        appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
            if (!currentAppointment.coappointment && (currentAppointment.coAppointmentId === appointment.appointmentId)) {
                totalDuration += currentAppointment.duration;
                const activeCoService = services && services.servicesList && services.servicesList.find(service => service.serviceId === currentAppointment.serviceId)
                appointmentServices.push({
                    ...activeCoService,
                    discountPercent: currentAppointment.discountPercent,
                    totalAmount: currentAppointment.totalAmount,
                    serviceName: currentAppointment.serviceName,
                    price: currentAppointment.price,
                    serviceId: currentAppointment.serviceId
                })
                totalCount++;
                totalPrice += currentAppointment.price;
                totalAmount += currentAppointment.totalAmount;

                currentAppointments.push(currentAppointment)
            }
        }))
    }

    const {booktimeStep} = company.settings;
    const cellHeight = 38;
    const step = booktimeStep / 60;
    const resultTextAreaHeight = ((totalDuration / 60 / step) - 1) * cellHeight;

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
    const serviceDetails = services && services.servicesList && (services.servicesList.find(service => service.serviceId === appointment.serviceId) || {}).details
    const minTextAreaHeight = ((currentAppointments.length - 1) ? cellHeight * (currentAppointments.length - 1) : 2);

    const staffList = appointments && appointments.filter(item => item.appointments && item.appointments.some(localAppointment => localAppointment.appointmentId === appointment.appointmentId));

    const timetableItems = timetable && timetable
        .filter(item => item.staffId === workingStaffElement.staffId || (appointment.coStaffs && staffList.some(coStaff => coStaff.staff.staffId === item.staffId)))

    const isOwnInterval = i => appointment.appointmentTimeMillis <= i && (appointment.appointmentTimeMillis + (totalDuration * 1000)) > i
    const nearestAvailableMillis = getNearestAvailableTime(appointment.appointmentTimeMillis, appointment.appointmentTimeMillis, timetableItems, appointments, reservedTime, staff, isOwnInterval);
    const maxTextAreaCellCount = (nearestAvailableMillis - (appointment.appointmentTimeMillis + (step * 60000))) / 1000 / 60 / step;
    const maxTextAreaHeight = maxTextAreaCellCount * cellHeight;

    const textAreaId = `${appointment.appointmentId}-${numberKey}-${staffKey}-textarea-wrapper`;

    const startMovingVisit = (movingVisit, totalDuration, prevVisitStaffId, draggingAppointmentId) => {
        dispatch(appointmentActions.togglePayload({
            movingVisit,
            movingVisitDuration: totalDuration,
            prevVisitStaffId,
            draggingAppointmentId,
            isStartMovingVisit: true
        }));
    }
    const content = (
        <div
            onMouseEnter={() => {
                if (appointment.clientId) {
                    let clientAppointmentsCount = 0
                    appointments.forEach(item => {
                        item.appointments && item.appointments.forEach(currentAppointment => {
                            if (currentAppointment.clientId === appointment.clientId && !currentAppointment.coappointment && !currentAppointment.coAppointmentId) {
                                clientAppointmentsCount++;
                            }
                        })
                    })
                    if (clientAppointmentsCount > 1) {
                        dispatch(appointmentActions.toggleBlickedClientId(appointment.clientId))
                    }
                }
            }}
            onMouseLeave={() => {
                if (appointment.clientId) {
                    dispatch(appointmentActions.toggleBlickedClientId(null))
                }
            }}
            className={"cell notes " + appointment.appointmentId + " " + (parseInt(moment(currentTime + appointment.duration * 1000).format("H")) >= 20 && 'notes-bottom' + ' ' + (parseInt(moment(currentTime).format("H")) === 23 && ' last-hour-notes'))
            + ((appointment.appointmentId === selectedNote && !appointment.coappointment) ? ' selected hovered' : '')
            + (blickClientId === appointment.clientId ? ' custom-blick-div' : '')
            }
            id={
                appointment.coappointment
                    ? ''
                    : (appointment.appointmentId + "_" + workingStaffElement.staffId + "_" + appointment.duration + "_" + appointment.appointmentTimeMillis + "_" + moment(appointment.appointmentTimeMillis, 'x').add(appointment.duration, 'seconds').format('x'))
            }
        >
            <p className={`notes-title${appointment.clientNotCome ? " client-not-come-background" : ""}`}
               onClick={() => dispatch(appointmentActions.toggleSelectedNote(appointment.appointmentId === selectedNote ? null : appointment.appointmentId))}>
                <span id={`${appointment.appointmentId}-service-time`} className="service_time">
                    {moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')} - {moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}
                                                                        </span>
                <span className="notes-buttons-container">
                    {appointment.clientNotCome && <Popover props={{
                        className: "client-not-come",
                        title: "Клиент не пришел",
                        minWidth: '61px'
                    }}/>}

                    {appointment.online && <Popover props={{className: "globus", title: "Онлайн-запись"}}/>}

                    {!!appointment.discountPercent && <Popover props={{
                        className: "percentage",
                        title: `${appointment.discountPercent}%`,
                        minWidth: '30px'
                    }}/>}

                    {!appointment.clientId &&
                    <Popover props={{className: "no-client-icon", title: "Визит от двери", minWidth: '55px'}}/>}

                    {!appointment.online && <Popover props={{className: "pen", title: "Запись через журнал"}}/>}


                    {!appointment.coappointment && (
                        <React.Fragment>
                            <Popover props={{
                                className: "delete",
                                'data-toggle': "modal",
                                'data-target': ".delete-notes-modal",
                                title: "Отменить встречу",
                                onClick: () => updateAppointmentForDeleting({
                                    ...appointment,
                                    staffId: workingStaffElement.staffId
                                })
                            }}/>

                            {/*{appointment.clientId && <Popover props={{*/}
                            {/*    className: `${appointment.regularClient ? 'old' : 'new'}-client-icon`,*/}
                            {/*    title: appointment.regularClient ? 'Подтвержденный клиент' : 'Новый клиент',*/}
                            {/*    minWidth: '100px'*/}
                            {/*}}/>}*/}


                        </React.Fragment>
                    )}

                    {appointment.hasCoAppointments &&
                    <Popover props={{className: "super-visit", title: "Мультивизит"}}/>}
               </span>

            </p>
            <p onMouseDown={(e) => e.preventDefault()} id={textAreaId} className={`notes-container ${appointment.color.toLowerCase() + "-color"}`}
               style={{
                   minHeight: minTextAreaHeight + "px",
                   maxHeight: maxTextAreaHeight + "px",
                   height: resultTextAreaHeight + "px",
               }}>
                                            <span className="notes-container-message">
                                                    <span
                                                        className="client-name">{appointment.clientFirstName ? ('Клиент: ' + appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')) + '\n' : ''}</span>
                                                    <ul>
                                                        <li className="service">{appointment.serviceName} {serviceDetails ? `(${serviceDetails})` : ''}</li>
                                                    </ul>
                                                {extraServiceText}
                                                {/*{('\nЦена: ' + totalPrice + ' ' + appointment.currency)} ${totalPrice !== totalAmount ? ('(' + totalAmount.toFixed(2) + ' ' + appointment.currency + ')') : ''} ${appointment.description ? `\nЗаметка: ${appointment.description}` : ''}`;*/}

                                            </span>
            </p>
            {!isStartMovingVisit && <div onMouseDown={(e) => e.preventDefault()} className="cell msg-client-info">
                <div className="cell msg-inner">
                    <p>
                        <p className="new-text">Запись&nbsp;<p className="visit-time">{moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')} - {moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}</p></p>
                        <button type="button" onClick={() => {
                            dispatch(appointmentActions.toggleSelectedNote(null));
                            dispatch(appointmentActions.toggleStartMovingVisit(false))
                        }} className="close"/>
                    </p>


                    {appointment.clientId &&
                    <p style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                       className="client-name-book">
                        <span className="client-title">Клиент:</span>
                    </p>}
                    {appointment.clientId &&
                    <p data-target=".client-detail" onClick={(e) => {
                        $('.client-detail').modal('show')
                        handleUpdateClient(appointment.clientId)
                    }}
                       className="name">{appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')}</p>}
                    {access(12) && appointment.clientId && <p>{appointment.clientPhone}</p>}
                    {appointment.carBrand
                    && <p><strong>Марка авто: </strong>
                        {appointment.carBrand}
                    </p>
                    }
                    {appointment.carNumber
                    && <p><strong>Гос. номер: </strong>
                        {appointment.carNumber}
                    </p>
                    }
                    {appointment.clientId && <p style={{height: '30px'}}>
                        <div style={{height: '28px'}}
                             className="cell check-box calendar-client-checkbox client-not-come">
                            Клиент не пришел

                            {isClientNotComeLoading ?
                                <div style={{margin: '0 0 0 auto', left: '15px'}} className="cell loader"><img
                                    style={{width: '40px'}} src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                    alt=""/></div>
                                :
                                <label>
                                    <input className="form-check-input" checked={appointment.clientNotCome}
                                           onChange={() => {
                                               const newClientNotCome = !currentAppointments[0].clientNotCome
                                               const params = currentAppointments.map(item => {
                                                   return {
                                                       ...item,
                                                       clientNotCome: newClientNotCome
                                                   }
                                               })
                                               dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId))
                                           }}
                                           type="checkbox"/>
                                    <span style={{width: '18px', height: '18px', margin: '-3px 0 0 13px'}}
                                          className="check-box-circle"/>
                                </label>
                            }
                        </div>

                    </p>}

                    {appointment.clientId && <hr className="block-line"/>}

                    <p className="client-name-book">{appointmentServices.length > 1 ? 'Список услуг:' : 'Услуга:'}</p>
                    {appointmentServices.map(service => {
                        const details = services && services.servicesList && (services.servicesList.find(service => service.serviceId === appointment.serviceId) || {}).details
                        return <p className="service-name">

                            {service.serviceName} {details ? `(${details})` : ''}

                            <span style={{display: 'inline-block', textAlign: 'left'}}>
                                                        {String(service.price) ? service.price : service.priceFrom} {service.currency} {!!service.discountPercent &&
                            <span style={{
                                display: 'inline',
                                textAlign: 'left',
                                color: 'rgb(212, 19, 22)'
                            }}>
                                                                ({service.totalAmount} {service.currency})
                                                            </span>}
                                                        </span>
                            {!!service.discountPercent && <span style={{
                                textAlign: 'left',
                                fontSize: '13px',
                                color: 'rgb(212, 19, 22)'
                            }}>{`${(service.discountPercent === (appointment && appointment.clientDiscountPercent)) ? 'Скидка клиента' : 'Единоразовая скидка'}: ${service.discountPercent}%`}</span>}


                        </p>
                    })
                    }

                    <p className="all-price">Итого:&nbsp;<span className="price">{totalPrice}&nbsp;BYN</span></p>

                    <hr className="block-line"/>

                    <span className="img-container">
                                         {/*<img className="rounded-circle"*/}
                                         {/*     src={staff.includes(workingStaffElement.id).imageBase64 ? "data:image/png;base64," + workingStaffElement.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}*/}
                                         {/*     alt=""/>*/}
                                     </span>
                    <p>{workingStaffElement.firstName + " " + (workingStaffElement.lastName ? workingStaffElement.lastName : '') }</p>

                    <p style={{
                        fontWeight: 'bold',
                        color: '#000'
                    }}>{workingStaffElement.firstName} {workingStaffElement.lastName ? workingStaffElement.lastName : ''}</p>
                    {appointment.description && <p>Заметка: {appointment.description}</p>}
                    {currentTime >= parseInt(moment().subtract(1, 'week').format("x")) && (
                        <div className="msg-inner-buttons">
                            <div
                                onClick={() => startMovingVisit(appointment, totalDuration, workingStaffElement.staffId)}
                                className="msg-inner-button-wrapper"
                            >
                                <div className="msg-inner-button-wrapper-1">
                                    <img style={{width: '20px'}}
                                         src={`${process.env.CONTEXT}public/img/appointment_move.svg`} alt=""/>
                                    Перенести
                                </div>
                                {/*<span className="move-white"/>*/}
                            </div>
                            <div
                                onClick={() => changeTime(currentTime, workingStaffElement, numbers, true, currentAppointments)}
                                className="msg-inner-button-wrapper"
                            >
                                <div className="msg-inner-button-wrapper-2">
                                    <img style={{width: '20px'}}
                                         src={`${process.env.CONTEXT}public/img/appointment_edit.svg`} alt=""/>
                                    Изменить
                                </div>
                                {/*<span className="move-white"/>*/}
                            </div>
                            <div
                                className="msg-inner-button-wrapper"
                                data-toggle="modal"
                                data-target=".delete-notes-modal"
                                onClick={() => updateAppointmentForDeleting({
                                    ...appointment,
                                    staffId: workingStaffElement.staffId
                                })}
                            >
                                <div className="msg-inner-button-wrapper-3">
                                    <img style={{width: '17px'}}
                                         src={`${process.env.CONTEXT}public/img/appointment_delete.svg`} alt=""/>
                                    Удалить
                                </div>
                                {/*<span className="cancel-white"/>*/}
                            </div>

                        </div>)
                    }
                </div>
            </div>}
        </div>
    )


    const wrapperClassName = 'cell default-width ' + (currentTime <= moment().format("x") && currentTime >= moment().subtract(step, "minutes").format("x") ? 'present-time ' : '') + (appointment.appointmentId === selectedNote ? 'selectedNote' : '')

    const dragVert = ((movingVisit && movingVisit.appointmentId) !== appointment.appointmentId) && currentTime >= parseInt(moment().subtract(1, 'week').format("x")) && (
        <p onMouseDown={(e) => {
            e.preventDefault();
            dispatch(appointmentActions.togglePayload({
                minTextAreaHeight,
                maxTextAreaHeight,
                textAreaId,
                currentTarget: e.currentTarget,
                changingVisit: {...appointment, staffId: workingStaffElement.staffId},
                changingPos: e.pageY,
                offsetHeight: document.getElementById(textAreaId).offsetHeight
            }));
        }} style={{
            cursor: 'ns-resize',
            height: '8px',
            position: 'absolute',
            bottom: -(resultTextAreaHeight - 5) + 'px',
            width: '100%',
            zIndex: 9990
        }}>
            {!!resultTextAreaHeight && <span className="drag-vert"/>}
        </p>
    );


    if (isMobile || appointment.coappointment) {
        return <div style={{display: 'block', width: '100%', overflow: 'visible', position: 'relative'}}>
            <div className={wrapperClassName}>{content}</div>
            {dragVert}
        </div>
    }

    return <div style={{display: 'block', width: '100%', overflow: 'visible', position: 'relative'}}>
        <Box
            moveVisit={moveVisit}
            appointmentId={appointment.appointmentId}
            dragVert={dragVert}
            startMoving={() => startMovingVisit(appointment, totalDuration, workingStaffElement.staffId, appointment.appointmentId)}
            content={content}
            wrapperClassName={wrapperClassName}
        />
        {appointment.appointmentId && dragVert}
    </div>
}

function mapStateToProps(state) {
    const {
        company,
        calendar: {
            appointments,
            reservedTime,
            isClientNotComeLoading
        },
        staff: {timetable, staff},
        appointment: {
            blickClientId,
            movingVisit,
            selectedNote,
            isStartMovingVisit,
            draggingAppointmentId
        },
        cell: {selectedDays}
    } = state;

    return {
        company,
        staff,
        appointments,
        reservedTime,
        timetable,
        isClientNotComeLoading,
        blickClientId,
        movingVisit,
        selectedNote,
        isStartMovingVisit,
        draggingAppointmentId,
        selectedDays
    }
}

export default connect(mapStateToProps)(CellAppointment);
