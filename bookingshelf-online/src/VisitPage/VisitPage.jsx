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
        const {appointment, info, screen, approveF, allVisits }=this.state;
        const { isLoading, deleted, error } = this.props.staff;

        const activeAppointment = appointment && staff && staff.find(item => item.staffId === appointment.staffId);


        return (

            <div className="container_popups">
                {isLoading && (<div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>)}
                {info && <Header info={info}/>}
                {appointment && screen===1 && !isLoading &&
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
                            {appointment.serviceId &&
                            <div className="service_item">
                                <p>{appointment.serviceName}</p>
                                <p className={appointment.priceFrom!==appointment.priceTo && 'sow'}><strong>{appointment.priceFrom}{appointment.priceFrom!==appointment.priceTo && " - "+appointment.priceTo} </strong> <span>{appointment.currency}</span></p>
                                <span className="runtime"><strong>{moment.duration(parseInt(appointment.duration), "seconds").format("h[ ч] m[ мин]")}</strong></span>
                            </div>
                            }
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
                        {false && <div style={{ position: 'relative', width: '210px', margin: '0 auto' }}>
                            <input style={{ backgroundColor: '#f3a410' }} type="submit" className="cansel-visit" value="Перенести визит" onClick={() => {
                                this.props.dispatch(staffActions.getClientAppointments(this.props.match.params.company))
                                this._move(appointment)
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

                { screen === 2 && error &&
                <TabError
                    error={error}
                    setScreen={this.setScreen}
                    companyId={this.props.match.params.company}
                    isVisitPage
                />}
                {screen === 2 && deleted &&
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
