import React from 'react';
import { connect } from 'react-redux';
import { userActions } from "../_actions";

class Index extends React.Component {
    componentDidMount() {
        this.checkLogin()
    }

    checkLogin() {
        this.props.dispatch(userActions.checkLogin());
        setTimeout(()=>this.checkLogin(), 540000)
    }

    render() {
        return null;
    }
}


export default connect()(Index);
