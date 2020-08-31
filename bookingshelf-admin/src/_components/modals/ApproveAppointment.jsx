import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ApproveAppointment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
    };

    this.approve = this.approve.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if ( JSON.stringify(this.props) !== JSON.stringify(newProps)) {
      this.setState({ ...this.state, id: newProps.id });
    }
  }

  render() {
    return (
      <div className="modal fade save-notes-modal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Применить запись</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="form-group mr-3 ml-3">
              <button type="button" className="button" onClick={this.approve} data-dismiss="modal">Да</button>
              <button type="button" className="gray-button" data-dismiss="modal">Нет</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  approve() {
    const { approve }=this.props;
    const { id }=this.state;

    return approve(id);
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert,
  };
}

ApproveAppointment.propTypes ={
  approve: PropTypes.func,
  id: PropTypes.number,
};

const connectedApp = connect(mapStateToProps)(ApproveAppointment);
export { connectedApp as ApproveAppointment };
