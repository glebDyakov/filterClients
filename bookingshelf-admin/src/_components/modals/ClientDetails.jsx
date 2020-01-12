import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';
import moment from "moment";
import {access} from "../../_helpers/access";
import {calendarActions, clientActions} from "../../_actions";

class ClientDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            client: props.client,
            defaultClientsList:  props.client,
            allPrice: 0,
            search: false,
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.goToPageCalendar = this.goToPageCalendar.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.clientId && (this.props.clientId !== newProps.clientId)) {
            this.props.dispatch(clientActions.getActiveClient(this.props.clientId));

            let allPrice = 0;
            newProps.client.appointments.forEach((appointment) => {
                if (appointment.appointmentTimeMillis <= moment().format('x')) {
                    allPrice += appointment.price
                }
            });
            this.setState({...this.state, client:newProps.client, defaultClientsList: newProps.client, allPrice: allPrice });
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

    goToPageCalendar(appointment, appointmentStaffId){
        $('.client-detail').modal('hide')
        const { appointmentId, appointmentTimeMillis } = appointment

        const url = "/page/" + appointmentStaffId + "/" + moment(appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY')
        this.props.history.push(url);

        this.props.dispatch(calendarActions.setScrollableAppointment(appointmentId))
    }

    render() {
        const {client, defaultClientsList}=this.state;
        const {editClient, services, staff}=this.props;

        return (

            <div className="modal fade client-detail">

                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
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
                                        {access(4) && (
                                            <React.Fragment>
                                                <span className="email-user">{client.email}</span>
                                                <span>{client.phone}</span>
                                            </React.Fragment>
                                        )}
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
                                <p className="pl-4 pr-4">Список визитов</p> : <p className="pl-4 pr-4">Нет визитов</p>
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

                                        const activeService = services && services.servicesList.find(service => service.serviceId === appointment.serviceId)
                                        const activeAppointmentStaff = staff && staff.staff && staff.staff.find(staffItem => staffItem.staffId === appointment.staffId);

                                        return(
                                            <div style={{
                                                paddingTop: '4px',
                                                cursor: 'pointer',
                                                borderBottom: '10px solid rgb(245, 245, 246)'
                                            }} className="visit-info row pl-4 pr-4 mb-2"
                                                 onClick={() => this.goToPageCalendar(appointment, appointment.staffId)}
                                            >
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
    const { alert, services, calendar, staff} = state;
    return {
        alert, services, calendar, staff
    };
}

ClientDetails.propTypes ={
    client: PropTypes.object,
    editClient: PropTypes.func
};

const connectedApp = connect(mapStateToProps)(withRouter(ClientDetails));
export { connectedApp as ClientDetails };
