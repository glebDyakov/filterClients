import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { calendarActions } from '../../_actions';

class DeleteReserve extends React.Component {
  constructor(props) {
    super(props);

    this.cancel = this.cancel.bind(this);
  }

  render() {
    return (
      <span className="modal delete-reserve-modal">
        <span className="action-modal d-flex h-100">
          <span className="modal-content">
            <span className="modal-header">
              <h4 className="modal-title">Удалить резерв времени?</h4>
              <button type="button" className="close" data-dismiss="modal"/>
            </span>
            <span className="modal-body">
              <div className="form-group mr-3 ml-3">
                <button type="button" className="button" onClick={this.cancel}
                  data-dismiss="modal">Удалить</button>
                <button type="button" className="gray-button" data-dismiss="modal">Отмена</button>
              </div>
            </span>
          </span>
        </span>
      </span>


    );
  }

  cancel() {
    const { dispatch, reservedTimeId, reservedTimeStaffId } = this.props;
    dispatch(calendarActions.deleteReservedTime(reservedTimeStaffId, reservedTimeId));
  }
}

DeleteReserve.propTypes = {
  id: PropTypes.number,
  staffId: PropTypes.number,
};

function mapStateToProps(state) {
  const { modals: { reservedTimeId, reservedTimeStaffId } } = state;
  return { reservedTimeId, reservedTimeStaffId };
}

export default connect(mapStateToProps)(DeleteReserve);
