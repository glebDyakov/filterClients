import React from 'react';
import { connect } from 'react-redux';
import {appointmentActions} from "../../_actions/appointment.actions";

class MoveVisit extends React.Component {
    constructor(props) {
        super(props);

        this.handleYes = this.handleYes.bind(this);
        this.handleNo = this.handleNo.bind(this);
    }

    render() {
        return (
            <div className="modal fade move-visit-modal">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Перенести выбранный визит?</h4>
                            <button type="button" className="close" onClick={this.handleNo} data-dismiss="modal" />
                        </div>
                        <div className="form-group mr-3 ml-3">
                            <button type="button" className="button" onClick={this.handleYes} data-dismiss="modal">Да</button>
                            <button type="button" className="gray-button" onClick={this.handleNo} data-dismiss="modal">Нет</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    handleYes (){
        const {
            moveVisit,
            movingVisit,
            movingVisitDuration,
            prevVisitStaffId,
            staffKey,
            selectedDaysKey,
            time,
        } = this.props;

        moveVisit({
            movingVisit,
            movingVisitDuration,
            prevVisitStaffId,
            staffKey,
            selectedDaysKey,
            time,
        })
    }

    handleNo (){
        this.props.dispatch(appointmentActions.togglePayload({
            movingVisit: null, movingVisitDuration: null, prevVisitStaffId: null, draggingAppointmentId: null, isStartMovingVisit: false
        }));
    }
}

function mapStateToProps(state) {
    const {
        appointment: {
            movingVisit,
            movingVisitDuration,
            prevVisitStaffId,
            staffKey,
            selectedDaysKey,
            time,
        }
    } = state;

    return {
        movingVisit,
        movingVisitDuration,
        prevVisitStaffId,
        staffKey,
        selectedDaysKey,
        time,
    }
}

const connectedApp = connect(mapStateToProps)(MoveVisit);
export { connectedApp as MoveVisit };
