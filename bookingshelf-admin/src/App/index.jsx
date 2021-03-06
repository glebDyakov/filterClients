import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import config from 'config';

import { history } from '../_helpers';
import {
  alertActions,
  calendarActions,
  companyActions,
  notificationActions, servicesActions,
  socketActions, userActions,
} from '../_actions';
import { hostname } from '../_helpers/handle-response';
import { PrivateRoute, PublicRoute } from '../_components';
import 'moment-duration-format';
import 'moment/locale/ru';

import '../../public/css_admin/bootstrap.css';
import '../../public/css_admin/datepicker.css';

import '../../public/scss/dark_theme.scss';


const MainIndexPage = React.lazy(() => import('../MainIndexPage'));
const ClientsPage = React.lazy(() => import('../ClientsPage'));
const ServicesPage = React.lazy(() => import('../ServicesPage'));
const CalendarPage = React.lazy(() => import('../CalendarPage'));

const OnlinePage = React.lazy(() => import('../OnlinePage'));
const StaffPage = React.lazy(() => import('../StaffPage'));
const MaterialPage = React.lazy(() => import('../MaterialPage'));
const PayrollPage = React.lazy(() => import('../PayrollPage'));
const EmailPage = React.lazy(() => import('../EmailPage'));
const NoPage = React.lazy(() => import('../NoPage'));

const LogoutPage = React.lazy(() => import('../LogoutPage'));
const RegisterPage = React.lazy(() => import('../RegisterPage'));
const LoginPage = React.lazy(() => import('../LoginPage'));
const PaymentsPage = React.lazy(() => import('../PaymentsPage'));

