import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from "react-router-dom";
import { ClientDetails } from "./ClientDetails";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import Footer from "./Footer";
import MediaQuery from 'react-responsive'
class TabSix extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            approveF: false,
        };
        this.onCancelVisit = this.onCancelVisit.bind(this);
        this.setterApproveF = this.setterApproveF.bind(this);
        this.toggleAllVisits = this.toggleAllVisits.bind(this);
    }
    toggleAllVisits() {
        this.setState({ allVisits: !this.state.allVisits });
    }
    onCancelVisit() {
        this.setState({ ...this.state, approveF: true });
        setTimeout(() => this.approvedButtons.scrollIntoView({ behavior: "smooth" }), 100);
    }
    setterApproveF() {
        this.setState({ ...this.state, approveF: false })
    }
    render() {

        const { selectedStaff, selectedService, selectedServices, selectedDay, selectedTime: time, selectedTime, newAppointments, getDurationForCurrentStaff,
            info, _delete, _move, movedVisitSuccess, movingVisit, t } = this.props;
        const { approveF } = this.state;
        const desctop = 710;
        const mob = 709;
        const currentDay = moment(selectedDay).format('DD MMMM YYYY,');
        let serviceInfo = null
        if (selectedServices[0]) {
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            selectedServices.forEach((service) => {
                priceFrom += parseInt(service.priceFrom)
                priceTo += parseInt(service.priceTo)
                duration += parseInt(getDurationForCurrentStaff(service))
            })

            serviceInfo = (
                <div className="last_list_block">
                    <div className="last_list_caption">
                        <div className="last_list_img">
                            <img src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt="" />
                            <div className="last_list_name">
                                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                                <p>{currentDay} {moment(time).format('LT')}</p>
                            </div>
                        </div>
                        <p className="desktop_visible" style={{
                            fontSize: "13px",
                            marginRight: "32px",
                        }}>{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</p>
                    </div>
                    <div className="last_list_services">
                        <p>{t("Список услуг:")}Список услуг:</p>
                        {selectedServices.map((service, id) => (
                            <p key={id}>{id + 1}. <span> {service.name}&nbsp;</span>
                                <strong>({service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo}&nbsp;{service.currency})</strong>
                            </p>
                        ))}
                    </div>
                    <div className="last_list_price">
                        <p>{t("Итого:")}Итого:</p>
                        <p>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                        <span>{selectedServices[0] && selectedServices[0].currency}</span>
                    </div>
                </div >
            )
        }
        return (
            <React.Fragment>
                <MediaQuery maxWidth={mob}>
                    <div className="service_selection final-screen">
                        <div className="last_footer_block">
                            <input
                                className=" book_button"

                                type="submit" value={t('Создать новую запись')} onClick={() => {
                                    this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                }} />
                            <p>
                                {t("Нажимая кнопку записаться, вы соглашаетесь с")}&nbsp;
              <a rel="nofollow noopener noreferrer" href={`${origin}/user_agreement`} >{t("условиями пользовательского соглашения")}</a>
                            </p>
                        </div>
                        <div className="last_list">
                            {serviceInfo}
                        </div>
                        <div className="final-screen-block">

                            <div className="title_block staff_title">
                            </div>

                            <div className="final-book">
                                <p>{t("Запись успешно")} {movedVisitSuccess ? t('перенесена') : t('создана')}</p>
                            </div>

                            <span><p>{t("Цены указаны на основе прайс-листа. Окончательная стоимость формируется на месте оказания услуги.")}</p></span>

                            {info && info.appointmentMessage && <p className="final-book_hz">{info.appointmentMessage}</p>}

                            {newAppointments && newAppointments[0] && !!newAppointments[0].discountPercent &&
                                <p className="final-book_hz_hz">{t("Ваша персональная скидка составит")}: {newAppointments[0].discountPercent}%</p>
                            }
                            <div className=" cansel_block">
                                {!(movingVisit && movingVisit[0] && movingVisit[0].coStaffs && movingVisit[0].coStaffs.length > 0) &&
                                    <input type="submit" className="cansel-visit" value={t("Перенести визит")} onClick={() => {
                                        const clientId = (!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit[0].clientId : newAppointments[0].clientId;
                                        this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company, clientId, 1))
                                        _move((!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit : newAppointments.sort((a, b) => a.appointmentId - b.appointmentId))
                                    }} />
                                }
                                <input type="submit" className="cansel-visit" value={t("Отменить визит")} onClick={() => this.onCancelVisit()} />
                            </div>
                            {approveF && <div ref={(el) => { this.approvedButtons = el; }} className="approveF">
                                <button className="approveFYes" onClick={() => {
                                    const resultAppointments = (movingVisit && movingVisit.length > 0) ? movingVisit : newAppointments
                                    if (resultAppointments.length) {
                                        if (resultAppointments[0] && resultAppointments[0].customId) {
                                            _delete(resultAppointments[0].customId)
                                        }
                                        this.props.dispatch(staffActions.toggleStartMovingVisit(false, []));
                                        this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                    }
                                }}>Да
                    </button>
                                <button className="approveFNo" onClick={() => this.setterApproveF()}>{t("Нет")}
                                </button>
                            </div>
                            }

                        </div>

                        <Footer />
                    </div >
                </MediaQuery>
                <MediaQuery minWidth={desctop}>
                    <div className="service_selection final-screen">
                        <div className="last_list">
                            {serviceInfo}
                        </div>
                        <div className="final-screen-block">

                            <div className="title_block staff_title">

                                <span className="prev_block" onClick={() => {
                                    setScreen(3);
                                    //if (!isStartMovingVisit) {
                                    refreshTimetable()
                                    //}
                                }}><span className="title_block_text"><a rel="nofollow" href={`/online/${this.props.match.params.company}`} onClick={() => {
                                    this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                }} className="title_block_text" >{t("Создать новую запись")}</a></span>
                                </span>

                            </div>

                            <div className="final-book">
                                <p>{t("Запись успешно")} {movedVisitSuccess ? t('перенесена') : t('создана')}</p>
                            </div>

                            <span><p>{t("Цены указаны на основе прайс-листа. Окончательная стоимость формируется на месте оказания услуги.")}</p></span>

                            {info && info.appointmentMessage && <p className="final-book_hz">{info.appointmentMessage}</p>}

                            {newAppointments && newAppointments[0] && !!newAppointments[0].discountPercent &&
                                <p className="final-book_hz_hz">{t("Ваша персональная скидка составит")}: {newAppointments[0].discountPercent}%</p>
                            }
                            <div className=" cansel_block">
                                {!(movingVisit && movingVisit[0] && movingVisit[0].coStaffs && movingVisit[0].coStaffs.length > 0) &&
                                    <input type="submit" className="cansel-visit" value={t("Перенести визит")} onClick={() => {
                                        const clientId = (!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit[0].clientId : newAppointments[0].clientId;
                                        this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company, clientId, 1))
                                        _move((!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit : newAppointments.sort((a, b) => a.appointmentId - b.appointmentId))
                                    }} />
                                }
                                <input type="submit" className="cansel-visit" value={t("Отменить визит")} onClick={() => this.onCancelVisit()} />
                            </div>
                            {approveF && <div ref={(el) => { this.approvedButtons = el; }} className="approveF">
                                <button className="approveFYes" onClick={() => {
                                    const resultAppointments = (movingVisit && movingVisit.length > 0) ? movingVisit : newAppointments
                                    if (resultAppointments.length) {
                                        if (resultAppointments[0] && resultAppointments[0].customId) {
                                            _delete(resultAppointments[0].customId)
                                        }
                                        this.props.dispatch(staffActions.toggleStartMovingVisit(false, []));
                                        this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                    }
                                }}>Да
                    </button>
                                <button className="approveFNo" onClick={() => this.setterApproveF()}>{t("Нет")}
                                </button>
                            </div>
                            }
                            {/*<input type="submit" className="all-visits" value="Все визиты" onClick={() => this.toggleAllVisits()}/>*/}
                            {/*{allVisits && <ClientDetails />}*/}
                            {/*<p className="skip_employee"  onClick={() => {*/}
                            {/*    setScreen(2);*/}
                            {/*    refreshTimetable();*/}
                            {/*    setDefaultFlag();*/}
                            {/*}}> Создать запись</p>*/}
                        </div>
                        <Footer />
                    </div >
                </MediaQuery>
            </React.Fragment>
        );
    }
}
export default connect()(withTranslation("common")(TabSix));
