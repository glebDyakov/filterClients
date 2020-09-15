import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux'

import TabScrollLeftMenu from './TabScrollLeftMenu';
import BaseCell from './BaseCell';

import { getCurrentCellTime } from '../../_helpers';

class TabScrollContentLine extends React.PureComponent {
  render() {
    const {
      isLoadingAppointments,
      isLoadingReservedTime,
      isToday,
      listClass,
      availableTimetable,
      isWeekBefore,
      step,
      cellHeight,
      checkForCostaffs,
      getCellTime,
      numberKey,
      changeTime,
      changeTimeFromCell,
      handleUpdateClient,
      numbers,
      services,
      updateAppointmentForDeleting,
      time,
      moveVisit,
      type,
      selectedDays,
      getIsPresent,
    } = this.props;

    const isLoading = isLoadingAppointments || isLoadingReservedTime;

    let currentCellTime;
    let isPresent;
    if (isToday) {
      currentCellTime = getCurrentCellTime(selectedDays, 0, time);
      isPresent = getIsPresent(currentCellTime);
    }

    return (
      <div className={'tab-content-list ' + listClass + (isPresent ? ' present-line-block' : '')}>
        {isPresent && type === 'day' &&
          <span data-time={moment().format('HH:mm')} className="present-time-line"/>
        }
        <TabScrollLeftMenu time={time}/>
        {availableTimetable && availableTimetable.map((workingStaffElement, staffKey) => (
          <BaseCell
            isWeekBefore={isWeekBefore}
            step={step}
            cellHeight={cellHeight}
            checkForCostaffs={checkForCostaffs}
            getCellTime={getCellTime}
            key={`working-staff-${staffKey}`}
            numberKey={numberKey}
            staffKey={staffKey}
            changeTime={changeTime}
            changeTimeFromCell={changeTimeFromCell}
            handleUpdateClient={handleUpdateClient}
            numbers={numbers}
            services={services}
            workingStaffElement={workingStaffElement}
            updateAppointmentForDeleting={updateAppointmentForDeleting}
            selectedDaysKey={type === 'day' ? 0 : staffKey}
            time={time}
            moveVisit={moveVisit}
          />
        ))}
      </div>
    );
  };
}

function mapStateToProps(state) {
  const {
    calendar: {
      isLoadingAppointments,
      isLoadingReservedTime,
    },
  } = state;

  return {
    isLoadingAppointments,
    isLoadingReservedTime,
  };
}

export default connect(mapStateToProps)(TabScrollContentLine);
