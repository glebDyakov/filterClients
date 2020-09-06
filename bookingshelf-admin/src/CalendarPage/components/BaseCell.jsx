import React from 'react';
import BaseCellContent from './BaseCellContent';

class BaseCell extends React.Component {
  componentDidMount() {
    this.updateWrapperZIndex();
  }

  updateWrapperZIndex() {
    const { rowIndex, numbers } = this.props;
    const node = this.wrapper;
    const wrapper = $(node).parent().parent().parent().parent().parent().parent();

    if (wrapper && wrapper[0]) {
      wrapper[0].style.zIndex = numbers.length - rowIndex;
    }
  }

  render() {
    const {
      isWeekBefore,
      step,
      cellHeight,
      checkForCostaffs,
      getCellTime,
      staffKey,
      changeTime,
      changeTimeFromCell,
      handleUpdateClient,
      numbers,
      services,
      workingStaffElement,
      updateAppointmentForDeleting,
      selectedDaysKey,
      rowIndex,
      moveVisit,
    } = this.props;

    this.updateWrapperZIndex();

    return (
      <div
        ref={(node) => this.wrapper = node}
        className={'tab-content-list tab-content-inner-cell-wrapper'}
      >
        <BaseCellContent
          isWeekBefore={isWeekBefore}
          step={step}
          cellHeight={cellHeight}
          checkForCostaffs={checkForCostaffs}
          getCellTime={getCellTime}
          numberKey={rowIndex}
          staffKey={staffKey}
          changeTime={changeTime}
          changeTimeFromCell={changeTimeFromCell}
          handleUpdateClient={handleUpdateClient}
          numbers={numbers}
          services={services}
          workingStaffElement={workingStaffElement}
          updateAppointmentForDeleting={updateAppointmentForDeleting}
          selectedDaysKey={selectedDaysKey}
          time={numbers[rowIndex]}
          moveVisit={moveVisit}
        />
      </div>
    );
  };
}

export default BaseCell;
