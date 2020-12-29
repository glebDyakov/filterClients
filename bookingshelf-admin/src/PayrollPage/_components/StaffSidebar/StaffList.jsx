import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import StaffItem from './StaffItem';
import StaffSidebarContext from '../../_context/StaffSidebarContext';

class StaffList extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.staffs !== nextProps.staffs;
  }

  render() {
    const { t } = this.props;
    const { staffs } = this.context;

    return (
      <div className="staffs-list">
        {staffs && staffs.sort((staffA, staffB) => staffB.roleId - staffA.roleId)
          .map((staff) => <StaffItem onClose={this.props.onClose} key={staff.staffId} staff={staff}/>)}
      </div>
    );
  }
}

StaffList.propTypes = {
  staffs: PropTypes.array,
  selectStaff: PropTypes.func,
  selectedStaffId: PropTypes.number,
};

StaffList.contextType = StaffSidebarContext;

export default withTranslation('common')(StaffList);
