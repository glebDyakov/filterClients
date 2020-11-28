import React, { Component } from 'react';

class DropdownGroupItem extends Component {
  render() {
    return (
      <div className="dropdown-item d-flex justify-content-between align-items-center">
        <p className="item-name">test</p>
        <div className="right-container">
          <p className="right-container__percent">0%</p>
        </div>
      </div>
    );
  }
}

export default DropdownGroupItem;
