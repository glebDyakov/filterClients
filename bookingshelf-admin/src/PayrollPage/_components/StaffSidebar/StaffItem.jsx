import React, { Component, PureComponent } from 'react';
import StaffSidebarContext from '../../_context/StaffSidebarContext';
import { withTranslation } from 'react-i18next';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

class StaffItem extends PureComponent {
  constructor(props) {
    super(props);
    this.getStaffRoleStr = this.getStaffRoleStr.bind(this);
  }

  getStaffRoleStr(roleId) {
    const { t } = this.props;

    switch (roleId) {
      case 4:
        return t('Владелец');
      case 3:
        return t('Админ');
      case 2:
        return t('Средний доступ');
      default:
        return t('Низкий доступ');
    }
  }

  render() {
    const { selectedStaffId, selectStaff } = this.context;
    const { staff } = this.props;


    return (
      <div key={this.props.key} onClick={() => {
        selectStaff(staff.staffId);
        if (this.props.onClose) this.props.onClose();
      }}
           className={'list-item d-flex align-items-center' + (selectedStaffId === staff.staffId ? ' selected' : '')}>
        <img className="staff-image"
             src={
               staff.imageBase64
                 ? 'data:image/png;base64,' + staff.imageBase64
                 : `${process.env.CONTEXT}public/img/avatar.svg`}
             alt="Staff image"/>
        <div className="staff-credit">
          <div className="staff-name">{staff.firstName + (staff.lastName ? ' ' + staff.lastName : '')}</div>
          <div className="staff-role">{this.getStaffRoleStr(staff.roleId)}</div>
        </div>
      </div>
    );
  }
}

StaffItem.contextType = StaffSidebarContext;

export default withTranslation('common')(StaffItem);
