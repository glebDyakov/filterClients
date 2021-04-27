import React from 'react';
import moment from 'moment';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import moize from 'moize';

import DragVertController from './DragVertController';
import TabScrollContentLine from './TabScrollContentLine';

class TabScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: [],
    };
    this.getHours24 = this.getHours24.bind(this);
    this.getIsPresent = this.getIsPresent.bind(this);
    this.moizedGetIsToday = moize(this.getIsToday);
    this.moizedGetIsWeekBefore = moize(this.getIsWeekBefore);
  }

  componentDidMount() {
    if (this.props.timetable && this.props.timetable.length) {
      this.getHours24(this.props.timetable);
    }
  }


  componentWillReceiveProps(newProps) {
    $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'});
    if (newProps.timetable && (JSON.stringify(newProps.timetable) !== JSON.stringify(this.props.timetable))) {
      this.getHours24(newProps.timetable);
    }
  }

  getHours24(timetable) {
    const {booktimeStep} = this.props.company.settings;
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

    this.setState({numbers});
  }

  getIsPresent(currentCellTime) {
    const {booktimeStep} = this.props.company.settings;
    const step = booktimeStep / 60;
    return currentCellTime <= moment().format('x') && currentCellTime >= moment().subtract(step, 'minutes').format('x');
  }

  getIsToday(selectedDay) {
    return moment().startOf('day').format('x') ===
      moment(selectedDay).startOf('day').format('x');
  }

  getIsWeekBefore(selectedDay) {
    return moment(selectedDay).startOf('day').format('x') >
      parseInt(moment().subtract(1, 'week').format('x'));
  }

  renderTable({step, cellHeight}) {
    const {
      availableTimetable, getCellTime, checkForCostaffs, services, moveVisit, type, handleUpdateClient,
      updateAppointmentForDeleting, changeTime, changeTimeFromCell, selectedDays,
    } = this.props;
    const {numbers} = this.state;

    const isWeekBefore = this.moizedGetIsWeekBefore(selectedDays[0])
    const isToday = this.moizedGetIsToday(selectedDays[0]);
    let listClass = 'list-15';
    switch (step) {
      case 5:
        listClass = 'list-5';
        break;

      case 10:
        listClass = 'list-10';
        break;

      case 30:
        listClass = 'list-30';
        break;
      default:
    }


    return numbers.map((time, numberKey) => (
      <TabScrollContentLine
        isToday={isToday}
        key={`number-${numberKey}`}
        listClass={listClass}
        availableTimetable={availableTimetable}
        isWeekBefore={isWeekBefore}
        step={step}
        cellHeight={cellHeight}
        checkForCostaffs={checkForCostaffs}
        getCellTime={getCellTime}
        numberKey={numberKey}
        changeTime={changeTime}
        changeTimeFromCell={changeTimeFromCell}
        handleUpdateClient={handleUpdateClient}
        numbers={numbers}
        services={services}
        updateAppointmentForDeleting={updateAppointmentForDeleting}
        time={time}
        moveVisit={moveVisit}
        type={type}
        selectedDays={selectedDays}
        getIsPresent={this.getIsPresent}
      />
    ));
  }

  render() {
    const {numbers} = this.state;
    if (!(numbers && numbers.length)) {
      return null;
    }

    const {company} = this.props;
    const {booktimeStep, existingAppointmentIgnored} = company.settings;
    const step = booktimeStep / 60;
    const cellHeight = 25;

    return (
      <div className="tabs-scroll">
        <DndProvider backend={Backend}>
          {this.renderTable({step, cellHeight})}
        </DndProvider>

        <DragVertController booktimeStep={booktimeStep} step={step} cellHeight={cellHeight} existingAppointmentIgnored={existingAppointmentIgnored} />
      </div>
    );
  }
}

export default TabScroll;
