import React, { Component } from 'react';
import TableRow from './TableRow';
import PayrollContext from '../../../../_context/PayrollContext';

class TableBody extends Component {
  render() {
    const { payoutPeriod } = this.context;

    return (
      <tbody>
        {payoutPeriod.map((pp, index) =>
          <TableRow key={index} payout={pp}/>,
        )}
      </tbody>
    );
  }
}

TableBody.contextType = PayrollContext;

export default TableBody;
