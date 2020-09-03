import React from 'react';
import { connect } from 'react-redux';

import CellAppointmentHeader from './CellAppointmentHeader';
import CellAppointmentArea from './CellAppointmentArea';
import { getNearestAvailableTime } from '../../../../_helpers/available-time';
import { appointmentActions } from '../../../../_actions';

class CellAppointmentContent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      maxTextAreaHeight: 0,
    };

    this.toggleSelectedNote = this.toggleSelectedNote.bind(this);
  }

  componentDidMount() {
    this.updateMaxTextareaHeight(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateMaxTextareaHeight(newProps);
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
        (appointment.coStaffs && staffList.some((coStaff) => coStaff.staff.staffId === item.staffId)),
      );

    const isOwnInterval = (i) => appointment.appointmentTimeMillis <= i && (appointment.appointmentTimeMillis +
      (totalDuration * 1000)) > i;
    const nearestAvailableMillis = getNearestAvailableTime(
      appointment.appointmentTimeMillis, appointment.appointmentTimeMillis, timetableItems,
      appointments, reservedTime, staff, isOwnInterval,
    );
    const maxTextAreaCellCount = (nearestAvailableMillis - (appointment.appointmentTimeMillis + (step * 60000)))
      / 1000 / 60 / step;
    const maxTextAreaHeight = maxTextAreaCellCount * cellHeight;
    if (this.state.maxTextAreaHeight !== maxTextAreaHeight) {
      this.setState({ maxTextAreaHeight });
    }
  }

  toggleSelectedNote() {
    const { appointment, selectedNote, dispatch } = this.props;
    dispatch(appointmentActions.toggleSelectedNote(
      appointment.appointmentId === selectedNote ? null : appointment.appointmentId),
    );
  }

  render() {
    const {
      isWeekBefore,
      appointment,
      totalDuration,
      updateAppointmentForDeleting,
      workingStaffElement,
      totalCount,
      currentAppointments,
      numberKey,
      staffKey,
      step,
      cellHeight,
    } = this.props;

    const { maxTextAreaHeight } = this.state;

    const resultTextAreaHeight = ((totalDuration / 60 / step) - 1) * cellHeight;

    let extraServiceText;
    switch (totalCount) {
      case 0:
        extraServiceText = '';
        break;
      case 1:
        extraServiceText = 'и ещё 1 услуга';
        break;
      case 2:
      case 3:
      case 4:
        extraServiceText = `и ещё ${totalCount} услуги`;
        break;
      default:
        extraServiceText = `и ещё 5+ услуг`;
    }

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
          isWeekBefore={isWeekBefore}
          workingStaffElement={workingStaffElement}
          appointment={appointment}
          textAreaId={textAreaId}
          minTextAreaHeight={minTextAreaHeight}
          maxTextAreaHeight={maxTextAreaHeight}
          resultTextAreaHeight={resultTextAreaHeight}
          extraServiceText={extraServiceText}
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

export default connect(mapStateToProps)((CellAppointmentContent));
