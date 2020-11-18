import React, {Component} from 'react';
import {connect} from "react-redux";
import StaffList from "./_components/StaffList";
import '../../public/scss/payroll.scss';

class Index extends Component {
    constructor(props) {
        super(props);

    }


    render() {

        return (
            <div id="payroll">
                <StaffList/>
            </div>
        );
    }
}

export default connect()(Index);
