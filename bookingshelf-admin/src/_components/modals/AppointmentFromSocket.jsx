import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { calendarActions, socketActions } from '../../_actions';
import { withRouter } from 'react-router';
import {compose} from "redux";
import {withTranslation} from "react-i18next";

// import PropTypes from 'prop-types';

class AppointmentFromSocket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.goToPageCalendar = this.goToPageCalendar.bind(this);
    this.closeAppointmentFromSocket = this.closeAppointmentFromSocket.bind(this);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.appointmentSocketMessageFlag) {
      $('.modal-backdrop ').css('display', 'none');
    }
  }

  goToPageCalendar(appointment, appointmentStaffId, wsMessageType) {
    const { staffId, roleId } = this.props.authentication.user.profile;
    const { appointmentId, appointmentTimeMillis } = appointment;

    const url = '/page/' + appointmentStaffId + '/' + moment(appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY');
    this.props.history.push(url);

    if (wsMessageType === 'APPOINTMENT_CREATED') {
      const params = {};
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
      this.props.dispatch(calendarActions.updateAppointment(appointmentId, JSON.stringify({
        moved: false,
        approved: true,
      })));
    }
    this.props.dispatch(calendarActions.setScrollableAppointment(appointmentId));
    this.closeAppointmentFromSocket();
  }


  closeAppointmentFromSocket() {
    $('.appointment-socket-modal ').addClass('appointment-socket-modal-go-away');
    setTimeout(() => {
      this.props.dispatch(socketActions.alertSocketMessage(null));
      $('.appointment-socket-modal ').removeClass('appointment-socket-modal-go-away');
    }, 2000);
  }

  render() {
    const { socket, appointmentSocketMessage, staff, client, company, t } = this.props;


    if (!socket.appointmentSocketMessage) {
      return null;
    }
    const companyTypeId = company.settings && company.settings.companyTypeId;
    const { payload: payloadFromProps, wsMessageType } = this.props.socket.appointmentSocketMessage;

    const payload = Array.isArray(payloadFromProps) ? payloadFromProps[0] : payloadFromProps;

    const activeStaff = payload && payload.staffId && staff && staff.staff && staff.staff.find((item) => {
      return ((item.staffId) === (payload.staffId));
    });

    const activeClient = payload && payload.clientId && client && client.client && client.client.find((item) => {
      return ((item.clientId) === (payload.clientId));
    });

    let socketTitle; let socketFooterText; let clientName; let staffName;

    switch (wsMessageType) {
      case 'APPOINTMENT_CREATED':
        staffName = payload && payload.staffName;
        clientName = payload && payload.clientId ? `${payload.clientFirstName} ${(payload.clientLastName ? payload.clientLastName : '')}` : '';
        socketTitle = payload && payload.online ? t('Онлайн-запись') : t('Запись в журнал');
        socketFooterText = t('Просмотреть запись');
        break;
      case 'APPOINTMENT_DELETED':
        staffName = `${activeStaff ? activeStaff.firstName : ''} ${activeStaff.lastName ? activeStaff.lastName : ''}`;
        clientName = payload && payload.clientId ? `${payload.clientFirstName} ${(payload.clientLastName ? payload.clientLastName : '')}` : '';
        socketTitle = `${t("Отменено")} ${payload.canceledOnline ? t('клиентом') : t('сотрудником')}`;
        socketFooterText = (payload && payload.canceledOnline ? t('Удален клиентом') : t('Удален сотрудником'));
        break;
      case 'APPOINTMENT_MOVED':
        staffName = payload && payload.staffName;
        clientName = payload && payload.clientId ? `${payload.clientFirstName} ${(payload.clientLastName ? payload.clientLastName : '')}` : '';
        socketTitle = t('Запись перенесена');
        socketFooterText = t('Просмотреть запись');
        break;
      default:
    }

    return (
      <div className="appointment-socket-modal">
        <div className="service_item">
          <div className="img-container">
            <img
              src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
              className="img"/>
            <p style={{ float: 'none' }}>{t("Мастер")}: <br/>
              {staffName}
            </p>
          </div>

          <div className="appointment-socket-modal-body">
            <div className="appointment-socket-modal-title" style={{ position: 'relative' }}>
              <p>{socketTitle}</p>
              <button className="close" onClick={this.closeAppointmentFromSocket}/>
            </div>
            <p className="service_name">
              {payload && payload.serviceName}
            </p>


            {clientName
              ? <p>{t("Клиент")}: {clientName}</p>
              : <p>{t("Без клиента")}</p>}
            {companyTypeId === 2 && payload && payload.carBrand
                            && <p style={{ textDecoration: 'underline' }}><strong>{t("Марка авто")}: </strong>
                              {payload.carBrand}
                            </p>
            }
            {companyTypeId === 2 && payload && payload.carNumber
                            && <p style={{ textDecoration: 'underline' }}><strong>{t("Гос номер")}: </strong>
                              {payload.carNumber}
                            </p>
            }
            {activeClient && activeClient.phone && <p><strong>{t("Телефон")}: </strong> {activeClient.phone}</p>}
            <p className="service_time">
              <span style={{ textTransform: 'capitalize' }}>{t("Время")}: </span>
              {payload && moment(payload.appointmentTimeMillis, 'x').locale('ru').format('DD MMMM YYYY, HH:mm')}
            </p>
            <p onClick={() => {
              if (socketFooterText === t('Просмотреть запись')) {
                this.goToPageCalendar(payload, payload.staffId, wsMessageType);
              }
            }}
            className="service_go"
            style={{
              cursor: (socketFooterText === t('Просмотреть запись') ? 'pointer' : 'default'),
            }}>{socketFooterText} → </p>

          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { staff, client, socket, authentication, company } = state;
  return { staff, client, socket, authentication, company };
}


export default compose(connect(mapStateToProps), withRouter, withTranslation("common"))(AppointmentFromSocket);

