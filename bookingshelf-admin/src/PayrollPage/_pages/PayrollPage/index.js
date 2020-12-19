import React, { Component } from 'react';
import AnalyticBlock from './_components/AnalyticBlock';
import Table from './_components/Table';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="payroll-tab">
        <AnalyticBlock/>
        <Table/>
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
