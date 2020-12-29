import React, { Component } from 'react';
import StaffList from './StaffList';
import MobileHandler from './MobileHandler';

class SelectStaffMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };


    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen(e) {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  }

  render() {
    return (
      <div className="mobile-staff-select">
        <MobileHandler onClick={this.handleOpen} staff={this.props.staff}/>

        <div className="staff-list-select">
          <StaffList/>
        </div>

        {/*{this.state.isOpen &&*/}
        {/*.staff-list-select}*/}
      </div>
    );
  }
}

export default SelectStaffMobile;
