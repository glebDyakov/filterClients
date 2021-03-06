import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import CellAppointment from './CellAppointment/CellAppointment';
import { appointmentActions } from '../../_actions';
import CellWhite from './CellWhite';
import CellExpired from './CellExpired';
import CellReservedTime from './CellReservedTime';
import { getCurrentCellTime } from '../../_helpers';

const cellTypes = {
  CELL_APPOINTMENT: 'CELL_APPOINTMENT',
  CELL_RESERVED_TIME: 'CELL_RESERVED_TIME',
  CELL_WHITE: 'CELL_WHITE',
  CELL_EXPIRED: 'CELL_EXPIRED',
};

class BaseCell extends React.Component {
  constructor(props) {
    super(props);
    const filledCell = this.getCellEmpty(props);;
    // const cellAppointment = this.getCellFilled({ ...props, cellType: cellTypes.CELL_APPOINTMENT });
    // if (cellAppointment) {
    //   filledCell = cellAppointment;
    // } else {
    //   const cellReservedTime = this.getCellFilled({ ...props, cellType: cellTypes.CELL_RESERVED_TIME });
    //   if (cellReservedTime) {
    //     filledCell = cellReservedTime;
    //   } else {
    //     filledCell = this.getCellEmpty(props);
    //   }
    // }
    this.state = {
      ...filledCell,
    };
    this.handleMoveVisit = this.handleMoveVisit.bind(this);
    this.handleAddVisit = this.handleAddVisit.bind(this);
    // console.log('constructor');
  }

  componentDidMount() {
    this.initCell(this.props);
  }

  shouldComponentUpdate(newProps, newState) {
    // const { numberKey, staffKey } = newProps;
    // if (numberKey === 0 && staffKey === 0) {
    //   console.log('shouldUpdate', newState.cellType);
    // }
    return (this.state.cellType !== newState.cellType) || ([cellTypes.CELL_APPOINTMENT, cellTypes.CELL_RESERVED_TIME]
      .some((cellType) => (this.state.cellType === cellType && newState.cellType === cellType)) &&
        Object.entries(newState.cell).some(([key, value]) => this.state.cell[key] !== value)
    ) || Object.entries(newProps.numbers).some(([key, value]) => this.props.numbers[key] !== value);
  }

  componentWillReceiveProps(newProps, nextContext) {
    if (!newProps.isLoadingAppointments && !newProps.isLoadingReservedTime) {
      this.initCell(newProps);
    }
  }

  initCell(props) {
    const { numberKey, staffKey } = props;
    const { cellType } = this.state;
    let filledCell;

    // if (numberKey === 0 && staffKey === 0) {
    //   console.log('initCell', props);
    // }

    const cellAppointment = this.getCellFilled({ ...props, cellType: cellTypes.CELL_APPOINTMENT });
    if (cellAppointment) {
      filledCell = cellAppointment;
    }

    if (!filledCell) {
      const cellReservedTime = this.getCellFilled({ ...props, cellType: cellTypes.CELL_RESERVED_TIME });
      if (cellReservedTime) {
        filledCell = cellReservedTime;
      }
    }

    if (filledCell) {
      this.updateCell(filledCell);
    } else {
      filledCell = this.getCellEmpty(props);

      if (((filledCell.cellType === cellTypes.CELL_WHITE) && (cellType !== cellTypes.CELL_WHITE)) ||
        (cellType !== cellTypes.CELL_EXPIRED)
      ) {
        this.updateCell(filledCell);
      }
    }
  }

  updateCell(filledCell) {
    this.setState({ ...filledCell });
  }

  getCellEmpty(props) {
    const {
      workingStaffElement, closedDates, selectedDaysKey, time, selectedDays, appointments, staffKey, checkForCostaffs,
      isWeekBefore,
    } = props;
    const currentTime = getCurrentCellTime(selectedDays, selectedDaysKey, time);

    const notExpired = workingStaffElement && workingStaffElement.timetables &&
      workingStaffElement.timetables.some((currentTimetable) => {
        return isWeekBefore &&
          (currentTime >= currentTimetable.startTimeMillis && currentTime < currentTimetable.endTimeMillis) &&
          checkForCostaffs({ appointments, staffKey, currentTime });
      }) &&
      (!(closedDates && closedDates.length > 0 && closedDates.some((st) => {
        return moment(moment(selectedDays[selectedDaysKey]).valueOf()).subtract(-1, 'minute')
          .isBetween(moment(st.startDateMillis).startOf('day'), moment(st.endDateMillis).endOf('day'));
      })));

    if (notExpired) {
      return { cellType: cellTypes.CELL_WHITE, cell: null, staffArray: null };
    } else {
      return { cellType: cellTypes.CELL_EXPIRED, cell: null, staffArray: null };
    }
  }

