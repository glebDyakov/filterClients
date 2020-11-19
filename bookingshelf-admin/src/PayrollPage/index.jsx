import React, { Component } from 'react';
import { connect } from 'react-redux';
import StaffList from './_components/StaffList';
import '../../public/scss/payroll.scss';
import { access } from '../_helpers/access';
import { DatePicker } from '../_components/DatePicker';
import PayrollDay from './_components/PayrollDay';

class Index extends Component {
  constructor(props) {
    super(props);

  }


  render() {
    return (
      <div id="payroll" className="d-flex">
        <StaffList/>
        <div className="main-container col p-0">
          <div className="header-nav-tabs">
            <div className="header-tabs-container">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a className={'nav-link'}
                  >Расчет зарплат</a>
                </li>
                <li className="nav-item">
                  <a className={'nav-link'}
                  >Настройки зарплат
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="stats-container d-flex">
            <div className="col">
              <h3 className="title">Отработано дней:</h3>
              <h2 className="stat">12</h2>
            </div>
            <div className="col">
              <h3 className="title">Отработано часов:</h3>
              <h2 className="stat">88</h2>
            </div>
            <div className="col">
              <h3 className="title">Услуг проведено:</h3>
              <h2 className="stat">12</h2>
            </div>
            <div className="col">
              <h3 className="title">Сумма услуг:</h3>
              <h2 className="stat with-currency">1000 <span className="currency">(BYN)</span></h2>
            </div>
            <div className="col">
              <h3 className="title">Товаров:</h3>
              <h2 className="stat">0</h2>
            </div>
            <div className="col">
              <h3 className="title">Сумма товаров:</h3>
              <h2 className="stat">0</h2>
            </div>
            <div className="col">
              <h3 className="title">Доход</h3>
              <h2 className="stat">
                <p className="income">1000 (BYN) сотруд.</p>
                <p className="income">1500 (BYN) компан.</p>
                <br/>
                <p></p>
              </h2>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
              <tr>
                <td className="table-header-title">Время <br/>начала</td>
                <td className="table-header-title">Время <br/>услуги</td>
                <td className="table-header-title">Услуга</td>
                <td className="table-header-title">Товар</td>
                <td className="table-header-title">Цена товара</td>
                <td className="table-header-title">Сумма</td>
                <td className="table-header-title">% от <br/>услуги</td>
                <td className="table-header-title">Доход <br/>Сотруд.</td>
                <td className="table-header-title">Доход <br/>Компании</td>
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
        </div>
      </div>
    );
  }
}

export default connect()(Index);
