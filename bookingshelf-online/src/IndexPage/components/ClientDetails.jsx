import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import moment from "moment";
import {staffActions} from "../../_actions";
import './ClientDetails.scss'
import '../../../public/css/bootstrap.css'


class ClientDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            client: null,
            defaultClientsList: null,
            allPrice: 0,
            search: false,
            allVisits: false
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.goToPageCalendar = this.goToPageCalendar.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company))
    }

    componentWillReceiveProps(newProps) {
        if (newProps.staff.clients && (newProps.staff.appointment || (newProps.staff.newAppointment && newProps.staff.newAppointment[0]))) {
            const id = (newProps.staff.appointment && newProps.staff.appointment.clientId) || (newProps.staff.newAppointment && newProps.staff.newAppointment[0] && newProps.staff.newAppointment[0].clientId)
            const client = newProps.staff.clients.find(item => item.clientId === id);
            this.setState({ client, defaultClientsList: client });
            if (client) {
                let allPrice = 0;
                client.appointments.forEach((appointment) => allPrice += appointment.priceFrom);
                this.setState({ allPrice: allPrice });
            }
        }
    }

    handleSearch () {
        const {defaultClientsList}= this.state;

        const searchClientList=defaultClientsList.appointments.filter((item)=>{
            return item.serviceName.toLowerCase().includes(this.search.value.toLowerCase())
        });

        this.setState({
            search: true,
            client: {...this.state.client ,appointments: searchClientList}
        });

        if(this.search.value===''){
            this.setState({
                search: true,
                client: defaultClientsList
            })
        }
    }

    goToPageCalendar(appointment, appointmentStaffId) {
        const {appointmentId, appointmentTimeMillis} = appointment

        const url = "/online-page/" + appointmentStaffId + "/" + moment(appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY') + '/' + appointmentId
        location.href = url
        //this.props.history.push(url);
    }




    render() {
        const {client, defaultClientsList, allVisits}=this.state;

        return (

            <div style={{  marginBottom: '20px'}} className="client-detail">

                    <div>
                        <div className="">
                            <div className="modal-header">
                                <h4 className="modal-title">Информация о клиенте</h4>
                                <button type="button" className="close" data-dismiss="modal"></button>
                                {/*<div className="close"></div>*/}
                                {/*<img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" data-dismiss="modal"/>*/}
                            </div>
                            <div className="client-info content-pages-bg">
                                {client &&
                                <div className="clients-list pt-4 pl-4 pr-4">
                                    <div className="client">
                                        <span className="abbreviation">{client.firstName && client.firstName.substr(0, 1)}</span>
                                        <span className="name_container">{client.firstName} {client.lastName}
                                            <span className="email-user">{client.email}</span>
                                            <span>{client.phone}</span>
                                        </span>

                                    </div>
                                    <div className="row">
                                        <div className="col-6" style={{textAlign:'center'}}>
                                            <strong>{defaultClientsList.appointments.length} </strong><br/>
                                            <span className="gray-text">Всего визитов</span>
                                        </div>
                                        <div className="col-6"  style={{textAlign:'center'}}>
                                            <strong>{this.state.allPrice} {defaultClientsList.appointments[0] && defaultClientsList.appointments[0].currency}</strong><br/>
                                            <span className="gray-text">Всего оплачено</span>
                                        </div>
                                    </div>
                                </div>
                                }
                                <hr className="gray"/>
                                {client && client.appointments && client.appointments.length!==0 ?
                                    <p className="pl-4 pr-4 mb-2">Список визитов</p> : <p className="pl-4 pr-4">Нет визитов</p>
                                }

                                {(defaultClientsList && defaultClientsList.appointments && defaultClientsList.appointments.length!==0 && defaultClientsList!=="" &&
                                        <div className="row align-items-center content clients mb-2 search-block">
                                            <div className="search col-7">
                                                <input type="search" placeholder="Введите название услуги"
                                                       aria-label="Search" ref={input => this.search = input} onChange={this.handleSearch}/>
                                                <button className="search-icon" type="submit"/>
                                            </div>
                                        </div>
                                    )}

                                <div className="visit-info-wrapper">
                                    {client && client.appointments && client.appointments
                                        .filter(appointment => appointment.id===client.id)
                                        .sort((a, b) => b.appointmentTimeMillis - a.appointmentTimeMillis)
                                        .map((appointment)=>{

                                        return(
                                        <div onClick={() => this.goToPageCalendar(appointment, appointment.staffId)} className="visit-info row mx-2 mb-2">
                                            <div className="col-9">
                                                <p className={appointment.appointmentTimeMillis > moment().format('x')?"blue-bg":"gray-bg"}>
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
                        </div>
                    </div>

            </div>

        )
    }
}

function mapStateToProps(state) {
    const { staff} = state;
    return {
        staff
    };
}

const connectedApp = connect(mapStateToProps)(withRouter(ClientDetails));
export { connectedApp as ClientDetails };
