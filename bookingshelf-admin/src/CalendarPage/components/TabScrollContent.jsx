import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import { Table, Column, Cell } from 'fixed-data-table-2';
import Dimensions from 'react-dimensions';

import TabScrollLeftMenu from './TabScrollLeftMenu';
import DragVertController from './DragVertController';
import BaseCellContent from './BaseCellContent';
import { getCurrentCellTime } from '../../_helpers';
import { staffActions } from '../../_actions';
import BaseCell from './BaseCell';

class TabScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: [],
      staffCellWidth: null,
      firstInit: true,
    };
    this.getHours24 = this.getHours24.bind(this);
    this.getIsPresent = this.getIsPresent.bind(this);
  }

  componentDidMount() {
    if (this.props.timetable && this.props.timetable.length) {
      this.getHours24(this.props.timetable);
    }
  }

  componentDidUpdate() {
    if (this.state.firstInit && (this.props.availableTimetable && this.props.availableTimetable.length)) {
      this.updateStaffCellWidth();
      this.setState({ firstInit: false });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.selectedDays[0] !== this.props.selectedDays[0]) {
      this.setState({ staffCellWidth: null });
    } else {
      this.updateStaffCellWidth();
    }

    if (newProps.timetable && (JSON.stringify(newProps.timetable) !== JSON.stringify(this.props.timetable))) {
      this.getHours24(newProps.timetable);
    }
  }

  updateStaffCellWidth() {
    const { staffCellWidth } = this.state;
    const fixedTabCellNode = document.getElementById('fixed-tab-cell-0');
    const updatedStaffCellWidth = fixedTabCellNode ? fixedTabCellNode.clientWidth + 5 : 195;
    if (staffCellWidth !== updatedStaffCellWidth) {
      this.setState({ staffCellWidth: updatedStaffCellWidth });
    }
  }

  updateRowZIndexes() {
    // this.state.numbers.forEach((number, i) => {
    //   const node = document.getElementsByClassName('fixedDataTableRowLayout_rowWrapper')[i]
    //   if (node) {
    //     node.style.zIndex = 'unset';
    //   }
    // })
  }

  getHours24(timetable) {
    const { booktimeStep } = this.props.company.settings;
    const step = booktimeStep / 60;
    const numbers = [];

    let minTime = 0;
    let maxTime = 0;

    timetable.forEach((timetableItem) => {
      timetableItem.timetables.forEach((time) => {
        if (!minTime || (moment(time.startTimeMillis).format('HH:mm') < moment(minTime).format('HH:mm'))) {
          minTime = time.startTimeMillis;
        }

        if (!maxTime || (moment(time.endTimeMillis).format('HH:mm') > moment(maxTime).format('HH:mm'))) {
          maxTime = time.endTimeMillis;
        }
      });
    });
    if (minTime > 0 && maxTime > 0) {
      const startTime = (parseInt(moment(minTime).format('HH')) * 60) + parseInt(moment(minTime).format('mm'));
      const endTime = (parseInt(moment(maxTime).format('HH')) * 60) + parseInt(moment(maxTime).format('mm'));

      const startNumber = startTime - parseInt(moment(minTime).format('mm'));

      const endNumber = endTime - parseInt(moment(maxTime).format('mm')) + 60;

      for (let i = startNumber; i < endNumber; i = i + step) {
        numbers.push(moment().startOf('day').add(i, 'minutes').format('HH:mm'));
      }
    }

    this.setState({ numbers });
  }

  getIsPresent(currentCellTime) {
    const { booktimeStep } = this.props.company.settings;
    const step = booktimeStep / 60;
    return currentCellTime <= moment().format('x') && currentCellTime >= moment().subtract(step, 'minutes').format('x');
  }

  render() {
    const {
      company, availableTimetable, getCellTime, checkForCostaffs, services, moveVisit, type, handleUpdateClient,
      updateAppointmentForDeleting, changeTime, changeTimeFromCell, selectedDays, containerWidth, containerHeight, timetable,
    } = this.props;
    const { numbers, staffCellWidth } = this.state;
    if (!(timetable && timetable.length) || !numbers.length) {
      return null;
    }
    console.log('rerendered');

    const { booktimeStep } = company.settings;
    const step = booktimeStep / 60;
    const cellHeight = 25;
    const isWeekBefore = moment(selectedDays[0]).startOf('day').format('x') >
      parseInt(moment().subtract(1, 'week').format('x'));

    const cellNode = document.getElementsByClassName('tab-content-list-first')[0];
    const tableWidth = cellNode ? (Number(cellNode.clientWidth) + 16) : 0;
    const firstCellWidth = 48;

    const availableTimetableArray = staffCellWidth ? availableTimetable : [];

    return (
      <div className="tabs-scroll">
        <DndProvider backend={Backend}>
          <Table
            rowClassNameGetter={(rowIndex) => `tab-content-list-wrapper${
              numbers[rowIndex].split(':')[1] === '00' ? ' list' : ''
            }${rowIndex === 0 ? '' : ' table-content-row-wrapper'}`}
            allowCellsRecycling
            header={'numbers'}
            touchScrollEnabled
            overflowX={'hidden'}
            rowHeight={25}
            headerHeight={0}
            rowsCount={numbers.length}
            width={tableWidth}
            height={containerHeight}
            {...this.props}
          >
            <Column
              allowCellsRecycling
              className={'my-class'}
              columnKey="left-menu"
              cell={({ rowIndex, ...props }) => {
                const time = numbers[rowIndex];
                const currentCellTime = getCurrentCellTime(selectedDays, 0, time);
                const isPresent = this.getIsPresent(currentCellTime);

                return (
                  <div className={'tab-content-list ' + (isPresent ? ' present-line-block' : '')}>
                    {isPresent && type === 'day' &&
                      <span data-time={moment().format('HH:mm')} className="present-time-line"/>
                    }
                    <TabScrollLeftMenu time={time} />
                  </div>
                );
              }}
              fixed={true}
              width={firstCellWidth}
            />
            {availableTimetableArray && availableTimetableArray.map((workingStaffElement, staffKey) => (
              <Column
                allowCellsRecycling
                columnKey={`working-staff-${staffKey}`}
                cell={
                  <BaseCell
                    isWeekBefore={isWeekBefore}
                    step={step}
                    cellHeight={cellHeight}
                    checkForCostaffs={checkForCostaffs}
                    getCellTime={getCellTime}
                    staffKey={staffKey}
                    changeTime={changeTime}
                    changeTimeFromCell={changeTimeFromCell}
                    handleUpdateClient={handleUpdateClient}
                    numbers={numbers}
                    services={services}
                    workingStaffElement={workingStaffElement}
                    selectedDays={selectedDays}
                    updateAppointmentForDeleting={updateAppointmentForDeleting}
                    selectedDaysKey={type === 'day' ? 0 : staffKey}
                    moveVisit={moveVisit}
                  />
                }
                pureRendering
                fixed={true}
                width={staffCellWidth}
              />
            ),
            )}
          </Table>
        </DndProvider>

        <DragVertController cellHeight={cellHeight} step={step} />
      </div>
    );
  }
}

export default connect()(Dimensions({
  getHeight: function(element) {
    return window.innerHeight - 200;
  },
  getWidth: function(element) {
    const widthOffset = window.innerWidth < 680 ? 0 : 240;
    return window.innerWidth - widthOffset;
  },
})(TabScroll));
