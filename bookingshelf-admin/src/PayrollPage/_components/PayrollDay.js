import React, { Component } from 'react';
import PayrollDayList from './PayrollDayList';
import { withTranslation } from 'react-i18next';

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
    const { t } = this.props;

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
              <p>{t("Услуг оказано")}: 6</p>
              <p>{t("Сумма услуг")}: 1230 BYN</p>
            </td>
            <td className="product-container">
              <p>{t("Продано товаров")}: 123</p>
              <p>{t("Сумма товаров")}: 1230 BYN</p>
            </td>
            <td className="income-container" colSpan={5}>
              <p>{t("Доход сотрудника")}: 230 BYN</p>
              <p>{t("Доход компании")}: 1000 BYN</p>
              <p></p>
            </td>
          </tr>
        {this.state.isOpened &&
        <PayrollDayList/>}
      </React.Fragment>
    );
  }
}

export default withTranslation("common")(PayrollDay);
