import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

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
              <a onClick={setTab.bind(null, 'setting')}
                 className={'nav-link' + (activeTab === 'setting' ? ' active' : '')}
              >{t('Настройки зарплат')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withTranslation("common")(NavBar);
