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
      <div className="staffs-list-wrapper col p-0">
        <div className="staffs-list">

          <div className="list-item header-item d-flex align-items-center">
            <h2 className="title mb-0">Выбор сотрубника</h2>
            <button className='close'/>
          </div>

          {staffs && staffs.sort((staffA, staffB) => staffB.roleId - staffA.roleId)
            .map((staff) => <StaffItem key={staff.staffId} staff={staff}/>)}
        </div>
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
