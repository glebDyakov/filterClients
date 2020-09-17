import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
// import {calendarActions, companyActions, menuActions, userActions, staffActions, clientActions} from "../_actions";
// import moment from "moment";
// import Link from "react-router-dom/es/Link";
// import classNames from "classnames";
// import {UserSettings} from "./modals/UserSettings";
// import {HeaderMain} from "./HeaderMain";
// import AppointmentFromSocket from "./modals/AppointmentFromSocket";
import '../../../public/scss/managers-settings.scss';
import ReactPhoneInput from 'react-phone-input-2';
import { isValidNumber } from 'libphonenumber-js';
import moment from './AddAppointment';
import Hint from '../Hint';
import InputCounter from '../InputCounter';
import {
  calendarActions, clientActions, companyActions, staffActions, userActions,
} from '../../_actions';
import { isValidEmailAddress } from '../../_helpers/validators';
import {compose} from "redux";
import {withTranslation} from "react-i18next";


class ManagerSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        senderEmail: '',
        senderName: '',
        senderPhone: '',
        text: '',
      },
      messageIsSentModalOpen: false,
    };

    this.addManager = this.addManager.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.setterPhone = this.setterPhone.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleMessageIsSentModal = this.handleMessageIsSentModal.bind(this);
    this.handleChangeTheme = this.handleChangeTheme.bind(this);
    this.handleChangeLang = this.handleChangeLang.bind(this);
  }


  componentDidMount() {
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
    document.addEventListener('mousedown', this.handleClickOutside);
  }


  handleMessageIsSentModal() {
    if (this.state.messageIsSentModalOpen) {
      this.setState({ messageIsSentModalOpen: false });
    } else {
      this.setState({ messageIsSentModalOpen: true });
      setTimeout(() => {
        this.setState({ messageIsSentModalOpen: false });
      }, 2000);

      this.setState({ message: { senderEmail: '', senderName: '', senderPhone: '', text: '' } });
    }
  }


  queryInitData() {
    this.props.dispatch(calendarActions.getManagers());
    this.props.dispatch(companyActions.getSubcompanies());
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }
  }

  setterPhone(phone) {
    const { message } = this.state;
    this.setState({ message: { ...message, senderPhone: phone.replace(/[()\- ]/g, '') } });
  }

  handleChangeTheme(newTheme) {
    console.log(this.props.company.subcompanies[0]);

    this.props.dispatch(companyActions.changeTheme(newTheme));

    this.props.dispatch(companyActions.updateSubcompany({
      ...this.props.company.subcompanies[0],
      lightTheme: newTheme,
    }, 'isFirstScreenLoading'));
  }

  handleChangeLang(lang) {
    const { staff, authentication } = this.props;
    this.props.i18n.changeLanguage(lang);

    const activeStaff = staff && staff.find((item) =>
        ((item.staffId) === (authentication.user && authentication.user.profile && authentication.user.profile.staffId)));

    const body = JSON.parse(JSON.stringify(activeStaff));
    body.languageCode = lang.toUpperCase();
    this.props.dispatch(staffActions.update(JSON.stringify([body]), activeStaff.staffId));

  }

  addManager() {
    const manager = {
      'email': 'alex@gmail.com',
      'firstName': 'Alex',
      'imageBase64': 'test',
      'lastName': 'Marty',
      'phone1': '+375298170912',
      'phone2': '+375298170913',
    };
    this.props.dispatch(calendarActions.addManager(JSON.stringify(manager)));
  }

  sendMessage() {
    const { message } = this.state;
    message.senderPhone = message.senderPhone.startsWith('+') ? message.senderPhone : `+${message.senderPhone}`;
    this.props.dispatch(calendarActions.sendMessage(message));

    this.handleMessageIsSentModal();
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { message } = this.state;

    this.setState({ message: { ...message, [name]: value } });
  }

  closeModal() {
    const { onClose } = this.props;

    return onClose();
  }


  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeModal();
    }
  }

  render() {
    const { managers } = this.props.calendar;
    const { message } = this.state;
    const {t} = this.props;


    return (
      <div className="managers-settings-wrapper">
        <div ref={this.setWrapperRef} className="managers-settings">
          <div className="modal-header">
            <h4>{t("Настройки")}</h4>
            <button type="button" className="close"
              onClick={this.closeModal}
            />

          </div>
          <div className="theme-block">
            <h5>{t("Выберите тему")}:</h5>
            <p>{t("Белая")}</p>
            <div onClick={() => {
              this.handleChangeTheme(true);
            }} className="screen white"></div>
            <p>{t("Темная")}</p>
            <div onClick={() => {
              this.handleChangeTheme(false);
            }} className="screen black"></div>
          </div>

          <div className="theme-block lang-block">
            <h5>Выберите язык</h5>
            <select value={this.props.i18n.language} onChange={(e) => {
              this.handleChangeLang(e.target.value);
            }} className="custom-select">

              <option value="RU">Русский</option>
              <option value="PL">Польский</option>
              <option value="EN">Английский</option>
              <option value="UA">Украинский</option>
            </select>
          </div>

          {/* <div className="manager-block">*/}
          {/*    <h5>Ваш менеджер</h5>*/}
          {/*    <div className="contact">*/}
          {/*                <span className="abbreviation">*/}
          {/*                </span>*/}
          {/*        <p className="manager-name">*/}
          {/*            /!*{((managers[0] && managers[0].firstName) ? managers[0].firstName : 'Имя') + ' ' + ((managers[0] && managers[0].lastName) ?  managers[0].lastName : 'Фамилия')}*!/*/}
          {/*            Скригаловский Андрей*/}
          {/*        </p>*/}
          {/*        <p className="manager-questions">Ответит на ваши вопросы</p>*/}
          {/*    </div>*/}
          {/*    /!*{managers[0] && managers[0].phone1 && <div className="phone contact-details"><span className="phone_logo"></span><p>{managers[0].phone1 ? managers[0].phone1 : ''}</p></div>}*!/*/}
          {/*    /!*{managers[0] && managers[0].phone2 && <div className="phone contact-details"><span className="phone_logo"></span><p>{managers[0].phone2 ? managers[0].phone2 : ''}</p></div>}*!/*/}
          {/*    /!*{managers[0] && managers[0].email && <div className="email contact-details"><span className="email_logo"></span><p>{managers[0].email ? managers[0].email : ''}</p></div>}*!/*/}
          {/*    <div className="phone contact-details"><span className="phone_logo"></span><a href="tel:+375 24 112 4444">+375 24 112 4444</a>*/}
          {/*    </div>*/}
          {/*    <div className="email contact-details"><span className="email_logo"></span>*/}
          {/*        <a href="mailto:Andrey.skr@online-zapis.com">Andrey.skr@online-zapis.com</a></div>*/}
          {/* </div>*/}
          <div className="send-leader">
            <h5>{t("Написать руководству")}</h5>
            <InputCounter
              title={t("Имя")}
              placeholder={t("Введите Имя")}
              value={message.senderName}
              name="senderName"
              handleChange={this.handleChange}
              maxLength={128}
              withCounter={false}
            />

            <p>{t("Телефон")}</p>
            <ReactPhoneInput
              defaultCountry={'by'}
              country={'by'}
              inputClass={'phone-number'}
              regions={['america', 'europe']}
              placeholder={t("Введите номер телефона")}
              disableAreaCodes={true}
              value={message.senderPhone}
              onChange={(phone) => this.setterPhone(phone)}
            />

            <InputCounter
              type="email"
              placeholder={t("Введите email")}
              value={message.senderEmail}
              name="senderEmail"
              title="Email"
              extraClassName={'' + (!isValidEmailAddress(message.senderEmail) && message.senderEmail !== '' ? ' redBorder' : '')}
              handleChange={this.handleChange}
              maxLength={128}
              withCounter={false}
            />

            <div className="appointment-note">
              <p>{t("Текст")}</p>
              <textarea
                className="company_input"
                placeholder={t("Введите текст")}
                name="text"
                maxLength={120}
                value={message.text}
                onChange={this.handleChange}
              />
            </div>

          </div>

          <button
            disabled={(!(message.senderPhone) || !isValidEmailAddress(message.senderEmail) || !message.senderName || !message.text)}
            className={'send-button' + ((!(message.senderPhone) || !isValidEmailAddress(message.senderEmail) || !message.senderName || !message.text) ? ' disabledField' : '')}
            type="button"
            onClick={this.sendMessage}>{t("Отправить")}
          </button>
        </div>

        {this.state.messageIsSentModalOpen &&
                <div className="message-is-sent-wrapper">
                  <div className="message-is-sent-modal">
                    <button onClick={this.handleMessageIsSentModal} className="close"></button>
                    <div className="modal-body">
                      <img src={`${process.env.CONTEXT}public/img/icons/Check_mark.svg`} alt="message is sent image"/>
                      <p className="body-text">
                        {t("Сообщение отправлено")}
                      </p>
                    </div>
                  </div>
                </div>
        }

      </div>


    );
  }
}

function mapStateToProps(state) {
  const { authentication, calendar, company, staff } = state;

  return {
    authentication, calendar, company, staff: staff.staff,
  };
}

ManagerSettings.proptypes = {
  location: PropTypes.object.isRequired,
};


export default compose(connect(mapStateToProps), withRouter, withTranslation("common"))(ManagerSettings);
