import React from 'react';
import { connect } from 'react-redux';
import { appointmentActions } from '../../../../_actions';

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
      resultTextAreaHeight, extraServiceText, services, movingVisit,
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
            <span className="client-name">
              {appointment.clientFirstName
                ? ('Клиент: ' + appointment.clientFirstName +
                (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')) + '\n'
                : 'Без клиента'}
            </span>
            <ul>
              <li className="service">{appointment.serviceName} {serviceDetails ? `(${serviceDetails})` : ''}</li>
            </ul>
            {extraServiceText}
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

export default connect(mapStateToProps)((CellAppointmentArea));
