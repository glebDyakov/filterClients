import React from 'react';
import { connect } from 'react-redux';

import { appointmentActions } from '../../../_actions';

import moment from 'moment';
import { isMobile } from 'react-device-detect';
import Box from '../../../_components/dragAndDrop/Box';
import { getCurrentCellTime } from '../../../_helpers';
import CellAppointmentModal from './CellAppointmentModal';
import CellAppointmentContent from './CellAppointmentContent/CellAppointmentContent';
import { access } from '../../../_helpers/access';
import { checkIsOnAnotherVisit } from '../../../_helpers/available-time';

class CellAppointment extends React.PureComponent {
  constructor(props) {
    super(props);

    this.startMovingVisit = this.startMovingVisit.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }


  updateAppointmentInfo(props) {
    const {
      services, appointment, appointments, blickClientId, selectedNote, isExistingAppointmentIgnoring,
      selectedDays, selectedDaysKey, time, step, workingStaffElement, draggingAppointmentId
    } = props;
    const currentAppointments = [appointment];

    let totalDuration = appointment.duration;
    let totalCount = 0;
    // let totalPrice = appointment.price;
    let totalAmount = appointment.totalAmount;
    const appointmentServices = [];
    const activeService = services && services.servicesList &&
      services.servicesList.find((service) => service.serviceId === appointment.serviceId
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
      appointments && appointments.forEach((staffAppointment) => staffAppointment.appointments &&
        staffAppointment.appointments.forEach((currentAppointment) => {
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

    const contentId = appointment.coappointment
      ? ''
      : (appointment.appointmentId + '_' + workingStaffElement.staffId + '_' + appointment.duration + '_' +
        appointment.appointmentTimeMillis + '_' +
        moment(appointment.appointmentTimeMillis, 'x').add(appointment.duration, 'seconds').format('x'));

    const staffAppointment = (appointments || []).find((item) => item.staff.staffId === workingStaffElement.staffId)
    const resultAppointments = staffAppointment?.appointments?.filter(item => item.appointmentId !== appointment.appointmentId)
    const isOnAnotherVisit = resultAppointments && appointment.intersected && checkIsOnAnotherVisit({ appointments: resultAppointments }, appointment.appointmentTimeMillis);

    const contentClassName = 'cell notes ' + ((appointment.intersected && (draggingAppointmentId !== appointment.appointmentId)) ? (isOnAnotherVisit ? 'notes-right ' : 'notes-left ') : '') + appointment.appointmentId + ' ' +
      (parseInt(moment(currentTime + appointment.duration * 1000).format('H')) >= 20 && 'notes-bottom' + ' ' +
        (parseInt(moment(currentTime).format('H')) === 23 && ' last-hour-notes')
      )
      + ((appointment.appointmentId === selectedNote && !appointment.coappointment) ? ' selected hovered' : '')
      + (blickClientId === appointment.clientId ? ' custom-blick-div' : '')
      + (!isExistingAppointmentIgnoring && !appointment.intersected ? ' full-width' : '');

    const wrapperClassName = 'cell default-width ' +
      (currentTime <= moment().format('x') &&
      currentTime >= moment().subtract(step, 'minutes').format('x') ? 'present-time ' : '') +
      (appointment.appointmentId === selectedNote ? 'selectedNote' : '');

    let clientAppointmentsCount = 0;
    if (appointment.clientId) {
      appointments && appointments.forEach((localAppointment) => {
        localAppointment.appointments && localAppointment.appointments.forEach((item) => {
          if (item.clientId === appointment.clientId) {
            clientAppointmentsCount++;
          }
        });
      });
    }

    return {
      totalDuration, totalCount, totalAmount, appointmentServices, currentAppointments, wrapperClassName,
      contentClassName, currentTime, contentId, clientAppointmentsCount
    };
  }

  startMovingVisit(draggingAppointmentId, totalDuration) {
    const { appointment, workingStaffElement } = this.props;
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
      step, cellHeight, settings, moveVisit, numberKey, staffKey, appointment, appointments, isStartMovingVisit,
      numbers, selectedNote, workingStaffElement, handleUpdateClient, services, changeTime, time,
      updateAppointmentForDeleting, isWeekBefore, selectedDaysKey, blickClientId, selectedDays, draggingAppointmentId,
    } = this.props;

    const {
      clientAppointmentsCount, totalDuration, totalCount, totalAmount, appointmentServices, currentAppointments,
      contentClassName, wrapperClassName, currentTime, contentId,
    } = this.updateAppointmentInfo({
      services, appointment, appointments, blickClientId, selectedNote, draggingAppointmentId,
      selectedDays, selectedDaysKey, time, step, workingStaffElement, staffKey
    });

    const content = (
      <div
        id={contentId}
        className={contentClassName}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <CellAppointmentContent
          clientAppointmentsCount={clientAppointmentsCount}
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
          totalAmount={totalAmount.toFixed(2)}
          appointmentServices={appointmentServices}
          services={services}
        />

        {access(15) && appointment.appointmentId === selectedNote && !appointment.coappointment &&
          <CellAppointmentModal
            isWeekBefore={isWeekBefore}
            isStartMovingVisit={isStartMovingVisit}
            appointment={appointment}
            totalDuration={totalDuration}
            settings={settings}
            currentAppointments={currentAppointments}
            handleUpdateClient={handleUpdateClient}
            appointmentServices={appointmentServices}
            workingStaffElement={workingStaffElement}
            currentTime={currentTime}
            startMovingVisit={() => this.startMovingVisit(null, totalDuration)}
            changeTime={changeTime}
            updateAppointmentForDeleting={updateAppointmentForDeleting}
            services={services}
            totalAmount={totalAmount.toFixed(2)}
            numbers={numbers}
          />
        }
      </div>
    );

    return <div className="cell-appointment">
      {access(15) && (!appointment.coappointment && !isMobile)
        ? (
          <Box
            moveVisit={moveVisit}
            appointmentId={appointment.appointmentId}
            startMoving={() => this.startMovingVisit(appointment.appointmentId, totalDuration)}
            content={content}
            wrapperClassName={wrapperClassName}
          />
        ): (
          <div className={wrapperClassName}>{content}</div>
        )
      }
    </div>;
  };
}

function mapStateToProps(state) {
  const {
    company: {
      settings,
    },
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
    settings,
    appointments,
    blickClientId,
    selectedNote,
    isStartMovingVisit,
    draggingAppointmentId,
    selectedDays,
  };
}

export default connect(mapStateToProps)(CellAppointment);
