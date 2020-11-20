import React, { Component } from 'react';
import { connect } from 'react-redux';
import StaffList from './_components/StaffList';
import '../../public/scss/payroll.scss';
import PayrollDay from './_components/PayrollDay';
import { withTranslation } from 'react-i18next';
import PercentOfSales from './_components/PercentOfSales';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'payroll',
    };

    this.setTab = this.setTab.bind(this);
  }

  setTab(tab) {
    this.setState({ activeTab: tab });
  }


  render() {
    const { activeTab } = this.state;
    const { t } = this.props;

    return (
      <div id="payroll" className="d-flex">
        <StaffList/>
        <div className="main-container col p-0">
          <div className="header-nav-tabs">
            <div className="header-tabs-container">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a onClick={() => {
                    this.setTab('payroll');
                  }} className={'nav-link' + (activeTab === 'payroll' ? ' active' : '')}
                  >{t("Расчет зарплат")}</a>
                </li>
                <li className="nav-item">
                  <a onClick={() => {
                    this.setTab('setting');
                  }} className={'nav-link' + (activeTab === 'setting' ? ' active' : '')}
                  >{t("Настройки зарплат")}
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {activeTab === 'payroll' &&
          <div className="payroll-tab">
            <div className="stats-container d-flex">
              <div className="col">
                <h3 className="title">{t("Отработано дней")}:</h3>
                <h2 className="stat">12</h2>
              </div>
              <div className="col">
                <h3 className="title">{t("Отработано часов")}:</h3>
                <h2 className="stat">88</h2>
              </div>
              <div className="col">
                <h3 className="title">{t("Услуг проведено")}:</h3>
                <h2 className="stat">12</h2>
              </div>
              <div className="col">
                <h3 className="title">{t("Сумма услуг")}:</h3>
                <h2 className="stat with-currency">1000 <span className="currency">(BYN)</span></h2>
              </div>
              <div className="col">
                <h3 className="title">{t("Товаров")}:</h3>
                <h2 className="stat">0</h2>
              </div>
              <div className="col">
                <h3 className="title">{t("Сумма товаров")}:</h3>
                <h2 className="stat">0</h2>
              </div>
              <div className="col">
                <h3 className="title">{t("Доход")}</h3>
                <h2 className="stat">
                  <p className="income">1000 (BYN) {t("сотруд")}.</p>
                  <p className="income">1500 (BYN) {t("компан")}.</p>
                  <br/>
                  <p></p>
                </h2>
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                <tr>
                  <td className="table-header-title">{t("Время начала")}</td>
                  <td className="table-header-title">{t("Время услуги")}</td>
                  <td className="table-header-title">{t("Услуга")}</td>
                  <td className="table-header-title">{t("Товар")}</td>
                  <td className="table-header-title">{t("Цена товара")}</td>
                  <td className="table-header-title">{t("Сумма")}</td>
                  <td className="table-header-title">% {t("от услуги")}</td>
                  <td className="table-header-title">{t("Доход Сотруд")}.</td>
                  <td className="table-header-title">{t("Доход Компании")}</td>
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
                <h2 className="settings-title">{t("Настройки зарплаты")}</h2>

                <div className="salary-container">
                  <label className="col">{t("Выбор ставки")}
                    <select className="custom-select mb-0 salary-input" name="" id="">
                      <option defaultChecked={true} value="0">{t('Выберите ставку')}</option>
                      <option value="test">test</option>
                    </select>
                  </label>
                  <label className="col">{t("Оклад за месяц")}
                    <input className="salary-input" type="number" placeholder={t('Введите оклад')}/>
                  </label>
                  <label className="col">{t("Гарантированный оклад")}
                    <input className="salary-input" type="number" placeholder={t('Введите оклад')}/>
                  </label>
                  <label className="col">% {t("от реализации")}
                    <input className="salary-input" type="number" min="0" max="100" placeholder="0%"/>
                  </label>
                </div>
              </div>
              <div className="percent-settings">
                <h2 className="settings-title">{t("Процент от реализации")}</h2>
                <div className="percent-container">
                  <PercentOfSales/>
                  <PercentOfSales/>
                  <PercentOfSales/>
                  <PercentOfSales/>
                  <PercentOfSales/>
                  <PercentOfSales/>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

export default connect()(withTranslation("common")(Index));
