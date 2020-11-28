import React, {Component} from 'react';
import DropdownGroupItem from "./DropdownGroupItem";

class DropdownGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenGroup: false
    }

    this.handleOpenGroup = this.handleOpenGroup.bind(this);
  }

  handleOpenGroup() {
    this.setState((state) => {
      return {isOpenGroup: !state.isOpenGroup}
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="dropdown-group d-flex justify-content-between align-items-center">
          <div className="left-container">
            <div className="open-handler-container">
              <button onClick={this.handleOpenGroup} className={"open-handler" + (this.state.isOpenGroup ? " opened" : '')}></button>
              <h2 className="group-title">Крема</h2>
            </div>
          </div>
          <div className="right-container">
            <p className="right-container__percent">0%</p>
          </div>

        </div>

        {this.state.isOpenGroup &&
        <div className="dropdown-group-items">
          <DropdownGroupItem/>
          <DropdownGroupItem/>
          <DropdownGroupItem/>
        </div>}

      </React.Fragment>
    );
  }
}

export default DropdownGroup;
