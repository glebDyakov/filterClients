import React, { Component } from 'react';
import { connect } from 'react-redux';
import StaffList from './_components/StaffList';
import '../../public/scss/payroll.scss';
import PayrollDay from './_components/PayrollDay';
import { withTranslation } from 'react-i18next';
import PercentOfSales from './_components/PercentOfSales';
import Hint from '../_components/Hint';
import moment from 'moment';
import { materialActions, payrollActions, servicesActions } from '../_actions';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'payroll',
      selectedStaff: 0,

      settings: {
        MONTHLY_SALARY: {
          amount: 0,
          staffPayoutTypeId: undefined,
        },
        GUARANTEED_SALARY: {
          amount: 0,
          staffPayoutTypeId: undefined,
        },
        SERVICE_PERCENT: {
          amount: 0,
          staffPayoutTypeId: undefined,
        },
        rate: 0,
      },

      serviceGroups: [],
      categories: [],
      products: [],
    };

    this.setTab = this.setTab.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.handleChangeSettings = this.handleChangeSettings.bind(this);
    this.handleSubmitSettings = this.handleSubmitSettings.bind(this);
  }

  componentDidMount() {
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authentication.user && nextProps.authentication.user.profile && nextProps.authentication.user.profile.staffId !== this.state.selectedStaff) {
      this.setState({ selectedStaff: nextProps.authentication.user.profile.staffId }, () => {
        this.initStaffData(this.state.selectedStaff);
      });
    }

    if (nextProps.services.services && JSON.stringify(this.state.serviceGroups) !== JSON.stringify(nextProps.services.services)) {
      this.setState({ serviceGroups: nextProps.services.services });
    }
  }

  queryInitData() {
    this.props.dispatch(servicesActions.get());
    this.props.dispatch(materialActions.getCategories());
    this.props.dispatch(materialActions.getProducts());
  }

  initStaffData(staffId) {
    this.props.dispatch(payrollActions.getPayoutTypes(staffId));
  }

  selectStaff(staffId) {
    this.setState({ selectedStaff: staffId }, () => {
      this.initStaffData(this.state.selectedStaff);
    });
  }

  setTab(tab) {
    this.setState({ activeTab: tab });
  }

  handleSubmitSettings() {
    this.props.dispatch(payrollActions.addPayoutType({
      rate: this.state.settings.rate,
      payoutType: 'MONTHLY_SALARY',
      staffId: this.state.selectedStaff,
      ...this.state.settings.MONTHLY_SALARY,
    }));

    this.props.dispatch(payrollActions.addPayoutType({
      rate: this.state.settings.rate,
      payoutType: 'GUARANTEED_SALARY',
      staffId: this.state.selectedStaff,
      ...this.state.settings.GUARANTEED_SALARY,
    }));

    this.props.dispatch(payrollActions.addPayoutType({
      rate: this.state.settings.rate,
      payoutType: 'SERVICE_PERCENT',
      staffId: this.state.selectedStaff,
      ...this.state.settings.SERVICE_PERCENT,
    }));
  }

  handleChangeSettings(e) {
    if (isNaN(e.target.value)) return;
    if (e.target.value.length < 1) e.target.value = 0;
    switch (e.target.name) {
      case 'GUARANTEED_SALARY':
      case 'SERVICE_PERCENT':
      case 'MONTHLY_SALARY':
        this.setState({
          settings: {
            ...this.state.settings,
            [e.target.name]: {
              ...this.state.settings[e.target.name],
              amount: parseFloat(e.target.value),
            },
          },
        });
        break;
      case 'rate':
        this.setState({
          settings: {
            ...this.state.settings,
            rate: parseFloat(e.target.value),
          },
        });
        break;
    }
  }


  render() {
    const { activeTab } = this.state;
    const { staff, t } = this.props;

    console.log(this.props.services);

    return (
      <div id="payroll" className="d-flex">
        <StaffList selectedStaff={this.state.selectedStaff} selectStaff={this.selectStaff} staffs={staff.staff}/>
        <div className="main-container col p-0">
          <div className="header-nav-tabs">
            <div className="header-tabs-container">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a onClick={() => {
                    this.setTab('payroll');
                  }} className={'nav-link' + (activeTab === 'payroll' ? ' active' : '')}
                  >{t('Расчет зарплат')}</a>
                </li>
                <li className="nav-item">
                  <a onClick={() => {
                    this.setTab('setting');
                  }} className={'nav-link' + (activeTab === 'setting' ? ' active' : '')}
                  >{t('Настройки зарплат')}
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {activeTab === 'payroll' &&
          <div className="payroll-tab">
            <div className="stats-container d-flex">
              <div className="col">
                <h3 className="title">{t('Отработано дней')}:</h3>
                <h2 className="stat">12</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Отработано часов')}:</h3>
                <h2 className="stat">88</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Услуг проведено')}:</h3>
                <h2 className="stat">12</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Сумма услуг')}:</h3>
                <h2 className="stat with-currency">1000 <span className="currency">(BYN)</span></h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Товаров')}:</h3>
                <h2 className="stat">0</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Сумма товаров')}:</h3>
                <h2 className="stat">0</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Доход')}</h3>
                <h2 className="stat">
                  <p className="income">1000 (BYN) {t('сотруд')}.</p>
                  <p className="income">1500 (BYN) {t('компан')}.</p>
                  <br/>
                  <p></p>
                </h2>
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                <tr>
                  <td className="table-header-title">{t('Время начала')}</td>
                  <td className="table-header-title">{t('Время услуги')}</td>
                  <td className="table-header-title">{t('Услуга')}</td>
                  <td className="table-header-title">{t('Товар')}</td>
                  <td className="table-header-title">{t('Цена товара')}</td>
                  <td className="table-header-title">{t('Сумма')}</td>
                  <td className="table-header-title">% {t('от услуги')}</td>
                  <td className="table-header-title">{t('Доход Сотруд')}.</td>
                  <td className="table-header-title">{t('Доход Компании')}</td>
                </tr>
                </thead>
                <tbody>
                <PayrollDay/>
                <PayrollDay/>
                <PayrollDay/>
                <PayrollDay/>
                <PayrollDay/>
                <PayrollDay/>
                <PayrollDay/>
                </tbody>
              </table>
            </div>
          </div>}

          {activeTab === 'setting' &&
          <div className="setting-tab">
            <div className="setting-container">
              <div className="salary-settings">
                <h2 className="settings-title">{t('Настройки зарплаты')}</h2>

                <div className="salary-container">
                  <label className="col"><p>{t('Выбор ставки')}</p>
                    <select onChange={this.handleChangeSettings} value={this.state.settings.rate}
                            className="custom-select mb-0 salary-input" name="rate"
                            id="">
                      <option defaultChecked={true} value="0">{t('Выберите ставку')}</option>
                      <option value="1.5">1.5 ставки - 12 часов</option>
                      <option value="1">1 ставка - 8 часов</option>
                      <option value="0.75">0.75 ставки - 6 часов</option>
                      <option value="0.5">0.5 ставки - 4 часов</option>
                      <option value="0.25">0.25 ставки - 2 часов</option>
                    </select>
                  </label>
                  <label className="col"><p>{t('Оклад за месяц')}</p>
                    <input onChange={this.handleChangeSettings} value={this.state.settings.MONTHLY_SALARY.amount}
                           name="MONTHLY_SALARY"
                           className="salary-input" placeholder={t('Введите оклад')}/>
                  </label>
                  <label className="col"><p>{t('Гарантированный оклад')}<Hint hintMessage={'message'}/></p>

                    <input onChange={this.handleChangeSettings} value={this.state.settings.GUARANTEED_SALARY.amount}
                           name="GUARANTEED_SALARY"
                           className="salary-input" placeholder={t('Введите оклад')}/>
                  </label>
                  <label className="col"><p>% {t('от реализации')}</p>
                    <input onChange={this.handleChangeSettings} value={this.state.settings.SERVICE_PERCENT.amount}
                           name="SERVICE_PERCENT"
                           className="salary-input" min="0" max="100" placeholder="0%"/>
                  </label>
                </div>
                <div className="button-container">
                  <button onClick={this.handleSubmitSettings} disabled={this.state.settings.rate === 0}
                          className="button-save border-0">Сохранить
                  </button>
                </div>

              </div>
              <div className="percent-settings">
                <h2 className="settings-title">{t('Процент от реализации')}</h2>
                <div className="percent-container">
                  <PercentOfSales material={this.props.material} serviceGroups={this.state.serviceGroups}/>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { staff, services, material, authentication } = store;

  return {
    staff,
    services,
    material,
    authentication,
  };
}

export default connect(mapStateToProps)(withTranslation('common')(Index));
