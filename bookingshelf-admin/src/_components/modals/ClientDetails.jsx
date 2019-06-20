import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from "moment";

class ClientDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            client: props.client,
            allPrice: 0
        };
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, client:newProps.client});
            if (newProps.client) {
                let allPrice = 0;
                newProps.client.appointments.forEach((appointment) => allPrice += appointment.priceFrom);
                this.setState({ allPrice: allPrice });
            }
        }
    }

    render() {
        const {client}=this.state;
        const {editClient}=this.props;

        return (

            <div className="modal fade client-detail">

                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Информация о клиенте</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="client-info content-pages-bg">
                            {client &&
                            <div className="clients-list pt-4 pl-4 pr-4">
                                <div className="client">
                                    <span className="abbreviation">{client.firstName.substr(0, 1)}</span>
                                    <span className="name_container">{client.firstName} {client.lastName}<span
                                        className="email-user">{client.email}</span></span>
                                </div>
                                <div className="row">
                                    <div className="col-6" style={{textAlign:'center'}}>
                                        <strong>{client.appointments.length} </strong><br/>
                                        <span className="gray-text">Всего визитов</span>
                                    </div>
                                    <div className="col-6"  style={{textAlign:'center'}}>
                                        <strong>{this.state.allPrice} {client.appointments[0] && client.appointments[0].currency}</strong><br/>
                                        <span className="gray-text">Всего оплачено</span>
                                    </div>
                                </div>
                            </div>
                            }
                            <hr className="gray"/>
                            {client && client.appointments && client.appointments.length!==0 ?
                                <p className="pl-4 pr-4">Прошлые визиты</p> : <p className="pl-4 pr-4">Нет визитов</p>
                            }
                            <div className="visit-info-wrapper">
                                {client && client.appointments && client.appointments
                                    .filter(appointment => appointment.id===client.id && appointment.appointmentTimeMillis < moment().format('x'))
                                    .sort((a, b) => b.appointmentTimeMillis - a.appointmentTimeMillis)
                                    .map((appointment)=>{

                                    return(
                                    <div className="visit-info row pl-4 pr-4 mb-2">
                                        <div className="col-9">
                                            <p className="gray-bg">
                                                <span className="visit-date">{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('DD MMM')}</span>
                                                <span>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('HH:mm')}</span>
                                            </p>
                                            <p className="visit-detail">
                                                <strong>{appointment.serviceName}</strong>
                                                <span className="gray-text">{moment.duration(parseInt(appointment.duration), "seconds").format("h[ ч] m[ мин]")}</span>
                                            </p>
                                        </div>
                                        <div className="col-3">
                                            <strong>{appointment.priceFrom}{appointment.priceFrom!==appointment.priceTo && " - "+appointment.priceTo}  {appointment.currency}</strong>
                                        </div>
                                    </div>
                                )})}
                            </div>

                            <span className="closer"/>
                        </div>
                        <hr/>
                        <div className="buttons p-4">
                            <button type="button" className="button" data-toggle="modal"
                                    data-target=".new-client"  onClick={()=>editClient(client && client.clientId)}>Редактировать клиента
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

ClientDetails.propTypes ={
    client: PropTypes.object,
    editClient: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(ClientDetails);
export { connectedApp as ClientDetails };