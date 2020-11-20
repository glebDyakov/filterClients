import React, { Component } from 'react';

class DropdownGroup extends Component {
  render() {
    return (
      <div className="dropdown-group d-flex justify-content-between align-items-center">
        <div className="left-container">
          <div className="open-handler-container">
            <button className="open-handler"></button>
            <h2 className="group-title">Крема</h2>
          </div>
        </div>
        <div className="right-container">
        </div>

      </div>
    );
  }
}

export default DropdownGroup;
