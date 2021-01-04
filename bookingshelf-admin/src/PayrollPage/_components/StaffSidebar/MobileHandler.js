import React, { Component } from 'react';
import StaffList from './StaffList';

class MobileHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen() {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  }


  render() {
    const { staff } = this.props;
    return (
      <>
        <label className="select-staff-label">Исполнитель
          <button onClick={this.handleOpen} className="select-staff-button">
            {staff &&
            <>
              <img src={
                staff && staff.imageBase64
                  ? 'data:image/png;base64,' + staff.imageBase64
                  : `${process.env.CONTEXT}public/img/avatar.svg`} alt="staff image" className="staff-image"/>
              <p
                className="staff-name">{staff && staff.firstName + (staff && staff.lastName ? ' ' + staff.lastName : '')}</p>
            </>}


          </button>
          {this.state.isOpen && <div><StaffList onClose={() => {
            this.setState({
              isOpen: false,
            });
          }} isMob={true}/></div>}
        </label>

      </>
    );
  }
}

export default MobileHandler;
