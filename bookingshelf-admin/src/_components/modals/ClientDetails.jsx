import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';
import { access } from '../../_helpers/access';
import { calendarActions, clientActions } from '../../_actions';

class ClientDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      client: {},
      defaultAppointmentsList: [],
      allPrice: 0,
      search: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.goToPageCalendar = this.goToPageCalendar.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.updateClients = this.updateClients.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.clientId && (this.props.clientId !== newProps.clientId)) {
      this.props.dispatch(clientActions.getActiveClient(newProps.clientId));
      this.props.dispatch(clientActions.getActiveClientAppointments(newProps.clientId, 1));
    }
    if (newProps.client.activeClientAppointments || newProps.client.activeClient) {
      let allPrice = 0;
      newProps.client.activeClientAppointments && newProps.client.activeClientAppointments.forEach((appointment) => {
        allPrice += appointment.price;
      });
      this.setState({
        allPrice,
        client: {
          ...this.state.client,
          ...newProps.client.activeClient,
          appointments: newProps.client.activeClientAppointments,
        },
        defaultAppointmentsList: newProps.client.activeClientAppointments,
      });
    }
  }

  handlePageClick(data) {
    const { selected } = data;
    const currentPage = selected + 1;
    this.updateClients(currentPage);
  };

  updateClients(currentPage = 1) {
    let searchValue = '';
    if (this.search.value.length >= 3) {
      searchValue = this.search.value.toLowerCase();
    }

    this.props.dispatch(clientActions.getActiveClientAppointments(this.props.clientId, currentPage, searchValue));
  }

  handleSearch() {
    const { defaultAppointmentsList }= this.state;

    const searchClientList=defaultAppointmentsList.filter((item)=>{
      return item.serviceName.toLowerCase().includes(this.search.value.toLowerCase());
    });

    this.setState({
      search: true,
      client: { ...this.state.client, appointments: searchClientList },
    });
    // if (this.search.value.length >= 3) {
    //     this.updateClients();
    // } else if (this.search.value.length === 0) {
    //     this.updateClients();
    // }
  }

  goToPageCalendar(appointment, appointmentStaffId) {
    $('.client-detail').modal('hide');
    const { appointmentId, appointmentTimeMillis } = appointment;

    const url = '/page/' + appointmentStaffId + '/' + moment(appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY');
    this.props.history.push(url);

    this.props.dispatch(calendarActions.setScrollableAppointment(appointmentId));
  }

  render() {
    const { client, defaultAppointmentsList }=this.state;
    const { editClient, services, staff, company, wrapper = 'client-detail' }=this.props;
    const companyTypeId = company.settings && company.settings.companyTypeId;

    return (

      <div className={'modal fade ' + (wrapper)}>

        <div className={'modal-dialog modal-lg modal-dialog-centered'}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Информация о клиенте</h4>
              <button type="button" className="close" data-dismiss="modal"></button>
            </div>
            <div className="client-info content-pages-bg">
              {client &&
                            <div className="clients-list">

                              <div className="row align-items-center all-visits-container">
                                <div className="col-6 all-visits" style={{ textAlign: 'center' }}>
                                  <strong>{defaultAppointmentsList.length} </strong><br/>
                                  <span className="gray-text">Всего визитов</span>
                                </div>
                                <div className="col-6 all-visits" style={{ textAlign: 'center' }}>
                                  <strong>{Math.floor(this.state.allPrice * 100) / 100 } {defaultAppointmentsList[0] && defaultAppointmentsList[0].currency}</strong><br/>
                                  <span className="gray-text">Сумма визитов</span>
                                </div>
                              </div>
                            </div>
              }
              <hr className="gray"/>
              {client && client.appointments && client.appointments.length!==0 ?
                '' : <p className="not-visits">Нет визитов</p>
              }

              {/* {(defaultAppointmentsList && defaultAppointmentsList.length!==0 && defaultAppointmentsList!=="" &&*/}
              {/*        <div className="row align-items-center content clients search-block">*/}
              {/*            <div className="search col-7">*/}
              {/*                <input type="search" placeholder="Введите название услуги"*/}
              {/*                       aria-label="Search" ref={input => this.search = input} onChange={this.handleSearch}/>*/}
              {/*                <button className="search-icon" type="submit"/>*/}
              {/*            </div>*/}
              {/*        </div>*/}
              {/*    )}*/}

              <div className="visit-info-wrapper">
                {client && client.appointments && client.appointments
                  .filter((appointment) => appointment.id===client.id)
                  .sort((a, b) => b.appointmentTimeMillis - a.appointmentTimeMillis)
                  .map((appointment)=>{
                    const activeService = services && services.servicesList.find((service) => service.serviceId === appointment.serviceId);
                    const activeAppointmentStaff = staff && staff.staff && staff.staff.find((staffItem) => staffItem.staffId === appointment.staffId);

                    return (
                      <div className="visit-info row d-flex justify-content-between align-items-center"
                        onClick={() => this.goToPageCalendar(appointment, appointment.staffId)}
                      >
                        <div className="col-9 col-sm-8">
                          <p className="visit-detail">
                            <span className="timing"><strong>Время: </strong>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dd, DD MMMM YYYY, HH:mm')}</span>
                            <span className="staff-name"><strong>{(companyTypeId === 2 || companyTypeId === 3) ? 'Рабочее место' : 'Сотрудник'}: </strong>{appointment.staffName}</span>
                            <span className="service"
                              style={{ fontSize: '13px' }}>{appointment.serviceName}</span>
                            {(activeService && activeService.details) ?
                              <span className="service">{activeService.details}</span> : ''}
                            {appointment.description ? <span
                              className="visit-description service">Заметка: {appointment.description}</span> : ''}
                            {appointment.clientNotCome ? <span className="visit-description" style={{ color: '#F46A6A' }}>Клиент не пришел</span> : ''}
                            <span className="price">Цена: {appointment.priceFrom !== appointment.priceTo ? appointment.priceFrom + ' - ' + appointment.priceTo : Math.floor(appointment.price * 100) / 100} {appointment.currency}</span>

                          </p>


                        </div>

                        <div style={{ padding: 0, textAlign: 'center' }} className="col-3 d-flex flex-column justify-content-center align-items-center">
                          {
                            activeAppointmentStaff && activeAppointmentStaff.staffId &&
                                                        <div style={{ position: 'static' }} className="img-container">
                                                          <img style={{ width: '70px', height: '70px' }} className="rounded-circle"
                                                            src={activeAppointmentStaff.imageBase64?'data:image/png;base64,'+activeAppointmentStaff.imageBase64:`${process.env.CONTEXT}public/img/avatar.svg`} alt=""/>
                                                          {/* <span className="staff-name">{activeStaffCurrent.firstName+" "+(activeStaffCurrent.lastName ? activeStaffCurrent.lastName : '')}</span>*/}
                                                        </div>
                          }

                          <span className="gray-text duration">{moment.duration(parseInt(appointment.duration), 'seconds').format('h[ ч] m[ мин]')}</span>


                        </div>


                      </div>
                    );
                  },
                  )}
              </div>

              <span className="closer"/>
            </div>
            <div className="buttons">
              <button type="button" className="button" data-toggle="modal"
                data-target=".new-client" onClick={()=> {
                  $('.client-detail').modal('hide');
                  $('.header-client-detail').modal('hide');
                  editClient(client);
                }}>Редактировать клиента
              </button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  const { alert, services, calendar, staff, client, company } = state;
  return {
    alert, services, calendar, staff, client, company,
  };
}

ClientDetails.propTypes ={
  client: PropTypes.object,
  editClient: PropTypes.func,
};

const connectedApp = connect(mapStateToProps)(withRouter(ClientDetails));
export { connectedApp as ClientDetails };
