import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class DeleteAppointment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id
        };

        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state, id:newProps.id})
        }
    }

    render() {
        return (
            <div className="modal fade delete-notes-modal">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Отменить запись</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="form-group mr-3 ml-3">
                            <button type="button" className="button" onClick={this.cancel} data-dismiss="modal">Да</button>
                            <button type="button" className="gray-button" data-dismiss="modal">Нет</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    cancel (){
        const {cancel}=this.props;
        const {id}=this.state;

        return cancel(id);
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

DeleteAppointment.propTypes ={
    cancel: PropTypes.func,
    id: PropTypes.number
};

const connectedApp = connect(mapStateToProps)(DeleteAppointment);
export { connectedApp as DeleteAppointment };