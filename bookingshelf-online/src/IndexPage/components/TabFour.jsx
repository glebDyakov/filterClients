import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import DayPicker from "react-day-picker";
import {staffActions} from "../../_actions";

class TabFour extends  PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            arrayTime: 0
        }
    }

    render() {

        const {selectedTime, movingVisit, staffs, handleDayClick, selectStaff, setScreen, isStartMovingVisit, refreshTimetable,selectedStaff, selectedService, selectedDay, selectedServices, workingStaff, setTime} = this.props;

        const availableTimes = []
        if(!this.state.arrayTime && workingStaff) {
            workingStaff.map((workingStaffElement, i) =>
                parseInt(moment(workingStaffElement.dayMillis, 'x').startOf('day').format('x'))===parseInt(moment(selectedDay).startOf('day').format('x')) &&
                workingStaffElement.availableTimes.map((workingTime) => {

                    const countTimes = (workingTime.endTimeMillis - workingTime.startTimeMillis) / 1000 / 60 / 15 + 1;
                    const arrayTimes = []
                    for( let i = 0 ; i< countTimes; i++) {
                        arrayTimes.push(workingTime.startTimeMillis + (1000 * 60 * 15 * i))
                    }


                    arrayTimes.forEach(arrayTime => {
                        if (arrayTime >= parseInt(moment().format("x"))) {
                            let isAdded = availableTimes.find(availableTime => availableTime.time === moment(arrayTime).format('HH:mm'))
                            if (!isAdded) {
                                availableTimes.push({
                                    time: moment(arrayTime).format('HH:mm'),
                                    markup: (
                                        <div key={arrayTime} onClick={() => {
                                            if (isStartMovingVisit) {
                                                this.setState({arrayTime})
                                            } else {
                                                setTime(arrayTime)
                                            }
                                        }}>
                                            <span>{moment(arrayTime, 'x').format('HH:mm')}</span>
                                        </div>
                                    )
                                })
                            }
                        }
                    })
                    }
                )

            );

            // const dayToMove = moment(selectedDay).format("DD/MM/YYYY")
            // const movingVisitDay = movingVisit && moment(movingVisit.appointmentTimeMillis).format("DD/MM/YYYY")
            //
            // if (isStartMovingVisit && movingVisit && (selectedStaff.staffId === movingVisit.staffId) && (dayToMove === movingVisitDay)) {
            //     const startTime = movingVisit.appointmentTimeMillis - (movingVisit.duration * 1000) + 15 * 60000;
            //     const endTime = movingVisit.appointmentTimeMillis + (movingVisit.duration * 1000)
            //
            //
            //     for (let checkingTime = startTime; checkingTime <= endTime; checkingTime += 15 * 60 * 1000) {
            //
            //         const movingVisitMillis = checkingTime;
            //         const movingVisitEndTime = checkingTime + (movingVisit.duration * 1000);
            //
            //         const intervals = []
            //         for(let i = movingVisitMillis; i < movingVisitEndTime; i+= 15 * 60000) {
            //             intervals.push(i)
            //         }
            //
            //         let shouldMove = false;
            //
            //         workingStaff.forEach(item => {
            //             item.availableTimes.forEach(time => {
            //                 const isFreeInterval = intervals.every(i => {
            //                     const conditionOne = (time.startTimeMillis <= i && time.endTimeMillis >= i)
            //                     const conditionTwo = (movingVisit.appointmentTimeMillis <= i && (movingVisit.appointmentTimeMillis + (movingVisit.duration * 1000)) >= i)
            //
            //                     return (conditionOne
            //                         || conditionTwo
            //                     || ((movingVisit.appointmentTimeMillis -  (movingVisit.duration * 1000) <= i && movingVisit.appointmentTimeMillis > i)))
            //                 });
            //                 if (isFreeInterval) {
            //                     shouldMove = true
            //                 }
            //             })
            //         });
            //         if (checkingTime === movingVisit.appointmentTimeMillis) {
            //             shouldMove = false
            //         }
            //
            //         if (shouldMove) {
            //             let isAdded = availableTimes.find(availableTime => availableTime.time === moment(checkingTime).format('HH:mm'))
            //             if (!isAdded) {
            //                 availableTimes.push({
            //                     time: moment(checkingTime).format('HH:mm'),
            //                     markup: (
            //                         <div key={checkingTime} onClick={() => {
            //                             if (isStartMovingVisit) {
            //                                 this.setState({arrayTime: checkingTime})
            //                             } else {
            //                                 setTime(checkingTime)
            //                             }
            //                         }}>
            //                             <span>{moment(checkingTime, 'x').format('HH:mm')}</span>
            //                         </div>
            //                     )
            //                 })
            //             }
            //         }
            //     }
            // }
        }


        return (
            <div className="service_selection screen1">
                <div className="title_block">
                            <span className="prev_block" onClick={()=> {
                                setScreen(3);
                                //if (!isStartMovingVisit) {
                                    refreshTimetable()
                                //}
                            }}>Назад</span>
                    <p className="modal_title">Выбор времени</p>
                    {selectedTime && !isStartMovingVisit && <span className="next_block" onClick={()=>{
                        setScreen(5);
                        refreshTimetable();
                    }}>Вперед</span>}
                </div>
                <div className="specialist">
                    {selectedStaff.staffId &&
                    <div>
                        <p className="img_container">
                            <img
                                src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                alt=""/>
                            <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                        </p>

                    </div>
                    }
                    {selectedService.serviceId &&
                    <div className="supperVisDet" >
                        {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                            (<p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>)}

                    </div>
                    }
                    {selectedDay &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedDay).utc().locale('ru').format('DD MMMM YYYY')}</strong>
                    </div>
                    }
                </div>
                {!!this.state.arrayTime && (
                    <React.Fragment>
                        <p className="modal_title">Перенести визит?</p>
                        <div className="approveF">

                            <button className="approveFYes"  onClick={()=>{
                                setTime(this.state.arrayTime)
                                this.setState({arrayTime: 0})
                            }}>Да
                            </button>
                            <button className="approveFNo" onClick={()=>{
                                selectStaff(staffs.find(staff => staff.staffId === movingVisit && movingVisit[0] && movingVisit[0].staffId))
                                handleDayClick(movingVisit && movingVisit[0] && movingVisit[0].appointmentTimeMillis)
                                this.props.dispatch(staffActions.toggleStartMovingVisit(false))
                                this.props.dispatch(staffActions.toggleMovedVisitSuccess(true))
                                setScreen(6)
                            }}>Нет
                            </button>
                        </div>
                    </React.Fragment>
                )}
                {!this.state.arrayTime && (
                    <div className="choise_time">
                        {availableTimes.sort((a, b) => a.time.localeCompare(b.time)).map( availableTime => availableTime.markup)}
                    </div>
                )}
            </div>
        );
    }
}
export default connect()(TabFour);