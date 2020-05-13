import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {calendarActions, companyActions, menuActions, userActions, staffActions, clientActions} from "../_actions";
import moment from "moment";
import Link from "react-router-dom/es/Link";
import classNames from "classnames";
import {UserSettings} from "./modals/UserSettings";
import {HeaderMain} from "./HeaderMain";
import AppointmentFromSocket from "./modals/AppointmentFromSocket";


class SidebarMain extends React.Component {
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
        this.handleOutsideClick=this.handleOutsideClick.bind(this)
        this.toggleDropdown=this.toggleDropdown.bind(this)
        this.approveAllAppointment=this.approveAllAppointment.bind(this)
        this.approveMovedAppointment=this.approveMovedAppointment.bind(this)
        this.openAppointments=this.openAppointments.bind(this)
        this.goToPageCalendar=this.goToPageCalendar.bind(this)
        this.logout=this.logout.bind(this)
        this.onClose=this.onClose.bind(this)
        this.getExtraServiceText=this.getExtraServiceText.bind(this)

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
            const companyTypeId = newProps.company.settings && newProps.company.settings.companyTypeId;
            if(newProps.match.params.activeTab==='staff'){document.title = (companyTypeId === 2 || companyTypeId === 3) ? "Рабочие места | Онлайн-запись" : "Сотрудники | Онлайн-запись"}
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
        $('.arrow_collapse').click(function (e) {
            // e.preventDefault();
            // e.stopPropagation();
            $('.arrow_collapse.sidebar_list_collapse').fadeOut(0);
            $('.arrow_collapse.sidebar_list_collapse-out').fadeIn(0);

            $(this).parent('ul').addClass('sidebar_collapse').animate({

            }, 200);

            $('.content-wrapper, .no-scroll, .no-scroll2').addClass('content-collapse').animate({

            }, 200);
        });

        $('.arrow_collapse.sidebar_list_collapse-out').click(function (e) {
            // e.preventDefault();
            // e.stopPropagation();
            $('.arrow_collapse.sidebar_list_collapse-out').fadeOut(0);
            $('.arrow_collapse.sidebar_list_collapse').fadeIn(0);

            $(this).parent('ul').removeClass('sidebar_collapse').animate({

            }, 200);

            $('.content-wrapper, .no-scroll, .no-scroll2').removeClass('content-collapse').animate({

            }, 200);
        });
        const { user } = this.props.authentication

        if (user && (user.forceActive
          || (moment(user.trialEndDateMillis).format('x') >= moment().format('x'))
          || (user.invoicePacket && moment(user.invoicePacket.endDateMillis).format('x') >= moment().format('x'))
        )) {
        } else {
          this.props.dispatch(menuActions.getMenu());
          return;
        }

