import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {calendarActions} from "../../_actions";

class MoveVisit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id
        };

        this.handleYes = this.handleYes.bind(this);
        this.handleNo = this.handleNo.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, id:newProps.id})
        }
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
        this.props.dispatch(calendarActions.toggleMoveVisit(true))
    }

    handleNo (){
        this.props.dispatch(calendarActions.toggleStartMovingVisit(false))
    }
}

const connectedApp = connect()(MoveVisit);
export { connectedApp as MoveVisit };
