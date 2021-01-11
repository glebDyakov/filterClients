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
      nestedItems: [],
    };

    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse() {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  }

  componentDidMount() {
    const { appointmentsSalary, productsSalary } = this.props.payout;
    this.setState({
      nestedItems: [
        ...appointmentsSalary,
        ...productsSalary.map(ps => ({ ...ps, dateStart: ps.date })),
      ].sort((a, b) => a.dateStart - b.dateStart),
    });
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
              <h2 className="weekday">{capitalize(moment(payout.date, 'YYYY-MM-DD').format('dd'))}</h2>
              <p className="weekday-date">{moment(payout.date, 'YYYY-MM-DD').format('D MMMM')}</p>
            </div>
          </td>
          <td className="mob-hidden">
            <div className="weekday-container">
              <h2 className="weekday">{capitalize(moment(payout.date, 'YYYY-MM-DD').format('dd'))}</h2>
              <p className="weekday-date">{moment(payout.date, 'YYYY-MM-DD').format('D MMMM')}</p>
            </div>
          </td>
          <td className="service-container" colSpan={2}>
            <p>{t('Услуг оказано')}: {payout.servicesAmount}</p>
            <p>{t('Сумма услуг')}: {payout.servicesCost.toFixed(2)} BYN</p>
          </td>
          <td className="product-container" colSpan={2}>
            <p>{t('Продано товаров')}: {payout.productsAmount}</p>
            <p>{t('Сумма товаров')}: {payout.productsCost.toFixed(2)} BYN</p>
          </td>
          <td className="income-container" colSpan={2}>
            <p>{t('Доход сотрудника')}: {(payout.staffProductsRevenue + payout.staffServiceRevenue).toFixed(2)} BYN</p>
            <p>{t('Выручка')}: {(payout.companyProductsRevenue + payout.companyServiceRevenue).toFixed(2)} BYN</p>
          </td>

          {this.state.isOpen &&
          this.state.nestedItems.map((ps, index) => <TableSubRow className="desk-hidden" key={index} payout={ps}/>)}
        </tr>


        {this.state.isOpen &&
        this.state.nestedItems.map((ps, index) => <TableSubRow className="mob-hidden" key={index} payout={ps}/>)}
      </>
    );
  }
}

export default withTranslation('common')(TableRow);
