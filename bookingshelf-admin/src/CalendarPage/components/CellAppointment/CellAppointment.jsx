import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

import Box from '../../../_components/dragAndDrop/Box';
import CellAppointmentModal from './CellAppointmentModal';
import CellAppointmentContent from './CellAppointmentContent/CellAppointmentContent';

import { appointmentActions } from '../../../_actions';

import { getCurrentCellTime } from '../../../_helpers';

class CellAppointment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      totalDuration: 0,
      totalCount: 0,
      totalAmount: 0,
      appointmentServices: [],
      currentAppointments: [],
    };

    this.startMovingVisit = this.startMovingVisit.bind(this);
    this.updateAppointmentInfo = this.updateAppointmentInfo.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this.updateAppointmentInfo(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateAppointmentInfo(newProps);
  }

  updateAppointmentInfo(props) {
    const {
      services, appointment, appointments, selectedDays, selectedDaysKey, time, blickClientId,
      workingStaffElement, selectedNote, step,
    } = props;

    const currentAppointments = [appointment];

    let totalDuration = appointment.duration;
    let totalCount = 0;
    // let totalPrice = appointment.price;
    let totalAmount = appointment.totalAmount;

    const appointmentServices = [];
    const activeService = services && services.servicesList &&
      services.servicesList.find((service) => service.serviceId === appointment.serviceId,
      );
    appointmentServices.push({
      ...activeService,
      discountPercent: appointment.discountPercent,
      totalAmount: appointment.totalAmount,
      price: appointment.price,
      serviceName: appointment.serviceName,
      serviceId: appointment.serviceId,
    });

    if (appointment.hasCoAppointments) {
      appointments.forEach((staffAppointment) => staffAppointment.appointments.forEach((currentAppointment) => {
        if (!currentAppointment.coappointment && (currentAppointment.coAppointmentId === appointment.appointmentId)) {
          totalDuration += currentAppointment.duration;
          totalCount++;
          // totalPrice += currentAppointment.price;
          totalAmount += currentAppointment.totalAmount;

          const activeCoService = services && services.servicesList &&
            services.servicesList.find((service) => service.serviceId === currentAppointment.serviceId);
          appointmentServices.push({
            ...activeCoService,
            discountPercent: currentAppointment.discountPercent,
            totalAmount: currentAppointment.totalAmount,
            serviceName: currentAppointment.serviceName,
            price: currentAppointment.price,
            serviceId: currentAppointment.serviceId,
          });

          currentAppointments.push(currentAppointment);
        }
      }));
    }

    const currentTime = getCurrentCellTime(selectedDays, selectedDaysKey, time);
    const isWeekBefore = currentTime >= parseInt(moment().subtract(1, 'week').format('x'));

    const contentId = appointment.coappointment
      ? ''
      : (appointment.appointmentId + '_' + workingStaffElement.staffId + '_' + appointment.duration + '_' +
        appointment.appointmentTimeMillis + '_' +
        moment(appointment.appointmentTimeMillis, 'x').add(appointment.duration, 'seconds').format('x'));

    const contentClassName = 'cell notes ' + appointment.appointmentId + ' ' +
      (parseInt(moment(currentTime + appointment.duration * 1000).format('H')) >= 20 && 'notes-bottom' + ' ' +
        (parseInt(moment(currentTime).format('H')) === 23 && ' last-hour-notes')
      )
      + ((appointment.appointmentId === selectedNote && !appointment.coappointment) ? ' selected hovered' : '')
      + (blickClientId === appointment.clientId ? ' custom-blick-div' : '');

    const wrapperClassName = 'cell default-width ' +
      (currentTime <= moment().format('x') &&
      currentTime >= moment().subtract(step, 'minutes').format('x') ? 'present-time ' : '') +
      (appointment.appointmentId === selectedNote ? 'selectedNote' : '');

    const updatedValues = {
      totalDuration, totalCount, totalAmount, appointmentServices, currentAppointments,
      isWeekBefore, contentId, contentClassName, wrapperClassName, currentTime,
    };
    Object.entries(updatedValues).forEach(([key, value]) => {
      if (this.state[key] !== value) {
        this.setState({ [key]: value });
      }
    });
  }

  startMovingVisit(draggingAppointmentId) {
    const { appointment, totalDuration, workingStaffElement } = this.props;
    this.props.dispatch(appointmentActions.togglePayload({
      movingVisit: appointment,
      movingVisitDuration: totalDuration,
      prevVisitStaffId: workingStaffElement.staffId,
      draggingAppointmentId,
      isStartMovingVisit: true,
    }));
  };

  handleMouseEnter() {
    const { appointment, appointments, dispatch } = this.props;
    if (appointment.clientId) {
      let clientAppointmentsCount = 0;
      appointments.forEach((item) => {
        item.appointments && item.appointments.forEach((currentAppointment) => {
          if (currentAppointment.clientId === appointment.clientId && !currentAppointment.coappointment &&
            !currentAppointment.coAppointmentId) {
            clientAppointmentsCount++;
          }
        });
      });
      if (clientAppointmentsCount > 1) {
        dispatch(appointmentActions.toggleBlickedClientId(appointment.clientId));
      }
    }
  }

  handleMouseLeave() {
    const { appointment, dispatch } = this.props;
    if (appointment.clientId) {
      dispatch(appointmentActions.toggleBlickedClientId(null));
    }
  }

  render() {
    const {
      step,
      cellHeight,
      currentTime,
      moveVisit,
      numberKey,
      staffKey,
      appointment,
      appointments,
      isStartMovingVisit,
      numbers,
      selectedNote,
      workingStaffElement,
      handleUpdateClient,
      services,
      changeTime,
      updateAppointmentForDeleting,
    } = this.props;

    const {
      totalDuration, totalCount, totalAmount, appointmentServices, currentAppointments,
      isWeekBefore, contentId, contentClassName, wrapperClassName,
    } = this.state;

    const content = (
      <div
        id={contentId}
        className={contentClassName}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <CellAppointmentContent
          isWeekBefore={isWeekBefore}
          cellHeight={cellHeight}
          step={step}
          appointments={appointments}
          appointment={appointment}
          totalDuration={totalDuration}
          selectedNote={selectedNote}
          updateAppointmentForDeleting={updateAppointmentForDeleting}
          workingStaffElement={workingStaffElement}
          totalCount={totalCount}
          currentAppointments={currentAppointments}
          numberKey={numberKey}
          staffKey={staffKey}
        />

        {appointment.appointmentId === selectedNote && !appointment.coappointment &&
          <CellAppointmentModal
            isWeekBefore={isWeekBefore}
            isStartMovingVisit={isStartMovingVisit}
            appointment={appointment}
            totalDuration={totalDuration}
            currentAppointments={currentAppointments}
            handleUpdateClient={handleUpdateClient}
            appointmentServices={appointmentServices}
            workingStaffElement={workingStaffElement}
            currentTime={currentTime}
            startMovingVisit={this.startMovingVisit}
            changeTime={changeTime}
            updateAppointmentForDeleting={updateAppointmentForDeleting}
            services={services}
            totalAmount={totalAmount}
            numbers={numbers}
          />
        }
      </div>
    );

    if (!appointment.coappointment && !isMobile) {
      return <div className="cell-appointment">
        <Box
          moveVisit={moveVisit}
          appointmentId={appointment.appointmentId}
          startMoving={() => this.startMovingVisit(appointment.appointmentId)}
          content={content}
          wrapperClassName={wrapperClassName}
        />
      </div>;
    }

    return <div className="cell-appointment">
      <div className={wrapperClassName}>{content}</div>
    </div>;
  };
}

function mapStateToProps(state) {
  const {
    calendar: {
      appointments,
    },
    appointment: {
      blickClientId,
      selectedNote,
      isStartMovingVisit,
      draggingAppointmentId,
    },
    cell: { selectedDays },
  } = state;

  return {
    appointments,
    blickClientId,
    selectedNote,
    isStartMovingVisit,
    draggingAppointmentId,
    selectedDays,
  };
}

export default connect(mapStateToProps)(CellAppointment);
