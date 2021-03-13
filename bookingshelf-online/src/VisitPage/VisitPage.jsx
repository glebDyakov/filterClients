import React from 'react';
import { connect } from 'react-redux';
import { staffActions } from "../../../bookingshelf-online/src/_actions";
import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/ru';
import 'moment-timezone';
import TabError from "../IndexPage/components/TabError";
import TabCanceled from "../IndexPage/components/TabCanceled";
import Header from "../IndexPage/components/Header";
import cansel from "../../public/img/icons/cansel_black.svg";
import { ARROW_ICON } from '../_constants/svg.constants';
import { ClientDetails } from '../IndexPage/components/ClientDetails';
import { withTranslation } from "react-i18next";
import MediaQuery from 'react-responsive'
import Footer from "../IndexPage/components/Footer";
import Loading from "../IndexPage/components/Loading";

import Blob from '../IndexPage/components/Blob';
class VisitPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.staff.info,
            screen: 1,
            approveF: false,
            allVisits: false

        };

        this._delete = this._delete.bind(this);
        this.setScreen = this.setScreen.bind(this);
        this.toggleAllVisits = this.toggleAllVisits.bind(this);
        this._move = this._move.bind(this);
    }

    componentDidMount() {
        const { company, visit } = this.props.match.params

        this.props.dispatch(staffActions.get(company));
        this.props.dispatch(staffActions.getByCustomId(visit));
        this.props.dispatch(staffActions.getInfo(company));
        this.props.dispatch(staffActions.getServices(company));

    }

    componentWillReceiveProps(newProps) {
        const { t } = this.props;
        if (JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff)) {
            if (newProps.staff.info) {
                document.title = newProps.staff.info.companyName + ` | ${t("Онлайн-запись")} `;
            }
            newProps.staff.info && newProps.staff.info.timezoneId && moment.tz.setDefault(newProps.staff.info.timezoneId)

            this.setState({
                info: newProps.staff.info && newProps.staff.info,
                appointment: newProps.staff && newProps.staff.appointment

            })
        }
    }


    componentDidUpdate() {
        initializeJs()
    }

    toggleAllVisits() {
        this.setState({ allVisits: !this.state.allVisits });
    }
    setScreen(num) {
        this.setState({
            screen: num
        })
    }

    onCancelVisit() {
        this.setState({ ...this.state, approveF: true });
        setTimeout(() => this.approvedButtons.scrollIntoView({ behavior: "smooth" }), 100);
    }

    _move(appointment) {
        this.props.history.push(`/${this.props.match.params.company}`)
        this.props.dispatch(staffActions.toggleStartMovingVisit(true, appointment, true));
        this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
        this.setScreen(1)
    }

    render() {
        const { staff: { staff }, t } = this.props;
        const { appointment: visitAppointments, info, screen, approveF, allVisits } = this.state;
        const { isLoading, deleted, error } = this.props.staff;
        const desktop = 600;
        const mob = 599;


        const activeAppointment = visitAppointments && visitAppointments[0] && staff && staff.find(item => item.staffId === visitAppointments[0].staffId);
       
        let serviceInfo = null
        const appointment = visitAppointments ? visitAppointments[0] : {};
        
        const currentDay = moment(appointment.appointmentTimeMillis).format('DD MMMM YYYY,');
        if (visitAppointments && visitAppointments[0]) {
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            let totalAmount = 0;
            visitAppointments.forEach((currentAppointment) => {
                priceFrom += Number(currentAppointment.priceFrom)
                priceTo += Number(currentAppointment.priceTo)
                duration += Number(currentAppointment.duration)
            })

            visitAppointments && visitAppointments[0] && visitAppointments[0].discountPercent && visitAppointments.forEach((appointment => {
                totalAmount += appointment.totalAmount
            }))

            serviceInfo = (
                <React.Fragment>
                    <div className="last_list_block">
                        <div className="last_list_caption">
                            <div className="last_list_img">
                                <img src={activeAppointment && activeAppointment.imageBase64 ? "data:image/png;base64," + activeAppointment.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt="" />

                                <div className="last_list_name">
                                    <span>{visitAppointments[0].staffName}</span>
                                    {appointment.appointmentTimeMillis && <p>{t(`${currentDay}`)}{moment(appointment.appointmentTimeMillis).format('LT')}</p>}
                                </div>
                            </div>
                            <p className="desktop_visible" style={{
                                fontSize: "13px",
                                marginRight: "32px",
                            }}>{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</p>
                        </div>
                        <div className="last_list_services">
                            <p>{t("Список услуг")}:</p>
                            {visitAppointments.map((service, id) => (
                                <p key={id}>{id + 1}. <span> {service.serviceName}&nbsp;</span>
                                    <strong>({service.priceFrom}{service.priceFrom !== service.priceTo && " - " + service.priceTo}&nbsp;{service.currency})</strong>
                                </p>
                            ))}
                        </div>
                        <p className="desktop_invisible" style={{
                            fontSize: "13px",
                            marginRight: "32px",
                        }}>{t("Длительность")}: {moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</p>
                        <div className="last_list_price">
                            <p>{t("Итого")}:</p>
                            <p>{priceFrom}{priceFrom !== priceTo && " - " + priceTo}&nbsp;</p>
                            <span>{visitAppointments[0] && visitAppointments[0].currency}</span>
                            {visitAppointments && visitAppointments[0] && !!visitAppointments[0].discountPercent && <span>&nbsp;({Math.round(totalAmount * 100) / 100} {visitAppointments[0].currency})</span>}
                        </div>
                        {visitAppointments && visitAppointments[0] && !!visitAppointments[0].discountPercent &&
                            <p className="final-book_hz_hz">{t("Ваша персональная скидка составит")}: {visitAppointments[0].discountPercent}%</p>
                        }
                    </div >
                </React.Fragment>
            )
        }

  



        return (
            <React.Fragment>
                <MediaQuery maxWidth={mob}>
                    <div className="container_popups">

                        {isLoading && <Loading />}
                        {info && <Header info={info} />}
                        {!error && !deleted && appointment && screen === 1 && !isLoading &&
                            <div className="service_selection final-screen">
                                <div className="service_selection_block_six">
                                    <div className="last_footer_block">
                                        <a className="book_button_last" href={`/online/${this.props.match.params.company}`} onClick={() => {
                                            this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                        }}>{t("Создать новую запись")}</a><p>
                                            {t("Нажимая кнопку записаться, вы соглашаетесь с условиями ")}&nbsp;
              <a className="last_footer_block_a" href={`${origin}/user_agreement`} >{t("пользовательского соглашения")}</a>
                                        </p>
                                    </div>
                                    <div className="last_list">
                                        {appointment.serviceId && serviceInfo}
                                    </div>
                                    <div className="final-screen-block">
                                        <span><p>{t("Цены указаны на основе прайс-листа. Окончательная стоимость формируется на месте оказания услуги.")}</p></span>
                                        <div className=" cansel_block">
                                            {!(appointment && appointment.coStaffs && appointment.coStaffs.length > 0) &&
                                                <button className="cansel-visit" onClick={() => {
                                                    this._move(visitAppointments)
                                                }} >{t("Перенести визит")}{ARROW_ICON}</button>
                                            }
                                            <button className="cansel-visit" onClick={() => this.onCancelVisit()} >{t("Отменить визит")}{ARROW_ICON}</button>
                                        </div>
                                        {info && info.appointmentMessage && <p className="final-book_hz">{t(`${info.appointmentMessage}`)}</p>}
                                        {approveF && <div ref={(el) => { this.approvedButtons = el; }} className="approveF">
                                            <div className="modal_window_block">
                                                <div className="modal_window_text">
                                                    <p className="modal_title">{t("Отменить визит")}?</p>
                                                    <img src={cansel} onClick={() => this.setterApproveF()} alt="cansel" />
                                                </div>
                                                <div className="modal_window_btn">
                                                    <button className="approveFYes" onClick={() => {
                                                        deleted
                                                        if (appointment.customId) {
                                                            this.setScreen(2)
                                                            this._delete(appointment.customId)
                                                        }
                                                    }}>{t("Да")}
                                                    </button>
                                                    <div style={{
                                                        height: "38px",
                                                        width: "1px",
                                                        backgroundColor: "rgba(9, 9, 58, 0.1)"
                                                    }}></div>
                                                    <button className="approveFNo" onClick={() => this.setterApproveF()}>{t("Нет")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                        {error &&
                            <TabError
                                error={error}
                                setScreen={this.setScreen}
                                companyId={this.props.match.params.company}
                                isVisitPage
                            />}
                        {deleted &&
                            <TabCanceled
                                setScreen={this.setScreen}
                                companyId={this.props.match.params.company}
                                isVisitPage
                            />
                        }
                        <Footer />

                    </div>
                </MediaQuery>
                <MediaQuery minWidth={desktop}>
                    <Blob screen={screen} />
                    <div className="container_popups">
                        {isLoading && <Loading />}
                        {info && <Header info={info} />}
                        {!error && !deleted && appointment && screen === 1 && !isLoading &&
                            <div className="service_selection final-screen">
                                <div className="last_list">
                                    {appointment.serviceId && serviceInfo}
                                </div>
                                <div className="final-screen-block">
                                    <div className="title_block staff_title">

                                        <span className="prev_block"><span className="title_block_text"><a href={`/online/${this.props.match.params.company}`} onClick={() => {
                                            this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
                                        }} className="title_block_text" >{t("Создать новую запись")}</a></span>
                                        </span>

                                    </div>
                                    <span><p>{t("Цены указаны на основе прайс-листа. Окончательная стоимость формируется на месте оказания услуги.")}</p></span>
                                    <div className=" cansel_block">
                                        {!(appointment && appointment.coStaffs && appointment.coStaffs.length > 0) &&
                                            <button className="cansel-visit" onClick={() => {
                                                this._move(visitAppointments)
                                            }} >{t("Перенести визит")}{ARROW_ICON}</button>
                                        }
                                        <button className="cansel-visit" onClick={() => this.onCancelVisit()} >{t("Отменить визит")}{ARROW_ICON}</button>
                                    </div>
                                    {info && info.appointmentMessage && <p className="final-book_hz">{t(`${info.appointmentMessage}`)}</p>}
                                    {approveF && <div ref={(el) => { this.approvedButtons = el; }} className="approveF">
                                        <div className="modal_window_block">
                                            <div className="modal_window_text">
                                                <p className="modal_title">{t("Отменить визит")}?</p>
                                                <img src={cansel} onClick={() => this.setterApproveF()} alt="cansel" />
                                            </div>
                                            <div className="modal_window_btn">
                                                <button className="approveFYes" onClick={() => {
                                                    deleted
                                                    if (appointment.customId) {
                                                        this.setScreen(2)
                                                        this._delete(appointment.customId)
                                                    }
                                                }}>{t("Да")}
                                                </button>
                                                <div style={{
                                                    height: "38px",
                                                    width: "1px",
                                                    backgroundColor: "rgba(9, 9, 58, 0.1)"
                                                }}></div>
                                                <button className="approveFNo" onClick={() => this.setterApproveF()}>{t("Нет")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>
                        }

                        {error &&
                            <TabError
                                error={error}
                                setScreen={this.setScreen}
                                companyId={this.props.match.params.company}
                                isVisitPage
                            />}
                        {deleted &&
                            <TabCanceled
                                setScreen={this.setScreen}
                                companyId={this.props.match.params.company}
                                isVisitPage
                            />
                        }
                        <Footer />
                    </div>
                </MediaQuery>
            </React.Fragment>
        );

    }

    _delete(id) {
        this.setScreen(2);
        this.props.dispatch(staffActions._delete(id));
    }


}

function mapStateToProps(store) {
    const { staff } = store;
    return {
        staff
    };
}

const connectedApp = connect(mapStateToProps)(withTranslation("common")(VisitPage));
export { connectedApp as VisitPage };
