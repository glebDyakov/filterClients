import React from 'react';
import { connect } from 'react-redux';
import config from 'config';

import { history } from '../_helpers';
import {
    alertActions,
    calendarActions,
    staffActions,
    menuActions,
    notificationActions,
    socketActions
} from '../_actions';
import { PrivateRoute, PublicRoute } from '../_components';

import '../../public/css_admin/bootstrap.css'
import '../../public/css_admin/datepicker.css'

import {MainIndexPage} from "../MainIndexPage";
import {StaffPage} from "../StaffPage";
import {ClientsPage} from "../ClientsPage";
import {ServicesPage} from "../ServicesPage";
import {CalendarPage} from "../CalendarPage";
import {OnlinePage} from "../OnlinePage";
import {EmailPage} from "../EmailPage";
import {NoPage} from "../NoPage";

import {LogoutPage} from "../LogoutPage";
import {RegisterPage} from "../RegisterPage";
import {LoginPage} from "../LoginPage";
import {PaymentsPage} from "../PaymentsPage";


import {Router, Route, Switch, Redirect} from "react-router-dom";
import PropTypes from 'prop-types';
import {SidebarMain} from "../_components/SidebarMain";
import {access} from "../_helpers/access";
import {ActivationPage} from "../ActivationPage/ActivationPage";
import moment from 'moment';
import 'moment-timezone';
import {companyActions} from "../_actions/company.actions";
import {NoPageDenied} from "../NoPageDenied";
import {NoPagePrivate} from "../NoPagePrivate";
import {MainIndex} from "../MainIndex";
import {CalendarPrePage} from "../CalendarPrePage";
import {FaqPage} from "../FaqPage";
import {ActivationPageStaff} from "../ActivationPageStaff/ActivationPageStaff";
import {userActions} from "../_actions/user.actions";
import { AnalyticsPage } from "../AnalyticsPage";
import {createSocket} from "../_helpers/createSocket";
import {AppointmentFromSocket} from "../_components/modals";
var socket;

import WebsocketHeartbeatJs from 'websocket-heartbeat-js';

