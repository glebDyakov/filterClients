import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import TabScrollLeftMenu from './TabScrollLeftMenu';

import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import DragVertController from "./DragVertController";
import BaseCell from "./BaseCell";

class TabScroll extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            numbers: []
        }
        this.getHours24 = this.getHours24.bind(this);
    }
    componentDidMount() {
        if (this.props.timetable && this.props.timetable.length) {
            this.getHours24(this.props.timetable);
        }
    }

    componentWillReceiveProps(newProps){
        $('.msg-client-info').css({'visibility': 'visible', 'cursor': 'default'});
        if (newProps.timetable && (JSON.stringify(newProps.timetable) !== JSON.stringify(this.props.timetable))) {
            this.getHours24(newProps.timetable);
        }
    }

    getHours24 (timetable){
        const numbers =[];

        let minTime = 0
        let maxTime = 0

        timetable.forEach(timetableItem => {
            timetableItem.timetables.forEach(time => {
                if (!minTime || (moment(time.startTimeMillis).format('HH:mm') < moment(minTime).format('HH:mm'))) {
                    minTime = time.startTimeMillis
                }

                if (!maxTime || (moment(time.endTimeMillis).format('HH:mm') > moment(maxTime).format('HH:mm'))) {
                    maxTime = time.endTimeMillis
                }

            })
        })
        if (minTime > 0 && maxTime > 0) {
            let startTime = (parseInt(moment(minTime).format('HH')) * 60) + parseInt(moment(minTime).format('mm'));
            let endTime = (parseInt(moment(maxTime).format('HH')) * 60) + parseInt(moment(maxTime).format('mm'));

            let startNumber = startTime % 60
                ? (startTime - parseInt(moment(minTime).format('mm')))
                : (startTime - 60);

            let endNumber = endTime % 60
                ? (endTime - parseInt(moment(maxTime).format('mm')) + 60)
                : (endTime + 60);

            for (let i = startNumber; i < endNumber; i = i + 15) {
                numbers.push(moment().startOf('day').add(i, 'minutes').format('HH:mm'));
            }
        }

        this.setState({ numbers });
    }

    render(){
        const { availableTimetable, getCellTime, services, moveVisit, type, handleUpdateClient, updateAppointmentForDeleting, changeTime, changeTimeFromCell } = this.props;
        const { numbers } = this.state;

        return(
            <div className="tabs-scroll">
                <DndProvider backend={Backend}>
                    {numbers && numbers.map((time, key) =>
                        <div key={`number-${key}`} className="tab-content-list" >
                            <TabScrollLeftMenu time={time}/>
                            {availableTimetable && (type === 'day' ? [0] : [0,1,2,3,4,5,6]).map((selectedDaysKey) => availableTimetable.map((workingStaffElement, staffKey) =>
                                <BaseCell
                                    getCellTime={getCellTime}
                                    key={`working-staff-${staffKey}`}
                                    numberKey={key}
                                    staffKey={staffKey}
                                    changeTime={changeTime}
                                    changeTimeFromCell={changeTimeFromCell}
                                    handleUpdateClient={handleUpdateClient}
                                    numbers={numbers}
                                    services={services}
                                    workingStaffElement={workingStaffElement}
                                    updateAppointmentForDeleting={updateAppointmentForDeleting}
                                    selectedDaysKey={selectedDaysKey}
                                    time={time}
                                    moveVisit={moveVisit}
                                />
                            ))
                            }
                        </div>
                    )}
                </DndProvider>
                <DragVertController />
            </div>
        );
    }

}

export default connect()(TabScroll);
