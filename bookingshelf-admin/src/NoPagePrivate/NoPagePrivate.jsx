import React from 'react';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";

class NoPagePrivate extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page404">
                <div className="container" style={{marginRight: '5%'}}>
                    <span className="red_center_text" style={{paddingTop: '15%'}}>404</span>
                    <p className="title">Такой страницы не существует</p>
                    <div className="clear"></div>
                    <Link className="button mt-5" to="/calendar">перейти на главную</Link>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {

    const { authentication } = state;
    return {
        authentication
    };
}

const connectedLoginPage = connect(mapStateToProps)(NoPagePrivate);
export { connectedLoginPage as NoPagePrivate };