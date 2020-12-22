import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PayrollContext from '../../../_context/PayrollContext';

class AnalyticBlock extends Component {
  render() {
    const { analytic } = this.context;
    const { t } = this.props;

    return (
      <div className="stats-container d-flex">
        <div className="col">
          <h3 className="title">{t('Отработано дней')}:</h3>
          <h2 className="stat">{analytic.workedDays ?? 0}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Отработано часов')}:</h3>
          <h2 className="stat">{analytic.workedHours ?? 0}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Услуг проведено')}:</h3>
          <h2 className="stat">{analytic.servicesCount ?? 0}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Сумма услуг')}:</h3>
          <h2 className="stat with-currency">{(analytic.servicesCost ?? 0).toFixed(2)} <span
            className="currency">(BYN)</span></h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Товаров')}:</h3>
          <h2 className="stat">{analytic.productsCount ?? 0}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Сумма товаров')}:</h3>
          <h2 className="stat">{(analytic.productsCost ?? 0).toFixed(2)}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Доход')}</h3>
          <h2 className="stat">
            <p className="income">{(analytic.staffRevenue ?? 0).toFixed(2)} (BYN) {t('сотруд')}.</p>
            <p className="income">{(analytic.companyRevenue ?? 0).toFixed(2)} (BYN) {t('компан')}.</p>
            <br/>
          </h2>
        </div>
      </div>
    );
  }
}

AnalyticBlock.contextType = PayrollContext;

export default withTranslation('common')(AnalyticBlock);
