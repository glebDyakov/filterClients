import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class PayrollDayList extends Component {
  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <tr className="payroll-day-list opened">
          <td>
            <p className="list-text text-center">6:30</p>
          </td>
          <td>
            <p className="list-text text-center">1{t("ч")} 30 {t("минут")}</p>
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

export default withTranslation("common")(PayrollDayList);
