import React, { Component } from 'react';
import { access } from '../../_helpers/access';

class BlackListUserItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isChecked === !this.state.isChecked) {
      this.setState({
        isChecked: newProps.isChecked,
      }, () => {
        console.log(newProps.isChecked);
      });
    }
  }

  render() {
    const { i, client_user, handleAddUser } = this.props;

    return (
      <li key={i}>
        <div className="client-item d-flex justify-content-between align-items-center">
          <div className="clients-list">

            <span
              className="name_container">{client_user.firstName} {client_user.lastName}
              {access(12) && (
                <React.Fragment>
                  <span
                    className="email-user">{client_user.email}</span>
                  <span
                    className="email-user">{client_user.phone}</span>
                </React.Fragment>
              )}
            </span>
          </div>
          <div className="add-checkbox">
            <label className="add-person">
              <input className="form-check-input" type="checkbox"
                checked={this.state.isChecked}
                onClick={() => {
                  handleAddUser(client_user);
                }}/>
              <span className="check-box-plus"></span>
            </label>
          </div>
        </div>
      </li>
    );
  }
}

export default BlackListUserItem;
