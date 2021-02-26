import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import StarRatings from "react-star-ratings";
import { staffActions } from "../../_actions";
import moment from 'moment';
import { withTranslation } from "react-i18next";
import i_icon from "../../../public/img/icons/i.svg"
import arrow_down from "../../../public/img/icons/arrow_down_white.svg";
import cansel from "../../../public/img/icons/cansel_black.svg";
import { compose } from 'redux';
import MediaQuery from 'react-responsive'
import { culcDay } from "../../_helpers/data-calc"
class TabOne extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            staff: null,
            openList: false,
        }
        this.handleStaffCommentsClick = this.handleStaffCommentsClick.bind(this);
        this.handleSelectStaff = this.handleSelectStaff.bind(this);
        this.approveFNo = this.approveFNo.bind(this);
        this.approveFYes = this.approveFYes.bind(this);
    }
    approveFNo() {
        const activeStaff = this.props.staffs.find(staff => staff.staffId === (movingVisit && movingVisit[0] && movingVisit[0].staffId))
        this.props.selectStaff(activeStaff)
        this.props.handleDayClick(movingVisit && movingVisit[0] && movingVisit[0].appointmentTimeMillis)
        this.props.dispatch(staffActions.toggleStartMovingVisit(false))
        this.props.dispatch(staffActions.toggleMovedVisitSuccess(true))
        this.props.setScreen(6)
        this.props.setDefaultFlag()
        this.setState({ staff: null })
    }
    approveFYes() {
        this.props.selectStaff(this.state.staff)
        this.props.handleMoveVisit()
        this.props.setDefaultFlag()
        this.setState({ staff: null })
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
        } else if (e.target.className !== 'staff-comments' && e.target.className !== 's') {
            selectStaff(staff)
            if (flagAllStaffs) {
                setScreen(5)
            }
        }
    }

    render() {
        const { t, staffId, isLoading, selectedDay, handleMoveVisit, error, handleDayClick, newAppointments, staffs, selectedTime: time, timetableAvailable, isStartMovingVisit, setDefaultFlag, selectedServices, flagAllStaffs, movingVisit, services, subcompanies, history, match, clearStaff, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown, getDurationForCurrentStaff } = this.props;
        const { openList } = this.state;
        const desctop = 710;
        const mob = 709;
        let serviceInfo = null;

        const currentDay = culcDay(selectedDay, "desctop");
        const currentDayMob = culcDay(selectedDay, "mob");

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
            margin_right = "0px";
        }
        else if (priceFrom100 > 1 || priceTo100 > 1) {
            sizeWords = "32px"
            margin_right = "0px";
        }

        serviceInfo = (
            <div>
                <MediaQuery maxWidth={mob}>
                    <div className="specialist">
                        <div className="specialist-block">

                            <div className="supperVisDet service_footer-block">

                                <div className="service_footer_price">
                                    <p className="service_footer_price_text">{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                                    <span>{selectedServices[0] && selectedServices[0].currency}</span>
                                </div>
                                <div className="time-footer hover">
                                    <p className="time_footer_p" onClick={event => this.setState({
                                        openList: !openList,
                                    })}>{t("Услуги")}: {selectedServices.length} <img
                                        style={{
                                            marginLeft: "3px",
                                            marginTop: "0px"
                                        }} src={arrow_down} className={openList ? "" : "arrow_rotate"} alt="arrou"></img></p>
                                </div>
                                <div className="time-footer">
                                    <p className="time_footer_p" >{t("Дата")}:</p>
                                    <p className="time_footer_p" >&nbsp;{currentDayMob}</p>
                                </div>
                            </div >
                            {openList && (
                                <div className="service_list_block">
                                    <div className="setvice_list_items">
                                        {selectedServices.map((element, index) =>
                                            <div key={index} className="setvice_list_item">
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
                                            <p>{t("Услуги:")}Услуги:</p>
                                            {selectedServices.map((element, index) =>
                                                <div key={index} className="setvice_list_item">
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
                                        <p className="time-footer_desctop_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Выбрано услуг")}: {selectedServices.length} <img src={arrow_down} className="arrow_rotate" alt="arrou"></img></p>
                                        {/* } */}
                                        <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                        </p>
                                    </div>
                                    <div className="time-footer" style={{
                                        marginRight: `${margin_right}`
                                    }}>
                                        <p className="time-footer_desctop_p" >{t("Дата")}:</p>
                                        <p className="service_footer_price_small_text" >{currentDay} {moment(time).format('LT')}</p>
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
                            const { company } = match.params;
                            const url = company.includes('_') ? company.split('_')[0] : company
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
                            <div className="modal_window_text">
                                <p className="modal_title">{t("Перенести визит?")}</p>
                                <img src={cansel} onClick={e => this.setState({ staff: null })} alt="cansel" />
                            </div>
                            <div className="modal_window_btn">
                                <button className="approveFYes" onClick={() => this.approveFYes}>{t("Да")}
                                </button>
                                <div style={{
                                    height: "38px",
                                    width: "1px",
                                    backgroundColor: "rgba(9, 9, 58, 0.1)"
                                }}></div>
                                <button className="approveFNo" onClick={() => this.approveFNo}>{t("Нет")}
                                </button>
                            </div>

                        </div>

                    </div>
                )}

                <div>
                    <div className="skip_employee-block">
                        {<p className="skip_employee" onClick={() => selectStaff([])}>{t("Сотрудник не важен")} <div className="skip-arrow-blue"></div></p>}
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
                                    const { company } = match.params;
                                    const url = company.includes('_') ? company.split('_')[0] : company
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
                                .map((staff, idStaff, array) => 
                                    <li className={(staffId && staffId === staff.staffId && 'selected') + ' nb' + (array.length === 1 && " service_items_grow")}
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
                                                        <div onClick={() => this.handleStaffCommentsClick(staff)} className="mobile_block desktop-visible">
                                                            <div className="staff-comments">
                                                                <img className="s" src={i_icon}
                                                                /></div>
                                                        </div>
                                                    </div>


                                                    <div>
                                                        {staff.rating ? (
                                                            <div style={{
                                                                display: "flex",
                                                            }}>
                                                                <StarRatings
                                                                    rating={staff.rating}
                                                                    starHoverColor={'#ff9500'}
                                                                    starRatedColor={'#ff9500'}
                                                                    starDimension="19px"
                                                                    starSpacing="3.5px"
                                                                />
                                                                <p className="rating_text">
                                                                    &nbsp;{staff.rating}
                                                                </p>
                                                            </div>
                                                        ) : <p className="no_zap">{t("Нет отзывов")}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            {staff.description ? (<p className="staff_popup_item_p">{staff.description}</p>)
                                                : (<p className="staff_popup_item_p">{t("Нет описания")}</p>)}
                                            {nearestTime && nearestTime.map((time, id) =>
                                                time.staffId === staff.staffId && time.availableDays.length !== 0 &&
                                                <React.Fragment key={'time' + id}>
                                                    <div className="mobile-visible" >
                                                        <span>{t("Ближ. запись")}</span>
                                                        <div className="stars" >{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                                    </div>

                                                    <span className="nearest_appointment">{t("Ближайшая запись")} - {roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</span>

                                                </React.Fragment>

                                            )}
                                            {nearestTime && !nearestTime.some((time, id) =>
                                                time.staffId === staff.staffId && time.availableDays.length !== 0

                                            ) && <div>
                                                    <span className="no_zap">{t("Нет записи")}</span>
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
