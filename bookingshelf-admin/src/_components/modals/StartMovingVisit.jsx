import React from 'react';
import { connect } from 'react-redux';
import { appointmentActions } from "../../_actions";

class StartMovingVisit extends React.Component {
    constructor(props) {
        super(props);
        this.handleYes = this.handleYes.bind(this);
    }

    render() {
        return (
            <div className="modal fade start-moving-modal">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Перенести визит?</h4>
                            <button type="button" className="close" data-dismiss="modal" />
                        </div>
                        <div className="form-group mr-3 ml-3">
                            <button type="button" className="button" onClick={this.handleYes} data-dismiss="modal">Да</button>
                            <button type="button" className="gray-button" data-dismiss="modal">Нет</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    handleYes (){
        this.props.dispatch(appointmentActions.toggleStartMovingVisit(true))
    }
}

const connectedApp = connect()(StartMovingVisit);
export { connectedApp as StartMovingVisit };
