import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import DayPicker from "react-day-picker";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import MediaQuery from 'react-responsive'
import cansel from "../../../public/img/icons/cansel_black.svg";
import { culcDay } from "../../_helpers/data-calc"
import { CURSOR_ICON } from '../../_constants/svg.constants';
import {TABLET_WIDTH} from '../../_constants/global.constants'
class TabFour extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            arrayTime: "",
            openList: false,
            chekTime: "",
            checkReschedule: false
        }
        this.openListFunc = this.openListFunc.bind(this);
        this.rescheduleVisit = this.rescheduleVisit.bind(this);
    }
    openListFunc(event) {
        if (event.target !== "title_block_text") {
            this.setState({
                openList: !this.state.openList,
            })
        }

    }
    rescheduleVisit() {
        const { movedVisitSuccess, setTime, flagAllStaffs } = this.props;
        if (movedVisitSuccess !== undefined && !flagAllStaffs) {
            this.setState({
                checkReschedule: true
            })
        } else {
            setTime(this.state.arrayTime, false)
        }

    }
    render() {

        const { t, flagAllStaffs, company, movedVisitSuccess, getDurationForCurrentStaff, movingVisit, selectedTime: time, staffs, handleDayClick, selectStaff, setScreen, isStartMovingVisit, refreshTimetable, selectedStaff, selectedService, selectedDay, selectedServices, timetableAvailable, setTime } = this.props;
        const { openList } = this.state;
        const availableTimes = []
        const currentDay = culcDay(selectedDay, "desktop");
        let currentTimeText = "";
        if (moment(this.state.arrayTime).format('LT') !== "Invalid date") {
            currentTimeText = moment(this.state.arrayTime).format('LT');
        }
        let interval = company.booktimeOnlineStepSec ? company.booktimeOnlineStepSec / 60 : 15;
        // if (!company.booktimeOnlineStepSec && selectedServices && selectedServices.length > 0) {
        //     interval = 0
        //     selectedServices.forEach(item => {
        //         interval += (getDurationForCurrentStaff(item) / 60)
        //     })
        // }

        if (timetableAvailable) {
            timetableAvailable.map(timetableItem =>
                timetableItem.availableDays && timetableItem.availableDays.map((workingStaffElement, i) =>
                    parseInt(moment(workingStaffElement.dayMillis, 'x').startOf('day').format('x')) === parseInt(moment(selectedDay).startOf('day').format('x')) &&
                    workingStaffElement.availableTimes.map((workingTime) => {
                        const currentMinutes = moment().format('mm') - (moment().format('mm') % interval) + interval;
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
                                                this.setState({ arrayTime })
                                                // setTime(arrayTime, false)
                                            }
                                        }}>
                                            <span className={arrayTime === this.state.arrayTime ? "time_color" : ""}>{moment(arrayTime, 'x').format('HH:mm')}</span>
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
                priceFrom += Number(service.priceFrom)
                priceTo += Number(service.priceTo)
                duration += Number(getDurationForCurrentStaff(service))
            })
            priceTo=Math.floor(priceTo * 100) / 100;
            priceFrom=Math.floor(priceFrom * 100) / 100;
            let sizeWords = "23px";
            const priceFrom100 = priceFrom / 100;
            const priceTo100 = priceTo / 100;
            const priceFrom1000 = priceFrom / 1000;
            const priceTo1000 = priceTo / 1000;

            if (priceFrom1000 > 1 || priceTo1000 > 1) {
                sizeWords = "20px"
            }
            else if (priceFrom100 > 1 || priceTo100 > 1) {
                sizeWords = "22px"
            }
            serviceInfo = (
                <div>
                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
                        <div className="specialist" onClick={event => this.openListFunc(event)}>

                            <div className="specialist-block">
                                {CURSOR_ICON}
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
                                                        <p>{priceFrom}</p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                                <p>-&nbsp;</p>
                                                <div className="price_footer_service_item">
                                                    <div className="price_footer_service_half">
                                                        <p>{priceTo} </p>
                                                        <span >{selectedServices[0] && selectedServices[0].currency}</span>
                                                    </div>
                                                </div>
                                            </React.Fragment>)
                                        }
                                    </div>

                                    <div className="time-footer hover" >
                                        <p className="time_footer_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("????????????")}: {selectedServices.length} </p>
                                        <p className="service_footer_price_small_text" >{t("????????????????????????")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("??")}] m[ ${t("??????????")}]`)}
                                        </p>
                                    </div>
                                    <div className="time-footer">
                                        <p className="time_footer_p" >{t("????????")}:</p>
                                        <p className="time_footer_p" >{t(`${currentDay}`)} </p>
                                        <p className="time_footer_p" >{currentTimeText}</p>
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
                                {!!selectedServices.length && <button disabled={!this.state.arrayTime} className={this.state.arrayTime ? "next_block" : "next_block disabledField"} onClick={() => this.rescheduleVisit()}>
                                    <span className="title_block_text">{t("????????????????????")}</span></button>}
                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery minWidth={TABLET_WIDTH}>
                        <div className="specialist-block">
                            {CURSOR_ICON}
                            {openList ?
                                <div className="specialist_big">
                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
                                            <p className="text_underline">{selectedStaff.firstName} {selectedStaff.lastName ? selectedStaff.lastName : ''}</p>
                                            <p>{t("????????????")}:</p>
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
                                    <div className="time-footer hover" >
                                        <p className="time-footer_desktop_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("?????????????? ??????????")}: {selectedServices.length}</p>
                                        {/* } */}
                                        <p className="service_footer_price_small_text" >{t("????????????????????????")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("??")}] m[ ${t("??????????")}]`)}
                                        </p>
                                    </div>
                                    <div className="time-footer" >
                                        <p className="time-footer_desktop_p" >{t("????????")}:</p>
                                        <p className="service_footer_price_small_text" >{t(`${currentDay}`)} {currentTimeText}</p>
                                    </div>
                                    {!!selectedServices.length && <button disabled={!this.state.arrayTime} className={this.state.arrayTime ? "next_block" : "next_block disabledField"} onClick={() => this.rescheduleVisit()}>
                                        <span className="title_block_text">{t("????????????????????")}</span></button>}
                                </div >
                            }
                        </div>
                    </MediaQuery>
                </div>

            )
        }

        return (
            <div className="service_selection screen4">
                <div className="service_selection_block_four">

                    <div className="title_block staff_title">
                        <span className="prev_block" onClick={() => {
                            setScreen(3);
                            //if (!isStartMovingVisit) {
                            refreshTimetable()
                            //}
                        }}><span className="title_block_text">{t("??????????")}</span>
                        </span>
                        <p className="modal_title">{t("???????????????? ??????????")}</p>
                    </div>
                    <div className="specialist" onClick={event => this.openListFunc(event)}>

                        {serviceInfo}

                    </div>


                    {this.state.checkReschedule ?
                        (<div className="approveF">
                            <div className="modal_window_block">
                                <div className="modal_window_text">
                                    <p className="modal_title">{t("?????????????????? ??????????")}?</p>
                                    <img src={cansel} onClick={e => this.setState({
                                        checkReschedule: false,
                                    })} alt="cansel" />
                                </div>
                                <div className="modal_window_btn">
                                    <button className="approveFYes" onClick={() => {
                                        setTime(this.state.arrayTime, true)
                                        this.setState({ arrayTime: 0 })
                                    }}>{t("????")}
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
                                    }}>{t("??????")}
                                    </button>
                                </div>
                            </div>
                        </div>) : ""
                    }

                    <div className="choise_time">
                        {availableTimes.sort((a, b) => a.time.localeCompare(b.time)).map(availableTime => availableTime.markup)}
                    </div>
                </div>
            </div>
        );
    }
}
export default connect()(withTranslation("common")(TabFour));