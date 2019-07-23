import React from 'react';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import {alertActions, calendarActions, staffActions, menuActions} from '../_actions';
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


import {Router, Route, Switch} from "react-router-dom";
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
            appointmentSocketMessage: {},
            appointmentSocketMessageFlag: false
        }


        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });

        this.notifications = this.notifications.bind(this);
        this.closeAppointmentFromSocket = this.closeAppointmentFromSocket.bind(this);
        this.handleSocketDispatch = this.handleSocketDispatch.bind(this);
        this.playSound = this.playSound.bind(this);

        this.props.dispatch(userActions.checkLogin());

    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.authentication) !==  JSON.stringify(newProps.authentication) && newProps.authentication.loginChecked) {
            if (newProps.authentication.loggedIn) {
                this.notifications();

                this.props.dispatch(companyActions.get());
            }
            this.setState({...this.state, authentication: newProps.authentication })
        }

        if ( JSON.stringify(this.props.company) !==  JSON.stringify(newProps.company)) {
            this.setState({...this.state, company: newProps.company })
        }

        if (this.props.authentication && this.props.authentication.user && this.props.authentication.user.profile && this.props.authentication.user.profile.staffId
            && this.state.flagStaffId){
            this.setState({flagStaffId: false});


            const options = {
                url: `wss://staging.online-zapis.com/websocket/${this.props.authentication.user.profile.staffId}/`,
                pingTimeout: 15000,
                pongTimeout: 10000,
                reconnectTimeout: 2000,
                pingMsg: "heartbeat"
            }
            let socket = new WebsocketHeartbeatJs(options);
            // socket = createSocket(this.props.authentication.user.profile.staffId );

            console.log("Сокет. Создан");
            socket.onopen = function() {
                console.log("Сокет. Соединение установлено");
                socket.send('ping');

            };


            socket.onclose = function(event) {
                if (event.wasClean) {
                    console.log('Сокет. cоединение закрыто');
                } else {
                    console.log('Сокет. соединения как-то закрыто');
                }
                // this.openSocketAgain(this.props.authentication.user.profile.staffId);
            };

            socket.onmessage = function(event) {
                if (event.data[0]==='{'){
                    const finalData = JSON.parse(event.data);
                    if((finalData.wsMessageType === "APPOINTMENT_CREATED") || (finalData.wsMessageType === "APPOINTMENT_DELETED")){
                        this.handleSocketDispatch(finalData);
                        console.log(`Сокет.пришли данные: ${event.data}`);
                    }
                }
                // console.log(`Сокет.пришли данные: ${event.data}`);

            };
           socket.onmessage = socket.onmessage.bind(this);
           socket.onclose = socket.onclose.bind(this);

           socket.onerror = function(event) {
                console.error("Сокет. ошибка", event);
            };
        }
    }

    notifications(){

        this.props.dispatch(companyActions.getNewAppointments());
        // setTimeout(()=>this.notifications(), 300000)
    }

    closeAppointmentFromSocket(){
        $(".appointment-socket-modal ").addClass('appointment-socket-modal-go-away');
        setTimeout(() => {
            this.setState({ appointmentSocketMessageFlag: false });
            $(".appointment-socket-modal ").removeClass('appointment-socket-modal-go-away');
        }, 2000);

    }
    handleSocketDispatch(payload){
        if (this.props.authentication.user.profile.staffId === payload.payload.staffId) {
            this.playSound();
            this.setState({appointmentSocketMessage: payload, appointmentSocketMessageFlag: true});
            debugger
            if (payload.wsMessageType === 'APPOINTMENT_CREATED') {

                this.props.dispatch(calendarActions.getAppointmentsNewSocket(payload));
                this.props.dispatch(companyActions.getAppointmentsCountMarkerIncrement());
            } else if ((payload.wsMessageType === 'APPOINTMENT_DELETED')) {
                debugger
                this.props.dispatch(calendarActions.deleteAppointmentsNewSocket(payload));
                // this.props.dispatch(companyActions.getAppointmentsCountMarkerDecrement());
                // this.props.dispatch(companyActions.getAppointmentsCountMarkerDecrement());
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
        sound.play();
    }


    render() {
        const { authentication, company, appointmentSocketMessageFlag, appointmentSocketMessage } = this.state;
        {
           company && company.settings && authentication.menu && authentication.loggedIn &&
            moment.tz.setDefault(company.settings.timezoneId)
        }
        return (
            <Router history={history} >
                {authentication.loginChecked &&
                    <div>
                        {authentication && authentication.user && authentication.menu && authentication.loggedIn &&
                        <SidebarMain/>
                        }
                        {appointmentSocketMessageFlag &&
                        <AppointmentFromSocket
                            appointmentSocketMessageFlag={appointmentSocketMessageFlag}
                            appointmentSocketMessage={appointmentSocketMessage}
                            closeAppointmentFromSocket={this.closeAppointmentFromSocket}
                        />}
                        {/*<button style={{zIndex: "9999", position: "absolute", left: "400px", top: "200px"}} onClick={()=>this.playSound()}>Sound</button>*/}
                        <Switch>
                            <PrivateRoute exact path="/" component={MainIndex} refresh={false} />
                            <PrivateRoute exact path="/settings" component={MainIndexPage} refresh={false} />
                            <PrivateRoute exact path="/staff/:activeTab?" component={StaffPage}  refresh={false}  />
                            <PrivateRoute exact path="/clients" component={ClientsPage}  refresh={false}  />
                            {access(0) &&
                            <PrivateRoute exact path="/services" component={ServicesPage}/>
                            }
                            <PrivateRoute exact path="/calendar/:selectedType?/:staffNum?/:dateFrom?/:dateTo?" component={CalendarPage}  />
                            <PrivateRoute exact path="/page/:id?/:date?" component={CalendarPrePage}  />
                            <PrivateRoute exact path="/online_booking" component={OnlinePage}  />
                            <PrivateRoute exact path="/email_sms/:activeTab?" component={EmailPage}  />
                            <PrivateRoute exact path="/faq/:activeTab?" component={FaqPage}  />

                            <PublicRoute path="/register" component={RegisterPage} />
                            <PublicRoute path="/activation/company/:company" component={ActivationPage} />
                            <PrivateRoute path="/activation/staff/:staff" component={ActivationPageStaff} />
                            <PublicRoute path="/activation/staff/:staff" component={ActivationPageStaff} />
                            <PublicRoute path="/login" component={LoginPage} />
                            <PrivateRoute path="/logout" component={LogoutPage} />
                            <PrivateRoute path="/denied" component={NoPageDenied} />
                            <PrivateRoute path="/nopage" component={NoPagePrivate} />
                            <PrivateRoute path="/analytics" component={AnalyticsPage} />
                            <PrivateRoute path="/payments" component={PaymentsPage} />
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
