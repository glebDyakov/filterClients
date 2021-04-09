import React from 'react';
import { connect } from 'react-redux';

import CellAppointmentHeader from './CellAppointmentHeader';
import CellAppointmentArea from './CellAppointmentArea';
import { getNearestAvailableTime } from '../../../../_helpers/available-time';
import { appointmentActions } from '../../../../_actions';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { calculateNotesHeight } from '../../../../_helpers/functions';

class CellAppointmentContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.toggleSelectedNote = this.toggleSelectedNote.bind(this);
  }

  updateMaxTextareaHeight(props) {
    const {
      appointment,
      staff,
      appointments,
      timetable,
      reservedTime,
      workingStaffElement,
      totalDuration,
      step,
      cellHeight,
    } = props;

    const staffList = appointments && appointments.filter((item) => item.appointments && item.appointments
      .some((localAppointment) => localAppointment.appointmentId === appointment.appointmentId),
    );

    const timetableItems = timetable && timetable
      .filter((item) => item.staffId === workingStaffElement.staffId ||
        (appointment.coStaffs && staffList && staffList.some((coStaff) => coStaff.staff.staffId === item.staffId)),
      );

    const isOwnInterval = (i) => appointment.appointmentTimeMillis <= i && (appointment.appointmentTimeMillis +
      (totalDuration * 1000)) > i;
    const nearestAvailableMillis = getNearestAvailableTime(
      appointment.appointmentTimeMillis, appointment.appointmentTimeMillis, timetableItems,
      [], reservedTime, staff, isOwnInterval,
    );
    const maxTextAreaCellCount = (nearestAvailableMillis - (appointment.appointmentTimeMillis + (step * 60000)))
      / 1000 / 60 / step;
    return maxTextAreaCellCount * cellHeight;
  }

  toggleSelectedNote() {
    const { appointment, selectedNote, dispatch } = this.props;
    dispatch(appointmentActions.toggleSelectedNote(
      appointment.appointmentId === selectedNote ? null : appointment.appointmentId),
    );
  }

  render() {
    const {
      isWeekBefore, appointment, totalDuration, updateAppointmentForDeleting, workingStaffElement,
      currentAppointments, numberKey, staffKey, step, cellHeight,
      appointments, timetable, reservedTime, staff, t, totalAmount, clientAppointmentsCount,appointmentServices,services
    } = this.props;
    const maxTextAreaHeight = this.updateMaxTextareaHeight({
      appointment,
      staff,
      appointments: appointments && appointments.map(item => {
        return {
          ...item,
          appointments: item?.appointments && item?.appointments?.filter(localAppointment => localAppointment.intersected)
        }
      }),
      timetable,
      reservedTime,
      workingStaffElement,
      totalDuration,
      step,
      cellHeight,
    });

    const resultTextAreaHeight = calculateNotesHeight(totalDuration, step, cellHeight, moment(appointment.appointmentTimeMillis, 'x').format('HH:mm'));

    const minTextAreaHeight = ((currentAppointments.length - 1) ? cellHeight * (currentAppointments.length - 1) : 0);

    const textAreaId = `${appointment.appointmentId}-${numberKey}-${staffKey}-textarea-wrapper`;

    return (
      <React.Fragment>
        <CellAppointmentHeader
          toggleSelectedNote={this.toggleSelectedNote}
          appointment={appointment}
          resultTextAreaHeight={resultTextAreaHeight}
          totalDuration={totalDuration}
          updateAppointmentForDeleting={updateAppointmentForDeleting}
          workingStaffElement={workingStaffElement}
        />
        <CellAppointmentArea
          clientAppointmentsCount={clientAppointmentsCount}
          isWeekBefore={isWeekBefore}
          workingStaffElement={workingStaffElement}
          appointment={appointment}
          textAreaId={textAreaId}
          minTextAreaHeight={minTextAreaHeight}
          maxTextAreaHeight={maxTextAreaHeight}
          resultTextAreaHeight={resultTextAreaHeight}
          toggleSelectedNote={this.toggleSelectedNote}
          totalAmount={totalAmount}
          totalDuration={totalDuration}
          appointmentServices={appointmentServices}
          services={services}
        />
      </React.Fragment>
    );
  };
}
function mapStateToProps(state) {
  const {
    calendar: {
      reservedTime,
    },

    staff: { timetable, staff },
  } = state;

  return {
    timetable,
    staff,
    reservedTime,
  };
}

export default connect(mapStateToProps)(withTranslation('common')(CellAppointmentContent));
