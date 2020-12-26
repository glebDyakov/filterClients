import React, { Component } from 'react';

class MobileHandler extends Component {
  render() {
    const { staff } = this.props;
    return (
      <>
        <label className="select-staff-label">Исполнитель
          <button className="select-staff-button">
            {staff &&
            <>
              <img src={
                staff.imageBase64
                  ? 'data:image/png;base64,' + staff.imageBase64
                  : `${process.env.CONTEXT}public/img/avatar.svg`} alt="staff image" className="staff-image"/>
              <p className="staff-name">{staff.firstName + (staff.lastName ? ' ' + staff.lastName : '')}</p>
            </>}
          </button>
        </label>
        </>
    );
  }
}

export default MobileHandler;
