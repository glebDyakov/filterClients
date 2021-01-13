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
            className="list-text text-center">{payout.date ? '-' : (moment('1900-01-01 00:00:00').add(payout.durationSec, 'seconds').format('H') + ' ' + t('ч') + ' ' + moment('1900-01-01 00:00:00').add(payout.durationSec, 'seconds').format('mm') + ' ' + t('минут'))}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Услуга')}</h2>
          <p className="list-text">{payout.date ? '-' : (<>{payout.serviceName} <br/> {t('Цена')}: <span
            className="price">{payout.serviceCost.toFixed(2)} BYN</span></>)}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">% {t('от услуги')}</h2>
          <p className="list-text">{payout.date ? '-' : payout.servicePercent + "%"}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Товар')}</h2>
          <p className="list-text">
            {payout.date
              ? <>{payout.productName} <br/> {t('Цена')}: <span className="price">{payout.productCost} BYN </span></>
              : <>{payout.serviceProductPercent === 0 ? '-' : <> {payout.productName}
                <br/> {t('Цена')}: <span className="price">{payout.serviceProductCost} BYN </span> </>}</>}</p>

        </td>
        <td>
          <h2 className="mobile-title desk-hidden">% {t('от товара')}</h2>
          <p
            className="list-text">{payout.date ? <>{payout.productPercent + "%"}</> : <>{payout.serviceProductPercent === 0 ? '-' : payout.serviceProductPercent + '%'}</>}</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Доход Сотруд')}</h2>
          <p className="list-text">{payout.date ? payout.staffProductRevenue.toFixed(2)  : payout.staffServiceRevenue.toFixed(2)} BYN</p>
        </td>
        <td>
          <h2 className="mobile-title desk-hidden">{t('Выручка')} {t('компании')}</h2>
          <p className="list-text">{payout.date ? payout.companyProductRevenue.toFixed(2)  : payout.companyServiceRevenue.toFixed(2)} BYN</p>
        </td>

      </tr>
    );
  }
}

export default withTranslation('common')(TableSubRow);
