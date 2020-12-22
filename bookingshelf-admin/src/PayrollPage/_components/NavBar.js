import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import DatePicker from '../_pages/PayrollPage/_components/DatePicker';

class NavBar extends Component {
  render() {
    const { activeTab, setTab, t } = this.props;

    return (
      <div className="header-nav-tabs">
        <div className="header-tabs-container d-flex align-items-center justify-content-center">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a onClick={setTab.bind(null, '')}
                 className={'nav-link' + (activeTab === '' ? ' active' : '')}
              >{t('Расчет зарплат')}</a>
            </li>
            <li className="nav-item">
              <a onClick={setTab.bind(null, 'settings')}
                 className={'nav-link' + (activeTab === 'settings' ? ' active' : '')}
              >{t('Настройки зарплат')}
              </a>
            </li>
          </ul>
          {activeTab === '' &&
          <DatePicker date={this.props.date}
                      handleSelectDate={this.props.handleSelectDate}/>}
        </div>
      </div>
    );
  }
}

export default withTranslation('common')(NavBar);
