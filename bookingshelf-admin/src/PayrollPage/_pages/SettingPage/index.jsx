import React, { Component } from 'react';
import SalarySettings from './_components/SalarySettings';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="setting-tab">
        <div className="setting-container">
          <SalarySettings/>
        </div>
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
