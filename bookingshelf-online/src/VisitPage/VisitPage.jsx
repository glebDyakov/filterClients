import React from 'react';
import { connect } from 'react-redux';
import {staffActions} from "../../../bookingshelf-online/src/_actions";
import moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/ru';
import 'moment-timezone';

class VisitPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.staff.info,
            screen: 1,
            approveF: false

        };

        this._delete = this._delete.bind(this);
        this.setScreen = this.setScreen.bind(this);
    }

    componentDidMount () {
        const {company, visit} = this.props.match.params


        this.props.dispatch(staffActions.getByCustomId(visit));
        this.props.dispatch(staffActions.getInfo(company));

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.staff) !==  JSON.stringify(newProps.staff)) {
            if(newProps.staff.info) {
                document.title = newProps.staff.info.companyName + " | Онлайн-запись ";
            }
            newProps.staff.info && newProps.staff.info.timezoneId && moment.tz.setDefault(newProps.staff.info.timezoneId)

            this.setState({...this.state,
                info: newProps.staff.info && newProps.staff.info,
                appointment: newProps.staff && newProps.staff.appointment

            })
        }
    }


    componentDidUpdate() {
        initializeJs()
    }


    setScreen (num) {
        this.setState({
            ...this.state,
            screen: num
        })
    }

    onCancelVisit () {
        this.setState({...this.state, approveF: true});
        this.approvedButtons.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        const {appointment, info, screen, approveF }=this.state;

        return (

            <div className="container_popups">
                {info &&
                <div className="modal_menu">
                    <p className="firm_name">{info && info.companyName}</p>
                    <div className="adress-phones">
                        <p>{info && info["companyAddress" + info.defaultAddress]}</p>
                    </div>
                    <span className="mobile"></span>
                    <p className="phones_firm">
                        {info.companyPhone1 && <a href={"tel:" + info.companyPhone1}>{info.companyPhone1}</a>}
                        {info.companyPhone2 && <a href={"tel:" + info.companyPhone2}>{info.companyPhone2}</a>}
                        {info.companyPhone3 && <a href={"tel:" + info.companyPhone3}>{info.companyPhone3}</a>}
                        <span className="closer"></span>
                    </p>
                    <div className="clear"></div>
                </div>

                }
                {appointment && screen===1 &&
                    <div className="service_selection final-screen">
                        <div className="final-book">
                            <p>Ваша запись</p>
                        </div>
                        <div className="specialist">
                            {appointment.staffId &&
                            <div>
                                <p className="img_container">
                                    <img src={appointment.imageBase64?"data:image/png;base64,"+appointment.imageBase64:`${process.env.CONTEXT}public/img/image.png`} alt=""/>
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
                        <input type="submit" className="cansel-visit" value="Отменить визит" onClick={() => this.onCancelVisit()}/>
                        {approveF && <div ref={(el) => {this.approvedButtons = el;}} className="approveF" >
                            <button className="approveFYes" onClick={()=>appointment.customId && this._delete(appointment.customId)}>Да
                            </button>
                            <button className="approveFNo" onClick={()=>this.setState({...this.state, approveF: false})}>Нет
                            </button>
                        </div>
                        }
                        <p className="skip_employee"  onClick={() => this.setScreen(2)}> Создать запись</p>

                    </div>
                }
                {appointment && screen === 2 &&
                <div className="service_selection final-screen">

                    <div className="final-book">
                        <p>Запись успешно отменена</p>
                    </div>

                    <a className="skip_employee"  href={'/'+this.props.match.params.company}> Создать запись</a>

                </div>
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