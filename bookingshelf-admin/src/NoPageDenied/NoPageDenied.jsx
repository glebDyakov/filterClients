import React from 'react';
import { connect } from 'react-redux';

class NoPageDenied extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page404">
                <div className="container" style={{marginRight: '5%'}}>
                    <span className="red_center_text" style={{paddingTop: '15%'}}>403</span>
                    <p className="title">У вас нет доступа к этой странице</p>
                    <div className="clear"></div>
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

const connectedLoginPage = connect(mapStateToProps)(NoPageDenied);
export { connectedLoginPage as NoPageDenied };