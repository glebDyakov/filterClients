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

        const {selectedTime, flagAllStaffs, serviceIntervalOn, getDurationForCurrentStaff, movingVisit, staffs, handleDayClick, selectStaff, setScreen, isStartMovingVisit, refreshTimetable,selectedStaff, selectedService, selectedDay, selectedServices, timetableAvailable, setTime} = this.props;

        const availableTimes = []

        let interval = 15;
        if (serviceIntervalOn && selectedServices && selectedServices.length > 0) {
            interval = 0
            selectedServices.forEach(item => {
                interval += (getDurationForCurrentStaff(item) / 60)
            })
        }

        if(!this.state.arrayTime && timetableAvailable) {
            timetableAvailable.map(timetableItem =>
                timetableItem.availableDays.map((workingStaffElement, i) =>
                    parseInt(moment(workingStaffElement.dayMillis, 'x').startOf('day').format('x'))===parseInt(moment(selectedDay).startOf('day').format('x')) &&
                    workingStaffElement.availableTimes.map((workingTime) => {
                        const currentMinutes = moment().format('mm') - (moment().format('mm') % 15) + 15;
                        const currentTime = parseInt(moment((moment().add(currentMinutes === 60 ? 1 : 0, 'hour').format("YYYY MMMM DD HH:") + (currentMinutes % 60)), 'YYYY MMMM DD HH:mm').format('x'));

                        const countTimes = (workingTime.endTimeMillis - workingTime.startTimeMillis) / 1000 / 60 / interval + 1;
                        const arrayTimes = []
                        let startTime = workingTime.startTimeMillis
                        if (workingTime.startTimeMillis < currentTime) {
                            startTime = currentTime
                        }

                        for( let i = 0 ; i< Math.ceil(countTimes); i++) {
                            const localCountTime = startTime + (1000 * 60 * interval * i)
                            if (localCountTime <= workingTime.endTimeMillis) {
                                arrayTimes.push(localCountTime)
                            }
                        }


                        arrayTimes.forEach(arrayTime => {
                            //if (arrayTime >= currentTime) {
                                let isAdded = availableTimes.find(availableTime => availableTime.time === moment(arrayTime).format('HH:mm'))
                                if (!isAdded) {
                                    availableTimes.push({
                                        time: moment(arrayTime).format('HH:mm'),
                                        markup: (
                                            <div key={arrayTime} onClick={() => {
                                                if (isStartMovingVisit && !flagAllStaffs) {
                                                    this.setState({arrayTime})
                                                } else {
                                                    setTime(arrayTime, false)
                                                }
                                            }}>
                                                <span>{moment(arrayTime, 'x').format('HH:mm')}</span>
                                            </div>
                                        )
                                    })
                                }
                            //}
                        })
                        }
                    )
                )
            )
        }


        let serviceInfo = null
        if (selectedService.serviceId) {
            let priceFrom = 0;
            let priceTo= 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })

            serviceInfo = (
                <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                        (<p>Выбрано услуг: <strong className="service_item_price">{selectedServices.length}</strong></p>)}
                    <p className={selectedServices.some((service) => service.priceFrom!==service.priceTo) && 'sow'}><strong className="service_item_price">{priceFrom}{priceFrom!==priceTo && " - "+priceTo}&nbsp;</strong> <span>{selectedServices[0] && selectedServices[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format("h[ ч] m[ мин]")}</strong>
                    </span>
                    <div className="supperVisDet_info">
                        <p className="supperVisDet_info_title">Список услуг:</p>
                        {selectedServices.map(service => (
                            <p>• {service.name}</p>
                        ))}
                        <span className="supperVisDet_closer" />
                    </div>
                    <img className="tap-service-icon" src={`${process.env.CONTEXT}public/img/tap-service.svg`}/>
                </div>
            )
        }

        return (
            <div className="service_selection screen1">
                <div className="title_block">
                            <span className="prev_block" onClick={()=> {
                                setScreen(3);
                                //if (!isStartMovingVisit) {
                                    refreshTimetable()
                                //}
                            }}><span className="title_block_text">Назад</span>
                            </span>
                    <p className="modal_title">Выбор времени</p>
                    {selectedTime && !isStartMovingVisit && <span className="next_block" onClick={()=>{
                        if (flagAllStaffs) {
                            setScreen(1);
                        } else {
                            setScreen(5);
                            refreshTimetable();
                        }
                    }}><span className="title_block_text">Далее</span>
                    </span>}
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
                    {serviceInfo && serviceInfo}
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
                                setTime(this.state.arrayTime, true)
                                this.setState({arrayTime: 0})
                            }}>Да
                            </button>
                            <button className="approveFNo" onClick={()=>{
                                const activeStaff=staffs.find(staff => staff.staffId === (movingVisit && movingVisit[0] && movingVisit[0].staffId))
                                selectStaff(activeStaff)
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