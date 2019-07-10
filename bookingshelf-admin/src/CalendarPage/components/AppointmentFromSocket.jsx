import React from 'react';
import { connect } from 'react-redux';
import CalendarSwitch from "./CalendarSwitch";

// import PropTypes from 'prop-types';

class AppointmentFromSocket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }



    render() {
        const {appointmentSocketMessageFlag, appointmentSocketMessage} = this.props;
        debugger
        return (
            <div className="appointment-socket-modal" style={{color: appointmentSocketMessageFlag?"red":"green"}}>
                <div className="appointment-socket-modal-title"><p>НОВАЯ ЗАПИСЬ</p></div>

            </div>
        )
    }


}

function mapStateToProps(state) {
    const {  } = state;
    return {

    };
}

// ApproveAppointment.propTypes ={
//     approve: PropTypes.func,
//     id: PropTypes.number
// };

export default AppointmentFromSocket;
