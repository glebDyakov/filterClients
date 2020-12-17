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
import DayPicker, { DateUtils } from 'react-day-picker';
import { getWeekRange } from '../_helpers';
import { getWeekDays } from '../StaffPage';
import MomentLocaleUtils from 'react-day-picker/moment';

class Index extends Component {
  constructor(props) {
    super(props);

    console.log("TAB", props.match.params.activeTab);
    if (props.match.params.activeTab &&
      props.match.params.activeTab !== 'setting' &&
      props.match.params.activeTab !== ''
    ) {
      props.history.push('/nopage');
    }

    this.state = {
      activeTab: 'payroll',
      selectedStaff: 0,

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

      isOpenedDatePicker: false,

      selectedDays: getWeekDays(getWeekRange(moment().subtract(7, 'days').format()).from),
      from: moment().subtract(7, 'days').startOf('day').utc().toDate(),
      to: moment().toDate(),
      enteredTo: moment().toDate(),

      serviceGroups: [],
      categories: [],
      products: [],

      payoutByPeriod: [],

      percentServices: [],
      percentServiceGroups: [],
      percentProducts: [],

      analytic: {
        companyRevenue: 0,
        productsCost: 0,
        productsCount: 0,
        servicesCost: 0,
        servicesCount: 0,
        staffRevenue: 0,
        workedDays: 0,
        workedHours: 0,
      },
    };

    this.setTab = this.setTab.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.handleChangeSettings = this.handleChangeSettings.bind(this);
    this.handleSubmitSettings = this.handleSubmitSettings.bind(this);

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleSubmitPercents = this.handleSubmitPercents.bind(this);
    this.handleOpenCalendar = this.handleOpenCalendar.bind(this);
    this.submitProduct = this.submitProduct.bind(this);

  }

  componentDidMount() {
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }

    if (this.props.authentication.user) {
      this.setState({ selectedStaff: this.props.authentication.user.profile.staffId }, () => {
        this.initStaffData(this.state.selectedStaff);
      });
    }

    document.addEventListener('mousedown', this.handleClickOutsideCalendar);

