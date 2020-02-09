import React, {Suspense} from 'react';
import {userActions} from "../_actions";
import {connect} from "react-redux";

const Content = React.lazy(() => import("../Content"));

class App extends React.Component {
    constructor(props) {
        super(props)
        this.checkLogin()

    }
    checkLogin() {
        const localStorageUser = localStorage.getItem('user')
        this.props.dispatch(userActions.checkLogin(localStorageUser));
        setTimeout(()=>this.checkLogin(), 540000)
    }
    render() {
        return (
            <Suspense fallback={null}>
                <Content />
            </Suspense>
        );
    }
}

export default connect()(App);
