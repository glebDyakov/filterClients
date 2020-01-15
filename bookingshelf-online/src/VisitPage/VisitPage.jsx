import React from 'react';
import { connect } from 'react-redux';
import {staffActions} from "../../../bookingshelf-online/src/_actions";
import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/ru';
import 'moment-timezone';
import TabError from "../IndexPage/components/TabError";
import TabCanceled from "../IndexPage/components/TabCanceled";
import Header from "../IndexPage/components/Header";
import { ClientDetails }from '../IndexPage/components/ClientDetails';

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

    componentDidMount () {
        const {company, visit} = this.props.match.params


        this.props.dispatch(staffActions.get(company));
        this.props.dispatch(staffActions.getByCustomId(visit));
        this.props.dispatch(staffActions.getInfo(company));
        this.props.dispatch(staffActions.getServices(company));

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.staff) !==  JSON.stringify(newProps.staff)) {
            if(newProps.staff.info) {
                document.title = newProps.staff.info.companyName + " | Онлайн-запись ";
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
    setScreen (num) {
        this.setState({
            screen: num
        })
    }

    onCancelVisit () {
        this.setState({...this.state, approveF: true});
        setTimeout(() => this.approvedButtons.scrollIntoView({ behavior: "smooth" }), 100);
    }

    _move(appointment) {
        this.props.history.push(`/${this.props.match.params.company}`)
        this.props.dispatch(staffActions.toggleStartMovingVisit(true, appointment));
        this.props.dispatch(staffActions.toggleMovedVisitSuccess(false));
        this.setScreen(1)
    }

    render() {
        const { staff : { staff } } = this.props;
        const {appointment: visitAppointments, info, screen, approveF, allVisits }=this.state;
        const { isLoading, deleted, error } = this.props.staff;

        const activeAppointment = visitAppointments && visitAppointments[0] && staff && staff.find(item => item.staffId === visitAppointments[0].staffId);

        let serviceInfo = null
        if (visitAppointments && visitAppointments[0]) {
            let price = 0;
            let priceFrom = 0;
            let priceTo= 0;
            let duration = 0;
            let totalAmount = 0;
            visitAppointments.forEach((currentAppointment) => {
                price += parseInt(currentAppointment.price)
                priceFrom += parseInt(currentAppointment.priceFrom)
                priceTo += parseInt(currentAppointment.priceTo)
                duration += parseInt(currentAppointment.duration)
            })

            visitAppointments && visitAppointments[0] && visitAppointments[0].discountPercent && visitAppointments.forEach(( appointment => {
                totalAmount += appointment.totalAmount
            }))

            serviceInfo = (
                <div style={{ display: 'inline-block' }} className="supperVisDet service_item">
                    {(visitAppointments.length===1)?<p>{visitAppointments[0].serviceName}</p>:
                        (<p>Выбрано услуг: <strong className="service_item_price">{visitAppointments.length}</strong></p>)}
                    <p><strong className="service_item_price">{priceFrom!==priceTo
                        ? priceFrom+" - "+priceTo
                        : price
                    }</strong>&nbsp;<span>{visitAppointments[0].currency}</span></p>
                    <span style={{ width: '100%' }} className="runtime">
                        <strong>{moment.duration(parseInt(duration), "seconds").format("h[ ч] m[ мин]")}</strong>
                        {visitAppointments && visitAppointments[0] && priceFrom===priceTo && !!visitAppointments[0].discountPercent && <span>({totalAmount} {visitAppointments[0].currency})</span>}
                    </span>
                    <div className="supperVisDet_info">
                        <p className="supperVisDet_info_title">Список услуг:</p>
                        {visitAppointments.map(service => (
                            <p>• {service.serviceName}</p>
                        ))}
                        <span className="supperVisDet_closer" />
                    </div>
                </div>
            )
        }

        const appointment = visitAppointments ? visitAppointments[0] : {};



        return (

            <div className="container_popups">
                {isLoading && (<div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>)}
                {info && <Header info={info}/>}
                {!error && !deleted && appointment && screen===1 && !isLoading &&
                    <div className="service_selection final-screen">
                        <div className="final-book">
                            <p>Ваша запись</p>
                        </div>
                        <div className="specialist">
                            {appointment.staffId &&
                            <div>
                                <p className="img_container">
                                    <img src={activeAppointment && activeAppointment.imageBase64 ? "data:image/png;base64,"+activeAppointment.imageBase64 : `${process.env.CONTEXT}public/img/image.png`} alt=""/>
                                    <span>{appointment.staffName}</span>
                                </p>
                            </div>
                            }
                            {appointment.serviceId && serviceInfo}
                            {appointment.appointmentTimeMillis &&
                            <div className="date_item_popup">
                                <strong>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('DD MMMM YYYY')}</strong>
                            </div>
                            }
                            {appointment.appointmentTimeMillis &&
                            <div className="date_item_popup">
                                <strong>{moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')}</strong>
                            </div>
                            }
                        </div>

                        <p style={{
                            textDecoration: 'underline',
                            textAlign: 'center',
                            fontSize: '12px',
                            marginBottom: '8px'
                        }}>Цены указаны на основе прайс-листа. Окончательная стоимость формируется на месте оказания услуги.</p>

                        {appointment && !!appointment.discountPercent &&
                        <p style={{
                            textAlign: 'center',
                            fontSize: '18px',
                            marginBottom: '8px'
                        }}>Ваша персональная скидка составит: {appointment.discountPercent}%</p>
                        }

                        {!(appointment && appointment.coStaffs && appointment.coStaffs.length > 0) && <div style={{ position: 'relative', width: '210px', margin: '0 auto' }}>
                            <input style={{ backgroundColor: '#f3a410' }} type="submit" className="cansel-visit" value="Перенести визит" onClick={() => {
                                this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company, appointment.clientId))
                                this._move(visitAppointments)
                            }}/>
                            <span className="move-white" />
                        </div>}
                        <div style={{ position: 'relative', width: '210px',  margin: '0 auto' }}>
                            <input style={{ backgroundColor: '#d41316', marginTop: '16px' }} type="submit" className="cansel-visit" value="Отменить визит" onClick={() => this.onCancelVisit()}/>
                            <span className="cancel-white" />
                        </div>
                        {approveF && <div ref={(el) => {this.approvedButtons = el;}} className="approveF" >
                            <button className="approveFYes" onClick={()=> {
                                if (appointment.customId) {
                                    this.setScreen(2)
                                    this._delete(appointment.customId)
                                }
                            }}>Да
                            </button>
                            <button className="approveFNo" onClick={()=>this.setState({...this.state, approveF: false})}>Нет
                            </button>
                        </div>
                        }

                        <input type="submit" className="all-visits" value="Все визиты" onClick={() => this.toggleAllVisits()}/>
                        {allVisits && <ClientDetails />}
                        {/*<p className="skip_employee"  onClick={() => this.setScreen(2)}> Создать запись</p>*/}
                        <a className="skip_employee"  href={`/online/${this.props.match.params.company}`}>Создать запись</a>

                    </div>
                }
                {/*{appointment && screen === 2 &&*/}
                {/*<div className="service_selection final-screen">*/}

                {/*    <div className="final-book">*/}
                {/*        <p>Запись успешно отменена</p>*/}
                {/*    </div>*/}

                {/*    <a className="skip_employee"  href={'/'+this.props.match.params.company}> Создать запись</a>*/}

                {/*</div>*/}
                {/*}*/}

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
                <div className="footer_modal">
                    <p>Работает на <a href="https://online-zapis.com" target="_blank"><strong>Online-zapis.com</strong></a></p>
                </div>
            </div>
        );
    }

    _delete(id) {
        this.setScreen(2);
        this.props.dispatch(staffActions._delete(id));
    }


}

function mapStateToProps(store) {
    const {staff}=store;
    return {
        staff
    };
}

const connectedApp = connect(mapStateToProps)(VisitPage);
export { connectedApp as VisitPage };
