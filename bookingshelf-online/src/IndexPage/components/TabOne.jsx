import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import StarRatings from "react-star-ratings";
import { staffActions } from "../../_actions";
import moment from 'moment';
import { withTranslation } from "react-i18next";
import i_icon from "../../../public/img/icons/i.svg"
class TabOne extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            staff: null
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
        const { t, staffId, isLoading, handleMoveVisit, error, handleDayClick, newAppointments, staffs, selectedTime: time, timetableAvailable, isStartMovingVisit, setDefaultFlag, selectedServices, flagAllStaffs, movingVisit, services, subcompanies, history, match, clearStaff, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown } = this.props;

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
                <div className="skip_employee-block">
                    {!flagAllStaffs && <p className="skip_employee" onClick={() => selectStaff([])}>{t("Сотрудник не важен")} {(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('рабочего места') : (info.companyTypeId === 4 ? t('врача') : t('сотрудника'))}<div className="skip-arrow"></div></p>}
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
                    {staffId &&
                        <span className="next_block" onClick={() => {
                            setScreen(isStartMovingVisit ? 3 : 2);
                            refreshTimetable();
                        }}><span className="title_block_text">{t("Далее")}</span></span>}
                </div>
                {!this.state.staff && (
                    <React.Fragment>
                        <ul className={`desktop-visible staff_popup ${staffs && staffs.length <= 23 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                            {flagAllStaffs && (
                                <li className={'nb'}
                                    onClick={() => {
                                        this.handleNoStaffClick()
                                    }}
                                >
                                    <span className="staff_popup_item">
                                        <div style={{ width: '100%' }} className="img_container">

                                            <span className="staff_popup_name no-staff">{(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('Рабочее место не важно') : t('Сотрудник не важен')}<br />


                                            </span>

                                        </div>

                                    </span>
                                </li>
                            )}
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
                                                        <p >{staff.firstName} {staff.lastName ? staff.lastName : ''}</p>
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
                                                        ) : <p style={{ fontSize: '13px', lineHeight: "20px", opacity: "0.5"}}>{t("Нет отзывов")}</p>}
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
                                                    {/* <div className="desktop-visible" key={'time' + id}>
                                                    </div> */}
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
                        <ul className={`mobile-visible staff_popup ${staffs && staffs.length <= 50 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                            {flagAllStaffs && (
                                <li className={'nb'}
                                    onClick={() => {
                                        this.handleNoStaffClick()
                                    }}
                                >
                                    <span className="staff_popup_item">
                                        <div style={{ width: '100%' }} className="img_container">
                                            <span className="staff_popup_name no-staff">{(info.template === 2 || info.companyTypeId === 2 || info.companyTypeId === 3) ? t('Рабочее место не важно') : t('Сотрудник не важен')}<br />
                                            </span>
                                        </div>
                                    </span>
                                </li>
                            )}
                            {staffs && !!staffs.length && staffs
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
                                            </div>
                                            <div >
                                                <img className="staff-comments" onClick={() => this.handleStaffCommentsClick(staff)} style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                                />
                                                {staff.rating ? (
                                                    <StarRatings
                                                        rating={staff.rating}
                                                        starHoverColor={'#ff9500'}
                                                        starRatedColor={'#ff9500'}
                                                        starDimension="20px"
                                                        starSpacing="0"
                                                    />
                                                ) : <span >{t("Нет отзывов")}</span>}
                                            </div>


                                            {nearestTime && nearestTime.map((time, id) =>
                                                time.staffId === staff.staffId && time.availableDays.length !== 0 &&
                                                <React.Fragment>
                                                    <div className="mobile_block mobile-visible" key={'time' + id}>
                                                        <span>{t("Ближ. запись")}</span>
                                                        <div className="stars" style={{ textTransform: 'capitalize' }}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                                    </div>
                                                    <div className="mobile_block desktop-visible" key={'time' + id}>
                                                        <span className="nearest_appointment">{t("Ближайшая запись")}</span>
                                                        {/* <div className="stars" style={{ textTransform: 'capitalize' }}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div> */}
                                                    </div>
                                                </React.Fragment>

                                            )}

                                            {nearestTime && !nearestTime.some((time, id) =>
                                                time.staffId === staff.staffId && time.availableDays.length !== 0

                                            ) && <div className="mobile_block">
                                                    <span style={{ fontWeight: 'bold' }}>{t("Нет записи")}</span>
                                                </div>


                                            }
                                        </span>
                                    </li>)}
                        </ul>
                    </React.Fragment>
                )
                }

                {
                    !!this.state.staff && (
                        <React.Fragment>
                            <p className="modal_title">{t("Перенести визит?")}</p>
                            <div className="approveF">

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
                        </React.Fragment>
                    )
                }
            </div >
        );
    }
}
export default connect()(withTranslation("common")(TabOne));
