import React, { Component } from 'react';
import PayrollDayNestedItem from './PayrollDayNestedItem';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import capitalize from 'react-bootstrap/lib/utils/capitalize';

class PayrollDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
      payout: props.payout
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

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.payout) !== JSON.stringify(nextProps.payout)) {
      this.setState({
        payout: nextProps.payout,
      });
    }
  }

  render() {
    const { t } = this.props;
    const { payout } = this.state;

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
        {this.state.isOpened &&
        payout.periodsSalary.map(ps => <PayrollDayNestedItem payout={ps}/>)
        }
      </React.Fragment>
    );
  }
}

export default withTranslation('common')(PayrollDay);
