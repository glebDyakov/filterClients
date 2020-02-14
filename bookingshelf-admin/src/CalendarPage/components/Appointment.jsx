import React, {Component} from 'react';
import { connect } from 'react-redux';

import { appointmentActions, calendarActions } from "../../_actions";
import {access} from "../../_helpers/access";

import moment from 'moment';

class Appointment extends Component {
    constructor(props) {
        super(props);
        this.toggleSelectedNote = this.toggleSelectedNote.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    toggleSelectedNote(selectedNote) {
        this.props.dispatch(appointmentActions.toggleSelectedNote(selectedNote));
    }

    handleMouseEnter(clientId) {
        if (clientId) {
            this.props.dispatch(appointmentActions.toggleBlickedClientId(clientId))
        }
    }

    handleMouseLeave(clientId) {
        if (clientId) {
            this.props.dispatch(appointmentActions.toggleBlickedClientId(null))
        }
    }

    render() {
        const {
            key,
            appointment,
            blickClientId,
            isStartMovingVisit,
            currentTime,
            numbers,
            selectedNote,
            isClientNotComeLoading,
            workingStaffElement,
            totalDuration,
            totalCount,
            totalPrice,
            totalAmount,
            resultTextAreaHeight,
            currentAppointments,
            appointmentServices,
            handleUpdateClient,
            services,
            startMovingVisit,
            changeTime,
            updateAppointmentForDeleting
        } = this.props;

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
        const resultTextArea = `${appointment.clientName ? ('Клиент: ' + appointment.clientName) + '\n' : ''}${appointment.serviceName} ${serviceDetails ? `(${serviceDetails})` : ''} ${extraServiceText} ${('\nЦена: ' + totalPrice + ' ' + appointment.currency)} ${totalPrice !== totalAmount ? ('(' + totalAmount + ' ' + appointment.currency + ')') : ''} ${appointment.description ? `\nЗаметка: ${appointment.description}` : ''}`;

        return (
            <div
                onMouseEnter={() => this.handleMouseEnter(appointment.clientId)}
                onMouseLeave={() => this.handleMouseLeave(appointment.clientId)}
                className={"cell notes " + appointment.appointmentId + " " + appointment.color.toLowerCase() + "-color " + (parseInt(moment(currentTime + appointment.duration * 1000 ).format("H")) >= 20 && 'notes-bottom' + ' ' + (parseInt(moment(currentTime).format("H")) === 23 && ' last-hour-notes'))
                + (appointment.appointmentId === selectedNote ? ' selected hovered' : '')
                + (blickClientId === appointment.clientId ? ' custom-blick-div' : '')
                }
                key={appointment.appointmentId + "_" + key}
                id={appointment.appointmentId + "_" + workingStaffElement.staffId + "_" + appointment.duration + "_" + appointment.appointmentTimeMillis + "_" + moment(appointment.appointmentTimeMillis, 'x').add(appointment.duration, 'seconds').format('x')}
            >
                <p className="notes-title" onClick={()=> this.toggleSelectedNote(appointment.appointmentId === selectedNote ? null : appointment.appointmentId)}>
                                                <span className="delete"
                                                      data-toggle="modal"
                                                      data-target=".delete-notes-modal"
                                                      title="Отменить встречу"
                                                      onClick={() => updateAppointmentForDeleting({
                                                          ...appointment,
                                                          staffId: workingStaffElement.staffId
                                                      })}/>
                    {!appointment.online &&
                    <span className="pen"
                          title="Запись через журнал"/>}
                    {/*<span className="men"*/}
                    {/*title="Постоянный клиент"/>*/}
                    {appointment.online &&
                    <span className="globus"
                          title="Онлайн-запись"/>}



                    {appointment.clientId && <span
                        className={`${appointment.regularClient? 'old' : 'new'}-client-icon`}
                        title={appointment.regularClient ? 'Подтвержденный клиент' : 'Новый клиент'}/>}


                    {!appointment.clientId &&
                    <span
                        className="no-client-icon"
                        title="Визит от двери"/>
                    }

                    {!!appointment.discountPercent &&
                    <span className="percentage"
                          title={`${appointment.discountPercent}%`}
                    />}

                    {appointment.hasCoAppointments && <span className="super-visit" title="Мультивизит"/>}
                    <span className="service_time">
                                                    {appointment.clientNotCome && <span className="client-not-come" title="Клиент не пришел"/>}
                        {moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')} -
                        {moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}
                                                                            </span>
                </p>
                <p onMouseDown={(e) => e.preventDefault()} id={`${appointment.appointmentId}-textarea-wrapper`} className="notes-container"
                   style={{
                       minHeight: ((currentAppointments.length - 1) ? 20 * (currentAppointments.length - 1) : 2) + "px",
                       height: resultTextAreaHeight + "px"
                   }}>
                                                <span className="notes-container-message">
                                                    {resultTextArea}
                                                </span>
                </p>
                {!isStartMovingVisit && <div onMouseDown={(e) => e.preventDefault()} className="cell msg-client-info">
                    <div className="cell msg-inner">
                        <p>
                            <p className="new-text">Запись</p>
                            <button type="button" onClick={()=> {
                                this.toggleSelectedNote(null)
                                this.props.dispatch(calendarActions.toggleStartMovingVisit(false))
                            }} className="close" />
                        </p>


                        {appointment.clientId && <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="client-name-book">
                            <span style={{ textAlign: 'left'}}>Клиент</span>
                            <span
                                className="clientEye clientEye-info"
                                data-target=".client-detail"
                                title="Просмотреть клиента"
                                onClick={(e) => {
                                    $('.client-detail').modal('show')
                                    handleUpdateClient(appointment.clientId)
                                }} />
                        </p>}
                        {appointment.clientId && <p className="name">{appointment.clientName}</p>}
                        {access(12) && appointment.clientId && <p>{appointment.clientPhone}</p>}
                        {appointment.clientId && <p style={{ height: '30px' }}>
                            <div style={{ height: '28px', display: 'flex', justifyContent: 'space-between' }} className="cell check-box calendar-client-checkbox red-text">
                                Клиент не пришел

                                {isClientNotComeLoading ?
                                    <div style={{ margin: '0 0 0 auto', left: '15px' }} className="cell loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>
                                    :
                                    <label>
                                        <input className="form-check-input" checked={appointment.clientNotCome} onChange={()=>this.props.dispatch(calendarActions.updateAppointmentCheckbox(appointment.appointmentId, JSON.stringify({ clientNotCome: !appointment.clientNotCome } )))}
                                               type="checkbox"/>
                                        <span style={{ width: '20px', margin: '-3px 0 0 11px'}} className="check" />
                                    </label>
                                }
                            </div>
                        </p>}


                        <p className="client-name-book">{appointmentServices.length > 1 ? 'Список услуг' : 'Услуга'}</p>
                        {appointmentServices.map(service => {
                            const details = services && services.servicesList && (services.servicesList.find(service => service.serviceId === appointment.serviceId) || {}).details
                            return <p>

                                {service.serviceName} {details ? `(${details})` : ''}

                                <span style={{display: 'inline-block', textAlign: 'left', fontWeight: 'bold'}}>
                                                            {service.price ? service.price : service.priceFrom} {service.currency} {!!service.discountPercent && <span style={{ display: 'inline', textAlign: 'left', fontWeight: 'bold', color: 'rgb(212, 19, 22)'}}>
                                                                    ({service.totalAmount} {service.currency})
                                                                </span>}
                                                            </span>
                                {!!service.discountPercent && <span style={{ textAlign: 'left', fontSize: '13px', color: 'rgb(212, 19, 22)'}}>{`${(service.discountPercent === (appointment && appointment.clientDiscountPercent)) ? 'Скидка клиента': 'Единоразовая скидка' }: ${service.discountPercent}%`}</span>}


                            </p>
                        })
                        }
                        <p>{moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')} -
                            {moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}</p>
                        <p style={{ fontWeight: 'bold', color: '#000'}}>{workingStaffElement.firstName} {workingStaffElement.lastName ? workingStaffElement.lastName : ''}</p>
                        {appointment.description && <p>Заметка: {appointment.description}</p>}

                        {currentTime >= parseInt(moment().subtract(1, 'week').format("x")) && (
                            <React.Fragment>
                                <div style={{
                                    marginTop: '2px',
                                }}
                                     onClick={() => startMovingVisit(appointment, totalDuration)}
                                     className="cell msg-inner-button-wrapper"
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
                                     className="cell msg-inner-button-wrapper"
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
                                     className="cell msg-inner-button-wrapper"
                                     data-toggle="modal"
                                     data-target=".delete-notes-modal"
                                     onClick={() => updateAppointmentForDeleting({
                                         ...appointment,
                                         staffId: workingStaffElement.staffId
                                     })}
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
        )
    }
}

function mapStateToProps(state) {
    const {
        calendar: { isClientNotComeLoading },
        appointment: {
            blickClientId,
            selectedNote,
        }
    } = state;

    return {
        isClientNotComeLoading,
        blickClientId,
        selectedNote,
    }
}

export default connect(mapStateToProps)(Appointment);
