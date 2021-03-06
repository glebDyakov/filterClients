import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from "react-router-dom";
import { ClientDetails } from "./ClientDetails";
import { staffActions } from "../../_actions";
import { withTranslation } from "react-i18next";
import Footer from "./Footer";
import MediaQuery from 'react-responsive'
import cansel from "../../../public/img/icons/cansel_black.svg";
import { ARROW_ICON } from '../../_constants/svg.constants';
import {TABLET_WIDTH} from '../../_constants/global.constants'
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
        const currentDay = moment(selectedDay).format('DD MMMM YYYY,');
        let serviceInfo = null
        if (selectedServices[0]) {
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            let totalAmount = 0
            selectedServices.forEach((service) => {
                priceFrom += Number(service.priceFrom)
                priceTo += Number(service.priceTo)
                duration += Number(getDurationForCurrentStaff(service))
            })
            priceTo=Math.floor(priceTo * 100) / 100;
            priceFrom=Math.floor(priceFrom * 100) / 100;
            newAppointments && newAppointments[0] && newAppointments[0].discountPercent && newAppointments.forEach(( appointment => {
                totalAmount += appointment.totalAmount;
                totalAmount=Math.floor(totalAmount * 100) / 100; 
            }))
            serviceInfo = (
                <div className="last_list_block">
                    <div className="last_list_caption">
                        <div className="last_list_img">
                            <img src={selectedStaff.imageBase64 ? "data:image/png;base64," + selectedStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt="" />
                            <div className="last_list_name">
                                <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                                <p>{t(`${currentDay}`)}{moment(time).format('LT')}</p>
                            </div>
                        </div>
                        <p className="desktop_visible" style={{
                            fontSize: "13px",
                            marginRight: "32px",
                        }}>{t("????????????????????????")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("??")}] m[ ${t("??????????")}]`)}</p>
                    </div>
                    <div className="last_list_services">
                        <p>{t("???????????? ??????????")}:</p>
                        {selectedServices.map((service, id) => (
                            <p key={id}>{id + 1}. <span> {service.name}&nbsp;</span>
                                <strong>({service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo}&nbsp;{service.currency})</strong>
                            </p>
                        ))}
                    </div>
                    <p className="desktop_invisible" style={{
                            fontSize: "13px",
                            marginRight: "32px",
                        }}>{t("????????????????????????")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("??")}] m[ ${t("??????????")}]`)}</p>
                    <div className="last_list_price">
                        <p>{t("??????????")}:</p>
                        <p>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                        <span>{selectedServices[0] && selectedServices[0].currency}</span>
                        {newAppointments && newAppointments[0]  && !!newAppointments[0].discountPercent && <span>&nbsp;({Math.round(totalAmount * 100) / 100} {newAppointments[0].currency})</span>}
                    </div>
                    {newAppointments && newAppointments[0] && !!newAppointments[0].discountPercent &&
                                <p className="final-book_hz_hz">{t("???????? ???????????????????????? ???????????? ????????????????")}: {newAppointments[0].discountPercent}%</p>
                            }
                </div >
            )
        }
        return (
            <React.Fragment>
                <MediaQuery maxWidth={TABLET_WIDTH-1}>
                    <div className="service_selection final-screen">
                        <div className="service_selection_block_six">
                            <div className="last_footer_block">
                                <a className="book_button_last" href={`/online/${this.props.match.params.company}`} onClick={() => {
                                    this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                }}>{t("?????????????? ?????????? ????????????")}</a><p>
                                    {t("?????????????? ???????????? ????????????????????, ???? ???????????????????????? ?? ?????????????????? ")}&nbsp;
              <a className="last_footer_block_a"  href={`${origin}/user_agreement`} >{t("?????????????????????????????????? ????????????????????")}</a>
                                </p>
                            </div>
                            <div className="last_list">
                                {serviceInfo}
                            </div>
                            <div className="final-screen-block">

                                <div className="final-book finel_color_text">
                                    <p>{t("???????????? ??????????????")} {movedVisitSuccess ? t('????????????????????') : t('??????????????')}</p>
                                </div>

                                <span><p>{t("???????? ?????????????? ???? ???????????? ??????????-??????????. ?????????????????????????? ?????????????????? ?????????????????????? ???? ?????????? ???????????????? ????????????.")}</p></span>

                             

                                
                                <div className=" cansel_block">
                                    {!(movingVisit && movingVisit[0] && movingVisit[0].coStaffs && movingVisit[0].coStaffs.length > 0) &&
                                        <button className="cansel-visit" onClick={() => {
                                            const clientId = (!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit[0].clientId : newAppointments[0].clientId;
                                            this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company, clientId, 1))
                                            _move((!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit : newAppointments.sort((a, b) => a.appointmentId - b.appointmentId))
                                        }} >{t("?????????????????? ??????????")}{ARROW_ICON}</button>
                                    }
                                    <button className="cansel-visit" onClick={() => this.onCancelVisit()} >{t("???????????????? ??????????")}{ARROW_ICON}</button>
                                </div>
                                {info && info.appointmentMessage && <p className="final-book_hz">{t(`${info.appointmentMessage}`)}</p>}
                                {approveF && <div ref={(el) => { this.approvedButtons = el; }} className="approveF">
                                    <div className="modal_window_block">
                                        <div className="modal_window_text">
                                            <p className="modal_title">{t("???????????????? ??????????")}?</p>
                                            <img src={cansel} onClick={() => this.setterApproveF()} alt="cansel" />
                                        </div>
                                        <div className="modal_window_btn">
                                            <button className="approveFYes" onClick={() => {
                                                const resultAppointments = (movingVisit && movingVisit.length > 0) ? movingVisit : newAppointments
                                                if (resultAppointments.length) {
                                                    if (resultAppointments[0] && resultAppointments[0].customId) {
                                                        _delete(resultAppointments[0].customId)
                                                    }
                                                    this.props.dispatch(staffActions.toggleStartMovingVisit(false, []));
                                                    this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                                }
                                            }}>{t("????")}
                                            </button>
                                            <div style={{
                                                height: "38px",
                                                width: "1px",
                                                backgroundColor: "rgba(9, 9, 58, 0.1)"
                                            }}></div>
                                            <button className="approveFNo" onClick={() => this.setterApproveF()}>{t("??????")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                }

                            </div>
                            
                            <Footer />
                        </div >

                    </div>
                </MediaQuery>
                <MediaQuery minWidth={TABLET_WIDTH}>
                    <div className="service_selection final-screen">
                        <div className="last_list">
                            {serviceInfo}
                        </div>
                        <div className="final-screen-block">

                            <div className="title_block staff_title">

                                <span className="prev_block"><span className="title_block_text"><a  href={`/online/${this.props.match.params.company}`} onClick={() => {
                                    this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                }} className="title_block_text" >{t("?????????????? ?????????? ????????????")}</a></span>
                                </span>

                            </div>
                            <div className="final-book finel_color_text">
                                <p>{t("???????????? ??????????????")} {movedVisitSuccess ? t('????????????????????') : t('??????????????')}</p>
                            </div>

                            <span><p>{t("???????? ?????????????? ???? ???????????? ??????????-??????????. ?????????????????????????? ?????????????????? ?????????????????????? ???? ?????????? ???????????????? ????????????.")}</p></span>

                            

                           
                            <div className=" cansel_block">
                                {!(movingVisit && movingVisit[0] && movingVisit[0].coStaffs && movingVisit[0].coStaffs.length > 0) &&
                                    <button className="cansel-visit" onClick={() => {
                                        const clientId = (!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit[0].clientId : newAppointments[0].clientId;
                                        this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company, clientId, 1))
                                        _move((!(newAppointments && newAppointments[0]) && movingVisit) ? movingVisit : newAppointments.sort((a, b) => a.appointmentId - b.appointmentId))
                                    }} >{t("?????????????????? ??????????")}{ARROW_ICON}</button>
                                }
                                <button className="cansel-visit"  onClick={() => this.onCancelVisit()} >{t("???????????????? ??????????")}{ARROW_ICON}</button>
                            </div>
                            {info && info.appointmentMessage && <p className="final-book_hz">{t(`${info.appointmentMessage}`)}</p>}
                            {approveF && <div ref={(el) => { this.approvedButtons = el; }} className="approveF">
                                <div className="modal_window_block">
                                    <div className="modal_window_text">
                                        <p className="modal_title">{t("???????????????? ??????????")}?</p>
                                        <img src={cansel} onClick={() => this.setterApproveF()} alt="cansel" />
                                    </div>
                                    <div className="modal_window_btn">
                                        <button className="approveFYes" onClick={() => {
                                            const resultAppointments = (movingVisit && movingVisit.length > 0) ? movingVisit : newAppointments
                                            if (resultAppointments.length) {
                                                if (resultAppointments[0] && resultAppointments[0].customId) {
                                                    _delete(resultAppointments[0].customId)
                                                }
                                                this.props.dispatch(staffActions.toggleStartMovingVisit(false, []));
                                                this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                            }
                                        }}>{t("????")}
                                        </button>
                                        <div style={{
                                            height: "38px",
                                            width: "1px",
                                            backgroundColor: "rgba(9, 9, 58, 0.1)"
                                        }}></div>
                                        <button className="approveFNo" onClick={() => this.setterApproveF()}>{t("??????")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                        <Footer />
                    </div>
                </MediaQuery>
            </React.Fragment>
        );
    }
}
export default connect()(withTranslation("common")(TabSix));
