import React, { Component } from 'react';
import AnalyticBlock from './_components/AnalyticBlock';
import Table from './_components/Table';
import MobileHandler from '../../_components/StaffSidebar/MobileHandler';
import PayrollContext, { PayrollProvider } from '../../_context/PayrollContext';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { activeStaff } = this.context;
    return (
      <div className="payroll-tab">
        <AnalyticBlock/>
        <Table/>
      </div>
    );
  }
}

Index.propTypes = {};

Index.contextType = PayrollContext;

export default Index;
