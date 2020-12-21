import React, { Component } from 'react';
import SalarySettings from './_components/SalarySettings';
import PercentSettings from './_components/PercentSettings';
import SettingContext from '../../_context/SettingContext';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="setting-tab">
        <div className="setting-container">
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
