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
          <td className="weekday-header">
            <div className="open-handler-container">
              <button onClick={this.handleCollapse} className="open-handler"/>
            </div>

            <div className="desk-hidden weekday-container">
              <h2 className="weekday">{capitalize(moment(payout.workDate, 'YYYY-MM-DD').format('dd'))}</h2>
              <p className="weekday-date">{moment(payout.workDate, 'YYYY-MM-DD').format('D MMMM')}</p>
            </div>
          </td>
          <td className="mob-hidden">
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
            <p>{t('Продано товаров')}: {payout.staffProductsAmount}</p>
            <p>{t('Сумма товаров')}: {payout.staffProductsCost} BYN</p>
          </td>
          <td className="income-container" colSpan={4}>
            <p>{t('Доход сотрудника')}: {payout.staffProductsRevenue + payout.staffServiceRevenue} BYN</p>
            <p>{t('Доход компании')}: {payout.staffProductsRevenue + payout.companyServiceRevenue} BYN</p>
          </td>

            {this.state.isOpen &&
            payout.appointmentsSalary.map((ps, index) => <TableSubRow className="desk-hidden" key={index} payout={ps}/>)}
        </tr>


          {this.state.isOpen &&
          payout.appointmentsSalary.map((ps, index) => <TableSubRow className="mob-hidden" key={index} payout={ps}/>)}
      </>
    );
  }
}

export default withTranslation('common')(TableRow);