import { Router, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import SidebarMain from '../_components/SidebarMain';
import ManagerSettings from '../_components/modals/ManagerSettings';

import { access } from '../_helpers/access';

const ActivationPage = React.lazy(() => import('../ActivationPage'));

import moment from 'moment';
import 'moment-timezone';

const NoPageDenied = React.lazy(() => import('../NoPageDenied'));
const NoPagePrivate = React.lazy(() => import('../NoPagePrivate'));
const MainIndex = React.lazy(() => import('../MainIndex'));
const CalendarPrePage = React.lazy(() => import('../CalendarPrePage'));
const FaqPage = React.lazy(() => import('../FaqPage'));
const ActivationPageStaff = React.lazy(() => import('../ActivationPageStaff'));
const ActivationPagePassword = React.lazy(() => import('../ActivationPagePassword'));
const AnalyticsPage = React.lazy(() => import('../AnalyticsPage'));

import '../../public/scss/styles.scss';

let socket;

import WebsocketHeartbeatJs from 'websocket-heartbeat-js';
import { withTranslation } from 'react-i18next';
import { i18next } from '../_helpers/i18n';

const sound = new Audio(`${process.env.CONTEXT}public/mp3/message_sound.mp3`);


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      authentication: props.authentication,
      flagStaffId: true,
      lightTheme: true,
      language: 'ru',
    };

    const { dispatch } = this.props;
    history.listen((location, action) => {
      dispatch(alertActions.clear());
    });

    this.notifications = this.notifications.bind(this);
    this.handleSocketDispatch = this.handleSocketDispatch.bind(this);
    this.playSound = this.playSound.bind(this);

    this.checkLogin();
  }

  componentDidMount() {
    let localStorageUser;
    try {
      localStorageUser = JSON.parse(localStorage.getItem('user'));
      const isLightTheme = JSON.parse(localStorage.getItem('lightTheme'));
      if (isLightTheme === false) $('body').addClass('dark-theme');
    } catch (e) {

    }


    const user = this.props.authentication.user || localStorageUser;

    if (user && (this.props.authentication.loggedIn || this.props.company.switchedStaffId)) {
      const socketStaffId = this.props.company.switchedStaffId ? this.props.company.switchedStaffId : this.props.authentication.user.profile.staffId;
      this.initSocket(socketStaffId);
    }
  }

  componentWillReceiveProps(newProps) {

    if (newProps.company && newProps.company.settings) {
      if (newProps.company.settings.lightTheme === true) {
        $('body').removeClass('dark-theme');
        localStorage.setItem('lightTheme', true);
      } else if (newProps.company.settings.lightTheme === false) {
        $('body').addClass('dark-theme');
        localStorage.setItem('lightTheme', false);
      }
    }

    if (this.props.authentication.i18nLanguage !== newProps.authentication.i18nLanguage) {
      this.setState({
        language: newProps.authentication.i18nLanguage,
      });
    }

    let localStorageUser;
    try {
      localStorageUser = JSON.parse(localStorage.getItem('user'));
    } catch (e) {

    }
    const user = newProps.authentication.user || localStorageUser;
    if (user && (user.forceActive
      || (moment(user.trialEndDateMillis).format('x') >= moment().format('x'))
      || (user.invoicePacket && moment(user.invoicePacket.endDateMillis).format('x') >= moment().format('x'))
    )) {
    } else {
      this.setState({ paymentsOnly: true, authentication: newProps.authentication });
      return;
    }


    if (this.state.paymentsOnly) {
      this.setState({ paymentsOnly: false });
    }
    if (JSON.stringify(this.props.authentication) !== JSON.stringify(newProps.authentication) && newProps.authentication.loginChecked && newProps.authentication.menu) {
      if (newProps.authentication.loggedIn) {
        this.notifications();
      }
      this.setState({ ...this.state, authentication: newProps.authentication });
    }

    if (JSON.stringify(this.props.company) !== JSON.stringify(newProps.company)) {
      this.setState({ ...this.state, company: newProps.company });
    }

    if (user
      && (newProps.authentication.loggedIn && (newProps.authentication.loggedIn !== this.props.authentication.loggedIn) || newProps.company.switchedStaffId)) {
      const socketStaffId = newProps.company.switchedStaffId ? newProps.company.switchedStaffId : newProps.authentication.user.profile.staffId;
      this.initSocket(socketStaffId);
    }
  }

  checkLogin() {
    const localStorageUser = localStorage.getItem('user');
    this.props.dispatch(userActions.checkLogin(localStorageUser));
    setTimeout(() => this.checkLogin(), 540000);
  }

  initSocket(socketStaffId) {
    this.props.dispatch(notificationActions.getBalance());
    this.props.dispatch(companyActions.get());
    this.props.dispatch(companyActions.getNewAppointments());
    this.props.dispatch(servicesActions.getServices());


    const options = {
      url: `wss://${hostname}${config.apiSocket}/${socketStaffId}/`,
      pingTimeout: 15000,
      pongTimeout: 10000,
      reconnectTimeout: 2000,
      pingMsg: 'heartbeat',
    };
    if (socket) {
      socket.close();
    }
    socket = new WebsocketHeartbeatJs(options);
    // socket = createSocket(this.props.authentication.user.profile.staffId );

    console.log('??????????. ????????????');
    socket.onopen = function() {
      console.log('??????????. ???????????????????? ?????????????????????? socket.onopen');
      socket.send('ping');
    };


    socket.onclose = function(event) {
      if (event && event.wasClean) {
        console.log('??????????. c?????????????????? ?????????????? socket.onclose - wasClean');
      } else {
        console.log('??????????. ???????????????????? ?????????????? socket.onclose');
      }
      // this.openSocketAgain(this.props.authentication.user.profile.staffId);
    };

    socket.onmessage = function(event) {
      if (event.data[0] === '{') {
        const finalData = JSON.parse(event.data);
        if ((finalData.wsMessageType === 'APPOINTMENT_CREATED') || (finalData.wsMessageType === 'APPOINTMENT_DELETED')
          || finalData.wsMessageType === 'APPOINTMENT_MOVED') {
          this.handleSocketDispatch(finalData);
          console.log(`??????????.???????????? ????????????: ${event.data}`);
        }
      }
      // console.log(`??????????.???????????? ????????????: ${event.data}`);
    };
    socket.onmessage = socket.onmessage.bind(this);
    socket.onclose = socket.onclose.bind(this);

    socket.onerror = function(event) {
      console.error('??????????. ????????????', event);
    };

    setTimeout(() => {
      this.initSocket(socketStaffId);
    }, 540000);
  }

  notifications() {

    // setTimeout(()=>this.notifications(), 300000)
  }

  handleSocketDispatch(payload) {
    const { staffId, roleId } = this.props.authentication.user.profile;
    if (staffId === payload.payload[0].staffId || (roleId === 1 && access(2)) || (roleId === 2 && access(2)) || roleId === 3 || roleId === 4) {
      this.playSound();
      this.props.dispatch(socketActions.alertSocketMessage(payload));
      if (payload.wsMessageType === 'APPOINTMENT_CREATED') {
        payload.payload.forEach((item) => {
          this.props.dispatch(calendarActions.getAppointmentsNewSocket(item));
        });
        this.props.dispatch(companyActions.getAppointmentsCountMarkerIncrement());
      } else if ((payload.wsMessageType === 'APPOINTMENT_DELETED')) {
        this.props.dispatch(calendarActions.deleteAppointmentsNewSocket(payload));
        // this.props.dispatch(companyActions.getAppointmentsCountMarkerDecrement());
        // this.props.dispatch(companyActions.getAppointmentsCountMarkerDecrement());
        // this.props.dispatch(staffActions.getTimetable(moment().startOf('day').format('x'), moment().add('7').endOf('day').format('x')));
        this.props.dispatch(companyActions.getNewAppointments());
      } else if (payload.wsMessageType === 'APPOINTMENT_MOVED') {
        this.props.dispatch(calendarActions.moveAppointmentsNewSocket(payload));

        // this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
        this.props.dispatch(companyActions.getNewAppointments());
      }
      this.props.dispatch(calendarActions.toggleRefreshAvailableTimes(true));
    }
  }

  playSound() {
    const soundSettings = localStorage.getItem('sound');
    if (soundSettings === 'false') {
      sound.volume = 0;
    } else {
      sound.volume = 1;
    }
    sound.play().then((data) => {
    }).catch((err) => {
    });
  }


  render() {
    const { authentication, company, paymentsOnly } = this.state;
    {
      company && company.settings && authentication.menu && authentication.loggedIn &&
      moment.tz.setDefault(company.settings.timezoneId);
    }


    return (
      <Router history={history}>
        <div>
          <div className="dark-theme-wrapper d-none"></div>
          {authentication && authentication.user && authentication.menu && authentication.loggedIn && localStorage.getItem('user') &&
          <React.Fragment>
            <SidebarMain/>
          </React.Fragment>
          }

          {/* <button style={{zIndex: "9999", position: "absolute", left: "400px", top: "200px"}} onClick={()=>this.playSound()}>Sound</button>*/}

          <Suspense
            fallback={<div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                   alt=""/></div>}>

            <Switch>
              {!paymentsOnly &&
              <PrivateRoute exact path="/" component={MainIndex} wrapped refresh={false}/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/settings" component={MainIndexPage} wrapped refresh={false}/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/staff/:activeTab?" component={StaffPage} wrapped
                            refresh={false}/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/material/:activeTab?" component={MaterialPage} wrapped
                            refresh={false}/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/salary/:activeTab?" refresh={true} component={PayrollPage} wrapped/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/clients" component={ClientsPage} wrapped refresh={false}/>}
              {!paymentsOnly && access(0) &&
              <PrivateRoute exact path="/services" component={ServicesPage} wrapped/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/calendar/:selectedType?/:staffNum?/:dateFrom?/:dateTo?"
                            component={CalendarPage} wrapped/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/page/:id?/:date?" component={CalendarPrePage} wrapped/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/online_booking" component={OnlinePage} wrapped/>}
              {!paymentsOnly &&
              <PrivateRoute exact path="/email_sms/:activeTab?" component={EmailPage} wrapped/>}

              {!paymentsOnly &&
              <PrivateRoute path="/activation/staff/:staff" component={ActivationPageStaff} wrapped/>}

              {!paymentsOnly && <PrivateRoute path="/logout" component={LogoutPage} wrapped/>}

              {!paymentsOnly && <PrivateRoute path="/analytics" component={AnalyticsPage} wrapped/>}


              <PrivateRoute exact path="/faq/:activeTab?" component={FaqPage} wrapped/>
              <PrivateRoute path="/payments" component={PaymentsPage} wrapped/>
              <PrivateRoute path="/invoices" component={PaymentsPage} wrapped/>

              <PublicRoute path="/register" component={RegisterPage}/>
              <PublicRoute path="/activation/company/:company" component={ActivationPage}/>
              <PublicRoute path="/activation/staff/:staff" component={ActivationPageStaff}/>
              <PublicRoute path="/activation/password/:token" component={ActivationPagePassword}/>
              <PublicRoute path="/login" component={LoginPage}/>

              <PrivateRoute path="/denied" component={NoPageDenied}/>
              <PrivateRoute path="/nopage" component={NoPagePrivate}/>

              {paymentsOnly && <Redirect to="/payments"/>}
              <PrivateRoute component={NoPagePrivate}/>
              <Route component={NoPage}/>
            </Switch>
          </Suspense>

        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { alert, authentication, company, menu } = state;
  return {
    alert, authentication, company, menu,
  };
}

Index.proptypes = {
  location: PropTypes.object.isRequired,
};


export default connect(mapStateToProps)(withTranslation('common')(Index));
