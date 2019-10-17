import React, {Component} from 'react';
import {connect} from "react-redux";
import {calendarActions} from "../_actions";

class CalendarOnlinePrePage extends Component {
    componentDidMount() {
        const url = "/page/" + this.props.match.params.staffId + "/" + this.props.match.params.date
        this.props.history.push(url);
        this.props.dispatch(calendarActions.setScrollableAppointment(this.props.match.params.appointmentId))
    }
    render() {
        return null;
    }
}

const connectedPage = connect()(CalendarOnlinePrePage);
export { connectedPage as CalendarOnlinePrePage };
