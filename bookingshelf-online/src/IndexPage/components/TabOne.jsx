import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import StarRatings from "react-star-ratings";
import { staffActions } from "../../_actions";
import moment from 'moment';
import { withTranslation } from "react-i18next";
import i_icon from "../../../public/img/icons/i.svg"
import cansel from "../../../public/img/icons/cansel_black.svg";
import { compose } from 'redux';
import MediaQuery from 'react-responsive'
import { culcDay } from "../../_helpers/data-calc"
import { ARROW_ICON,CURSOR_ICON } from '../../_constants/svg.constants';
import {TABLET_WIDTH} from '../../_constants/global.constants'

class TabOne extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            staff: null,
            openList: false,
        }
        this.openListFunc = this.openListFunc.bind(this);
        this.handleStaffCommentsClick = this.handleStaffCommentsClick.bind(this);
        this.handleSelectStaff = this.handleSelectStaff.bind(this);
    }
    openListFunc() {
        this.setState({
            openList: !this.state.openList,
        })
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
        const desktop = 600;
        const mob = 599;
        let currentTimeText = "";
        if (moment(time).format('LT') !== "Invalid date") {
            currentTimeText = moment(time).format('LT');
        }
        let serviceInfo = null;

        const currentDay = culcDay(selectedDay, "desktop");

        let sizeWords = "23px";
        let priceFrom = 0;
        let priceTo = 0;
        let duration = 0;
        selectedServices.forEach((service) => {
            priceFrom += Number(service.priceFrom)
            priceTo += Number(service.priceTo)
            duration += Number(getDurationForCurrentStaff(service))
        })

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
                    <div className="specialist" onClick={event => this.openListFunc()}>

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

                                <div className="time-footer hover">
                                    <p className="time_footer_p" onClick={event => this.setState({
                                        openList: !openList,
                                    })}>{t("Услуги")}: {selectedServices.length} </p>
                                    <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                    </p>

                                </div>
                                <div className="time-footer">
                                    <p className="time_footer_p" >{t("Дата")}:</p>
                                    <p className="time_footer_p" >{currentDay}</p>
                                    <p className="time_footer_p" >{currentTimeText}</p>
                                </div>
                            </div >
                            {openList && (
                                <div className="service_list_block">
                                    <div className="setvice_list_items">
                                        {selectedServices.map((element, index) =>
                                            <div key={index} className="setvice_list_item">
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
                <MediaQuery minWidth={TABLET_WIDTH}>
                    <div className="specialist" >
                        <div className="specialist-block">
                            {CURSOR_ICON}
                            {openList ?
                                <div className="specialist_big">
                                    <div className="service_list_block">
                                        <div className="setvice_list_items">
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
                                    <div className="time-footer hover" >
                                        <p className="time-footer_desktop_p" onClick={event => this.setState({
                                            openList: !openList,
                                        })}>{t("Выбрано услуг")}: {selectedServices.length}</p>
                                        {/* } */}
                                        <p className="service_footer_price_small_text" >{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}
                                        </p>
                                    </div>
                                    <div className="time-footer" >
                                        <p className="time-footer_desktop_p" >{t("Дата")}:</p>
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
                   <p>{t("Онлайн-запись отключена. Пожалуйста, свяжитесь с администратором. Приносим извинения за доставленные неудобства.")}</p> 
                    {(subcompanies.length > 1) && (
                        <button onClick={() => {
                            setScreen(0)
                            this.props.dispatch(staffActions.clearError());
                            const { company } = match.params;
                            const url = company.includes('_') ? company.split('_')[0] : company
                            history.push(`/${url}`)
                        }}  className="online_zapis_off_btn">{t("На страницу выбора филиалов")}</button>
                    )}
                </div>
            )
        }

        return info && (info.bookingPage === match.params.company) && (info.onlineZapisOn || (!info.onlineZapisOn && (parseInt(moment().utc().format('x')) < info.onlineZapisEndTimeMillis))) && (

            <div className="service_selection screen1">
                <div className={selectedServices[0] ?"service_selection_block_one service_selection_block_one_select" :"service_selection_block_one"}>
                    <div className="skip_employee-block">
                        {flagAllStaffs && <p className="skip_employee" onClick={() => this.handleNoStaffClick()}>{(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('Рабочее место не важно') : t('Сотрудник не важен')} <div className="skip-arrow-blue"></div></p>}
                        {!flagAllStaffs && <p className="skip_employee" onClick={() => selectStaff([])}>{t("Пропустить выбор")} {(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('рабочего места') : (info.companyTypeId === 4 ? t('врача') : t('сотрудника'))}<div className="skip-arrow-blue">{ARROW_ICON}</div></p>}

                        {/* {<p className="skip_employee" onClick={() => selectStaff([])}>{t("Сотрудник не важен")} {(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('рабочего места') : (info.companyTypeId === 4 ? t('врача') : t('сотрудника'))}<div className="skip-arrow"></div></p>} */}
                    </div>
                    <div className={((isStartMovingVisit && newAppointments && !!newAppointments.length) || (flagAllStaffs || (subcompanies.length > 1)))?"title_block n staff_title":"title_block n staff_title no_back_button"}>
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
                        <p className="modal_title">{(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('Выберите рабочее место') : (info.companyTypeId === 4 ? t('Выберите врача') : t('Выберите сотрудника'))}</p>
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
                                                        <p>{staff.firstName} {staff.lastName ? staff.lastName : ''}</p>
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
                                                                    &nbsp;{staff.rating.toFixed(1)}
                                                                </p>
                                                            </div>
                                                        ) : <p className="no_otz">{t("Нет отзывов")}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            {staff.description && (<p className="staff_popup_item_p">{staff.description}</p>)}
                                            {nearestTime && nearestTime.map((time, id) =>
                                                time.staffId === staff.staffId && time.availableDays.length !== 0 &&
                                                <React.Fragment key={'time' + id}>
                                                    {/* <div className="mobile-visible" >
                                                        <span>{t("Ближ. запись")}</span>
                                                        <div className="stars" >{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                                    </div> */}

                                                    <span className="nearest_appointment">{t("Ближайшая запись")} - {roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</span>

                                                </React.Fragment>

                                            )}
                                            {nearestTime && !nearestTime.some((time, id) =>
                                                time.staffId === staff.staffId && time.availableDays.length !== 0

                                            ) && <div className="no_zap">
                                                    <span >{t("Нет записи")}</span>
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

                {this.state.staff && (
                    <div className="approveF">
                        <div className="modal_window_block">
                            <div className="modal_window_text">
                                <p className="modal_title">{t("Перенести визит")}?</p>
                                <img src={cansel} onClick={e => this.setState({ staff: null })} alt="cansel" />
                            </div>
                            <div className="modal_window_btn">
                                <button className="approveFYes" onClick={() => {
                                    selectStaff(this.state.staff)
                                    handleMoveVisit()
                                    setDefaultFlag()
                                    this.setState({ staff: null })
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
                                    setDefaultFlag()
                                    this.setState({ staff: null })
                                }}>{t("Нет")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div >
        );
    }
}
export default connect()(withTranslation("common")(TabOne));
