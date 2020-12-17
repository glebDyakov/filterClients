import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class StaffList extends Component {
  render() {
    const { selectedStaff, selectStaff, staffs, t } = this.props;

    return (
      <div className="staffs-list-wrapper col p-0">
        <div className="staffs-list">

          <div className="list-item header-item d-flex align-items-center">
            <h2 className="title mb-0">Выбор сотрубника</h2>
            <button className='close'></button>
          </div>

          {staffs && staffs.map((staff) =>
            <div onClick={() => {
              selectStaff(staff.staffId)
            }} className={"list-item d-flex align-items-center" + (selectedStaff === staff.staffId ? " selected": '')}>
              <img className="staff-image"
                   src={staff.imageBase64 ? 'data:image/png;base64,' + staff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                   alt="Staff image"/>
              <div className="staff-credit">
                <div className="staff-name">{staff.firstName + (staff.lastName ? ' ' + staff.lastName : '')}</div>
                <div className="staff-role">{t('Администратор')}</div>
              </div>
            </div>) || <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
        </div>
      </div>
    );
  }
}

export default withTranslation('common')(StaffList);
