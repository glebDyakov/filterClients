import React, { Component } from 'react';
import capitalize from 'react-bootstrap/lib/utils/capitalize';
import moment from 'moment';
import TableSubRow from './TableSubRow';
import { withTranslation } from 'react-i18next';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse() {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  }

  render() {
    const { payout, t } = this.props;
    const { isOpen } = this.state;

    return (
      <>
        <tr className={'payroll-day' + (this.state.isOpen ? ' opened' : '')}>
          <td>
            <div className="open-handler-container">
              <button onClick={this.handleCollapse} className="open-handler"/>
            </div>
          </td>
          <td>
            <div className="weekday-container">
              <h2 className="weekday">{capitalize(moment(payout.workDate, 'YYYY-MM-DD').format('dd'))}</h2>
              <p className="weekday-date">{moment(payout.workDate, 'YYYY-MM-DD').format('D MMMM')}</p>
            </div>
          </td>
          <td className="service-container">
            <p>{t('Услуг оказано')}: {payout.servicesAmount}</p>
            <p>{t('Сумма услуг')}: {payout.servicesCost} BYN</p>
          </td>
          <td className="product-container">
            <p>{t('Продано товаров')}: {payout.productsAmount}</p>
            <p>{t('Сумма товаров')}: {payout.servicesCost} BYN</p>
          </td>
          <td className="income-container" colSpan={4}>
            <p>{t('Доход сотрудника')}: {payout.staffRevenue} BYN</p>
            <p>{t('Доход компании')}: {payout.companyRevenue} BYN</p>
          </td>
        </tr>

        {this.state.isOpen &&
        payout.periodsSalary.map((ps, index) => <TableSubRow key={index} payout={ps}/>)}
      </>
    );
  }
}

export default withTranslation('common')(TableRow);
