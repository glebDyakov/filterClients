import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {calendarActions, companyActions, menuActions, userActions, staffActions, clientActions} from "../_actions";
import {access} from "../_helpers/access";
import moment from "moment";
import Link from "react-router-dom/es/Link";
import classNames from "classnames";
import {UserSettings} from "./modals/UserSettings";

class SidebarMain extends Component {
    constructor(props) {
        super(props);
        this.state={
            menu: props.menu,
            authentication: props.authentication,
            company: props.company,
            collapse: localStorage.getItem('collapse') === 'true',
            calendar: props.calendar,
            openedTab: 'new',
            canceledOpened: false,
            userSettings: false

        };

        this.handleClick=this.handleClick.bind(this)
        this.approveAllAppointment=this.approveAllAppointment.bind(this)
        this.openAppointments=this.openAppointments.bind(this)
        this.goToPageCalendar=this.goToPageCalendar.bind(this)
        this.logout=this.logout.bind(this)
        this.onClose=this.onClose.bind(this)

    }
    logout(){
        const { dispatch } = this.props;
        dispatch(userActions.logout());
        // this.props.history.push('/login');
    }


    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.authentication) !==  JSON.stringify(newProps.authentication)) {
            this.setState({
                authentication: newProps.authentication,
            })
        }
        if ( JSON.stringify(this.props.calendar) !==  JSON.stringify(newProps.calendar)) {
            this.setState({
                calendar: newProps.calendar,
            })
        }
        if ( JSON.stringify(this.props.menu) !==  JSON.stringify(newProps.menu)) {
            this.setState({
                menu: newProps.menu,
            })
        }
        if ( JSON.stringify(this.props.company) !==  JSON.stringify(newProps.company)) {
            this.setState({
                company: newProps.company,
                count: newProps.company.count && newProps.company.count
            })
        }
        if (JSON.stringify(newProps.company.count) !== JSON.stringify(this.props.company.count)) {
            // this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
            // this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        }
    }

    componentDidMount() {
        this.props.dispatch(companyActions.getBookingInfo());
        this.props.dispatch(companyActions.getNewAppointments());
        this.props.dispatch(menuActions.getMenu());
        this.props.dispatch(staffActions.get());
        this.props.dispatch(clientActions.getClientWithInfo());

        this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));

    }

    toggleCollapse(value) {
        const collapse = value === 'true';
        localStorage.setItem('collapse', value);
        this.setState({ collapse });
    }

    render() {
        const { location, calendar: { appointmentsCanceled }, staff, client, appointmentsCount }=this.props;
        const { isLoadingModalAppointment, isLoadingModalCount, isLoadingModalCanceled} = this.props.calendar;
        const { authentication, menu, company, collapse, openedTab,  count, userSettings }=this.state;
        let path="/"+location.pathname.split('/')[1]

        const appointmentCountMarkup = appointmentsCount && appointmentsCount.map((appointmentInfo) => {
            const activeStaff = staff && staff.staff && staff.staff.find(item =>
                ((item.staffId) === (appointmentInfo.staff.staffId)));

            return appointmentInfo.appointments.map((appointment) => {
                let resultMarkup = null;
                if ((!appointment.approved && !appointment.coAppointmentId)
                    && ((appointmentInfo.staff.staffId === authentication.user.profile.staffId) || activeStaff.adminOverviewMode)) {


                    const activeClient = client && client.client && client.client.find(item => {
                        return ((item.clientId) === (appointment.clientId));
                    });

                    resultMarkup = (
                        <li onClick={() => this.goToPageCalendar(appointment.appointmentId, "/page/" + appointmentInfo.staff.staffId + "/" + moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY'))}>
                            <div className="service_item">
                                <div className="img-container" style={{width: "15%"}}>
                                    <img
                                        src={activeStaff && activeStaff.imageBase64 ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                        className="img"/></div>
                                <div style={{width: "40%"}}>
                                    <p className="service_name"
                                       style={{
                                           // width: "65%",
                                           // marginRight: "5%",
                                           // wordWrap: "break-word"
                                       }}
                                    ><strong>{appointment.serviceName}</strong>
                                        {/*<br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                                    </p><br/>
                                    <p style={{float: "none"}}>
                                        <strong>Мастер: </strong>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}
                                    </p>
                                </div>
                                <div style={{width: "40%"}}>
                                    <p><strong>Клиент:</strong> {appointment.clientName}</p><br/>
                                    {activeClient && activeClient.phone &&
                                    <p><strong>Телефон: </strong> {activeClient.phone}</p>}
                                    <p className="service_time" style={{textTransform: 'capitalize'}}
                                        // style={{width: "30%", textAlign: "left"}}
                                    >
                                        <strong>Время: </strong>
                                        {moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dd, DD MMMM YYYY, HH:mm')}
                                    </p>
                                    <p style={{color: "#3E90FF"}}>Просмотреть запись</p>

                                </div>
                            </div>
                        </li>
                    )
                }
                return resultMarkup;
            })
        })

        let movedCount = 0;
        const appointmentMovedMarkup = appointmentsCount && appointmentsCount.map((appointmentInfo) => {
            const activeStaff = staff && staff.staff && staff.staff.find(item =>
                ((item.staffId) === (appointmentInfo.staff.staffId)));
            return appointmentInfo.appointments.map((appointment) => {
                let resultMarkup = null;
                if((appointment.moved) && ((appointmentInfo.staff.staffId === authentication.user.profile.staffId) || activeStaff.adminOverviewMode)) {


                    const activeClient = client && client.client && client.client.find(item => {
                        return((item.clientId) === (appointment.clientId));});
                    movedCount++;
                    resultMarkup = (
                        <li onClick={() => this.goToPageCalendar(appointment.appointmentId, "/page/" + appointmentInfo.staff.staffId + "/" + moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY'))}>
                            <div className="service_item">
                                <div className="img-container" style={{width: "15%"}}>
                                    <img src={activeStaff && activeStaff.imageBase64 ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                         className="img"/></div>
                                <div style={{width: "40%"}}>
                                    <p className="service_name"
                                       style={{
                                           // width: "65%",
                                           // marginRight: "5%",
                                           // wordWrap: "break-word"
                                       }}
                                    ><strong>{appointment.serviceName}</strong>
                                        {/*<br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                                    </p><br/>
                                    <p style={{float: "none"}} ><strong>Мастер: </strong>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}</p>
                                </div>
                                <div style={{width: "40%"}}>
                                    <p><strong>Клиент:</strong> {appointment.clientName}</p><br/>
                                    {activeClient && activeClient.phone && <p><strong>Телефон: </strong> {activeClient.phone}</p>}
                                    <p className="service_time" style={{textTransform: 'capitalize'}}
                                        // style={{width: "30%", textAlign: "left"}}
                                    >
                                        <strong>Время: </strong>
                                        {moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dd, DD MMMM YYYY, HH:mm')}
                                    </p>
                                    <p style={{color: "#3E90FF"}}>Просмотреть запись</p>

                                </div>
                            </div>
                        </li>
                    )
                }
                return resultMarkup;
            })
        })

        return (
            <div>
            <ul className={"sidebar "+(collapse &&' sidebar_collapse')}>

                <li className="mob-menu-personal">
                    <div className="logo_mob"/>
                    <div className="mob-firm-name" onClick={()=>this.onOpen()} style={{height: "45px"}}>
                        <div className="img-container">
                            <img className="rounded-circle" style={{opacity: "1"}} src={authentication.user.profile.imageBase64 && authentication.user.profile.imageBase64!==''?("data:image/png;base64,"+authentication.user.profile.imageBase64):`${process.env.CONTEXT}public/img/image.png`} alt=""/>
                        </div>
                        <p className="firm-name" style={{float: "left", opacity: "0.5"}}>
                            {authentication && authentication.user.profile && authentication.user.profile.firstName} {authentication && authentication.user.profile.lastName}
                        </p>
                        <span  onClick={()=>this.logout()} className="log_in"/>
                        {/*<div className="setting_mob">*/}
                        {/*    <a className="notification">Уведомления</a>*/}
                        {/*    <a className="setting" data-toggle="modal" data-target=".modal_user_setting" onClick={()=>this.onOpen()}>Настройки</a>*/}
                        {/*</div>*/}
                    </div>
                </li>

                <li className="arrow_collapse sidebar_list_collapse" onClick={() => this.toggleCollapse('true')} style={{'display':collapse?'none':'block'}}/>
                <li className="arrow_collapse sidebar_list_collapse-out" onClick={() => this.toggleCollapse('false')} style={{'display':collapse?'block':'none'}}/>
                {authentication && authentication.menu && authentication.user && authentication.user.menu &&
                menu && menu.menuList && menu.menuList.map((item, keyStore)=>{
                    return(
                    authentication.user.menu.map(localItem=>{
                        return(
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
                            (count && count.canceled && count.canceled.count>0) ||
                            (count && count.moved && count.moved.count>0))
                            && <span className="menu-notification" onClick={(event)=>this.openAppointments(event)} data-toggle="modal" data-target=".modal_counts">{parseInt(count && count.appointments && count.appointments.count)+parseInt(count && count.canceled && count.canceled.count)+parseInt(count && count.moved && count.moved.count)}</span>}
                        </a>
                    </li>
                    );})

                );})}

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
                                    <span aria-hidden="true"></span>
                                </button>
                                {/*<img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" data-dismiss="modal"*/}
                                {/*     style={{margin:"13px 5px 0 0"}}/>*/}
                            </div>


                            <div className="modal-inner pl-4 pr-4 count-modal modal-not-approved">
                                <div className="button-field">
                                    <button type="button" className={"float-left button small-button approve-tab " + (openedTab === 'new' ? '' : 'disabled')}
                                            onClick={() => this.setState({openedTab: 'new'})}>Новые записи <span className="counter">
                                        {count && count.appointments && count.appointments.count}
                                    </span></button>
                                    <button type="button" className={"float-left button small-button approve-tab " + (openedTab === 'deleted' ? '' : 'disabled')} onClick={()=>this.setState({openedTab:'deleted'})}>Удаленные записи<span  className="counter">{count && count.canceled && count.canceled.count}</span></button>
                                    <button type="button" className={"float-left button small-button approve-tab " + (openedTab === 'moved' ? '' : 'disabled')} onClick={()=>this.setState({openedTab:'moved'})}>Перемещенные записи<span  className="counter">{count && count.moved && count.moved.count}</span></button>
                                </div>
                                {openedTab === 'new' && <React.Fragment>
                                    <div className="not-approved-list">
                                        {!(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled) && appointmentCountMarkup}
                                        {(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled)
                                        && <div className="loader"
                                                style={{left: '0', width: '100%', height: '74%', top: '120px'}}><img
                                            src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}

                                    </div>
                                    {appointmentsCount && (
                                        <div className="button-field down-button">
                                            <button className="button approveAll"
                                                    onClick={() => this.approveAllAppointment(true, false)}>Отметить всё как просмотрено
                                            </button>
                                        </div>)}
                                </React.Fragment>
                                }
                                {openedTab === 'deleted' && <React.Fragment>
                                    <div className="not-approved-list">
                                        {appointmentsCanceled && !(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled) &&
                                        appointmentsCanceled.map((appointment) =>
                                        {
                                            return(
                                                !appointment.approved &&
                                                <li className="opacity0">
                                                    <div className="service_item">
                                                        <p className="service_name" style={{
                                                            width: "65%",
                                                            marginRight: "5%",
                                                            wordWrap: "break-word"
                                                        }}>{appointment.serviceName}<br/>
                                                            <span
                                                                className="deleted" style={{color: "#3E90FF"}}>{appointment.canceledOnline ? 'Удален клиентом' : 'Удален сотрудником'}</span>
                                                        </p>
                                                        <p className="service_time"
                                                           style={{width: "30%", textAlign: "left"}}><strong
                                                            style={{textTransform: 'capitalize'}}>{moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dd, DD MMMM YYYY, HH:mm')}</strong>
                                                        </p>
                                                    </div>
                                                </li>
                                            )})}
                                    </div>
                                    {appointmentsCount && (
                                    <div className="button-field down-button">
                                        <button className="button approveAll"
                                                onClick={() => this.approveAllAppointment(true, true)}>Отметить всё как просмотрено
                                        </button>
                                    </div>)}
                                </React.Fragment>
                                }
                                {openedTab === 'moved' && <React.Fragment>
                                    <div className="not-approved-list">
                                        {!(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled) && appointmentMovedMarkup}
                                        {(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled)
                                        && <div className="loader"
                                                style={{left: '0', width: '100%', height: '74%', top: '120px'}}><img
                                            src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}

                                    </div>
                                    {appointmentsCount && (
                                        <div className="button-field down-button">
                                            <button className="button approveAll"
                                                    onClick={() => {
                                                        this.props.dispatch(calendarActions.approveMovedAppointment());
                                                    }}>Отметить всё как просмотрено
                                            </button>
                                        </div>)}
                                </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {userSettings &&
                <UserSettings
                onClose={this.onClose}/>
                }

            </div>



        );
    }
    onOpen(){
        this.setState({userSettings: true})
    }
    onClose(){
        this.setState({userSettings:false})
    }

    handleClick(url){
            this.props.dispatch(menuActions.runSocket())
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
        const { openedTab } = this.state;

        this.props.history.push(url);

        if (openedTab === 'new') {
            this.approveAppointment(id)
        } else if (openedTab === 'moved') {
            this.props.dispatch(calendarActions.updateAppointment(id, JSON.stringify({ moved: false, approved: true })))
        }
        this.props.dispatch(calendarActions.setScrollableAppointment(id))
    }
    openAppointments(event){
        event.stopPropagation()
        // setTimeout(() => {
        //     this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        //     this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        //
        // }, 100)
    }
}

function mapStateToProps(state) {
    const { alert, menu, authentication, company, calendar, staff, client} = state;

    return {
        alert, menu, authentication, company, calendar, appointmentsCount: calendar.appointmentsCount, staff, client
    };
}

SidebarMain.proptypes = {
    location: PropTypes.object.isRequired,
};

const connectedApp = connect(mapStateToProps)(withRouter(SidebarMain));
export { connectedApp as SidebarMain };