  getCellFilled(props) {
    const { cellType, workingStaffElement, step, selectedDaysKey, time, selectedDays } = props;

    let uniqConditions = {};

    switch (cellType) {
      case cellTypes.CELL_APPOINTMENT:
        uniqConditions = {
          staffArrayKey: 'appointments',
          checkingArrayKey: 'appointments',
          checkingTimeKey: 'appointmentTimeMillis',
          exists: (appointment) => appointment && !appointment.coAppointmentId,
        };
        break;
      case cellTypes.CELL_RESERVED_TIME:
        uniqConditions = {
          staffArrayKey: 'reservedTime',
          checkingArrayKey: 'reservedTimes',
          checkingTimeKey: 'startTimeMillis',
          exists: (reservedTime) => reservedTime,
        };
        break;
      default:
        return null;
    }
    const { staffArrayKey, checkingArrayKey, checkingTimeKey, exists } = uniqConditions;
    const staffArray = props[staffArrayKey];

    const checkingArray = staffArray && staffArray.find((appointmentStaff) =>
      appointmentStaff[checkingArrayKey] && (appointmentStaff.staff && appointmentStaff.staff.staffId) ===
      (workingStaffElement && workingStaffElement.staffId),
    );
    const cell = checkingArray && checkingArray[checkingArrayKey] && checkingArray[checkingArrayKey]
      .find((checkingItem) => {
        const checkingTime = parseInt(checkingItem[checkingTimeKey]);
        const currentCellTime = getCurrentCellTime(selectedDays, selectedDaysKey, time);
        const nextCellTime = currentCellTime + (step * 60 * 1000)

        return (currentCellTime <= checkingTime) && (nextCellTime > checkingTime);
      });

    if (exists(cell)) {
      return {
        cell,
        cellType,
        staffArray: checkingArray,
      };
    }

    return null;
  }

  handleMoveVisit() {
    const { staffKey, selectedDaysKey, time } = this.props;
    this.props.dispatch(appointmentActions.togglePayload({ staffKey, selectedDaysKey, time }));
  }

  handleAddVisit() {
    const { changeTimeFromCell, staffKey, selectedDaysKey, time, numbers } = this.props;
    changeTimeFromCell({ staffKey, selectedDaysKey, time }, numbers, false, null);
  }

  render() {
    const {
      isWeekBefore, numberKey, staffKey, changeTime, numbers, moveVisit, services, selectedDaysKey,
      time, workingStaffElement, handleUpdateClient, updateAppointmentForDeleting, step, cellHeight, company,
    } = this.props;
    const { cellType, cell } = this.state;

    const isExistingAppointmentIgnoring = company.settings?.existingAppointmentIgnored;

    // if (numberKey === 0 && staffKey === 0) {
    //   console.log('rerendered');
    // }

    switch (cellType) {
      case cellTypes.CELL_APPOINTMENT:
        return (
          <CellAppointment
            isWeekBefore={isWeekBefore}
            step={step}
            cellHeight={cellHeight}
            selectedDaysKey={selectedDaysKey}
            moveVisit={moveVisit}
            numberKey={numberKey}
            staffKey={staffKey}
            appointment={cell}
            changeTime={changeTime}
            handleUpdateClient={handleUpdateClient}
            numbers={numbers}
            services={services}
            workingStaffElement={workingStaffElement}
            updateAppointmentForDeleting={updateAppointmentForDeleting}
            isExistingAppointmentIgnoring={isExistingAppointmentIgnoring}
          />
        );
      case cellTypes.CELL_RESERVED_TIME:
        return (
          <CellReservedTime
            step={step}
            cellHeight={cellHeight}
            cell={cell}
            workingStaffElement={workingStaffElement}
          />
        );
      case cellTypes.CELL_WHITE:
        return (
          <CellWhite
            time={time}
            staffKey={staffKey}
            selectedDaysKey={selectedDaysKey}
            addVisit={this.handleAddVisit}
            moveVisit={this.handleMoveVisit}
          />
        );
      default:
        return <CellExpired time={time} />;
    };
  }
}

function mapStateToProps(state) {
  const {
    staff: { closedDates },
    calendar: {
      isLoadingAppointments,
      isLoadingReservedTime,
      appointments,
      reservedTime,
    },
    cell: { selectedDays },
    company,
  } = state;

  return {
    isLoadingAppointments,
    isLoadingReservedTime,
    closedDates,
    appointments,
    reservedTime,
    selectedDays,
    company,
  };
}

export default connect(mapStateToProps)(BaseCell);
