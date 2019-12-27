import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import moment from "moment";
import config from 'config'
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
        this.goToVisit = this.goToVisit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company))
    }

    componentWillReceiveProps(newProps) {
        if (newProps.staff.clients && ((newProps.staff.appointment && newProps.staff.appointment[0]) || (newProps.staff.newAppointment && newProps.staff.newAppointment[0]))) {
            const id = (newProps.staff.appointment && newProps.staff.appointment[0] && newProps.staff.appointment[0].clientId) || (newProps.staff.newAppointment && newProps.staff.newAppointment[0] && newProps.staff.newAppointment[0].clientId)
            const client = newProps.staff.clients.find(item => item.clientId === id);
            this.setState({ client, defaultClientsList: client });
            if (client) {
                let allPrice = 0;
                client.appointments.forEach((appointment) => allPrice += (appointment.price || appointment.priceFrom));
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

    goToVisit(appointment) {
        const {customId} = appointment

        const url = `https://${config.apiUrl.includes('staging') ? 'staging.' : ''}online-zapis.com` + `/online/visits/${this.props.match.params.company}/${customId}`
        location.href = url
    }

    render() {
        const { staff } = this.props;
        const {client, defaultClientsList, allVisits}=this.state;

        return (
            <div style={{  marginBottom: '20px'}} className="client-detail">
                    <div>
                        <div className="">
                            <div className="modal-header"></div>
                            <div className="client-info content-pages-bg">
                                {client &&
                                <div className="clients-list pt-4 pl-4 pr-4">
                                    {/*<div className="client">*/}
                                    {/*    <span className="abbreviation">{client.firstName && client.firstName.substr(0, 1)}</span>*/}
                                    {/*    <span className="name_container">{client.firstName} {client.lastName}*/}
                                    {/*        <span className="email-user">{client.email}</span>*/}
                                    {/*        <span>{client.phone}</span>*/}
                                    {/*    </span>*/}

                                    {/*</div>*/}
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
                                            const activeService = staff && staff.services && staff.services.find(service => service.serviceId === appointment.serviceId)
                                            const activeAppointmentStaff = staff && staff.staff && staff.staff.find(staffItem => staffItem.staffId === appointment.staffId);

                                            return(
                                                <div style={{
                                                    paddingTop: '4px',
                                                    borderBottom: '10px solid rgb(245, 245, 246)'
                                                }} className="visit-info row pl-4 pr-4 mb-2">
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }} className="col-9">
                                                        <p className="visit-detail">
                                                            <span style={{whiteSpace: 'normal'}}><strong>Время: </strong>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dd, DD MMMM YYYY, HH:mm')}</span>
                                                            <span style={{
                                                                whiteSpace: 'normal',
                                                                fontSize: '12px'
                                                            }}><strong>Сотрудник: </strong>{appointment.staffName}</span>
                                                            <strong
                                                                style={{fontSize: '13px'}}>{appointment.serviceName}</strong>
                                                            {(activeService && activeService.details) ?
                                                                <span style={{ fontSize: '12px' }}>{activeService.details}</span> : ''}
                                                            {appointment.description ? <span
                                                                className="visit-description">Заметка: {appointment.description}</span> : ''}
                                                        </p>
                                                    </div>

                                                    <div style={{ padding: 0, textAlign: 'right' }} className="col-2">
                                                        {
                                                            activeAppointmentStaff && activeAppointmentStaff.staffId &&
                                                            <div style={{ position: 'static' }} className="img-container">
                                                                <img style={{ width: '50px', height: '50px' }} className="rounded-circle"
                                                                     src={activeAppointmentStaff.imageBase64?"data:image/png;base64,"+activeAppointmentStaff.imageBase64:`${process.env.CONTEXT}public/img/image.png`}  alt=""/>
                                                                {/*<span className="staff-name">{activeStaffCurrent.firstName+" "+(activeStaffCurrent.lastName ? activeStaffCurrent.lastName : '')}</span>*/}
                                                            </div>
                                                        }

                                                        <span className="gray-text">{moment.duration(parseInt(appointment.duration), "seconds").format("h[ ч] m[ мин]")}</span>

                                                        <br />

                                                        <strong style={{fontSize: '12px'}}>{appointment.priceFrom !== appointment.priceTo ? appointment.priceFrom + " - " + appointment.priceTo : appointment.price} {appointment.currency}</strong>
                                                    </div>
                                                </div>
                                            )}
                                    )}
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
