import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Hint from '../../../../_components/Hint';
import IntervalInput from '../../../_components/timeoutElements/IntervalInput';
import IntervalSelect from '../../../_components/timeoutElements/IntervalSelect';
import SettingContext from '../../../_context/SettingContext';

class SalarySettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        MONTHLY_SALARY: {
          amount: 0,
        },
        GUARANTEED_SALARY: {
          amount: 0,
        },
        SERVICE_PERCENT: {
          amount: 0,
        },
      },
      rate: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRate = this.handleChangeRate.bind(this);
    this.handleSubmitType = this.handleSubmitType.bind(this);
  }

  componentDidMount() {
    const { payoutTypes } = this.context;
    this.setState((state) => ({
      settings: payoutTypes.reduce((acc, payout) => {
        acc[payout.payoutType] = {
          amount: payout.amount,
          staffId: payout.staffId,
          staffPayoutTypeId: payout.staffPayoutTypeId,
        };
        return acc;
      }, state.settings),
      rate: payoutTypes.reduce((number, type) => type.rate, 0),
    }));
  }

  // TODO:


  handleChange(e) {
    const { value, name } = e.target;

    if (isNaN(value) && value !== '') return;
    if (parseFloat(value) >= 0 || value === '') {
      this.setState((state) => ({
        settings: {
          ...state.settings,
          [name]: {
            amount: parseFloat(value),
          },
        },
      }));
    }
  }

  handleChangeRate(e) {
    if (isNaN(e.target.value)) return;
    this.setState({ rate: parseFloat(e.target.value) });
  }

  // TODO:

  handleSubmitType(type) {
    const { updatePayoutType } = this.context;
    const payoutType = this.state.settings[type];

    if (isNaN(payoutType.amount)) return;

    console.log(payoutType.amount);

    const rqPayoutType = {
      ...payoutType,
      payoutType: type,
      rate: this.state.rate,
    };

    updatePayoutType(rqPayoutType);
  }

  render() {
    const { t } = this.props;
    const { rate } = this.state;

    const { MONTHLY_SALARY, GUARANTEED_SALARY, SERVICE_PERCENT } = this.state.settings;

    return (
      <div className="salary-settings">
        <h2 className="settings-title">{t('Настройки зарплаты')}</h2>
        <div className="salary-container">
          <label className="col"><p>{t('Выбор ставки')}</p>
            <IntervalSelect value={rate}
                            changeEvent={this.handleChangeRate}
                            className="custom-select mb-0 salary-input"
                            name="rate">
              <option defaultChecked={true} value="0">{t('Выберите ставку')}</option>
              <option value="1.5">1.5 ставки - 12 часов</option>
              <option value="1">1 ставка - 8 часов</option>
              <option value="0.75">0.75 ставки - 6 часов</option>
              <option value="0.5">0.5 ставки - 4 часов</option>
              <option value="0.25">0.25 ставки - 2 часов</option>
            </IntervalSelect>
          </label>
          <label className="col"><p>{t('Оклад за месяц')}</p>
            <IntervalInput value={MONTHLY_SALARY.amount}
                           action={this.handleSubmitType}
                           type="number"
                           changeEvent={this.handleChange}
                           name="MONTHLY_SALARY"
                           className="salary-input"
                           disabled={this.state.rate === 0}
                           placeholder={t('Введите оклад')}/>
          </label>
          <label className="col"><p>{t('Гарантированный оклад')}<Hint hintMessage={'message'}/></p>
            <IntervalInput value={GUARANTEED_SALARY.amount}
                           type="number"
                           action={this.handleSubmitType}
                           changeEvent={this.handleChange}
                           name="GUARANTEED_SALARY"
                           className="salary-input"
                           disabled={this.state.rate === 0}
                           placeholder={t('Введите оклад')}/>
          </label>
          <label className="col">
            <p>% {t('от реализации')}</p>
            <IntervalInput value={SERVICE_PERCENT.amount}
                           type="number"
                           changeEvent={this.handleChange}
                           action={this.handleSubmitType}
                           className="salary-input"
                           min="0"
                           max="100"
                           disabled={this.state.rate === 0}
                           placeholder="0%"
                           name="SERVICE_PERCENT"/>
          </label>
        </div>
        {this.context.updatePayoutTypeStatus === 200 &&
        <p className="alert-success p-1 rounded pl-3 mb-2">{t('Сохранено')}</p>}
      </div>
    );
  }
}

SalarySettings.contextType = SettingContext;

export default withTranslation('common')(SalarySettings);
