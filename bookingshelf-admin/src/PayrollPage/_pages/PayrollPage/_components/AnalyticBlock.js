import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PayrollContext from '../../../_context/PayrollContext';
import Hint from '../../../../_components/Hint';
import moment from 'moment';

class AnalyticBlock extends Component {
  render() {
    const { analytic } = this.context;
    const { t } = this.props;

    return (
      <div className="stats-container d-flex">
        <div className="col">
          <h3 className="title">{t('Рабочих')} {t('дней')}:<Hint
            hintMessage={t('Количество дней по рабочему графику.')}/></h3>
          <h2 className="stat position-relative">{analytic.workedDays ?? 0}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Рабочих часов')}:</h3>
          <h2 className="stat">{analytic.workedHours ?? 0}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Часов на услуги')}:</h3>
          <h2
            className="stat">{analytic.appointmentsTimeAmount ? moment.duration(analytic.appointmentsTimeAmount, 'millisecond').asHours().toFixed(1) : 0}</h2>
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
          <h3 className="title">{t('Товаров продано')}:</h3>
          <h2 className="stat">{analytic.productsCount ?? 0}</h2>
        </div>
        <div className="col">
          <h3 className="title">{t('Сумма товаров')}:</h3>
          <h2 className="stat with-currency">{(analytic.productsCost ?? 0).toFixed(2)} <span
            className="currency">(BYN)</span></h2>
        </div>
        <div className="col">
          <h3 className="title staff-revenue">{t('Доход сотрудника')}:</h3>
          {/*<h2 className="stat">*/}
            <p className="income">{(analytic.staffRevenue ?? 0).toFixed(2)} (BYN)</p>
          {/*</h2>*/}

          <h3 className="title company-revenue">{t('Выручка')} {t('компании')}:</h3>
          {/*<h2 className="stat">*/}
            <p className="income">{(analytic.companyRevenue ?? 0).toFixed(2)} (BYN)</p>
          {/*</h2>*/}
        </div>
      </div>
    );
  }
}

AnalyticBlock.contextType = PayrollContext;

export default withTranslation('common')(AnalyticBlock);
