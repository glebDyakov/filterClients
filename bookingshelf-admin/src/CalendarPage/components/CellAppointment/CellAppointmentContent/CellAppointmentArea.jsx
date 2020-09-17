import React from 'react';
import { connect } from 'react-redux';
import { appointmentActions } from '../../../../_actions';
import {withTranslation} from "react-i18next";

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
      isWeekBefore, appointment, textAreaId, minTextAreaHeight, maxTextAreaHeight,
      resultTextAreaHeight, extraServiceText, services, movingVisit, totalAmount, toggleSelectedNote, t
    } = this.props;

    const serviceDetails = services && services.servicesList &&
      (services.servicesList.find((service) => service.serviceId === appointment.serviceId) || {}).details;

    const dragVert = appointment.appointmentId &&
      ((movingVisit && movingVisit.appointmentId) !== appointment.appointmentId) && isWeekBefore && (
      <p onMouseDown={this.handleMouseDown} className="drag-vert-wrapper">
        <span className="drag-vert"/>
      </p>
    );

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
          <span className="notes-container-message">
            <span className="client-name w-100 d-flex justify-content-between">
              <span className="client-name">{appointment.clientFirstName
                  ? (`${t('Клиент')}: ` + appointment.clientFirstName +
                  (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')) + '\n'
                  : t('Без клиента')}</span>
              <span style={{width: "43%"}} className="text-right client-name">{totalAmount} {appointment.currency}</span>
            </span>
            <ul>
              <li className="service">{appointment.serviceName} {serviceDetails ? `(${serviceDetails})` : ''}</li>
            </ul>
            {extraServiceText}
            {appointment.description.length > 0 && <p className="service client-name">{t("Заметка")}: {appointment.description}</p>}
            {/* {('\nЦена: ' + totalPrice + ' ' + appointment.currency)} ${totalPrice !== totalAmount
            ? ('(' + totalAmount.toFixed(2) + ' ' + appointment.currency + ')') : ''} ${appointment.description
            ? `\nЗаметка: ${appointment.description}` : ''}`;*/}

          </span>
        </p>
        {dragVert}
      </React.Fragment>
    );
  };
}

function mapStateToProps(state) {
  const {
    services,
    appointment: {
      movingVisit,
    },
  } = state;

  return {
    services,
    movingVisit,
  };
}

export default connect(mapStateToProps)(withTranslation("common")(CellAppointmentArea));
