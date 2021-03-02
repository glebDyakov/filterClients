import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import DayPicker from "react-day-picker";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import MediaQuery from 'react-responsive'
import cansel from "../../../public/img/icons/cansel_black.svg";
import { culcDay } from "../../_helpers/data-calc"
import { imgSvg } from "../../_helpers/svg"
class TabFour extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            arrayTime: 0,
            openList: false,
        }
        this.openListFunc = this.openListFunc.bind(this);
    }
    openListFunc() {
        this.setState({
            openList: !this.state.openList,
        })
    }
    render() {

        const { t, flagAllStaffs, serviceIntervalOn, getDurationForCurrentStaff, movingVisit, staffs, handleDayClick, selectStaff, setScreen, isStartMovingVisit, refreshTimetable, selectedStaff, selectedService, selectedDay, selectedServices, timetableAvailable, setTime } = this.props;
        const { openList } = this.state;
        const desctop = 600;
        const mob = 599;
        const availableTimes = []

        const currentDay = culcDay(selectedDay, "desctop");

        let interval = 15;
        if (serviceIntervalOn && selectedServices && selectedServices.length > 0) {
            interval = 0
            selectedServices.forEach(item => {
                interval += (getDurationForCurrentStaff(item) / 60)
            })
        }

        if (timetableAvailable) {
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
                            const isAdded = availableTimes.find(availableTime => availableTime.time === moment(arrayTime).format('HH:mm'))
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
                        }
                        )
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

            let margin_right1 = "25px";
            let margin_right2 = "53px";
            let sizeWords = "36px";
            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "24px"
                margin_right1 = "0px";
                margin_right2 = "0px";
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "32px"
                margin_right1 = "0px";
                margin_right2 = "0px";
            }
            serviceInfo = (
                <div>
                    <MediaQuery maxWidth={mob}>
                        <div className="specialist" onClick={event => this.openListFunc()}>

                            <div className="specialist-block">
                            {imgSvg}
                                <div className="supperVisDet service_footer-block">

                                    <div className="service_footer_price">
                                        {priceFrom === priceTo
                                            ? (<React.Fragment>
                                                <div className="price_footer_service_item">
                                                    <div className="price_footer_service_half">
                                                        <p>{priceFrom}</p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                            </React.Fragment>)
                                            : (<React.Fragment>
                                                <div className="price_footer_service_item">
                                                    <div className="price_footer_service_half">
                                                        <p><p>{t("от")}</p>{priceFrom}</p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                                <div className="price_footer_service_item">
                                                    <div className="price_footer_service_half">
                                                        <p><p>{t("до")}</p>{priceTo} </p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                            </React.Fragment>)
                                        }
                                    </div>
                                   
                                    <div className="time-footer hover" >
                                        <p className="time_footer_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Услуги")}: {selectedServices.length} </p>
                                          <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                        </p>
                                    </div>
                                    <div className="time-footer">
                                        <p className="time_footer_p" >{t("Дата")}:</p>
                                        <p className="time_footer_p" >{t(`${currentDay}`)}</p>
                                    </div>
                                </div >
                                {openList && (
                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
                                            {selectedServices.map((element) =>
                                                <div className="setvice_list_item">
                                                    <div className="service_circle">
                                                        <div className="service_circle_center"></div>
                                                    </div>
                                                    <p>{element.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {!!selectedServices.length && <button className="next_block" onClick={() => {
                                    if (selectedServices.length) {
                                        setScreen(3);
                                    }
                                    refreshTimetable();
                                }}>
                                    <span className="title_block_text">{t("Продолжить")}</span></button>}
                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery minWidth={desctop}>
                        <div className="specialist-block">
                            {imgSvg}
                            {openList ?
                                <div className="specialist_big">
                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
                                            <p className="text_underline">{selectedStaff.firstName} {selectedStaff.lastName ? selectedStaff.lastName : ''}</p>
                                            <p>{t("Услуги")}:</p>
                                            {selectedServices.map((element, index) =>
                                                <div key={index} className="setvice_list_item">
                                                    <div className="service_circle">
                                                        <div className="service_circle_center"></div>
                                                    </div>
                                                    <p>{element.name}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="cansel_btn_big" onClick={event => this.setState({
                                            openList: !openList,
                                        })}> </div>
                                    </div>
                                </div>
                                :
                                <div className="supperVisDet service_footer-block">

                                    <div className="service_footer_price">
                                        <p style={{
                                            color: 'white',
                                            fontSize: `${sizeWords}`,
                                            lineHeight: "49px",
                                        }}>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                                        <span>{selectedServices[0] && selectedServices[0].currency}</span>
                                    </div>
                                    <div className="time-footer hover" style={{
                                        marginRight: `${margin_right1}`
                                    }}>
                                        <p className="time-footer_desctop_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Выбрано услуг")}: {selectedServices.length}</p>
                                        {/* } */}
                                        <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                        </p>
                                    </div>
                                    <div className="time-footer" style={{
                                        marginRight: `${margin_right2}`
                                    }}>
                                        <p className="time-footer_desctop_p" >{t("Дата")}:</p>
                                        <p className="service_footer_price_small_text" >{t(`${currentDay}`)}</p>
                                    </div>
                                    {!!selectedServices.length && <button className="next_block" onClick={() => {
                                        if (selectedServices.length) {
                                            setScreen(4);
                                        }
                                        refreshTimetable();
                                    }}>
                                        <span className="title_block_text">{t("Продолжить")}</span></button>}
                                </div >
                            }
                        </div>
                    </MediaQuery>
                </div>

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
                <div className="specialist" onClick={event => this.openListFunc()}>

                    {serviceInfo}

                </div>


                {this.state.arrayTime ?
                    (<div className="approveF">
                        <div className="modal_window_block">
                            <div className="modal_window_text">
                                <p className="modal_title">{t("Перенести визит")}?</p>
                                <img src={cansel} onClick={e => this.setState({
                                    arrayTime: 0,
                                })} alt="cansel" />
                            </div>
                            <div className="modal_window_btn">
                                <button className="approveFYes" onClick={() => {
                                    setTime(this.state.arrayTime, true)
                                    this.setState({ arrayTime: 0 })
                                }}>{t("Да")}
                                </button>
                                <div style={{
                                    height: "38px",
                                    width: "1px",
                                    backgroundColor: "rgba(9, 9, 58, 0.1)"
                                }}></div>
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
                        </div>
                    </div>) : ""

                }

                <div className="choise_time">
                    {availableTimes.sort((a, b) => a.time.localeCompare(b.time)).map(availableTime => availableTime.markup)}
                </div>
            </div>
        );
    }
}
export default connect()(withTranslation("common")(TabFour));