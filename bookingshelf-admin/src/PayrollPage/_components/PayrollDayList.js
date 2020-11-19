import React, { Component } from 'react';

class PayrollDayList extends Component {
  render() {
    return (
      <React.Fragment>
        <tr className="payroll-day-list opened">
          <td>
            <p className="list-text text-center">6:30</p>
          </td>
          <td>
            <p className="list-text text-center">1ч 30 мин</p>
          </td>
          <td>
            <p className="list-text">Укладка волос феном очень (короткие) длинное название</p>
          </td>
          <td>
            <p className="list-text">Шампунь с очень длинным названием на вторую строку</p>
          </td>
          <td>
            <p className="list-text">15 BYN</p>
          </td>
          <td>
            <p className="list-text">15 BYN</p>
          </td>
          <td>
            <p className="list-text">10 BYN</p>
          </td>
          <td>
            <p className="list-text">5 BYN</p>
          </td>
          <td>
            <p className="list-text">5 BYN</p>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default PayrollDayList;