    initializeJs();
  }

  submitProduct(productId, percent) {
    const product = {
      productId,
      percent,
      staffId: this.state.selectedStaff,
    };

    this.props.dispatch(payrollActions.updateOneProductPercent(this.state.selectedStaff, [product]));
  }

  submitService(serviceId, percent) {
    const service = {
      serviceId,
      percent,
      staffId: this.state.selectedStaff,
    };

    this.props.dispatch(payrollActions.updateOneServicePercent(this.state.selectedStaff, [service]));
  }


  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutsideCalendar);
  }

  handleClickOutsideCalendar(event) {
    if (this.calendarRef && !this.calendarRef.current.contains(event.target)) {
      this.setState({
        isOpenedDatePicker: false,
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.authentication.loginChecked !== nextProps.authentication.loginChecked) {
      this.queryInitData();

      if (nextProps.authentication.user) {
        this.setState({ selectedStaff: nextProps.authentication.user.profile.staffId }, () => {
          this.initStaffData(this.state.selectedStaff);
        });
      }
    }

    if (JSON.stringify(this.props.authentication.user) !== JSON.stringify(nextProps.authentication.user)) {
      this.setState({ selectedStaff: nextProps.authentication.user.profile.staffId }, () => {
        this.initStaffData(this.state.selectedStaff);
      });
    }

    if (JSON.stringify(this.props.payroll.payoutByPeriod) !== JSON.stringify(nextProps.payroll.payoutByPeriod)) {
      this.setState({
        payoutByPeriod: nextProps.payroll.payoutByPeriod,
      });
    }

    if (JSON.stringify(this.props.payroll.percentServiceGroups) !== JSON.stringify(nextProps.payroll.percentServiceGroups)) {
      this.setState({
        percentServiceGroups: nextProps.payroll.percentServiceGroups,
      });
    }
    if (JSON.stringify(this.props.payroll.percentServices) !== JSON.stringify(nextProps.payroll.percentServices)) {
      this.setState({
        percentServices: nextProps.payroll.percentServices,
      });
    }
    if (JSON.stringify(this.props.payroll.percentProducts) !== JSON.stringify(nextProps.payroll.percentProducts)) {
      this.setState({
        percentProducts: nextProps.payroll.percentProducts,
      });
    }

    if (JSON.stringify(this.props.payroll.payoutTypes) !== JSON.stringify(nextProps.payroll.payoutTypes)) {
      let rate = 0;
      const settings = nextProps.payroll.payoutTypes.reduce((acc, payout) => {
        acc[payout.payoutType] = {
          amount: payout.amount,
          staffId: payout.staffId,
          staffPayoutTypeId: payout.staffPayoutTypeId,
        };

        rate = payout.rate;
        return acc;
      }, {});

      this.setState({
        rate,
        settings,
      });
    }

    if (nextProps.services && (JSON.stringify(this.props.services) !== JSON.stringify(nextProps.services))) {
      this.setState({ serviceGroups: nextProps.services.services });
    }

    if (JSON.stringify(this.props.payroll.analytic) !== JSON.stringify(nextProps.payroll.analytic)) {
      this.setState({
        analytic: nextProps.payroll.analytic,
      });
    }
  }

  queryInitData() {
    this.props.dispatch(servicesActions.get());
    this.props.dispatch(materialActions.getCategories());
    this.props.dispatch(materialActions.getProducts());
  }

  initStaffData(staffId, from = this.state.from, to = this.state.to) {
    this.props.dispatch(payrollActions.getPayoutTypes(staffId));
    this.props.dispatch(payrollActions.getPercentProducts(staffId));
    this.props.dispatch(payrollActions.getPercentServiceGroups(staffId));
    this.props.dispatch(payrollActions.getPercentServices(staffId));

    console.log(this.state.from);

    this.props.dispatch(payrollActions.getPayoutAnalytic(staffId, moment(from).format('x'), moment(to).format('x')));
    this.props.dispatch(payrollActions.getPayoutByPeriod(staffId, moment(from).format('x'), moment(to).format('x')));
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
    const settings = Object.keys(this.state.settings).map((type) => {
      return {
        ...this.state.settings[type],
        rate: this.state.rate,
        payoutType: type,
        staffId: this.state.selectedStaff,
      };
    });
    this.props.dispatch(payrollActions.addPayoutTypes(this.state.selectedStaff, settings));
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
          rate: parseFloat(e.target.value),
        });
        break;
    }
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
    }
  }

  handleOpenCalendar() {
    this.setState((state) => {
      return {
        isOpenedDatePicker: !state.isOpenedDatePicker,
      };
    });
  }

  handleDayClick(day) {
    const { from, to } = this.state;
    if (from && to && day >= from && day <= to) {
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        ...this.state,
        from: day,
        to: null,
        enteredTo: day,
      });
    } else {
      this.setState({
        ...this.state,
        to: day,
        enteredTo: day,
      }, () => {
        this.props.dispatch(payrollActions.getPayoutAnalytic(this.state.selectedStaff, moment(this.state.from).format('x'), moment(this.state.to).format('x')));
        this.props.dispatch(payrollActions.getPayoutByPeriod(this.state.selectedStaff, moment(this.state.from).format('x'), moment(this.state.to).format('x')));
      });
    }
  }


  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleResetClick() {
    this.setState({
      ...this.state, from: null,
      to: null,
      enteredTo: null,
    });
  }

  handleSubmitPercents(type, arr) {
    switch (type) {
      case 'percentServiceGroups':
        const percentServiceGroups = arr.map(psg => {
          return {
            ...psg,
            staffId: this.state.selectedStaff,
          };
        });
        this.props.dispatch(payrollActions.updatePercentServiceGroups(this.state.selectedStaff, percentServiceGroups));
        break;
      case 'percentServices':
        const percentServices = arr.map(ps => {
          return {
            ...ps,
            staffId: this.state.selectedStaff,
          };
        });
        this.props.dispatch(payrollActions.updatePercentServices(this.state.selectedStaff, percentServices));
        break;
      case 'percentProducts':
        const percentProducts = arr.map(pp => {
          return {
            ...pp,
            staffId: this.state.selectedStaff,
          };
        });
        this.props.dispatch(payrollActions.updatePercentProducts(this.state.selectedStaff, percentProducts));
        break;
    }
  }

  render() {
    const { activeTab, analytic } = this.state;
    const { staff, t } = this.props;

    const { from, to, enteredTo } = this.state;
    const modifiersClosed = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDaysClosed = [from, { from, to: enteredTo }];


    return (
      <div id="payroll" className="d-flex">
        <StaffList selectedStaff={this.state.selectedStaff} selectStaff={this.selectStaff} staffs={staff.staff}/>
        <div className="main-container col p-0">
          <div className="header-nav-tabs">
            <div className="header-tabs-container d-flex align-items-center justify-content-center">
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
              {this.state.activeTab === 'payroll' &&
              <div className="calendar">
                <div onClick={this.handleOpenCalendar} className="button-calendar">
                  <input type="button" data-range="true"
                         value={
                           (from && from !== 0 ? moment(from).format('dd, DD MMMM YYYY') : '') +
                           (to ? ' - ' + moment(to).format('dd DD MMMM') : '')
                         }
                         data-multiple-dates-separator=" - " name="date"
                         ref={(input) => this.startClosedDate = input}/>
                </div>

                {this.state.isOpenedDatePicker &&
                <DayPicker
                  ref={(node) => this.calendarRef = node}
                  className="SelectedWeekExample"
                  fromMonth={from}
                  selectedDays={selectedDaysClosed}
                  disabledDays={[disabledDays, { after: moment().utc().toDate() }]}
                  modifiers={modifiersClosed}
                  onDayClick={this.handleDayClick}
                  onDayMouseEnter={this.handleDayMouseEnter}
                  localeUtils={MomentLocaleUtils}
                  locale={this.props.i18n.language}
                />}
              </div>}


            </div>
          </div>

          {activeTab === 'payroll' &&
          <div className="payroll-tab">
            <div className="stats-container d-flex">
              <div className="col">
                <h3 className="title">{t('Отработано дней')}:</h3>
                <h2 className="stat">{analytic.workedDays}</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Отработано часов')}:</h3>
                <h2 className="stat">{analytic.workedHours}</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Услуг проведено')}:</h3>
                <h2 className="stat">{analytic.servicesCount}</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Сумма услуг')}:</h3>
                <h2 className="stat with-currency">{analytic.servicesCost.toFixed(2)} <span
                  className="currency">(BYN)</span></h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Товаров')}:</h3>
                <h2 className="stat">{analytic.productsCount}</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Сумма товаров')}:</h3>
                <h2 className="stat">{analytic.productsCost.toFixed(2)}</h2>
              </div>
              <div className="col">
                <h3 className="title">{t('Доход')}</h3>
                <h2 className="stat">
                  <p className="income">{analytic.staffRevenue.toFixed(2)} (BYN) {t('сотруд')}.</p>
                  <p className="income">{analytic.companyRevenue.toFixed(2)} (BYN) {t('компан')}.</p>
                  <br/>
                  <p></p>
                </h2>
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                <tr>
                  <td className="table-header-title text-center">{t('Время начала')}</td>
                  <td className="table-header-title text-center">{t('Время услуги')}</td>
                  <td className="table-header-title">{t('Услуга')}</td>
                  <td className="table-header-title">% {t('от услуги')}</td>
                  <td className="table-header-title">{t('Товар')}</td>
                  <td className="table-header-title">% {t('от товара')}</td>
                  <td className="table-header-title">{t('Доход Сотруд')}.</td>
                  <td className="table-header-title">{t('Доход Компании')}</td>
                </tr>
                </thead>
                <tbody>
                {!this.props.payroll.isLoadingPeriod && !this.props.payroll.isLoadingPayoutStats ? this.state.payoutByPeriod.map(pb => {
                    return (
                      <PayrollDay payout={pb}/>
                    );
                  }) :
                  <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                            alt=""/>
                  </div>}
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
                    <select onChange={this.handleChangeSettings} value={this.state.rate || 0}
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
                    <input onChange={this.handleChangeSettings}
                           value={this.state.settings.MONTHLY_SALARY && this.state.settings.MONTHLY_SALARY.amount || 0}
                           name="MONTHLY_SALARY"
                           className="salary-input" placeholder={t('Введите оклад')}/>
                  </label>
                  <label className="col"><p>{t('Гарантированный оклад')}<Hint hintMessage={'message'}/></p>

                    <input onChange={this.handleChangeSettings}
                           value={this.state.settings.GUARANTEED_SALARY && this.state.settings.GUARANTEED_SALARY.amount || 0}
                           name="GUARANTEED_SALARY"
                           className="salary-input" placeholder={t('Введите оклад')}/>
                  </label>
                  <label className="col"><p>% {t('от реализации')}</p>
                    <input onChange={this.handleChangeSettings}
                           value={this.state.settings.SERVICE_PERCENT && this.state.settings.SERVICE_PERCENT.amount || 0}
                           name="SERVICE_PERCENT"
                           className="salary-input" min="0" max="100" placeholder="0%"/>
                  </label>
                </div>
                <div className="button-container">
                  {this.props.payroll.statusSavePayouttypes === 200 &&
                  <p className="alert-success p-1 rounded pl-3 mb-2">{t("Сохранено")}</p>}
                  <button onClick={this.handleSubmitSettings} disabled={this.state.rate === 0}
                          className={"button-save border-0" + (this.state.rate === 0 ? " disabledField" : '')}>Сохранить
                  </button>


                </div>

              </div>
              <div className="percent-settings">
                <h2 className="settings-title">{t('Процент от реализации')}</h2>
                <div className="percent-container">
                  {this.props.payroll.percentServices && this.props.payroll.percentServiceGroups &&
                  <PercentOfSales servicesPercent={this.state.percentServices}
                                  serviceGroupsPercent={this.state.percentServiceGroups}
                                  productsPercent={this.state.percentProducts}
                                  material={this.props.material}
                                  serviceGroups={this.state.serviceGroups}
                                  handleSubmitPercents={this.handleSubmitPercents}
                                  submitProduct={this.submitProduct}
                                  staffId={this.state.selectedStaff}/>}

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
  const { staff, payroll, services, material, authentication } = store;

  return {
    staff,
    payroll,
    services,
    material,
    authentication,
  };
}

export default connect(mapStateToProps)(withTranslation('common')(Index));
