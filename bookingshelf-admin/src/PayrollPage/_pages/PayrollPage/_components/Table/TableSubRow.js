import React, { Component } from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

class TableSubRow extends Component {
  render() {
    const { payout, t } = this.props;

    return (
      <tr className="payroll-day-list opened">
        <td>
          <p className="list-text text-center">{moment(payout.dateStart).format('HH:mm')}</p>
        </td>
        <td>
          <p
            className="list-text text-center">{moment('1900-01-01 00:00:00').add(payout.durationSec, 'seconds').format('H')}{t('ч')} {moment('1900-01-01 00:00:00').add(payout.durationSec, 'seconds').format('mm')} {t('минут')}</p>
        </td>
        <td>
          <p className="list-text">{payout.serviceName}</p>
        </td>
        <td>
          <p className="list-text">{payout.servicePercent}%</p>
        </td>
        <td>
          <p className="list-text">{payout.productPercent === 0 ? '-' : payout.productName}</p>
        </td>
        <td>
          <p className="list-text">{payout.productPercent === 0 ? '-' : payout.productPercent + '%'}</p>
        </td>
        <td>
          <p className="list-text">{payout.staffRevenue} BYN</p>
        </td>
        <td>
          <p className="list-text">{payout.companyRevenue} BYN</p>
        </td>

      </tr>
    );
  }
}

export default withTranslation('common')(TableSubRow);