        // this.props.dispatch(companyActions.getNewAppointments());
        this.props.dispatch(menuActions.getMenu());
        // this.props.dispatch(clientActions.getClientWithInfo());

    }

    componentDidUpdate() {
        if(this.state.isNotificationDropdown || this.state.isPaymentDropdown) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
    }


    handleOutsideClick() {
        this.setState({ isNotificationDropdown: false, isPaymentDropdown: false })
    }

    toggleCollapse(value) {
        const collapse = value === 'true';
        localStorage.setItem('collapse', value);
        this.setState({ collapse });

        const elems = document.getElementsByClassName('modal---modal-overlay---3D5Nr')
        if (elems) {
            elems[0].style.marginLeft = collapse ? '70px' : '250px'
        }

        const headerLayout = document.getElementById('header-layout');
        if (headerLayout) {
            if (collapse) {
                headerLayout.classList.remove("collapsed-header");
            } else {
                headerLayout.classList.add("collapsed-header");
            }
        }
    }

    toggleDropdown(key) {
        this.setState({ [key]: !this.state[key]})
    }

    getExtraServiceText(appointments, appointment) {
        let totalCount = 0;
        if (appointment.hasCoAppointments) {
            appointments.forEach(staffAppointment => staffAppointment.appointments.forEach(currentAppointment => {
                if (currentAppointment.coAppointmentId === appointment.appointmentId) {
                    totalCount++;
                }
            }))
        }
        let extraServiceText = ''
        switch (totalCount) {
            case 0:
                extraServiceText = '';
                break;
            case 1:
                extraServiceText = 'и ещё 1 услуга';
                break;
            case 2:
            case 3:
            case 4:
                extraServiceText = `и ещё ${totalCount} услуги`;
                break;
            default:
                extraServiceText = `и ещё 5+ услуг`;
        }
        return extraServiceText
    }

    render() {
        const { location, notification, calendar: { appointmentsCanceled }, staff, appointmentsCount }=this.props;
        const { isLoadingModalAppointment, isLoadingModalCount, isLoadingModalCanceled} = this.props.calendar;
        const { authentication, menu, company, collapse, openedTab,  count, userSettings, isNotificationDropdown, isPaymentDropdown }=this.state;
        let path="/"+location.pathname.split('/')[1]

        const companyTypeId = company.settings && company.settings.companyTypeId;

        const { invoicePacket, forceActive, trialEndDateMillis } = authentication.user;
        let packetEnd, packetEndText;
        if (invoicePacket) {
            packetEnd = Math.ceil((invoicePacket.endDateMillis - moment().format('x')) / 3600 / 24 / 1000) - 1

            packetEndText = packetEnd === 0
                ? 'Сегодня система будет отключена'
                : `До окончания действия пакета ${packetEnd === 1 ? 'остался 1 день' : `осталось ${packetEnd} дня`}`;

        } else if (!forceActive) {
            packetEnd = Math.ceil((trialEndDateMillis - moment().format('x')) / 3600 / 24 / 1000) - 1
            if (packetEnd < 0) {
              packetEndText = 'Компания не активна. Чтобы активировать, выберите и оплатите пакет'
            } else {
              packetEndText = packetEnd === 0
                ? 'Сегодня система будет отключена'
                : `До окончания тестового периода ${packetEnd === 1 ? 'остался 1 день' : `осталось ${packetEnd} дня`}`;
            }
        }

        let staffType;
        if (authentication.user && authentication.user.profile && authentication.user.profile.roleId) {
            switch (authentication.user.profile.roleId) {
                case 1:
                case 2:
                    staffType = 'Сотрудник'
                    break;
                case 3:
                    staffType = 'Админ'
                    break;
                case 4:
                    staffType = 'Владелец'
                    break;
                default:
            }
        }

        const packetShowCondition = packetEnd <= 3;

        const appointmentCountMarkup = appointmentsCount && appointmentsCount.map((appointmentInfo) => {
            const activeStaff = staff && staff.staff && staff.staff.find(item =>
                ((item.staffId) === (appointmentInfo.staff.staffId)));

            return appointmentInfo.appointments.map((appointment) => {
                const { roleId } = authentication.user.profile
                let resultMarkup = null;
                let condition;
                if (roleId === 3 || roleId === 4) {
                    condition = !appointment.adminApproved
                } else {
                    condition = !appointment.approved && appointmentInfo.staff.staffId === authentication.user.profile.staffId
                }
                let extraServiceText = this.getExtraServiceText(appointmentsCount, appointment);

                if (condition && !appointment.coAppointmentId) {
                    resultMarkup = (
                        <li onClick={() => this.goToPageCalendar(appointment, appointmentInfo.staff.staffId)}>
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
                                        <br />
                                        <strong>{extraServiceText}</strong>
                                        {/*<br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                                    </p><br/>
                                    <p style={{float: "none"}}>
                                        <strong>Мастер: </strong>{appointmentInfo.staff.firstName + " " + (appointmentInfo.staff.lastName ? appointmentInfo.staff.lastName : '')}
                                    </p>
                                </div>
                                <div style={{width: "40%", wordBreak: 'break-word'}}>
                                    {appointment.clientFirstName ? <React.Fragment><p><strong>Клиент:</strong> {appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')}</p><br/></React.Fragment> : 'Без клиента'}
                                    {appointment.clientPhone && <p><strong>Телефон: </strong> {appointment.clientPhone}</p>}
                                    {appointment.carBrand && <p style={{ textDecoration: 'underline' }}><strong>Марка авто: </strong> {appointment.carBrand}</p>}
                                    {appointment.carNumber && <p style={{ textDecoration: 'underline' }}><strong>Гос. номер: </strong> {appointment.carNumber}</p>}
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
                const { roleId } = authentication.user.profile
                let resultMarkup = null;
                let condition;
                if (roleId === 3 || roleId === 4) {
                    condition = appointment.adminMoved
                } else {
                    condition = appointment.moved && appointmentInfo.staff.staffId === authentication.user.profile.staffId
                }
                let extraServiceText = this.getExtraServiceText(appointmentsCount, appointment);
                if(condition && !appointment.coAppointmentId) {
                    movedCount++;
                    resultMarkup = (
                        <li onClick={() => this.goToPageCalendar(appointment, appointmentInfo.staff.staffId)}>
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
                                    ><strong>{appointment.serviceName}</strong> <br />
                                        <strong>{extraServiceText}</strong>
                                        {/*<br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                                    </p><br/>
                                    <p style={{float: "none"}} ><strong>Мастер: </strong>{appointmentInfo.staff.firstName + " " + (appointmentInfo.staff.lastName ? appointmentInfo.staff.lastName : '')}</p>
                                    <span
                                        className="deleted" style={{color: "#3E90FF"}}>{appointment.movedOnline ? 'Перенесен клиентом' : 'Перенесен сотрудником'}</span>
                                </div>
                                <div style={{width: "40%", wordBreak: 'break-word'}}>
                                    {appointment.clientFirstName ? <React.Fragment><p><strong>Клиент:</strong> {appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}`: '')}</p><br/></React.Fragment> : 'Без клиента'}
                                    {appointment.clientPhone && <p><strong>Телефон: </strong> {appointment.clientPhone}</p>}
                                    {appointment.carBrand && <p style={{ textDecoration: 'underline' }}><strong>Марка авто: </strong> {appointment.carBrand}</p>}
                                    {appointment.carNumber && <p style={{ textDecoration: 'underline' }}><strong>Гос. номер: </strong> {appointment.carNumber}</p>}
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
            <React.Fragment>
                <HeaderMain />
                <AppointmentFromSocket />

                <ul className={"sidebar "+(collapse &&' sidebar_collapse')}>
                    <li className="mob-menu-personal">
                        <div className="logo_mob"/>
                        <div className="mob-firm-name" onClick={(e)=> {
                            if (e.target.className !== 'notification-mob') {
                                this.onOpen()
                            }
                        }} style={{height: "55px"}}>
                            <div className="img-container">
                                <img className="rounded-circle" style={{opacity: "1"}} src={authentication.user.profile.imageBase64 && authentication.user.profile.imageBase64!==''?("data:image/png;base64,"+authentication.user.profile.imageBase64):`${process.env.CONTEXT}public/img/image.png`} alt=""/>
                            </div>
                            <p onClick={() => {
                                $('.modal_user_setting').modal('show')
                            }} className="firm-name" style={{float: "left", opacity: "0.5"}}>
                                {authentication && authentication.user.profile && authentication.user.profile.firstName} {authentication && authentication.user.profile.lastName}
                                <p style={{ fontSize: '11px' }}>{staffType}</p>
                            </p>

                            <span  onClick={()=>this.logout()} className="log_in"/>
                            <span className="notification-mob" onClick={() => {
                                $('#__replain_widget').addClass('__replain_widget_show')
                                $('#__replain_widget_iframe').contents().find(".btn-img").click()
                                $("#__replain_widget_iframe").contents().find(".hide-chat").bind("click", function() {
                                    $('#__replain_widget').removeClass('__replain_widget_show')
                                });
                            }}/>
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
                        authentication.user.menu.map((localItem, i)=>{
                            return(
                            localItem.id===item.id &&
                        <li style={i === 0 ? { marginTop: '30px'} : {}} className={path === item.url ? 'active' : ''}
                            key={keyStore}>
                            <a onClick={(e) => this.handleClick(item.url, e)}>
                                <img
                                    src={`${process.env.CONTEXT}public/img/icons/` + item.icon}
                                    alt=""/>
                                <span>{item.id === 'staff_menu_id' ? (
                                    (companyTypeId === 2 || companyTypeId === 3) ? 'Рабочие места' : 'Сотрудники'
                                ) : item.name}</span>
                                {keyStore===0 &&
                                ((count && count.appointments && count.appointments.count>0) ||
                                (count && count.canceled && count.canceled.count>0) ||
                                (count && count.moved && count.moved.count>0))
                                && <span className="menu-notification" onClick={(event)=>this.openAppointments(event)} data-toggle="modal" data-target=".modal_counts">{parseInt(count && count.appointments && count.appointments.count)+parseInt(count && count.canceled && count.canceled.count)+parseInt(count && count.moved && count.moved.count)}</span>}

                                {item.id === 'email_menu_id' && (
                                  <div className="sidebar-notification-wrapper" onClick={() => this.toggleDropdown('isNotificationDropdown')}>

                                      { (notification.balance && notification.balance.smsAmount < (localStorage.getItem('notifyCount') || 200)
                                        || notification.balance && notification.balance.emailAmount < (localStorage.getItem('notifyCount') || 200))
                                      && <React.Fragment>
                                          <span className="sidebar-notification"/>
                                          {isNotificationDropdown && <ul className="sidebar-notification-dropdown">
                                              {notification.balance && notification.balance.smsAmount < (localStorage.getItem('notifyCount') || 200) &&
                                              <li>Баланс SMS ниже {(localStorage.getItem('notifyCount') || 200)}</li>
                                              }
                                              {notification.balance && notification.balance.emailAmount < (localStorage.getItem('notifyCount') || 200) &&
                                              <li>Баланс Email ниже {(localStorage.getItem('notifyCount') || 200)}</li>
                                              }
                                          </ul>}
                                      </React.Fragment> }

                                  </div>
                                )}

                                {item.id === 'payments_menu_id' && (
                                  <div className="sidebar-notification-wrapper" onClick={() => this.toggleDropdown('isPaymentDropdown')}>

                                      {packetShowCondition && <React.Fragment>
                                          <span className="sidebar-notification"/>
                                          {isPaymentDropdown && (
                                            <ul className="sidebar-notification-dropdown">
                                              <li>{packetEndText}</li>
                                            </ul>
                                          )}
                                      </React.Fragment>
                                      }

                                  </div>
                                )}
                            </a>
                        </li>
                        );})

                    );})}

                    <li className="mob-menu-closer">
                        <div>
                            <img src={`${process.env.CONTEXT}public/img/closer_mob.svg`} alt=""/>
                        </div>
                    </li>

                    {authentication && authentication.user && authentication.user && authentication.user.bookingPage && <div className={classNames('id_company', { 'id_company_collapse': collapse })}>{!collapse && 'Id компании:'} <a target="_blank"
                                                                href={"https://online-zapis.com/online/" + authentication.user.bookingPage}
                                                                className="">{authentication.user.bookingPage}
                    </a>
                    </div>}
                    <div className="questions"><Link to="/faq">
                        <img className="rounded-circle" src={`${process.env.CONTEXT}public/img/information.svg`} alt=""/>
                    </Link></div>

                </ul>
                <div className="sidebar-modal modal fade modal_counts" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                        <div className="button-field down-button">
                                            <button className="button approveAll"
                                                    onClick={() => this.approveAllAppointment(true, false)}>Отметить всё как просмотрено
                                            </button>
                                        </div>
                                </React.Fragment>
                                }
                                {openedTab === 'deleted' && <React.Fragment>
                                    <div className="not-approved-list">
                                        {appointmentsCanceled && !(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled) &&
                                        appointmentsCanceled.map((appointment) => {
                                            const activeStaff = staff && staff.staff && staff.staff.find(item =>
                                                ((item.staffId) === (appointment.staffId)));
                                            const { roleId } = authentication.user.profile
                                            let condition;
                                            if (roleId === 3 || roleId === 4) {
                                                condition = !appointment.adminApproved
                                            } else {
                                                condition = !appointment.approved
                                            }
                                            return (condition &&
                                                <li className="opacity0">
                                                    <div className="service_item">
                                                        <div className="img-container" style={{width: "15%"}}>
                                                            <img src={activeStaff && activeStaff.imageBase64 ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                                 className="img"/></div>
                                                        <div style={{width: "50%"}}>
                                                            <p className="service_name" style={{
                                                                width: "65%",
                                                                marginRight: "5%",
                                                                wordWrap: "break-word"
                                                            }}>{appointment.serviceName}<br/>
                                                                <span
                                                                    className="deleted" style={{color: "#3E90FF"}}>{appointment.canceledOnline ? 'Удален клиентом' : 'Удален сотрудником'}</span>
                                                            </p>
                                                        </div>
                                                        <div style={{width: "40%",  wordBreak: 'break-word'}}>
                                                            {appointment.clientFirstName ? <React.Fragment><p><strong>Клиент:</strong> {appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')}</p><br/> </React.Fragment> : 'Без клиента'}
                                                            {appointment.clientPhone && <p><strong>Телефон: </strong> {appointment.clientPhone }</p>}
                                                            {appointment.carBrand && <p><strong style={{ textDecoration: 'underline' }}>Марка авто: </strong> {appointment.carBrand}</p>}
                                                            {appointment.carNumber && <p><strong style={{ textDecoration: 'underline' }}>Гос. номер: </strong> {appointment.carNumber}</p>}
                                                            <p className="service_time" style={{textTransform: 'capitalize'}}
                                                                // style={{width: "30%", textAlign: "left"}}
                                                            >
                                                                <strong>Время: </strong>
                                                                {moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dd, DD MMMM YYYY, HH:mm')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </div>
                                    <div className="button-field down-button">
                                        <button className="button approveAll"
                                                onClick={() => this.approveAllAppointment(true, true)}>Отметить всё как просмотрено
                                        </button>
                                    </div>
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
                                    <div className="button-field down-button">
                                        <button className="button approveAll"
                                                onClick={() => {
                                                    this.approveMovedAppointment()

                                                }}>Отметить всё как просмотрено
                                        </button>
                                    </div>
                                </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>



        );
    }
    onOpen(){
        this.setState({userSettings: true})
    }
    onClose(){
        this.setState({userSettings:false})
    }

    handleClick(url, e){
        if (e.target.className !== 'sidebar-notification') {
            if (this.props.location.pathname === '/settings') {
                this.props.dispatch(companyActions.getSubcompanies())
            }
            this.props.dispatch(menuActions.runSocket())
            this.props.history.push(url)
        }
    }

    approveMovedAppointment() {
        const { roleId } = this.props.authentication.user.profile
        const params = {}

        if (roleId === 3 || roleId === 4) {
            params.adminMoved = false
        } else {
            params.moved = false
        }

        this.props.dispatch(calendarActions.approveMovedAppointment(params));
    }

    approveAllAppointment(approved, canceled){
        const { roleId } = this.props.authentication.user.profile
        const params = {}

        if (roleId === 3 || roleId === 4) {
            params.adminApproved = true
        } else {
            params.approved = true
        }

        this.props.dispatch(calendarActions.approveAllAppointment(approved, canceled, params));
    }

    goToPageCalendar(appointment, appointmentStaffId){
        $('.modal_counts').modal('hide')
        const { staffId, roleId } = this.props.authentication.user.profile
        const { openedTab } = this.state;
        const { appointmentId, appointmentTimeMillis } = appointment

        const url = "/page/" + appointmentStaffId + "/" + moment(appointmentTimeMillis, 'x').locale('ru').format('DD-MM-YYYY')
        this.props.history.push(url);

        if (openedTab === 'new') {
            const params = {}
            if (staffId !== appointmentStaffId) {
                params.approved = false;
                params.adminApproved = true;
            } else if (roleId === 3 || roleId === 4) {
                params.approved = true;
                params.adminApproved = true;
            } else {
                params.approved = true;

            }

            this.props.dispatch(calendarActions.approveAppointment(appointmentId, params));
        } else if (openedTab === 'moved') {
            const params = {}
            if (staffId !== appointmentStaffId) {
                params.moved = true;
                params.adminMoved = false;
            } else if (roleId === 3 || roleId === 4) {
                params.moved = false;
                params.adminMoved = false;
            } else {
                params.moved = false;

            }
            this.props.dispatch(calendarActions.updateAppointment(appointmentId, JSON.stringify(params)))
        }

        this.props.dispatch(calendarActions.setScrollableAppointment(appointmentId))
    }
    openAppointments(event){
        event.stopPropagation()
        this.props.dispatch(staffActions.get());
        // this.props.dispatch(clientActions.getClientWithInfo())
        this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
        this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));

        // setTimeout(() => {
        //     this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        //     this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        //
        // }, 100)
    }
}

function mapStateToProps(state) {
    const { alert, menu, authentication, company, calendar, notification, staff } = state;

    return {
        alert, menu, authentication, company, calendar, notification, appointmentsCount: calendar.appointmentsCount, staff
    };
}

SidebarMain.proptypes = {
    location: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(SidebarMain));
