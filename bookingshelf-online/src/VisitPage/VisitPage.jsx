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
        const desctop = 600;
        const mob = 599;
        console.log(visitAppointments)
        // const currentDay = moment(appointmentTimeMillis).format('DD MMMM YYYY,');

        const activeAppointment = visitAppointments && visitAppointments[0] && staff && staff.find(item => item.staffId === visitAppointments[0].staffId);

        let serviceInfo = null
        if (visitAppointments && visitAppointments[0]) {
            let price = 0;
            let priceFrom = 0;
            let priceTo = 0;
            let duration = 0;
            let totalAmount = 0;
            visitAppointments.forEach((currentAppointment) => {
                price += Number(currentAppointment.price)
                priceFrom += Number(currentAppointment.priceFrom)
                priceTo += Number(currentAppointment.priceTo)
                duration += Number(currentAppointment.duration)
            })

            visitAppointments && visitAppointments[0] && visitAppointments[0].discountPercent && visitAppointments.forEach((appointment => {
                totalAmount += appointment.totalAmount
            }))

            serviceInfo = (
                <React.Fragment>
                    {/* <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(visitAppointments.length===1)?<p>{visitAppointments[0].serviceName}</p>:
                        (<p>{t("Выбрано услуг")}: <strong className="service_item_price">{visitAppointments.length}</strong></p>)}
                    <p><strong className="service_item_price">{priceFrom!==priceTo
                        ? priceFrom+" - "+priceTo
                        : price
                    }</strong>&nbsp;<span>{visitAppointments[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format(`h[ ${t("ч")}] m[ ${t("минут")}]`)}</strong>
                        {visitAppointments && visitAppointments[0] && priceFrom===priceTo && !!visitAppointments[0].discountPercent && <span>({totalAmount} {visitAppointments[0].currency})</span>}
                    </span>
                    <div className="supperVisDet_info">
                        <p className="supperVisDet_info_title">{t("Список услуг")}:</p>
                        {visitAppointments.map(service => (
                            <p>• {service.serviceName}</p>
                        ))}
                        <span className="supperVisDet_closer" />
                    </div>
                    <img className="tap-service-icon" src={`${process.env.CONTEXT}public/img/tap-service.svg`}/>
                </div> */}

                    <div className="last_list_block">
                        <div className="last_list_caption">
                            <div className="last_list_img">
                                <img src={activeAppointment && activeAppointment.imageBase64 ? "data:image/png;base64," + activeAppointment.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt="" />

                                <div className="last_list_name">
                                    <span>{visitAppointments[0].staffName}</span>
                                    {/* <p>{t(`${currentDay}`)}{moment(time).format('LT')}</p> */}
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

        const appointment = visitAppointments ? visitAppointments[0] : {};



        return (

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
                            {/* <div className="final-book">
                                <p>{t("Ваша запись")}</p>
                            </div> */}
                            {/* <div className="specialist">
                            {appointment.staffId &&
                                <div>
                                    <p className="img_container">
                                        <img src={activeAppointment && activeAppointment.imageBase64 ? "data:image/png;base64," + activeAppointment.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt="" />
                                        <span>{appointment.staffName}</span>
                                    </p>
                                </div>
                            }
                            {appointment.serviceId && serviceInfo}
                            {appointment.appointmentTimeMillis &&
                                <div className="date_item_popup">
                                    <strong>{moment(appointment.appointmentTimeMillis, 'x').format('DD MMMM YYYY')}</strong>
                                </div>
                            }
                            {appointment.appointmentTimeMillis &&
                                <div className="date_item_popup">
                                    <strong>{moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')}</strong>
                                </div>
                            }
                        </div> */}
                            {info && info.appointmentMessage && <p style={{
                                color: 'red',
                                textDecoration: 'underline',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: '13px',
                                marginBottom: '8px'
                            }}>{info.appointmentMessage}</p>}


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
