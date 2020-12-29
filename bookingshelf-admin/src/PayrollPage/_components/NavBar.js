import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import DatePicker from '../_pages/PayrollPage/_components/DatePicker';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenDropdown: false,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen() {
    this.setState((state) => ({ isOpenDropdown: !state.isOpenDropdown }));
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClickOutside, false);
  }

  handleClickOutside(event) {
    if ((!this.wrapperRef || !this.wrapperRef.contains(event.target))) {
      this.setState({ isOpenDropdown: false });
    }
  }


  render() {
    const { activeTab, setTab, t } = this.props;

    return (
      <div className="header-nav-tabs">
        <div
          className="header-tabs-container flex-column flex-sm-row d-flex align-items-start align-items-md-center  justify-content-center">
          <ul className="nav mob-hidden nav-tabs">
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

          <div ref={this.setWrapperRef} className='header-tabs-mob desk-hidden'>
            <p onClick={this.handleOpen} className="dropdown-button">{activeTab === 'settings' ? t('Настройки зарплат') : t('Расчет зарплат')}</p>

            {this.state.isOpenDropdown && (
              <ul className="nav nav-tabs dropdown-buttons">
                <li className="nav-item">
                  <a onClick={() => {
                    setTab('');
                    this.handleOpen();
                  }}
                     className={'nav-link'}
                  >{t('Расчет зарплат')}</a>
                </li>
                <li className="nav-item">
                  <a onClick={() => {
                    setTab('settings');
                    this.handleOpen();
                  }}
                     className={'nav-link'}
                  >{t('Настройки зарплат')}
                  </a>
                </li>
              </ul>
            )}
          </div>


          {activeTab === '' &&
          <DatePicker date={this.props.date}
                      handleSelectDate={this.props.handleSelectDate}/>}
        </div>
      </div>
    );
  }
}

export default withTranslation('common')(NavBar);
