import React from 'react';
import pure from 'recompose/pure';
import moment from 'moment';

const AppointmentCell = ({appointment, appointments,workingStaffElement, handleUpdateClient, approveAppointmentSetter,currentTime,key,client}) => {
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
    return (
            <div
                className={currentTime <= moment().format("x")
                && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
            >
                {!appointment[0][0].coAppointmentId && (
                    <div
                        className={"notes " + appointment[0][0].appointmentId + " " + appointment[0][0].color.toLowerCase() + "-color " + (parseInt(moment(currentTime).format("H")) >= 20 && 'notes-bottom')}
                        key={appointment[0][0].appointmentId + "_" + key}
                        id={appointment[0][0].appointmentId + "_" + workingStaffElement.staffId + "_" + appointment[0][0].duration + "_" + appointment[0][0].appointmentTimeMillis + "_" + moment(appointment[0][0].appointmentTimeMillis, 'x').add(appointment[0][0].duration, 'seconds').format('x')}
                    >
                        <p className="notes-title">
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
                        <div className="msg-client-info"
                             ref={(node) => {
                                 if (node && appointment[0][0].hasCoAppointments && (parseInt(moment(currentTime).format("H")) >= 20)) {
                                     node.style.setProperty("top", '-325px', "important");
                                 }
                             }}>
                            {client && client.map((client) => (
                                client.clientId === appointment[0][0].clientId &&
                                <div className="msg-inner">
                                    <p className="new-text">Запись</p>
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
                                            handleUpdateClient(client);


                                        }}>Просмотреть клиента</a>
                                </div>))
                            }
                        </div>
                    </div>
                )}
            </div>

    );
}
export default pure(AppointmentCell);