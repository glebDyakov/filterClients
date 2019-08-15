import React from 'react';
import { connect } from 'react-redux';
import moment from "moment";

// import PropTypes from 'prop-types';

class AppointmentFromSocket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.appointmentSocketMessageFlag) {
            $(".modal-backdrop ").css("display", "none")
        }
    }


    render() {
        const {appointmentSocketMessageFlag, appointmentSocketMessage, closeAppointmentFromSocket, staff, client} = this.props;
        const {payload} = this.props.appointmentSocketMessage;

        const activeStaff = payload && payload.staffId &&  staff && staff.staff && staff.staff.find(item => {
            return((item.staffId) === (payload.staffId));});

        const activeClient = payload && payload.clientId && client && client.client && client.client.find(item => {
            return((item.clientId) === (payload.clientId));});

        let socketTitle, socketFooterText;

        switch (appointmentSocketMessage && appointmentSocketMessage.wsMessageType) {
            case "APPOINTMENT_CREATED":
                socketTitle = "НОВАЯ ЗАПИСЬ";
                socketFooterText = "Просмотреть запись"
                break;
            case "APPOINTMENT_DELETED":
                socketTitle = `ОТМЕНЕНО ${payload.canceledOnline ? 'КЛИЕНТОМ' : 'СОТРУДНИКОМ'}`
                socketFooterText = (payload && payload.canceledOnline ? 'Удален клиентом' : 'Удален сотрудником')
                break
            case "APPOINTMENT_MOVED":
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
                            <button className="close" onClick={()=>closeAppointmentFromSocket()}></button>
                        </div>
                        <p className="service_name"><strong>
                            {payload && payload.serviceName}
                        </strong></p>
                        <p style={{float: "none"}} ><strong>Мастер: </strong>
                            {payload && payload.staffName}
                        </p>

                        <p><strong>Клиент: </strong>
                            {payload && payload.clientName}
                        </p>
                        {activeClient && activeClient.phone && <p><strong>Телефон: </strong> {activeClient.phone}</p>}
                        <p className="service_time">
                            <strong style={{textTransform: 'capitalize'}}>Время: </strong>
                            {payload && moment(payload.appointmentTimeMillis, 'x').locale('ru').format('DD MMMM YYYY, HH:mm')}
                        </p>
                        <p style={{color: "#3E90FF"}}>{socketFooterText}</p>

                    </div>
                </div>

            </div>
        )
    }


}

function mapStateToProps(state) {
    const {staff, client  } = state;
    return {staff, client};
}


const connectedApp = connect(mapStateToProps)(AppointmentFromSocket);
export { connectedApp as AppointmentFromSocket };
