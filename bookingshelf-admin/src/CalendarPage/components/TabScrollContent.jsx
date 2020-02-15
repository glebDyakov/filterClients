import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import TabScrollLeftMenu from './TabScrollLeftMenu';

import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { appointmentActions } from "../../_actions";
import DragVertController from "./DragVertController";
import BaseCell from "./BaseCell";

class TabScroll extends Component{
    constructor(props) {
        super(props);
        this.state = {
            numbers: []
        }
        this.startMovingVisit = this.startMovingVisit.bind(this);
        this.moveVisit = this.moveVisit.bind(this);
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
                numbers.push(moment().startOf('day').add(i, 'minutes').format('x'));
            }
        }

        this.setState({ numbers });
    }

    startMovingVisit(movingVisit, totalDuration, prevVisitStaffId, draggingAppointmentId) {
        this.props.dispatch(appointmentActions.togglePayload({ movingVisit, movingVisitDuration: totalDuration, prevVisitStaffId, draggingAppointmentId }));
        this.props.dispatch(appointmentActions.toggleStartMovingVisit(true))
    }

    moveVisit(movingVisitStaffId, time) {
        this.props.dispatch(appointmentActions.togglePayload({ movingVisitMillis : time, movingVisitStaffId }));
    }

    render(){
        const { availableTimetable, services, selectedDays, closedDates ,handleUpdateClient, updateAppointmentForDeleting,updateReservedId,changeTime,isLoading } = this.props;
        const { numbers } = this.state;

        return(
            <div className="tabs-scroll"
                // style={{'minWidth': (120*parseInt(workingStaff.timetable && workingStaff.timetable.length))+'px'}}
            >
                <DndProvider backend={Backend}>
                    {numbers && numbers.map((time, key) =>
                        <div className={'tab-content-list ' + (isLoading && 'loading')} key={key}>
                            <TabScrollLeftMenu time={time}/>
                            {!isLoading && availableTimetable && selectedDays.map((day) => availableTimetable.map((workingStaffElement, staffKey) => (
                                    <BaseCell
                                        moveVisit={this.moveVisit}
                                        numberKey={key}
                                        staffKey={staffKey}
                                        changeTime={changeTime}
                                        handleUpdateClient={handleUpdateClient}
                                        numbers={numbers}
                                        services={services}
                                        startMovingVisit={this.startMovingVisit}
                                        workingStaffElement={workingStaffElement}
                                        closedDates={closedDates}
                                        updateAppointmentForDeleting={updateAppointmentForDeleting}
                                        updateReservedId={updateReservedId}
                                        day={day}
                                        time={time}
                                    />
                                )
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
