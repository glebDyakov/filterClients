import React, { Component } from 'react';
import SalarySettings from './_components/SalarySettings';
import PercentSettings from './_components/PercentSettings';
import SettingContext from '../../_context/SettingContext';
import MobileHandler from '../../_components/StaffSidebar/MobileHandler';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { activeStaff } = this.context;

    return (
      <div className="setting-tab">
        <div className="setting-container">
          {/*<MobileHandler staff={activeStaff}/>*/}
          <SalarySettings/>
          <PercentSettings/>
        </div>
      </div>
    );
  }
}

Index.propTypes = {};

Index.contextType = SettingContext;

export default Index;
