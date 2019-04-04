import React from 'react';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import {alertActions, staffActions} from '../_actions';
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            authentication: props.authentication
        }


        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });

        this.notifications = this.notifications.bind(this);



    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props.authentication) !==  JSON.stringify(newProps.authentication)) {
            if (newProps.authentication.loggedIn) {
                this.notifications();

                this.props.dispatch(companyActions.get());
            }
            this.setState({...this.state, authentication: newProps.authentication })
        }

        if ( JSON.stringify(this.props.company) !==  JSON.stringify(newProps.company)) {
            this.setState({...this.state, company: newProps.company })
        }
    }

    componentDidMount() {
        const {authentication} = this.state;

        // this.props.dispatch(socketActions.INCREMENT_CONNECT('online-zapis.com', 44500));

        if (authentication && authentication.user && authentication.menu && authentication.loggedIn) {
            this.notifications();

            this.props.dispatch(companyActions.get());
        }


    }

    notifications(){

        this.props.dispatch(companyActions.getNewAppointments());


        // setTimeout(()=>this.notifications(), 20000)
    }


    render() {
        const { authentication, company } = this.state;
        {
           company && company.settings && authentication.menu && authentication.loggedIn &&
            moment.tz.setDefault(company.settings.timezoneId)
        }
        return (
            <Router history={history} >
                <div>
                    {authentication && authentication.user && authentication.menu && authentication.loggedIn &&
                    <SidebarMain/>
                    }
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
                        <PrivateRoute component={NoPagePrivate} />

                        <Route component={NoPage} />
                    </Switch>
                </div>
            </Router>

        );
    }
}

function mapStateToProps(state) {
    const { alert, authentication, company } = state;
    return {
        alert, authentication, company
    };
}

App.proptypes = {
    location: PropTypes.object.isRequired,
};


const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 