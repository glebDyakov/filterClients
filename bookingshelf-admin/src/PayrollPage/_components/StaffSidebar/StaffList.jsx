import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import StaffItem from './StaffItem';
import StaffSidebarContext from '../../_context/StaffSidebarContext';

class StaffList extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);

    this.state = {
      scrollBack: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.staffs !== nextProps.staffs || this.state.scrollBack !== nextState.scrollBack;
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  scrollHandler() {
    const { staffs } = this.context;

    const countStaffs = staffs && staffs.length || 0;

    if (this.wrapperRef) {
      if (this.wrapperRef.scrollLeft + this.wrapperRef.clientWidth >= this.wrapperRef.scrollLeftMax) {
        this.setState({ scrollBack: true });
        console.log('STATE', this.state.scrollBack);
      }

      if (this.wrapperRef.scrollLeft >= this.wrapperRef.scrollLeftMax) {
        $(this.wrapperRef).animate({ scrollLeft: 0 }, { duration: 370 });
        this.setState({ scrollBack: false });
      } else {
        // this.wrapperRef.scrollLeft += this.wrapperRef.clientWidth;
        $(this.wrapperRef).animate({ scrollLeft: this.wrapperRef.scrollLeft + this.wrapperRef.clientWidth }, { duration: 370 });
      }
    }
  }

  render() {
    console.log('wrapper: ', this.wrapperRef);
    const { t } = this.props;
    const { staffs } = this.context;

    return (
      <>
        <div ref={this.setWrapperRef} className="staffs-list">
          {staffs && staffs.sort((staffA, staffB) => staffB.roleId - staffA.roleId)
            .map((staff) => <StaffItem onClose={this.props.onClose} key={staff.staffId} staff={staff}/>)}

        </div>
        <button onClick={this.scrollHandler}
                className={'scroll-button' + (this.state.scrollBack ? ' scrolled' : '')}></button>
      </>

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
