import React, { Component } from 'react';
import PayrollDayList from './PayrollDayList';

class PayrollDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen() {
    this.setState(state => {
      return {
        isOpened: !state.isOpened,
      };
    });
  }

  render() {
    return (
      <React.Fragment>
          <tr className={'payroll-day' + (this.state.isOpened ? ' opened' : '')}>
            <td>
              <div className="open-handler-container">
                <button onClick={this.handleOpen} className="open-handler"></button>
              </div>
            </td>
            <td>
              <div className="weekday-container">
                <h2 className="weekday">Пн</h2>
                <p className="weekday-date">9 июня</p>
              </div>
            </td>
            <td className="service-container">
              <p>Услуг оказано: 6</p>
              <p>Сумма услуг: 1230 BYN</p>
            </td>
            <td className="product-container">
              <p>Продано товаров: 123</p>
              <p>Сумма товаров: 1230 BYN</p>
            </td>
            <td className="income-container" colSpan={5}>
              <p>Доход сотрудника: 230 BYN</p>
              <p>Доход компании: 1000 BYN</p>
              <p></p>
            </td>
          </tr>
        {this.state.isOpened &&
        <PayrollDayList/>}
      </React.Fragment>
    );
  }
}

export default PayrollDay;
