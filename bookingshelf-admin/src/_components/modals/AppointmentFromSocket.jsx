import React from 'react';
import { connect } from 'react-redux';
import moment from "moment";
import {calendarActions} from "../../_actions";
import {withRouter} from "react-router";

// import PropTypes from 'prop-types';

class AppointmentFromSocket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        this.goToPageCalendar = this.goToPageCalendar.bind(this)

    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.appointmentSocketMessageFlag) {
            $(".modal-backdrop ").css("display", "none")
        }
    }

    goToPageCalendar(appointment, appointmentStaffId, wsMessageType){
        const { staffId, roleId } = this.props.authentication.user.profile
        const { appointmentId, appointmentTimeMillis } = appointment

        const url = "/page/" + appointmentStaffId + "/" + moment(appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY')
        this.props.history.push(url);

        if (wsMessageType === 'APPOINTMENT_CREATED') {
            const params = {}
            if (staffId !== appointmentStaffId) {
                params.approved = false;
                params.adminApproved = true;
            } else if (roleId === 3 || roleId === 4) {
                params.approved = true;
                params.adminApproved = true;
            } else {
                params.approved = true;

            }

            this.props.dispatch(calendarActions.approveAppointment(appointmentId, params));
        } else if (wsMessageType === 'APPOINTMENT_MOVED') {
            this.props.dispatch(calendarActions.updateAppointment(appointmentId, JSON.stringify({ moved: false, approved: true })))
        }
        this.props.dispatch(calendarActions.setScrollableAppointment(appointmentId))
        this.props.closeAppointmentFromSocket()
    }

    render() {
        const {socket, appointmentSocketMessage, closeAppointmentFromSocket, staff, client} = this.props;
        if (!socket.appointmentSocketMessage) {
            return null
        }

        const { payload: payloadFromProps, wsMessageType } = this.props.socket.appointmentSocketMessage;

        const payload = Array.isArray(payloadFromProps) ? payloadFromProps[0] : payloadFromProps

        const activeStaff = payload && payload.staffId && staff && staff.staff && staff.staff.find(item => {
            return((item.staffId) === (payload.staffId));});

        const activeClient = payload && payload.clientId && client && client.client && client.client.find(item => {
            return((item.clientId) === (payload.clientId));});

        let socketTitle, socketFooterText, clientName, staffName;

        switch (wsMessageType) {
            case "APPOINTMENT_CREATED":
                staffName = payload && payload.staffName
                clientName = payload && payload.clientName
                socketTitle = "НОВАЯ ЗАПИСЬ";
                socketFooterText = "Просмотреть запись"
                break;
            case "APPOINTMENT_DELETED":
                staffName = `${activeStaff ? activeStaff.firstName : ''} ${activeStaff ? activeStaff.lastName : ''}`
                clientName = activeClient ? `${activeClient.firstName} ${activeClient.lastName}` : ''
                socketTitle = `ОТМЕНЕНО ${payload.canceledOnline ? 'КЛИЕНТОМ' : 'СОТРУДНИКОМ'}`
                socketFooterText = (payload && payload.canceledOnline ? 'Удален клиентом' : 'Удален сотрудником')
                break;
            case "APPOINTMENT_MOVED":
                staffName = payload && payload.staffName
                clientName = payload && payload.clientName
                socketTitle = 'ЗАПИСЬ ПЕРЕНЕСЕНА'
                socketFooterText = "Просмотреть запись"
                break;
            default:
        }

        return (
            <div className="appointment-socket-modal">
                <div className="service_item">
                    <div className="img-container" style={{width: "30%"}}>
                    <img src={activeStaff && activeStaff.imageBase64 ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                         className="img"/></div>

                    <div style={{width: "65%"}}>
                        <div className="appointment-socket-modal-title" style={{position:"relative"}}>
                            <p>{socketTitle}</p>
                            <button className="close" onClick={()=>closeAppointmentFromSocket()} />
                        </div>
                        <p className="service_name"><strong>
                            {payload && payload.serviceName}
                        </strong></p>
                        <p style={{float: "none"}} ><strong>Мастер: </strong>
                            {staffName}
                        </p>

                        {clientName
                            ? <p><strong>Клиент: </strong>
                                {clientName}
                              </p>
                            : <p>Без клиента</p>}
                        {activeClient && activeClient.phone && <p><strong>Телефон: </strong> {activeClient.phone}</p>}
                        <p className="service_time">
                            <strong style={{textTransform: 'capitalize'}}>Время: </strong>
                            {payload && moment(payload.appointmentTimeMillis, 'x').locale('ru').format('DD MMMM YYYY, HH:mm')}
                        </p>
                        <p onClick={() => {
                            if (socketFooterText === 'Просмотреть запись') {
                                this.goToPageCalendar(payload, payload.staffId, wsMessageType)
                            }
                        }} style={{color: "#3E90FF", cursor: (socketFooterText === 'Просмотреть запись' ? 'pointer' : 'default')}}>{socketFooterText}</p>

                    </div>
                </div>

            </div>
        )
    }


}

function mapStateToProps(state) {
    const { staff, client, socket, authentication } = state;
    return { staff, client, socket, authentication };
}


const connectedApp = connect(mapStateToProps)(withRouter(AppointmentFromSocket));
export { connectedApp as AppointmentFromSocket };
