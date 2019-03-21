import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {calendarActions, companyActions, menuActions, userActions} from "../_actions";
import {access} from "../_helpers/access";
import moment from "moment";
import Link from "react-router-dom/es/Link";

class SidebarMain extends Component {
    constructor(props) {
        super(props);
        this.state={
            menu: props.menu,
            authentication: props.authentication,
            company: props.company,
            calendar: props.calendar};

        this.handleClick=this.handleClick.bind(this)
        this.openAppointments=this.openAppointments.bind(this)
        this.goToPageCalendar=this.goToPageCalendar.bind(this)
        this.logout=this.logout.bind(this)

    }
    logout(){
        const { dispatch } = this.props;
        dispatch(userActions.logout());
        // this.props.history.push('/login');
    }


    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.authentication) !==  JSON.stringify(newProps.authentication)) {
            this.setState({ ...this.state,
                authentication: newProps.authentication,
            })
        }
        if ( JSON.stringify(this.props.menu) !==  JSON.stringify(newProps.menu)) {
            this.setState({ ...this.state,
                menu: newProps.menu,
            })
        }
        if ( JSON.stringify(this.props.company) !==  JSON.stringify(newProps.company)) {
            this.setState({ ...this.state,
                company: newProps.company,
                count: newProps.company.count && newProps.company.count.count
            })
        }
        if ( JSON.stringify(this.props.calendar) !==  JSON.stringify(newProps.calendar)) {
            this.setState({ ...this.state,
                appointmentsCount: newProps.calendar.appointmentsCount && newProps.calendar.appointmentsCount
            })
        }
    }

    componentDidMount() {
        this.props.dispatch(companyActions.getBookingInfo());
        this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        this.props.dispatch(menuActions.getMenu());
    }

    render() {
        const {location}=this.props;
        const {authentication, count, menu, appointmentsCount, company}=this.state;
        let path="/"+location.pathname.split('/')[1]
        console.log(this.state)

        return (
            <div>
            <ul className={"sidebar "+(localStorage.getItem('collapse')=='true'&&' sidebar_collapse')}>

                <li className="mob-menu-personal">
                    <a href={`${process.env.CONTEXT}calendar`} className="logo_mob"/>
                    <div className="mob-firm-name">
                        <div className="img-container">
                            <img className="rounded-circle" src={`${process.env.CONTEXT}public/img/image.png`} alt=""/>
                        </div>
                        <a className="firm-name" href="#">
                            {authentication && authentication.user.profile && authentication.user.profile.firstName} {authentication && authentication.user.profile.lastName}
                        </a>
                        <span  onClick={()=>this.logout()} className="log_in"/>
                        <div className="setting_mob">
                            <a className="notification">Уведомления</a>
                            <a className="setting" data-toggle="modal" data-target=".modal_user_setting">Настройки</a>
                        </div>
                    </div>
                </li>

                <li className="arrow_collapse sidebar_list_collapse" onClick={()=>localStorage.setItem('collapse', 'true')} style={{'display':localStorage.getItem('collapse')=='true'?'none':'block'}}/>
                <li className="arrow_collapse sidebar_list_collapse-out" onClick={()=>localStorage.setItem('collapse', 'false')} style={{'display':localStorage.getItem('collapse')!='true'?'none':'block'}}/>
                {authentication && authentication.menu && authentication.user && authentication.user.menu &&
                menu && menu.menuList && menu.menuList.map((item, keyStore)=>
                    authentication.user.menu.map(localItem=>
                        localItem.id===item.id &&
                    <li className={path === item.url ? 'active' : ''}
                        key={keyStore}>
                        <a onClick={() => this.handleClick(item.url)}>
                            <img
                                src={`${process.env.CONTEXT}public/img/icons/` + item.icon}
                                alt=""/>
                            <span>{item.name}</span>
                            {keyStore===0 && count>0 && <span className="menu-notification" onClick={(event)=>this.openAppointments(event)} data-toggle="modal" data-target=".modal_counts">{count}</span>}
                        </a>
                    </li>
                    )

                )}

                <li className="mob-menu-closer">
                    <div>
                        <img src={`${process.env.CONTEXT}public/img/closer_mob.svg`} alt=""/>
                    </div>
                </li>

                {company.booking && <div className="id_company">Id компании: <a target="_blank"
                                                            href={"https://online-zapis.com/online/" + company.booking.bookingPage}
                                                            className="">{company.booking.bookingPage}
                </a>
                </div>}
                <div className="questions"><Link to="/faq">
                    <img className="rounded-circle" src={`${process.env.CONTEXT}public/img/information.svg`} alt=""/>
                </Link></div>

            </ul>
                <div className="modal fade modal_counts" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Новые записи</h4>


                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-inner pl-4 pr-4 count-modal">
                                {appointmentsCount && appointmentsCount.map((appointmentInfo)=>
                                    appointmentInfo.appointments.map((appointment)=>
                                        !appointment.approved &&
                                    <li>
                                        <a className="service_item" onClick={()=>this.goToPageCalendar("/page/"+appointmentInfo.staff.staffId+"/"+moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY'))}>
                                            <p>{appointment.serviceName}</p>
                                            <p><strong style={{textTransform: 'capitalize'}}>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dddd, HH:mm')}</strong></p>
                                        </a>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        );
    }
    handleClick(url){

            this.props.history.push(url)
    }

    goToPageCalendar(url){
        $('.modal_counts').modal('hide')

        this.props.history.push(url)
    }
    openAppointments(event){
        event.stopPropagation()
        this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
    }
}

function mapStateToProps(state) {
    const { alert, menu, authentication, company, calendar } = state;
    return {
        alert, menu, authentication, company, calendar
    };
}

SidebarMain.proptypes = {
    location: PropTypes.object.isRequired,
};

const connectedApp = connect(mapStateToProps)(withRouter(SidebarMain));
export { connectedApp as SidebarMain };