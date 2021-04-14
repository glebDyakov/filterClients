import React from 'react';
import { connect } from 'react-redux';
import { appointmentActions } from '../../../../_actions';
import { withTranslation } from 'react-i18next';
import { access } from '../../../../_helpers/access';

class CellAppointmentArea extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleMouseDown(e) {
    e.preventDefault();

    const { dispatch, minTextAreaHeight, maxTextAreaHeight, textAreaId, appointment, workingStaffElement } = this.props;

    dispatch(appointmentActions.togglePayload({
      minTextAreaHeight,
      maxTextAreaHeight,
      textAreaId,
      currentTarget: e.currentTarget,
      changingVisit: { ...appointment, staffId: workingStaffElement.staffId },
      changingPos: e.pageY,
      offsetHeight: document.getElementById(textAreaId).offsetHeight,
    }));
  }

  render() {
    const {
      isWeekBefore, appointment, textAreaId, minTextAreaHeight, maxTextAreaHeight, clientAppointmentsCount,
      resultTextAreaHeight, services, movingVisit, totalAmount, toggleSelectedNote, t, appointmentServices
    } = this.props;

    const dragVert = appointment.appointmentId &&
      ((movingVisit && movingVisit.appointmentId) !== appointment.appointmentId) && isWeekBefore && (
        <p onMouseDown={this.handleMouseDown} className="drag-vert-wrapper">
          {/*<span className="drag-vert"/>*/}
        </p>
      );
    const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;


    const countAppointmentsText = () => {
      if (clientAppointmentsCount >= 2 && clientAppointmentsCount <= 4) {
        return 'визита сегодня';
      } else {
        return 'визитов сегодня';
      }
    };

    return (
      <React.Fragment>
        <p
          id={textAreaId}
          onClick={toggleSelectedNote}
          className={`notes-container ${appointment.color.toLowerCase() + '-color'}`}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            minHeight: minTextAreaHeight + 'px',
            maxHeight: maxTextAreaHeight + 'px',
            height: resultTextAreaHeight + 'px',
            padding: (resultTextAreaHeight === 0 ? '0px' : ''),
          }}
        >
          <span className="notes-container-message" style={{
            height: resultTextAreaHeight + 'px',
          }}>
            <span style={{ alignItems: "flex-start" }} className="client-name w-100 d-flex justify-content-between">
              <span style={{ wordBreak: "normal" }} className="client-name">
                {appointment.clientFirstName
                  ? (appointment.clientFirstName +
                    (appointment.clientLastName ? ` ${appointment.clientLastName}` : ''))
                  : t('Без клиента')}


              </span>

              <span style={{ width: '46%', display: "flex", justifyContent: "flex-end" }}
                className="text-right client-name">{totalAmount} {appointment.currency}
                {clientAppointmentsCount > 1 &&
                  <img title={`${companyTypeId === 4 ? t('У пациента') : t('У клиента')} ${clientAppointmentsCount} ${t(countAppointmentsText())}`}
                    className="appointment-body-icon" src={`${process.env.CONTEXT}public/img/appointment_body.svg`}
                    alt="" />}</span>
            </span>
            {access(12) && appointment.clientId && appointment.clientPhone &&
              <span className="client-phone">{appointment.clientPhone}</span>}

            <ul>
              {appointmentServices.map((service, i) => {
                const details = services && services.servicesList &&
                (services.servicesList.find((service) => service.serviceId === appointment.serviceId) || {}).details;                
                return (
                  <li key={"service" + service.serviceId + i} className="service">{service.serviceName} {details ? `(${details})` : ''}</li>
                );
              })
              }
            </ul>
            {appointment.description.length > 0 &&
              <p className="service client-name">{t('Заметка')}: {appointment.description}</p>}
            {/* {('\nЦена: ' + totalPrice + ' ' + appointment.currency)} ${totalPrice !== totalAmount
            ? ('(' + totalAmount.toFixed(2) + ' ' + appointment.currency + ')') : ''} ${appointment.description
            ? `\nЗаметка: ${appointment.description}` : ''}`;*/}

          </span>
        </p>
        {access(15) && dragVert}
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  const {
    services,
    company,
    appointment: {
      movingVisit,
    },
  } = state;

  return {
    services,
    movingVisit,
    company
  };
}

export default connect(mapStateToProps)(withTranslation("common")(CellAppointmentArea));
