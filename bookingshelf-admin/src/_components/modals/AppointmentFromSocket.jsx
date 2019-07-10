import React from 'react';
import { connect } from 'react-redux';

// import PropTypes from 'prop-types';

class AppointmentFromSocket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }



    render() {
        debugger
        return (
            <div className="appointment-socket-modal">

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

const connectedApp = connect(mapStateToProps)(AppointmentFromSocket);
export { connectedApp as AppointmentFromSocket };
