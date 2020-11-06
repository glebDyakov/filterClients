import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { calendarActions, companyActions, menuActions, userActions, staffActions, clientActions } from '../_actions';
import moment from 'moment';
import Link from 'react-router-dom/es/Link';
import classNames from 'classnames';
import { UserSettings } from './modals/UserSettings';
import { HeaderMain } from './HeaderMain';
import AppointmentFromSocket from './modals/AppointmentFromSocket';
import ManagerSettings from './modals/ManagerSettings';
import LogoutPage from '../LogoutPage';
import {compose} from "redux";
import {withTranslation} from "react-i18next";


class SidebarMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: props.menu,
      authentication: props.authentication,
      company: props.company,
      collapse: localStorage.getItem('collapse') === 'true',
      calendar: props.calendar,
      openedTab: 'new',
      canceledOpened: false,
      userSettings: false,
      isOpenDropdownButtons: false,
      openManager: false,
      openUserSettings: true,
      language: "ru"

    };

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.approveAllAppointment = this.approveAllAppointment.bind(this);
    this.approveMovedAppointment = this.approveMovedAppointment.bind(this);
    this.openAppointments = this.openAppointments.bind(this);
    this.goToPageCalendar = this.goToPageCalendar.bind(this);
    this.logout = this.logout.bind(this);
    this.onClose = this.onClose.bind(this);
    this.getExtraServiceText = this.getExtraServiceText.bind(this);
    this.handleDropdownButtons = this.handleDropdownButtons.bind(this);
    this.handleOpenManagerMenu = this.handleOpenManagerMenu.bind(this);
    this.handleOpenUserSettings = this.handleOpenUserSettings.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }

  logout() {
    const { dispatch } = this.props;
    dispatch(userActions.logout());
    // this.props.history.push('/login');
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      $('.sidebar').slideUp(200);
    }
  }

  handleOpenUserSettings() {
    this.setState({ openUserSettings: !this.state.openUserSettings });
  }

  handleOpenManagerMenu() {
    this.setState({ openManager: !this.state.openManager });
  }

  componentWillReceiveProps(newProps) {
    if (JSON.stringify(this.props.authentication) !== JSON.stringify(newProps.authentication)) {
      this.setState({
        authentication: newProps.authentication,
      });
    }
    if (JSON.stringify(this.props.calendar) !== JSON.stringify(newProps.calendar)) {
      this.setState({
        calendar: newProps.calendar,
      });
    }

    if (this.props.i18n.language !== newProps.i18n.language || this.state.language !== newProps.i18n.language) {
      this.setState({
        language: newProps.i18n.language
      });
    }

    if (JSON.stringify(this.props.menu) !== JSON.stringify(newProps.menu)) {
      this.setState({
        menu: newProps.menu,
      });
    }
    if (JSON.stringify(this.props.company) !== JSON.stringify(newProps.company)) {
      const companyTypeId = newProps.company.settings && newProps.company.settings.companyTypeId;
      if (newProps.match.params.activeTab === 'staff') {
        document.title = (companyTypeId === 2 || companyTypeId === 3) ? this.props.t('Рабочие места | Онлайн-запись') : this.props.t('Сотрудники | Онлайн-запись');
      }
      this.setState({
        company: newProps.company,
        count: newProps.company.count && newProps.company.count,
      });
    }

    if (JSON.stringify(newProps.company.count) !== JSON.stringify(this.props.company.count)) {
      // this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
      // this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
    }

    if (this.props.i18n.language !== newProps.i18n.language || JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff)) {
      const activeStaff = this.props.staff && this.props.staff.staff && this.props.staff.staff.find((item) =>
          ((item.staffId) === (this.props.authentication.user && this.props.authentication.user.profile && this.props.authentication.user.profile.staffId)));

      if (activeStaff) {
        this.props.i18n.changeLanguage(activeStaff.languageCode);
      }
    }
  }

  componentDidMount() {

    $('.arrow_collapse').click(function(e) {
      // e.preventDefault();
      // e.stopPropagation();
      $('.arrow_collapse.sidebar_list_collapse').fadeOut(0);
      $('.arrow_collapse.sidebar_list_collapse-out').fadeIn(0);

      $(this).parent('ul').addClass('sidebar_collapse').animate({}, 200);

      $('.content-wrapper, .no-scroll, .no-scroll2').addClass('content-collapse').animate({}, 200);
    });

    $('.arrow_collapse.sidebar_list_collapse-out').click(function(e) {
      // e.preventDefault();
      // e.stopPropagation();
      $('.arrow_collapse.sidebar_list_collapse-out').fadeOut(0);
      $('.arrow_collapse.sidebar_list_collapse').fadeIn(0);

      $(this).parent('ul').removeClass('sidebar_collapse').animate({}, 200);

      $('.content-wrapper, .no-scroll, .no-scroll2').removeClass('content-collapse').animate({}, 200);
    });
    const { user } = this.props.authentication;

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
    this.props.dispatch(staffActions.get());

    // this.props.dispatch(clientActions.getClientWithInfo());
  }

  componentDidUpdate() {
    if (this.state.isNotificationDropdown || this.state.isPaymentDropdown) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    const activeStaff = this.props.staff && this.props.staff.staff && this.props.staff.staff.find((item) =>
        ((item.staffId) === (this.props.authentication.user && this.props.authentication.user.profile && this.props.authentication.user.profile.staffId)));

    if (activeStaff && activeStaff.languageCode !== this.props.i18n.language) {
      this.props.i18n.changeLanguage(activeStaff.languageCode);
    }

    if (this.state.isOpenDropdownButtons) {
      document.addEventListener('click', this.handleDropdownButtons, false);
    } else {
      document.removeEventListener('click', this.handleDropdownButtons, false);
    }
  }

  openModalUserSettings() {
    // const {onOpen} = this.props;
    //
    // return onOpen();

    $('.modal_user_setting').modal('show');
  }

  onCloseUserSettings() {
    $('.modal_user_setting').modal('hide');
  }

  handleDropdownButtons() {
    const { isOpenDropdownButtons } = this.state;
    if (isOpenDropdownButtons) {
      this.setState({ isOpenDropdownButtons: false });
    } else {
      this.setState({ isOpenDropdownButtons: true });
    }
  }

  handleOutsideClick() {
    this.setState({ isNotificationDropdown: false, isPaymentDropdown: false });
  }

  toggleCollapse(value) {
    const collapse = value === 'true';
    localStorage.setItem('collapse', value);
    this.setState({ collapse });

    const elems = document.getElementsByClassName('modal---modal-overlay---3D5Nr');
    if (elems) {
      elems[0].style.marginLeft = collapse ? '70px' : '250px';
    }

    const headerLayout = document.getElementById('header-layout');
    if (headerLayout) {
      if (collapse) {
        headerLayout.classList.remove('collapsed-header');
      } else {
        headerLayout.classList.add('collapsed-header');
      }
    }
  }

  toggleDropdown(key) {
    this.setState({ [key]: !this.state[key] });
  }

  getExtraServiceText(appointments, appointment) {
    let totalCount = 0;
    if (appointment.hasCoAppointments) {
      appointments.forEach((staffAppointment) => staffAppointment.appointments.forEach((currentAppointment) => {
        if (currentAppointment.coAppointmentId === appointment.appointmentId) {
          totalCount++;
        }
      }));
    }
    let extraServiceText = '';
    switch (totalCount) {
      case 0:
        extraServiceText = '';
        break;
      case 1:
        extraServiceText = this.props.t('и ещё 1 услуга');
        break;
      case 2:
      case 3:
      case 4:
        extraServiceText = `и ещё ${totalCount} услуги`;
        break;
      default:
        extraServiceText = this.props.t(`и ещё 5+ услуг`);
    }
    return extraServiceText;
  }

  render() {
    const { location, notification, calendar: { appointmentsCanceled }, staff, appointmentsCount } = this.props;
    const { isLoadingModalAppointment, isLoadingModalCount, isLoadingModalCanceled } = this.props.calendar;
    const { authentication, menu, company, collapse, openedTab, count, userSettings, isNotificationDropdown, isPaymentDropdown } = this.state;
    const path = '/' + location.pathname.split('/')[1];

    const companyTypeId = company.settings && company.settings.companyTypeId;
    const {t} = this.props;


    const activeStaff = staff && staff.staff && staff.staff.find((item) =>
      ((item.staffId) === (authentication.user && authentication.user.profile && authentication.user.profile.staffId)));



    const { invoicePacket, forceActive, trialEndDateMillis } = authentication.user;
    let packetEnd; let packetEndText;
    if (invoicePacket) {
      packetEnd = Math.ceil((invoicePacket.endDateMillis - moment().format('x')) / 3600 / 24 / 1000) - 1;

      packetEndText = packetEnd === 0
        ? this.props.t('Сегодня система будет отключена')
        : `${this.props.t("До окончания действия пакета")} ${packetEnd === 1 ? this.props.t('остался 1 день') : `${this.props.t("осталось")} ${packetEnd} ${this.props.t("дня")}`}`;
    } else if (!forceActive) {
      packetEnd = Math.ceil((trialEndDateMillis - moment().format('x')) / 3600 / 24 / 1000) - 1;
      if (packetEnd < 0) {
        packetEndText = this.props.t('Компания не активна Чтобы активировать выберите и оплатите пакет');
      } else {
        packetEndText = packetEnd === 0
          ? this.props.t('Сегодня система будет отключена')
          : `${this.props.t("До окончания действия пакета")} ${packetEnd === 1 ? this.props.t('остался 1 день') : `${this.props.t("осталось")} ${packetEnd} ${this.props.t("дня")}`}`;
      }
    }

    let staffType;
    if (authentication.user && authentication.user.profile && authentication.user.profile.roleId) {
      switch (authentication.user.profile.roleId) {
        case 1:
        case 2:
          staffType = this.props.t('Сотрудник');
          break;
        case 3:
          staffType = this.props.t('Админ');
          break;
        case 4:
          staffType = this.props.t('Владелец');
          break;
        default:
      }
    }

    const packetShowCondition = packetEnd <= 3;

    const appointmentCountMarkup = appointmentsCount && appointmentsCount.map((appointmentInfo) => {
      const activeStaff = staff && staff.staff && staff.staff.find((item) =>
        ((item.staffId) === (appointmentInfo.staff.staffId)));

      return appointmentInfo.appointments.map((appointment) => {
        const { roleId } = authentication.user.profile;
        let resultMarkup = null;
        let condition;
        if (roleId === 3 || roleId === 4) {
          condition = !appointment.adminApproved;
        } else {
          condition = !appointment.approved && appointmentInfo.staff.staffId === authentication.user.profile.staffId;
        }
        const extraServiceText = this.getExtraServiceText(appointmentsCount, appointment);

        const {t} = this.props;

        if (condition && !appointment.coAppointmentId) {
          resultMarkup = (
            <li onClick={() => this.goToPageCalendar(appointment, appointmentInfo.staff.staffId)}>
              <div className="service_item">
                <div className="left-block d-none d-md-flex">
                  <div className="img-container d-none d-md-flex">
                    <img
                      src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                      className="img"/></div>
                  <div>
                    <p style={{ float: 'none' }} className="user-name d-flex align-items-center">
                      <div className="img-container d-md-none">
                        <img
                          src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                          className="img"/></div>
                      <strong>{t("Мастер")}:&nbsp;</strong>{appointmentInfo.staff.firstName + ' ' + (appointmentInfo.staff.lastName ? appointmentInfo.staff.lastName : '')}
                    </p>
                    <p className="service_name"
                    >{appointment.serviceName}&nbsp;{extraServiceText}
                      {/* <br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-column" style={{ wordBreak: 'break-word' }}>
                  {appointment.clientFirstName ? <React.Fragment><p>
                    <strong>{t("Клиент")}:</strong> {appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')}
                  </p></React.Fragment> : ''}
                  {appointment.clientPhone &&
                                    <p><strong>{t("Телефон")}: </strong> {appointment.clientPhone}</p>}
                  {companyTypeId === 2 && appointment.carBrand &&
                                    <p style={{ textDecoration: 'underline' }}><strong>{t("Марка авто")}: </strong> {appointment.carBrand}</p>}
                  {companyTypeId === 2 && appointment.carNumber &&
                                    <p style={{ textDecoration: 'underline' }}><strong>{t("Гос номер")}: </strong> {appointment.carNumber}</p>}
                  <p className="service_time" style={{ textTransform: 'capitalize' }}
                    // style={{width: "30%", textAlign: "left"}}
                  >
                    <strong>{t("Время")}: </strong>
                    {moment(appointment.appointmentTimeMillis, 'x').format('dd, DD MMMM YYYY, HH:mm')}
                  </p>
                  <p className="d-none d-md-flex" style={{ color: '#50A5F1' }}>
                    {t("Просмотреть запись")} →
                  </p>

                </div>

                <div className="left-block d-flex d-md-none flex-column">
                  <br/>
                  <div className="img-container d-none d-md-flex">
                    <img
                      src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                      className="img"/></div>
                  <div>
                    <p style={{ float: 'none' }} className="user-name d-flex align-items-center">
                      <div className="img-container d-md-none">
                        <img
                          src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                          className="img"/></div>
                      <strong>{t("Мастер")}:&nbsp;</strong>{appointmentInfo.staff.firstName + ' ' + (appointmentInfo.staff.lastName ? appointmentInfo.staff.lastName : '')}
                    </p>
                    <p className="service_name"
                    >{appointment.serviceName}&nbsp;{extraServiceText}
                      {/* <br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                    </p>
                  </div>
                  <br/>
                  <p style={{ color: '#50A5F1' }}>
                    {t("Просмотреть запись")} →
                  </p>
                </div>
              </div>
            </li>
          );
        }

        return resultMarkup;
      });
    });

    let movedCount = 0;

    const appointmentMovedMarkup = appointmentsCount && appointmentsCount.map((appointmentInfo) => {
      const activeStaff = staff && staff.staff && staff.staff.find((item) =>
        ((item.staffId) === (appointmentInfo.staff.staffId)));
      return appointmentInfo.appointments.map((appointment) => {
        const { roleId } = authentication.user.profile;
        let resultMarkup = null;
        let condition;
        if (roleId === 3 || roleId === 4) {
          condition = appointment.adminMoved;
        } else {
          condition = appointment.moved && appointmentInfo.staff.staffId === authentication.user.profile.staffId;
        }
        const extraServiceText = this.getExtraServiceText(appointmentsCount, appointment);
        if (condition && !appointment.coAppointmentId) {
          movedCount++;
          resultMarkup = (
            <li onClick={() => this.goToPageCalendar(appointment, appointmentInfo.staff.staffId)}>
              {/* <div className="service_item">*/}
              {/*    <div className="left-block">*/}
              {/*        <div className="img-container d-none d-md-flex">*/}
              {/*            <img*/}
              {/*                src={activeStaff && activeStaff.imageBase64 ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}*/}
              {/*                className="img"/></div>*/}
              {/*        <div>*/}
              {/*            <p style={{float: "none"}}>*/}
              {/*                <div className="img-container d-md-none">*/}
              {/*                    <img*/}
              {/*                        src={activeStaff && activeStaff.imageBase64 ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}*/}
              {/*                        className="img"/></div>*/}
              {/*                <strong>Мастер: </strong>{appointmentInfo.staff.firstName + " " + (appointmentInfo.staff.lastName ? appointmentInfo.staff.lastName : '')}*/}
              {/*            </p>*/}

              {/*            <p className="service_name"*/}
              {/*               style={{*/}
              {/*                   // width: "65%",*/}
              {/*                   // marginRight: "5%",*/}
              {/*                   // wordWrap: "break-word"*/}
              {/*               }}*/}
              {/*            ><strong>{appointment.serviceName}</strong> <br/>*/}
              {/*                <strong>{extraServiceText}</strong>*/}
              {/*                /!*<br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*!/*/}
              {/*            </p>*/}
              {/*            <span*/}
              {/*                className="deleted"*/}
              {/*                style={{color: "#3E90FF"}}>{appointment.movedOnline ? 'Перенесен клиентом' : 'Перенесен сотрудником'}</span>*/}
              {/*            <br/>*/}
              {/*            <br/>*/}
              {/*        </div>*/}
              {/*    </div>*/}
              {/*    <div style={{wordBreak: 'break-word'}}>*/}
              {/*        {appointment.clientFirstName ? <React.Fragment><p>*/}
              {/*            <strong>Клиент:</strong> {appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')}*/}
              {/*        </p></React.Fragment> : 'Без клиента'}<br/>*/}
              {/*        {appointment.clientPhone &&*/}
              {/*        <p><strong>Телефон: </strong> {appointment.clientPhone}</p>}*/}
              {/*        {companyTypeId === 2 && appointment.carBrand &&*/}
              {/*        <p style={{textDecoration: 'underline'}}><strong>Марка*/}
              {/*            авто: </strong> {appointment.carBrand}</p>}*/}
              {/*        {companyTypeId === 2 && appointment.carNumber &&*/}
              {/*        <p style={{textDecoration: 'underline'}}><strong>Гос.*/}
              {/*            номер: </strong> {appointment.carNumber}</p>}*/}
              {/*        <p className="service_time" style={{textTransform: 'capitalize'}}*/}
              {/*            // style={{width: "30%", textAlign: "left"}}*/}
              {/*        >*/}
              {/*            <strong>Время: </strong>*/}
              {/*            {moment(appointment.appointmentTimeMillis, 'x').locale('ru').format('dd, DD MMMM YYYY, HH:mm')}*/}
              {/*        </p>*/}
              {/*        <p style={{color: "#50A5F1"}}>*/}
              {/*            Просмотреть запись →*/}
              {/*        </p>*/}

              {/*    </div>*/}
              {/* </div>*/}
              <div className="service_item">
                <div className="left-block d-none d-md-flex">
                  <div className="img-container d-none d-md-flex">
                    <img
                      src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                      className="img"/></div>
                  <div>
                    <p style={{ float: 'none' }} className="user-name d-flex align-items-center">
                      <div className="img-container d-md-none">
                        <img
                          src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                          className="img"/></div>
                      <strong>{t("Мастер")}:&nbsp;</strong>{appointmentInfo.staff.firstName + ' ' + (appointmentInfo.staff.lastName ? appointmentInfo.staff.lastName : '')}
                    </p>
                    <p className="service_name"
                    >{appointment.serviceName}&nbsp;{extraServiceText}
                      {/* <br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-column" style={{ wordBreak: 'break-word' }}>
                  {appointment.clientFirstName ? <React.Fragment><p>
                    <strong>{t("Клиент")}:</strong> {appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')}
                  </p></React.Fragment> : ''}
                  {appointment.clientPhone &&
                                    <p><strong>{t("Телефон")}: </strong> {appointment.clientPhone}</p>}
                  {companyTypeId === 2 && appointment.carBrand &&
                                    <p style={{ textDecoration: 'underline' }}><strong>{t("Марка авто")}: </strong> {appointment.carBrand}</p>}
                  {companyTypeId === 2 && appointment.carNumber &&
                                    <p style={{ textDecoration: 'underline' }}><strong>{t("Гос. номер")}: </strong> {appointment.carNumber}</p>}
                  <p className="service_time" style={{ textTransform: 'capitalize' }}
                    // style={{width: "30%", textAlign: "left"}}
                  >
                    <strong>{t("Время")}: </strong>
                    {moment(appointment.appointmentTimeMillis, 'x').format('dd, DD MMMM YYYY, HH:mm')}
                  </p>
                  <p className="d-none d-md-flex" style={{ color: '#50A5F1' }}>
                                        {t("Просмотреть запись")} →
                  </p>

                </div>

                <div className="left-block d-flex d-md-none flex-column">
                  <br/>
                  <div className="img-container d-none d-md-flex">
                    <img
                      src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                      className="img"/></div>
                  <div>
                    <p style={{ float: 'none' }} className="user-name d-flex align-items-center">
                      <div className="img-container d-md-none">
                        <img
                          src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                          className="img"/></div>
                      <strong>{t("Мастер")}:&nbsp;</strong>{appointmentInfo.staff.firstName + ' ' + (appointmentInfo.staff.lastName ? appointmentInfo.staff.lastName : '')}
                    </p>
                    <p className="service_name"
                    >{appointment.serviceName}&nbsp;{extraServiceText}
                      {/* <br/>{appointmentInfo.staff.firstName + " " + appointmentInfo.staff.lastName}*/}
                    </p>
                  </div>
                  <br/>
                  <p style={{ color: '#50A5F1' }}>
                                        {t("Просмотреть запись")} →
                  </p>
                </div>
              </div>


            </li>
          );
        }
        return resultMarkup;
      });
    });
    return (
      <React.Fragment>
        <HeaderMain/>
        <AppointmentFromSocket/>

        <ul ref={this.setWrapperRef} className={'sidebar ' + (collapse && ' sidebar_collapse')}>
          <li className="mob-menu-personal">
            <div className="logo_mob"/>
            <div className="mob-firm-name" onClick={(e) => {
              if (e.target.className !== 'notification-mob') {
                this.onOpen();
              }
            }} style={{ height: '55px' }}>
              <li onClick={() => {
                $('.sidebar').slideUp(200);
              }} className="mob-menu-closer">
                <div>
                  <img src={`${process.env.CONTEXT}public/img/closer_mob.svg`} alt=""/>
                </div>
              </li>

              <hr/>

              <div className="img-container">
                <img className="rounded-circle" style={{ opacity: '1' }}
                  src={activeStaff && activeStaff.imageBase64 && authentication.user.profile.imageBase64 !== '' ? ('data:image/png;base64,' + activeStaff.imageBase64) : `${process.env.CONTEXT}public/img/avatar.svg`}
                  alt=""/>
              </div>
              <p onClick={() => this.openModalUserSettings()} className="firm-name"
                style={{ float: 'left', fontWeight: 600 }}>
                {authentication && authentication.user.profile && authentication.user.profile.firstName} {authentication && authentication.user.profile.lastName}
                <p style={{ fontSize: '14px', fontWeight: 300 }}>{staffType}</p>


              </p>


              <span onClick={() => this.logout()} className="log_in"/>
              <span className="notification-mob" onClick={() => this.handleOpenManagerMenu()}/>
              {/* <div className="setting_mob">*/}
              {/*    <a className="notification">Уведомления</a>*/}
              {/*    <a className="setting" data-toggle="modal" data-target=".modal_user_setting" onClick={()=>this.onOpen()}>Настройки</a>*/}
              {/* </div>*/}

            </div>
          </li>

          <li className="arrow_collapse sidebar_list_collapse" onClick={() => this.toggleCollapse('true')}
            style={{ 'display': collapse ? 'none' : 'block' }}/>
          <li className="arrow_collapse sidebar_list_collapse-out"
            onClick={() => this.toggleCollapse('false')} style={{ 'display': collapse ? 'block' : 'none' }}/>
          {authentication && authentication.menu && authentication.user && authentication.user.menu &&
                    menu && menu.menuList && menu.menuList.map((item, keyStore) => {
            return (
              authentication.user.menu.map((localItem, i) => {
                return (
                  localItem.id === item.id &&
                                    <li className={path === item.url ? 'active' : ''}
                                      style={item.id === 'calendar_menu_id' ? { marginTop: '30px' } : {}}
                                      key={keyStore}>
                                      <a onClick={(e) => this.handleClick(item.url, e)}>
                                        <img
                                          src={`${process.env.CONTEXT}public/img/icons/` + item.icon}
                                          alt=""/>
                                        <span className={item.id === 'warehouse_menu_id' ? "beta": ''}>{item.id === 'staff_menu_id' ? (
                                          (companyTypeId === 2 || companyTypeId === 3) ? t('Рабочие места') : t('Сотрудники')
                                        ) : t(item.name)}</span>

                                        {keyStore === 0 &&
                                            ((count && count.appointments && count.appointments.count > 0) ||
                                                (count && count.canceled && count.canceled.count > 0) ||
                                                (count && count.moved && count.moved.count > 0))
                                            && <span className="sidebar-notification-wrapper"><span
                                              className="sidebar-notification"
                                              onClick={(event) => this.openAppointments(event)} data-toggle="modal"
                                              data-target=".modal_counts">{parseInt(count && count.appointments && count.appointments.count) + parseInt(count && count.canceled && count.canceled.count) + parseInt(count && count.moved && count.moved.count)}</span></span>}

                                        {item.id === 'email_menu_id' && (
                                          <div className="sidebar-notification-wrapper"
                                            onClick={() => this.toggleDropdown('isNotificationDropdown')}>

                                            {(notification.balance && notification.balance.smsAmount < (localStorage.getItem('notifyCount') || 200)
                                                        || notification.balance && notification.balance.emailAmount < (localStorage.getItem('notifyCount') || 200))
                                                    && <React.Fragment>
                                                      <span className="sidebar-notification red-notification">!</span>
                                                      {isNotificationDropdown &&
                                                        <ul className="sidebar-notification-dropdown">
                                                          {notification.balance && notification.balance.smsAmount < (localStorage.getItem('notifyCount') || 200) &&
                                                            <li>{t("Баланс SMS ниже")} {(localStorage.getItem('notifyCount') || 200)}</li>
                                                          }
                                                          {notification.balance && notification.balance.emailAmount < (localStorage.getItem('notifyCount') || 200) &&
                                                            <li>{t("Баланс Email ниже")} {(localStorage.getItem('notifyCount') || 200)}</li>
                                                          }
                                                        </ul>}
                                                    </React.Fragment>}

                                          </div>
                                        )}

                                        {item.id === 'payments_menu_id' && (
                                          <div className="sidebar-notification-wrapper"
                                            onClick={() => this.toggleDropdown('isPaymentDropdown')}>

                                            {packetShowCondition && <React.Fragment>
                                              <span className="sidebar-notification">!</span>
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
                );
              })

            );
          })}


          {authentication && authentication.user && authentication.user && authentication.user.bookingPage &&
                    <div
                      className={classNames('id_company', { 'id_company_collapse': collapse })}>{!collapse && this.props.t("Id компании") + ': '}
                      <a target="_blank"
                        href={'https://online-zapis.com/online/' + authentication.user.bookingPage}
                        className="">{authentication.user.bookingPage}
                      </a>
                    </div>}
          <div className="questions"><Link to="/faq">
            <img className="rounded-circle" src={`${process.env.CONTEXT}public/img/information.svg`}
              alt=""/>
          </Link></div>

        </ul>
        <div className="sidebar-modal modal fade modal_counts" tabIndex="-1" role="dialog" aria-hidden="true">
          <div style={{ maxWidth: '761px' }} className="modal-dialog modal-dialog-lg modal-dialog-centered"
            role="document">
            <div className="modal-content modal-height">
              <div className="modal-header">
                <h4 className="modal-title">{t("Уведомления")}</h4>


                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"></span>
                </button>
                {/* <img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" data-dismiss="modal"*/}
                {/*     style={{margin:"13px 5px 0 0"}}/>*/}
              </div>


              <div className="modal-inner count-modal modal-not-approved">
                <div className="button-field">
                  <button type="button"
                    className={'float-left button small-button approve-tab ' + (openedTab === 'new' ? '' : 'disabled')}
                    onClick={() => this.setState({ openedTab: 'new' })}>{t("Новые записи")} <span
                      className="counter">
                      {count && count.appointments && count.appointments.count}
                    </span></button>
                  <button type="button"
                    className={'float-left button small-button approve-tab ' + (openedTab === 'deleted' ? '' : 'disabled')}
                    onClick={() => this.setState({ openedTab: 'deleted' })}>{t("Удаленные записи")}<span
                      className="counter">{count && count.canceled && count.canceled.count}</span>
                  </button>
                  <button type="button"
                    className={'float-left button small-button approve-tab ' + (openedTab === 'moved' ? '' : 'disabled')}
                    onClick={() => this.setState({ openedTab: 'moved' })}>{t("Перемещенные записи")}<span
                      className="counter">{count && count.moved && count.moved.count}</span></button>
                </div>

                <div className="button-field-mob">
                  <button type="button"
                    className={'float-left button small-button approve-tab ' + (openedTab === 'new' ? '' : 'disabled')}
                    onClick={() => this.setState({ openedTab: 'new' })}>{t("Новые записи")} <span
                      className="counter">
                      {count && count.appointments && count.appointments.count}
                    </span></button>
                  <button type="button"
                    className={'float-left button small-button approve-tab ' + (openedTab === 'deleted' ? '' : 'disabled')}
                    onClick={() => this.setState({ openedTab: 'deleted' })}>{t("Удаленные записи")}<span
                      className="counter">{count && count.canceled && count.canceled.count}</span>
                  </button>
                  <button type="button"
                    className={'float-left button small-button approve-tab ' + (openedTab === 'moved' ? '' : 'disabled')}
                    onClick={() => this.setState({ openedTab: 'moved' })}>{t("Перемещенные записи")}<span
                      className="counter">{count && count.moved && count.moved.count}</span></button>
                </div>

                {openedTab === 'new' && <React.Fragment>
                  <div className="not-approved-list">
                    {!(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled) && appointmentCountMarkup}
                    {(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled)
                                        && <div className="loader"
                                          style={{ left: '0', width: '100%', height: '74%', top: '120px' }}><img
                                            src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}

                  </div>
                  <div className="down-button">
                    <button className="button approveAll"
                      onClick={() => this.approveAllAppointment(true, false)}>{t("Отметить всё как прочитано")}
                    </button>
                  </div>
                </React.Fragment>
                }
                {openedTab === 'deleted' && <React.Fragment>
                  <div className="not-approved-list">
                    {appointmentsCanceled && !(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled) &&
                                        appointmentsCanceled.map((appointment) => {
                                          const activeStaff = staff && staff.staff && staff.staff.find((item) =>
                                            ((item.staffId) === (appointment.staffId)));
                                          const { roleId } = authentication.user.profile;
                                          let condition;
                                          if (roleId === 3 || roleId === 4) {
                                            condition = !appointment.adminApproved;
                                          } else {
                                            condition = !appointment.approved;
                                          }
                                          return (condition &&
                                                <li className="opacity0">
                                                  <div className="service_item">
                                                    <div className="left-block d-none d-md-flex">
                                                      <div className="img-container d-none d-md-flex">
                                                        <img
                                                          src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                                                          className="img"/></div>

                                                      <div className="d-flex flex-column">
                                                        <p><strong>{t("Мастер")}:&nbsp;</strong>{activeStaff.firstName + ' ' + (activeStaff.lastName ? activeStaff.lastName : '')}</p>

                                                        <p style={{ float: 'none' }}
                                                          className="user-name d-flex align-items-center">
                                                          <div className="img-container d-md-none">
                                                            <img
                                                              src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                                                              className="img"/></div>
                                                        </p>
                                                        <p className="service_name"
                                                        >{appointment.serviceName}

                                                        </p>
                                                      </div>
                                                    </div>
                                                    <div className="d-flex flex-column"
                                                      style={{ wordBreak: 'break-word' }}>
                                                      {appointment.clientFirstName ? <React.Fragment><p>
                                                        <strong>{t("Клиент")}:</strong> {appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')}
                                                      </p></React.Fragment> : ''}
                                                      {appointment.clientPhone &&
                                                            <p><strong>Телефон: </strong> {appointment.clientPhone}</p>}
                                                      {companyTypeId === 2 && appointment.carBrand &&
                                                            <p style={{ textDecoration: 'underline' }}><strong>{t("Марка авто")}: </strong> {appointment.carBrand}</p>}
                                                      {companyTypeId === 2 && appointment.carNumber &&
                                                            <p style={{ textDecoration: 'underline' }}><strong>{t("Гос номер")}: </strong> {appointment.carNumber}</p>}
                                                      <p className="service_time"
                                                        style={{ textTransform: 'capitalize' }}
                                                        // style={{width: "30%", textAlign: "left"}}
                                                      >
                                                        <strong>{t("Время")}: </strong>
                                                        {moment(appointment.appointmentTimeMillis, 'x').format('dd, DD MMMM YYYY, HH:mm')}
                                                      </p>
                                                      <p className="d-none d-md-flex" style={{ color: '#50A5F1' }}>
                                                        {appointment.canceledOnline ? t('Удален клиентом') : t('Удален сотрудником')}

                                                      </p>

                                                    </div>

                                                    <div className="left-block d-flex d-md-none flex-column">
                                                      <br/>
                                                      <div className="img-container d-none d-md-flex">
                                                        <img
                                                          src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                                                          className="img"/></div>

                                                      <div>
                                                        <p style={{ float: 'none' }}
                                                          className="user-name d-flex align-items-center">
                                                          <div className="img-container d-md-none">
                                                            <img
                                                              src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                                                              className="img"/></div>
                                                          <p><strong>{t("Мастер")}:&nbsp;</strong>{activeStaff.firstName + ' ' + (activeStaff.lastName ? activeStaff.lastName : '')}</p>
                                                        </p>
                                                      </div>
                                                      <p className="service_name">
                                                        {appointment.serviceName}
                                                      </p>

                                                      <p style={{ color: '#50A5F1' }}>
                                                        {appointment.canceledOnline ? t('Удален клиентом') : t('Удален сотрудником')}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </li>
                                          );
                                        })}
                  </div>
                  <div className="down-button">
                    <button className="button approveAll"
                      onClick={() => this.approveAllAppointment(true, true)}>{t("Отметить всё как прочитано")}
                    </button>
                  </div>
                </React.Fragment>
                }
                {openedTab === 'moved' && <React.Fragment>
                  <div className="not-approved-list">
                    {!(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled) && appointmentMovedMarkup}
                    {(isLoadingModalAppointment || isLoadingModalCount || isLoadingModalCanceled)
                                        && <div className="loader"
                                          style={{ left: '0', width: '100%', height: '74%', top: '120px' }}><img
                                            src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}

                  </div>
                  <div className="down-button">
                    <button className="button approveAll"
                      onClick={() => {
                        this.approveMovedAppointment();
                      }}>{t("Отметить всё как прочитано")}
                    </button>
                  </div>
                </React.Fragment>
                }
              </div>
            </div>
          </div>
        </div>

        {this.state.openManager &&
                <ManagerSettings
                  onClose={this.handleOpenManagerMenu}
                />}
      </React.Fragment>


    );
  }

  onOpen() {
    this.setState({ userSettings: true });
  }

  onClose() {
    this.setState({ userSettings: false });
  }

  handleClick(url, e) {
    if (e.target.className !== 'sidebar-notification') {
      if (this.props.location.pathname === '/settings') {
        this.props.dispatch(companyActions.getSubcompanies());
      }
      this.props.dispatch(menuActions.runSocket());
      this.props.history.push(url);
    }
  }

  approveMovedAppointment() {
    const { roleId } = this.props.authentication.user.profile;
    const params = {};

    if (roleId === 3 || roleId === 4) {
      params.adminMoved = false;
    } else {
      params.moved = false;
    }

    this.props.dispatch(calendarActions.approveMovedAppointment(params));
  }

  approveAllAppointment(approved, canceled) {
    const { roleId } = this.props.authentication.user.profile;
    const params = {};

    if (roleId === 3 || roleId === 4) {
      params.adminApproved = true;
    } else {
      params.approved = true;
    }

    this.props.dispatch(calendarActions.approveAllAppointment(approved, canceled, params));
  }

  goToPageCalendar(appointment, appointmentStaffId) {
    $('.modal_counts').modal('hide');
    const { staffId, roleId } = this.props.authentication.user.profile;
    const { openedTab } = this.state;
    const { appointmentId, appointmentTimeMillis } = appointment;

    const url = '/page/' + appointmentStaffId + '/' + moment(appointmentTimeMillis, 'x').format('DD-MM-YYYY');
    this.props.history.push(url);

    if (openedTab === 'new') {
      const params = {};
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
      const params = {};
      if (staffId !== appointmentStaffId) {
        params.moved = true;
        params.adminMoved = false;
      } else if (roleId === 3 || roleId === 4) {
        params.moved = false;
        params.adminMoved = false;
      } else {
        params.moved = false;
      }

      this.props.dispatch(calendarActions.approveAppointment(appointmentId, params));
      // this.props.dispatch(calendarActions.updateAppointment(appointmentId, JSON.stringify(params)));
    }

    this.props.dispatch(calendarActions.setScrollableAppointment(appointmentId));
  }

  openAppointments(event) {
    event.stopPropagation();
    this.props.dispatch(staffActions.get());
    // this.props.dispatch(clientActions.getClientWithInfo())
    this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
    this.props.dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
    this.props.dispatch(calendarActions.getAppointments(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));

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
    alert,
    menu,
    authentication,
    company,
    calendar,
    notification,
    appointmentsCount: calendar.appointmentsCount,
    staff,
  };
}

SidebarMain.proptypes = {
  location: PropTypes.object.isRequired,
};

export default compose(connect(mapStateToProps), withRouter, withTranslation("common"))(SidebarMain);
