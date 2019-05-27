import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {calendarActions, companyActions, menuActions, userActions} from "../_actions";
import {access} from "../_helpers/access";
import moment from "moment";
import Link from "react-router-dom/es/Link";
import classNames from "classnames";

class SidebarMain extends Component {
    constructor(props) {
        super(props);
        this.state={
            menu: props.menu,
            authentication: props.authentication,
            company: props.company,
            appointmentsCount: props.appointmentsCount,
            collapse: localStorage.getItem('collapse') === 'true',
            calendar: props.calendar,
            newOpened: true,
            canceledOpened: false

        };

        this.handleClick=this.handleClick.bind(this)
        this.approveAllAppointment=this.approveAllAppointment.bind(this)
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
                count: newProps.company.count && newProps.company.count
            })

            this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
            this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        }
        if ( JSON.stringify(this.props.calendar) !==  JSON.stringify(newProps.calendar)) {
            this.setState({ ...this.state,
                appointmentsCount: newProps.calendar.appointmentsCount && newProps.calendar.appointmentsCount,
                appointmentsCanceled: newProps.calendar.appointmentsCanceled && newProps.calendar.appointmentsCanceled,
            })
        }
    }

    componentDidMount() {
        this.props.dispatch(companyActions.getBookingInfo());
        this.props.dispatch(companyActions.getNewAppointments());
        this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        this.props.dispatch(menuActions.getMenu());
    }

    toggleCollapse(value) {
        const collapse = value === 'true';
        localStorage.setItem('collapse', value);
        this.setState({ collapse });
    }

    render() {
        const { location }=this.props;
        const { authentication, menu, company, collapse, newOpened, appointmentsCanceled, appointmentsCount, count }=this.state;
        let path="/"+location.pathname.split('/')[1]

        const appointmentCountMarkup = appointmentsCount && appointmentsCount.map((appointmentInfo) =>

            appointmentInfo.appointments.map((appointment) => {
                let resultMarkup = null;
                if(!appointment.approved && !appointment.coAppointmentId) {

                    resultMarkup = (
                        <li>
                            <a className="service_item"
                               onClick={() => this.goToPageCalendar(appointment.appointmentId, "/page/" + appointmentInfo.staff.staffId + "/" + moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY'))}>
                                <p className="service_name" style={{
                                    width: "65%",
                                    marginRight: "5%",
                                    wordWrap: "break-word"
                                }}>{appointment.serviceName}</p>
                                <p className="service_time"
                                   style={{width: "30%", textAlign: "left"}}>
                                    <strong
                                        style={{textTransform: 'capitalize'}}>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dddd, D.MM, HH:mm')}</strong>
                                </p>
                            </a>
                        </li>
                    )
                }
                return resultMarkup;
            })
        )

        return (
            <div>
            <ul className={"sidebar "+(collapse &&' sidebar_collapse')}>

                <li className="mob-menu-personal">
                    <div className="logo_mob"/>
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

                <li className="arrow_collapse sidebar_list_collapse" onClick={() => this.toggleCollapse('true')} style={{'display':collapse?'none':'block'}}/>
                <li className="arrow_collapse sidebar_list_collapse-out" onClick={() => this.toggleCollapse('false')} style={{'display':collapse?'block':'none'}}/>
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
                            {keyStore===0 &&
                            ((count && count.appointments && count.appointments.count>0) ||
                            (count && count.canceled && count.canceled.count>0))
                            && <span className="menu-notification" onClick={(event)=>this.openAppointments(event)} data-toggle="modal" data-target=".modal_counts">{parseInt(count && count.appointments && count.appointments.count)+parseInt(count && count.canceled && count.canceled.count)}</span>}
                        </a>
                    </li>
                    )

                )}

                <li className="mob-menu-closer">
                    <div>
                        <img src={`${process.env.CONTEXT}public/img/closer_mob.svg`} alt=""/>
                    </div>
                </li>

                {company.booking && <div className={classNames('id_company', { 'id_company_collapse': collapse })}>{!collapse && 'Id компании:'} <a target="_blank"
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
                        <div className="modal-content modal-height">
                            <div className="modal-header">
                                <h4 className="modal-title">Уведомления</h4>


                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            {newOpened &&
                            <div className="modal-inner pl-4 pr-4 count-modal modal-not-approved">
                                <div className="button-field">
                                    <button type="button" className="float-left button small-button">Новые записи <span className="counter">
                                        {count && count.appointments && count.appointments.count}
                                    </span></button>
                                    <button type="button" className="float-left button small-button disabled" onClick={()=>this.setState({'newOpened':false})}>Удаленные записи<span  className="counter">{count && count.canceled && count.canceled.count}</span></button>
                                </div>
                                <div className="not-approved-list">
                                    {appointmentCountMarkup}

                                </div>
                                {appointmentsCount && (
                                    <div className="button-field down-button">
                                        <button className="button approveAll" onClick={()=>this.approveAllAppointment(true, false)}>Отметить всё как просмотрено</button>
                                    </div>)}
                            </div>
                            }
                            {!newOpened &&
                            <div className="modal-inner pl-4 pr-4 count-modal modal-not-approved">

                                <div className="button-field">
                                    <button type="button" className="float-left button small-button disabled"
                                            onClick={() => this.setState({'newOpened': true})}>Новые
                                        записи<span className="counter">
                                            {count && count.appointments && count.appointments.count}
                                            </span></button>
                                    <button type="button" className="float-left button small-button">Удаленные записи<span
                                        className="counter">{count && count.canceled && count.canceled.count}</span></button>
                                </div>
                                <div className="not-approved-list">
                                {appointmentsCanceled &&
                                appointmentsCanceled.map((appointment) =>
                                    !appointment.approved &&
                                    <li className="opacity0">
                                        <a className="service_item">
                                            <p className="service_name" style={{
                                                width: "65%",
                                                marginRight: "5%",
                                                wordWrap: "break-word"
                                            }}>{appointment.serviceName}<br/>
                                                <span
                                                    className="deleted">{appointment.canceledOnline ? 'Удален клиентом' : 'Удален сотрудником'}</span>
                                            </p>
                                            <p className="service_time"
                                               style={{width: "30%", textAlign: "left"}}><strong
                                                style={{textTransform: 'capitalize'}}>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dddd, D.MM, HH:mm')}</strong>
                                            </p>
                                        </a>
                                    </li>
                                )}
                            </div>
                                {appointmentsCount && (
                                    <div className="button-field down-button">
                                        <button className="button approveAll" onClick={()=>this.approveAllAppointment(true, true)}>Отметить всё как просмотрено</button>
                                    </div>)}
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>



        );
    }
    handleClick(url){

            this.props.history.push(url)
    }

    approveAppointment(id){
        const {dispatch} = this.props;

        dispatch(calendarActions.approveAppointment(id));
    }
    approveAllAppointment(approved, canceled){
        this.props.dispatch(calendarActions.approveAllAppointment(approved, canceled));
    }

    goToPageCalendar(id, url){
        $('.modal_counts').modal('hide')

        this.props.history.push(url);

        this.approveAppointment(id)
        this.props.dispatch(calendarActions.setScrollableAppointment(id))
        // const className = `.${id}`;
        //  setTimeout(() => {
        //
        //      $(className).addClass("custom-blick-div")
        //
        //
        //      setTimeout(() => {
        //          // container.animate({scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop(), scrollLeft: 0},300);
        //          const elmnt = document.getElementsByClassName(className)[0];
        //          elmnt.scrollIntoView();
        //          }, 500);
        //
        //  }, 1000)
        //
        // setTimeout(()=> $(className).removeClass("custom-blick-div"), 15000);

    }
    openAppointments(event){
        event.stopPropagation()
        this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
    }
}

function mapStateToProps(state) {
    const { alert, menu, authentication, company, calendar, appointmentsCount } = state;
    return {
        alert, menu, authentication, company, calendar, appointmentsCount
    };
}

SidebarMain.proptypes = {
    location: PropTypes.object.isRequired,
};

const connectedApp = connect(mapStateToProps)(withRouter(SidebarMain));
export { connectedApp as SidebarMain };