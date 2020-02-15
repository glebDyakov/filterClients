import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { calendarActions } from "../../_actions";

class DeleteReserve extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            staffId: props.staffId,
        };

        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({...this.state,
                id:newProps.id,
                staffId:newProps.staffId
            })
        }
    }

    render() {
        return (
            <div className="modal fade delete-reserve-modal">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Удалить</h4>
                            <button type="button" className="close" data-dismiss="modal"></button>
                            {/*<img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt="" className="close" data-dismiss="modal"/>*/}

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
        const { dispatch, staffId, id }=this.props;
        dispatch(calendarActions.deleteReservedTime(staffId, id));
    }
}

DeleteReserve.propTypes ={
    cancel: PropTypes.func,
    id: PropTypes.number,
    staffId: PropTypes.number
};

const connectedApp = connect()(DeleteReserve);
export { connectedApp as DeleteReserve };