var sound = new Audio(`${process.env.CONTEXT}public/mp3/message_sound.mp3`);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            authentication: props.authentication,
            flagStaffId: true,
        }


        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });

        this.notifications = this.notifications.bind(this);
        this.closeAppointmentFromSocket = this.closeAppointmentFromSocket.bind(this);
        this.handleSocketDispatch = this.handleSocketDispatch.bind(this);
        this.playSound = this.playSound.bind(this);
        this.checkLogin = this.checkLogin.bind(this);

        this.checkLogin();

    }

    componentWillReceiveProps(newProps) {
        const { user } = newProps.authentication
        if (user && (user.forceActive
          || (moment(user.trialEndDateMillis).format('x') >= moment().format('x'))
          || (user.invoicePacket && moment(user.invoicePacket.endDateMillis).format('x') >= moment().format('x'))
        )) {
        } else {
            this.setState({ paymentsOnly: true, authentication: newProps.authentication })
            return;
        }
        if (this.state.paymentsOnly) {
            this.setState({paymentsOnly: false})
        }
        if (JSON.stringify(this.props.authentication) !== JSON.stringify(newProps.authentication) && newProps.authentication.loginChecked) {
            if (newProps.authentication.loggedIn) {
                this.notifications();

                this.props.dispatch(companyActions.get());
                this.props.dispatch(companyActions.getSubcompanies());
            }
            this.setState({...this.state, authentication: newProps.authentication})
        }

        if (JSON.stringify(this.props.company) !== JSON.stringify(newProps.company)) {
            this.setState({...this.state, company: newProps.company})
        }

        if (this.props.authentication && this.props.authentication.user && this.props.authentication.user.profile && this.props.authentication.user.profile.staffId
          && this.state.flagStaffId) {
            this.setState({flagStaffId: false});
            this.props.dispatch(notificationActions.getBalance());


            const options = {
                url: `${config.apiSocket}/${this.props.authentication.user.profile.staffId}/`,
                pingTimeout: 15000,
                pongTimeout: 10000,
                reconnectTimeout: 2000,
                pingMsg: "heartbeat"
            }
            let socket = new WebsocketHeartbeatJs(options);
            // socket = createSocket(this.props.authentication.user.profile.staffId );

            console.log("Сокет. Создан");
            socket.onopen = function () {
                console.log("Сокет. Соединение установлено");
                socket.send('ping');

            };


            socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log('Сокет. cоединение закрыто');
                } else {
                    console.log('Сокет. соединения как-то закрыто');
                }
                // this.openSocketAgain(this.props.authentication.user.profile.staffId);
            };

            socket.onmessage = function (event) {
                if (event.data[0] === '{') {
                    const finalData = JSON.parse(event.data);
                    if ((finalData.wsMessageType === "APPOINTMENT_CREATED") || (finalData.wsMessageType === "APPOINTMENT_DELETED")
                      || finalData.wsMessageType === "APPOINTMENT_MOVED") {
                        this.handleSocketDispatch(finalData);
                        console.log(`Сокет.пришли данные: ${event.data}`);
                    }
                }
                // console.log(`Сокет.пришли данные: ${event.data}`);

            };
            socket.onmessage = socket.onmessage.bind(this);
            socket.onclose = socket.onclose.bind(this);

            socket.onerror = function (event) {
                console.error("Сокет. ошибка", event);
            };
        }
    }

    checkLogin() {
        this.props.dispatch(userActions.checkLogin());
        setTimeout(()=>this.checkLogin(), 540000)
    }

    notifications(){

        this.props.dispatch(companyActions.getNewAppointments());
        // setTimeout(()=>this.notifications(), 300000)
    }

    closeAppointmentFromSocket(){
        $(".appointment-socket-modal ").addClass('appointment-socket-modal-go-away');
        setTimeout(() => {
            this.props.dispatch(socketActions.alertSocketMessage(null));
            $(".appointment-socket-modal ").removeClass('appointment-socket-modal-go-away');
        }, 2000);

    }
    handleSocketDispatch(payload){
        const { staffId, roleId } = this.props.authentication.user.profile
        if (staffId === payload.payload.staffId || roleId === 3 || roleId === 4) {
            this.playSound();
            this.props.dispatch(socketActions.alertSocketMessage(payload));
            if (payload.wsMessageType === 'APPOINTMENT_CREATED') {

                this.props.dispatch(calendarActions.getAppointmentsNewSocket(payload));
                this.props.dispatch(companyActions.getAppointmentsCountMarkerIncrement());
            } else if ((payload.wsMessageType === 'APPOINTMENT_DELETED')) {
                this.props.dispatch(calendarActions.deleteAppointmentsNewSocket(payload));
                // this.props.dispatch(companyActions.getAppointmentsCountMarkerDecrement());
                // this.props.dispatch(companyActions.getAppointmentsCountMarkerDecrement());
                this.props.dispatch(companyActions.getNewAppointments());
            } else if (payload.wsMessageType === 'APPOINTMENT_MOVED') {
                this.props.dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
                this.props.dispatch(companyActions.getNewAppointments());
            }
        }
    }

    // openSocketAgain(id){
    //     socket = createSocket(id);
    //     console.log("Сокет. Создан");
    //     socket.onopen = function() {
    //         console.log("Сокет2. cоединение установлено");
    //
    //         socket.send('ping');
    //
    //     };
    //
    //
    //     socket.onclose = function(event) {
    //         if (event.wasClean) {
    //             console.log('Сокет2.cоединение закрыто');
    //         } else {
    //             console.log('Сокет2.соединения как-то закрыто');
    //         }
    //         this.openSocketAgain(id);
    //     };
    //
    //     socket.onmessage = function(event) {
    //         if (event.data[0]==='{'){
    //             const finalData = JSON.parse(event.data);
    //             if ((finalData.wsMessageType === "APPOINTMENT_CREATED") || (finalData.wsMessageType === "APPOINTMENT_DELETED")){
    //                 this.handleSocketDispatch(finalData);
    //             }
    //         }
    //         console.log(`Сокет.пришли данные: ${event.data}`);
    //
    //     };
    //     socket.onmessage = socket.onmessage.bind(this);
    //     socket.onclose = socket.onclose.bind(this);
    //
    //     socket.onerror = function(event) {
    //         console.error("Сокет2.ошибка", event);
    //     };
    //
    // }
    playSound(){
        let soundSettings = localStorage.getItem('sound');
        if(soundSettings==="false") {
            sound.volume = 0;
        }else {
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
            moment.tz.setDefault(company.settings.timezoneId)
        }
        return (
            <Router history={history} >
                {authentication.loginChecked &&
                    <div>
                        {authentication && authentication.user && authentication.menu && authentication.loggedIn && localStorage.getItem('user') &&
                        <SidebarMain/>
                        }
                        <AppointmentFromSocket
                            closeAppointmentFromSocket={this.closeAppointmentFromSocket}
                        />
                        {/*<button style={{zIndex: "9999", position: "absolute", left: "400px", top: "200px"}} onClick={()=>this.playSound()}>Sound</button>*/}
                        <Switch>
                            {!paymentsOnly && <PrivateRoute exact path="/" component={MainIndex} refresh={false} />}
                            {!paymentsOnly && <PrivateRoute exact path="/settings" component={MainIndexPage} refresh={false} />}
                            {!paymentsOnly && <PrivateRoute exact path="/staff/:activeTab?" component={StaffPage}  refresh={false}  />}
                            {!paymentsOnly && <PrivateRoute exact path="/clients" component={ClientsPage}  refresh={false}  />}
                            {!paymentsOnly && access(0) &&
                            <PrivateRoute exact path="/services" component={ServicesPage}/>
                            }
                            {!paymentsOnly && <PrivateRoute exact path="/calendar/:selectedType?/:staffNum?/:dateFrom?/:dateTo?" component={CalendarPage}  />}
                            {!paymentsOnly && <PrivateRoute exact path="/page/:id?/:date?" component={CalendarPrePage}  />}
                            {!paymentsOnly && <PrivateRoute exact path="/online_booking" component={OnlinePage}  />}
                            {!paymentsOnly && <PrivateRoute exact path="/email_sms/:activeTab?" component={EmailPage}  />}
                            <PrivateRoute exact path="/faq/:activeTab?" component={FaqPage}  />

                            <PublicRoute path="/register" component={RegisterPage} />
                            <PublicRoute path="/activation/company/:company" component={ActivationPage} />
                            {!paymentsOnly && <PrivateRoute path="/activation/staff/:staff" component={ActivationPageStaff} />}
                            <PublicRoute path="/activation/staff/:staff" component={ActivationPageStaff} />
                            <PublicRoute path="/login" component={LoginPage} />
                            {!paymentsOnly && <PrivateRoute path="/logout" component={LogoutPage} />}
                            <PrivateRoute path="/denied" component={NoPageDenied} />
                            <PrivateRoute path="/nopage" component={NoPagePrivate} />
                            {!paymentsOnly && <PrivateRoute path="/analytics" component={AnalyticsPage} />}
                            <PrivateRoute path="/payments" component={PaymentsPage} />
                            <PrivateRoute path="/invoices" component={PaymentsPage} />
                            {paymentsOnly && <Redirect to="/payments" />}
                            <PrivateRoute component={NoPagePrivate} />

                            <Route component={NoPage} />
                        </Switch>
                    </div>}
            </Router>

        );
    }
}

function mapStateToProps(state) {
    const { alert, authentication, company, menu } = state;
    return {
        alert, authentication, company, menu
    };
}

App.proptypes = {
    location: PropTypes.object.isRequired,
};


const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 
