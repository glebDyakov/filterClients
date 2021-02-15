import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import DayPicker from "react-day-picker";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import arrow_down from "../../../public/img/icons/arrow_down_white.svg";
class TabFour extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            arrayTime: 0
        }
    }

    render() {

        const { t, selectedTime, flagAllStaffs, serviceIntervalOn, getDurationForCurrentStaff, movingVisit, staffs, handleDayClick, selectStaff, setScreen, isStartMovingVisit, refreshTimetable, selectedStaff, selectedService, selectedDay, selectedServices, timetableAvailable, setTime } = this.props;

        const availableTimes = []

        let interval = 15;
        if (serviceIntervalOn && selectedServices && selectedServices.length > 0) {
            interval = 0
            selectedServices.forEach(item => {
                interval += (getDurationForCurrentStaff(item) / 60)
            })
        }

        if (!this.state.arrayTime && timetableAvailable) {
            timetableAvailable.map(timetableItem =>
                timetableItem.availableDays && timetableItem.availableDays.map((workingStaffElement, i) =>
                    parseInt(moment(workingStaffElement.dayMillis, 'x').startOf('day').format('x')) === parseInt(moment(selectedDay).startOf('day').format('x')) &&
                    workingStaffElement.availableTimes.map((workingTime) => {
                        const currentMinutes = moment().format('mm') - (moment().format('mm') % 15) + 15;
                        const currentTime = parseInt(moment((moment().add(currentMinutes === 60 ? 1 : 0, 'hour').format("YYYY MMMM DD HH:") + (currentMinutes % 60)), 'YYYY MMMM DD HH:mm').format('x'));

                        const countTimes = (workingTime.endTimeMillis - workingTime.startTimeMillis) / 1000 / 60 / interval + 1;
                        const arrayTimes = []
                        let startTime = workingTime.startTimeMillis
                        if (workingTime.startTimeMillis < currentTime) {
                            startTime = currentTime
                        }

                        for (let i = 0; i < Math.ceil(countTimes); i++) {
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
                                                this.setState({ arrayTime })
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
            let priceTo = 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })
            
            let margin_right = "22px";
            let sizeWords = "36px";
            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "24px"
                margin_right = "0px";
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "32px"
                margin_right = "0px";
            }
            serviceInfo = (
                <div className="supperVisDet service_footer-block">
                    {/* {(selectedServices.length === 1) ?  */}
                    {/* <p style={{ color: 'white' }}>{selectedServices[0].name}</p>  */}
                    {/* : */}
                    {/* <div className={selectedServices.some((service) => service.priceFrom !== service.priceTo) && 'sow service_footer_price'}> */}
                    <div className="service_footer_price">
                        <p style={{
                            color: 'white',
                            fontSize: `${sizeWords}`,
                            lineHeight: "49px",
                        }}>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                        <span>{selectedServices[0] && selectedServices[0].currency}</span>
                    </div>
                    <div className="time-footer" style={{
                        marginRight: `${margin_right}`
                    }}>
                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "29px",
                            letterSpacing: "0.1px",
                        }}>{t("Выбрано услуг")}: {selectedServices.length} <img src={arrow_down} alt="arrou"></img></p>
                        {/* } */}
                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "18px",
                            letterSpacing: "0.1px",
                        }} >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                        </p>
                    </div>
                    <div className="time-footer" style={{
                        marginRight: `${margin_right}`
                    }}>
                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "29px",
                            letterSpacing: "0.1px",
                        }} >{t("Дата")}:</p>
                        <p style={{
                            color: 'white',
                            fontSize: "13px",
                            lineHeight: "18px",
                            letterSpacing: "0.1px",
                        }} >{moment(selectedDay).utc().format('DD MMMM YYYY')}</p>
                    </div>
                    {!!selectedServices.length && <button className="next_block" onClick={() => {
                        if (selectedServices.length) {
                            setScreen(3);
                        }
                        refreshTimetable();
                    }}>
                        <span className="title_block_text">{t("Продолжить")}</span></button>}
                </div >
            )
        }

        return (
            <div className="service_selection screen1">
                <div className="title_block staff_title">
                    <span className="prev_block" onClick={() => {
                        setScreen(3);
                        //if (!isStartMovingVisit) {
                        refreshTimetable()
                        //}
                    }}><span className="title_block_text">{t("Назад")}</span>
                    </span>
                    <p className="modal_title">{t("Выберите время")}</p>
                </div>
                <div className="specialist">
                    <div className="specialist-block">
                        {/* {selectedStaff.staffId &&
                    <div>
                        <p className="img_container">
                            <img
                                src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                alt=""/>
                            <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                        </p>

                    </div>
                    } */}
                        {serviceInfo && serviceInfo}
                        {/* {selectedDay &&
                    <div className="date_item_popup">
                       
                    </div>
                     }  */}
                    </div>
                </div>
                {!!this.state.arrayTime && (
                    <React.Fragment>
                        <p className="modal_title">{t("Перенести визит?")}</p>
                        <div className="approveF">

                            <button className="approveFYes" onClick={() => {
                                setTime(this.state.arrayTime, true)
                                this.setState({ arrayTime: 0 })
                            }}>{t("Да")}
                            </button>
                            <button className="approveFNo" onClick={() => {
                                const activeStaff = staffs.find(staff => staff.staffId === (movingVisit && movingVisit[0] && movingVisit[0].staffId))
                                selectStaff(activeStaff)
                                handleDayClick(movingVisit && movingVisit[0] && movingVisit[0].appointmentTimeMillis)
                                this.props.dispatch(staffActions.toggleStartMovingVisit(false))
                                this.props.dispatch(staffActions.toggleMovedVisitSuccess(true))
                                setScreen(6)
                            }}>{t("Нет")}
                            </button>
                        </div>
                    </React.Fragment>
                )}
                {!this.state.arrayTime && (
                    <div className="choise_time">
                        {availableTimes.sort((a, b) => a.time.localeCompare(b.time)).map(availableTime => availableTime.markup)}
                    </div>
                )}
            </div>
        );
    }
}
export default connect()(withTranslation("common")(TabFour));