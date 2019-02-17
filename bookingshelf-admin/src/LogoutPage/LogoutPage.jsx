import {Link, Redirect} from 'react-router-dom';
import React from "react";
import { userActions } from '../_actions';
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router";


class LogoutPage extends React.Component {
    constructor(props) {
        super(props);

        this.logout=this.logout.bind(this)
    }

    logout(){
        const { dispatch } = this.props;
        dispatch(userActions.logout());
        // this.props.history.push('/login');
    }

    render (){
        return (
            <a onClick={()=>this.logout()}>Выход</a>

        )
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

LogoutPage.proptypes = {
    location: PropTypes.object.isRequired,
};

const connectedApp = connect(mapStateToProps)(withRouter(LogoutPage));
export { connectedApp as LogoutPage };