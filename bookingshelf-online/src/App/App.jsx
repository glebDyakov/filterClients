import React from 'react';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';

import {IndexPage} from "../IndexPage";
import {VisitPage} from "../VisitPage";

import {Router, Route, Switch} from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });
    }

    render() {
        return (
            <Router history={history}>
                <div>
                    <Switch>
                        <Route path="/visits/:company/:visit" component={VisitPage} />
                        <Route path="/:company" component={IndexPage} />


                    </Switch>
                </div>
            </Router>

        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 