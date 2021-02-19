import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import StarRatings from "react-star-ratings";
import { staffActions } from "../../_actions";
import moment from 'moment';
import { withTranslation } from "react-i18next";
import i_icon from "../../../public/img/icons/i.svg"
import arrow_down from "../../../public/img/icons/arrow_down_white.svg";
import { compose } from 'redux';
import MediaQuery from 'react-responsive'
import TabCreateComment from "./TabCreateComment"
import TabStaffComments from "./TabStaffComments"
class TabOne extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            staff: null,
            openList: false,
        }
        this.handleStaffCommentsClick = this.handleStaffCommentsClick.bind(this);
        this.handleSelectStaff = this.handleSelectStaff.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { movingVisit } = newProps
        if (newProps.services && newProps.isStartMovingVisit && movingVisit && (JSON.stringify(this.props.services) !== JSON.stringify(newProps.services))) {
            movingVisit && movingVisit.forEach(visit => {
                this.props.selectService({ target: { checked: true } }, newProps.services.find(service => service.serviceId === visit.serviceId))

            })
            //this.props.refreshTimetable()
        }
    }

    handleStaffCommentsClick(staff) {
        this.props.setStaffComments(staff);
        this.props.setScreen('staff-comments');
    }

    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    handleNoStaffClick() {
        const { setScreen, isStartMovingVisit, forceUpdateStaff, selectedTime: time, timetableAvailable, staffs } = this.props;

        const updatedState = {};

        const selectedStaffFromTimetableList = timetableAvailable.filter(timetableItem =>
            timetableItem.availableDays && timetableItem.availableDays.some(avDayItem => avDayItem.availableTimes.some(avTimeItem => {
                return avTimeItem.startTimeMillis <= time && time <= avTimeItem.endTimeMillis
            })));
        const randomStaffIndex = this.randomInteger(0, (selectedStaffFromTimetableList.length - 1));
        const selectedStaffFromTimetable = selectedStaffFromTimetableList[randomStaffIndex];

        updatedState.selectedStaff = staffs.find(item => item.staffId === selectedStaffFromTimetable.staffId);
        forceUpdateStaff(updatedState.selectedStaff)
        if (isStartMovingVisit) {
            this.setState({ staff: updatedState.selectedStaff })
        } else {
            setScreen(5);
        }
    }

    handleSelectStaff(e, staff) {
        const { selectStaff, forceUpdateStaff, flagAllStaffs, setScreen, isStartMovingVisit } = this.props;
        if (isStartMovingVisit && flagAllStaffs) {
            forceUpdateStaff(staff)
            this.setState({ staff })
        } else if (e.target.className !== 'staff-comments') {
            selectStaff(staff)
            if (flagAllStaffs) {
                setScreen(5)
            }
        }
    }

    render() {
        const { t, staffId, isLoading, selectedDay, handleMoveVisit, error, handleDayClick, newAppointments, staffs, selectedTime: time, timetableAvailable, isStartMovingVisit, setDefaultFlag, selectedServices, flagAllStaffs, movingVisit, services, subcompanies, history, match, clearStaff, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown, getDurationForCurrentStaff } = this.props;
        const { openList } = this.state;
        const desctop=710;
        const mob=709;
        let serviceInfo = null;

        let currentDay = moment(selectedDay).format('MMMM,DD');
        let currentDayMob = moment(selectedDay).format('DD MMM YYYY');
        currentDay = currentDay[0].toUpperCase() + currentDay.slice(1);
        currentDay = currentDay.split(",")
        currentDay = currentDay.reverse()
        currentDay = currentDay.join(" ")

        let padding_left = "21px";
        let padding_right = "39px";
        let sizeWords = "36px";
        let margin_right = "22px";
        let priceFrom = 0;
        let priceTo = 0;
        let duration = 0;
        selectedServices.forEach((service) => {
            priceFrom += parseInt(service.priceFrom)
            priceTo += parseInt(service.priceTo)
            duration += parseInt(getDurationForCurrentStaff(service))
        })

        const priceFrom100 = priceFrom / 100;
        const priceTo100 = priceTo / 100;
        const priceFrom1000 = priceFrom / 1000;
        const priceTo1000 = priceTo / 1000;

        if (priceFrom1000 > 1 || priceTo1000 > 1) {
            sizeWords = "24px"
            padding_left = "0px";
            padding_right = "0px";
            margin_right = "0px";
        }
        else if (priceFrom100 > 1 || priceTo100 > 1) {
            sizeWords = "32px"
            padding_left = "0px";
            padding_right = "0px";
            margin_right = "0px";
        }

        serviceInfo = (
            <div>
                <MediaQuery maxWidth={mob}>
                    <div className="specialist">
                        <div className="specialist-block">

                            <div className="supperVisDet service_footer-block">

                                <div className="service_footer_price">
                                    <p style={{
                                        color: 'white',
                                        fontSize: `13px`,
                                        lineHeight: "18px",
                                        fontWeight: "400",
                                    }}>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                                    <span>{selectedServices[0] && selectedServices[0].currency}</span>
                                </div>
                                <div className="time-footer hover" style={{
                                    // marginRight: `${margin_right}`
                                }}>
                                    <p style={{
                                        color: 'white',
                                        fontSize: "13px",
                                        lineHeight: "18px",
                                        letterSpacing: "0.1px",
                                        fontWeight: "400",
                                    }} onClick={event => this.setState({
                                        openList: !openList,
                                    })}>{t("Услуги")}: {selectedServices.length} <img
                                        style={{
                                            marginLeft: "3px",
                                            marginTop: "0px"
                                        }} src={arrow_down} alt="arrou"></img></p>
                                </div>
                                <div className="time-footer" style={{
                                    // marginRight: `${margin_right}`
                                }}>
                                    <p style={{
                                        color: 'white',
                                        fontSize: "13px",
                                        lineHeight: "18px",
                                        letterSpacing: "0.1px",
                                        fontWeight: "400",
                                    }} >{t("Дата")}:</p>
                                    <p style={{
                                        color: 'white',
                                        fontSize: "13px",
                                        lineHeight: "18px",
                                        letterSpacing: "0.1px",
                                        fontWeight: "400",
                                    }} >&nbsp;{currentDayMob}</p>
                                </div>
                            </div >
                            {openList && (
                                <div className="service_list_block">
                                    <div className="setvice_list_items">
                                        {selectedServices.map((element) =>
                                            <div className="setvice_list_item">
                                                <div className="cansel_btn_small"> </div>
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
                    <div className="specialist">
                        <div className="specialist-block">
                            {openList ?
                                <div className="specialist_big">
                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
                                            <p>Услуги:</p>
                                            {selectedServices.map((element) =>
                                                <div className="setvice_list_item">
                                                    <div className="cansel_btn_small"> </div>
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
                                        marginRight: `${margin_right}`
                                    }}>
                                        <p style={{
                                            color: 'white',
                                            fontSize: "13px",
                                            lineHeight: "29px",
                                            letterSpacing: "0.1px",
                                        }} onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Выбрано услуг")}: {selectedServices.length} <img src={arrow_down} alt="arrou"></img></p>
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
                                        }} >{currentDay} {moment(time).format('LT')}</p>
                                    </div>
                                    <span style={{
                                        width: "161px",
                                        height: "30px",
                                    }}></span>
                                </div >
                            }
                        </div>
                    </div>
                </MediaQuery>

            </div>
        )


        if (info && (info.bookingPage === match.params.company) && !info.onlineZapisOn && (parseInt(moment().utc().format('x')) >= info.onlineZapisEndTimeMillis)) {
            return (
                <div className="online-zapis-off">
                    {t("Онлайн-запись отключена")}
                    {(subcompanies.length > 1) && (
                        <button onClick={() => {
                            setScreen(0)
                            this.props.dispatch(staffActions.clearError());
                            let { company } = match.params;
                            let url = company.includes('_') ? company.split('_')[0] : company
                            history.push(`/${url}`)
                        }} style={{ marginTop: '4px', marginBottom: '20px' }} className="book_button">{t("На страницу выбора филиалов")}</button>
                    )}
                </div>
            )
        }
        return info && (info.bookingPage === match.params.company) && (info.onlineZapisOn || (!info.onlineZapisOn && (parseInt(moment().utc().format('x')) < info.onlineZapisEndTimeMillis))) && (
          
          
            <div className="service_selection screen1">
                {this.state.staff && (
                    <div className="approveF">
                        <div className="modal_window_block">
                            <p className="modal_title">{t("Перенести визит?")}</p>
                            <div className="modal_window">
                            <button className="approveFYes" onClick={() => {
                                selectStaff(this.state.staff)
                                handleMoveVisit()
                                setDefaultFlag()
                                this.setState({ staff: null })
                            }}>{t("Да")}
                            </button>
                            <button className="approveFNo" onClick={() => {
                                const activeStaff = staffs.find(staff => staff.staffId === (movingVisit && movingVisit[0] && movingVisit[0].staffId))
                                selectStaff(activeStaff)
                                handleDayClick(movingVisit && movingVisit[0] && movingVisit[0].appointmentTimeMillis)
                                this.props.dispatch(staffActions.toggleStartMovingVisit(false))
                                this.props.dispatch(staffActions.toggleMovedVisitSuccess(true))
                                setScreen(6)
                                setDefaultFlag()
                                this.setState({ staff: null })
                            }}>{t("Нет")}
                            </button>
                            </div>
                        </div>

                    </div>
                )}

                        <div>
                            <div className="skip_employee-block">
                                {<p className="skip_employee" onClick={() => selectStaff([])}>{t("Сотрудник не важен")} <div className="skip-arrow"></div></p>}
                                {/* {!flagAllStaffs && <p className="skip_employee" onClick={() => selectStaff([])}>{t("Сотрудник не важен")} {(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('рабочего места') : (info.companyTypeId === 4 ? t('врача') : t('сотрудника'))}<div className="skip-arrow"></div></p>} */}
                            </div>
                            <div className="title_block n staff_title">
                                {((isStartMovingVisit && newAppointments && !!newAppointments.length) || (flagAllStaffs || (subcompanies.length > 1))) && (
                                    <span className="prev_block" onClick={() => {
                                        if (flagAllStaffs) {
                                            setScreen(4);
                                        } else if (isStartMovingVisit && newAppointments && newAppointments.length) {
                                            setScreen(6);
                                        } else {
                                            clearStaff();
                                            setDefaultFlag();
                                            setScreen(0);
                                            let { company } = match.params;
                                            let url = company.includes('_') ? company.split('_')[0] : company
                                            history.push(`/${url}`)
                                        }
                                    }}><span className="title_block_text">{t("Назад")}</span></span>
                                )}
                                <p className="modal_title">{(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('Выбор рабочего места') : (info.companyTypeId === 4 ? t('Выбор врача') : t('Выберите сотрудника'))}</p>
                            </div>
                                <React.Fragment>
                                    <ul className={`desktop-visible staff_popup ${staffs && staffs.length <= 23 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                                        {staffs && staffs.length > 0 && staffs
                                            .filter(staff => {
                                                const activeServices = movingVisit ? services.filter(item => movingVisit.some(visit => item.serviceId === visit.serviceId)) : [];
                                                return flagAllStaffs || (movingVisit ? (activeServices && activeServices.every(item => (item.staffs && item.staffs.some(localStaff => localStaff.staffId === staff.staffId)))) : true)
                                            })
                                            .filter(staff => {
                                                return isStartMovingVisit || (flagAllStaffs ? selectedServices.some(selectedServ => selectedServ.staffs && selectedServ.staffs.some(selectedServStaff => selectedServStaff.staffId === staff.staffId)) : true)
                                            })
                                            .filter(staff => {
                                                if (flagAllStaffs) {
                                                    return timetableAvailable.filter(timetableItem =>
                                                        timetableItem.availableDays && timetableItem.availableDays.some(avDayItem => avDayItem.availableTimes.some(avTimeItem => {
                                                            return avTimeItem.startTimeMillis <= time && time <= avTimeItem.endTimeMillis
                                                        })))
                                                        .some(item => item.staffId === staff.staffId);
                                                }
                                                return true
                                            })
                                            .map((staff, idStaff) =>
                                                <li className={(staffId && staffId === staff.staffId && 'selected') + ' nb'}
                                                    onClick={(e) => this.handleSelectStaff(e, staff)}
                                                    key={idStaff}
                                                >
                                                    <span className="staff_popup_item">
                                                        <div className="img_container_block">

                                                            <img className="img_container_staff"
                                                                src={staff.imageBase64 ? "data:image/png;base64," + staff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                                alt="" />

                                                            {/* <span className="staff_popup_name"> */}
                                                            <div className="staff_popup-name-stars">
                                                                <div className="staff_popup-name">
                                                                    <p style={
                                                                        {
                                                                            letterSpacing: "0.3px",
                                                                        }
                                                                    }>{staff.firstName} {staff.lastName ? staff.lastName : ''}</p>
                                                                    <div className="mobile_block mobile-visible">
                                                                        <div className="staff-comments">
                                                                            <img onClick={() => this.handleStaffCommentsClick(staff)} src={i_icon}
                                                                            /></div>
                                                                    </div>
                                                                    <div className="mobile_block desktop-visible">
                                                                        <div className="staff-comments">
                                                                            <img onClick={() => this.handleStaffCommentsClick(staff)} src={i_icon}
                                                                            /></div>
                                                                    </div>
                                                                </div>


                                                                <div>
                                                                    {staff.rating ? (
                                                                        <StarRatings
                                                                            rating={staff.rating}
                                                                            starHoverColor={'#ff9500'}
                                                                            starRatedColor={'#ff9500'}
                                                                            starDimension="20px"
                                                                            starSpacing="0"
                                                                        />
                                                                    ) : <p style={{ fontSize: '13px', lineHeight: "20px", opacity: "0.5" }}>{t("Нет отзывов")}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {staff.description && <p style={{
                                                            fontFamily: "Open Sans",
                                                            fontStyle: "normal",
                                                            fontWeight: "normal",
                                                            fontSize: "13px",
                                                            lineHeight: "20px",
                                                            color: "#09093A",
                                                            opacity: "0.5",
                                                            overflow: "hidden",
                                                            margin: "-21px 0px 0px 0px",
                                                        }}>{staff.description} <br /></p>}
                                                        {nearestTime && nearestTime.map((time, id) =>
                                                            time.staffId === staff.staffId && time.availableDays.length !== 0 &&
                                                            <React.Fragment>
                                                                <div className="mobile-visible" key={'time' + id}>
                                                                    <span>{t("Ближ. запись")}</span>
                                                                    <div className="stars" style={{ textTransform: 'capitalize' }}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                                                </div>

                                                                <span className="nearest_appointment">{t("Ближайшая запись")} - {roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</span>

                                                            </React.Fragment>

                                                        )}
                                                        {nearestTime && !nearestTime.some((time, id) =>
                                                            time.staffId === staff.staffId && time.availableDays.length !== 0

                                                        ) && <div className="">
                                                                <span style={{ fontSize: '13px', lineHeight: '20px', opacity: '0.5' }}>{t("Нет записи")}</span>
                                                            </div>
                                                        }

                                                        {/* </span> */}
                                                    </span>
                                                </li>
                                            )}
                                    </ul>
                                </React.Fragment>
                        </div>
                {/* футер услуг */}
                {selectedServices[0] && serviceInfo}
                {/*  */}


            </div >
        );
    }
}
export default connect()(withTranslation("common")(TabOne));
