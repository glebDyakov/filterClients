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
        this.props.dispatch(userActions.checkLogin());
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
