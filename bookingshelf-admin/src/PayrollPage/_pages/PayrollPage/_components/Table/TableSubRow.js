import React, { Component } from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

class TableSubRow extends Component {
  render() {
    const { payout, t } = this.props;

    return (
      <tr className={this.props.className + ' payroll-day-list opened'}>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Время начала')}</h2>
          <p className="list-text text-center">{moment(payout.dateStart).format('HH:mm')}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Время услуги')}</h2>
          <p
            className="list-text text-center">{moment('1900-01-01 00:00:00').add(payout.durationSec, 'seconds').format('H')}{t('ч')} {moment('1900-01-01 00:00:00').add(payout.durationSec, 'seconds').format('mm')} {t('минут')}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Услуга')}</h2>
          <p className="list-text">{payout.serviceName} <br/> {t('Цена')}: <span className="price">{payout.serviceCost} BYN</span></p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">% {t('от услуги')}</h2>
          <p className="list-text">{payout.servicePercent}%</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Товар')}</h2>
          <p className="list-text">{payout.productPercent === 0 ? '-' : <> { payout.productName } <br/> {t('Цена')}: <span className="price">{payout.productCost} BYN </span> </>}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">% {t('от товара')}</h2>
          <p className="list-text">{payout.productPercent === 0 ? '-' : payout.productPercent + '%'}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Доход Сотруд')}</h2>
          <p className="list-text">{payout.staffRevenue} BYN</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Доход Компании')}</h2>
          <p className="list-text">{payout.companyRevenue} BYN</p>
        </td>

      </tr>
    );
  }
}

export default withTranslation('common')(TableSubRow);
