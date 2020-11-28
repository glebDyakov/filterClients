import React, {Component} from 'react';
import DropdownGroupItem from "./DropdownGroupItem";

class DropdownGroup extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="dropdown-group d-flex justify-content-between align-items-center">
          <div className="left-container">
            <div className="open-handler-container">
              <button className="open-handler"></button>
              <h2 className="group-title">Крема</h2>
            </div>
          </div>
          <div className="right-container">
            <p className="right-container__percent">0%</p>
          </div>

        </div>

        <div className="dropdown-group-items">
          <DropdownGroupItem/>
        </div>
      </React.Fragment>
    );
  }
}

export default DropdownGroup;
