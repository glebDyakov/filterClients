import React, { Component } from 'react';
import { connect } from 'react-redux';

import { companyActions, notificationActions } from '../_actions';
import Avatar from 'react-avatar-edit';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import { access } from '../_helpers/access';
import ReactPhoneInput from 'react-phone-input-2';
import {withTranslation} from "react-i18next";


class Index extends Component {
  constructor(props) {
    super(props);

    if (!access(-1)) {
      props.history.push('/denied');
    }

    this.state = {
      authentication: props.authentication,
      company: props.company,
      subcompanies: props.company.subcompanies,
      isLoading: true,
      adding: false,
      activeDay: 1,
      status: {},
      submitted: false,
      isAvatarOpened: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNotificationChange = this.handleNotificationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleWeekPicker = this.handleWeekPicker.bind(this);
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.changeSound = this.changeSound.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData(newProps.authentication);
    }

    if ( JSON.stringify(this.props.authentication) !== JSON.stringify(newProps.authentication)) {
      this.setState({ authentication: newProps.authentication,
      });
    }

    if ( JSON.stringify(this.props.company.settings) !== JSON.stringify(newProps.company.settings)) {
      this.setState({ company: newProps.company });
    }
    if ( JSON.stringify(this.props.company.subcompanies) !== JSON.stringify(newProps.company.subcompanies)) {
      this.setState({ subcompanies: newProps.company.subcompanies });
    }
    if (newProps.company && newProps.company.status==='saved.settings') {
      this.setState({ status: newProps.company.status });
      setTimeout(() => {
        this.setState({ status: {}, submitted: false, saved: null });
      }, 3000);
    }

    if (JSON.stringify(this.props.notification) !== JSON.stringify(newProps.notification)) {
      this.setState({ notification: newProps.notification.notification });
    }
  }

  handleChange(e, i) {
    const { name, value } = e.target;
    const { subcompanies } = this.state;
    const newSubcompanies = subcompanies;
    newSubcompanies[i][name] = value;

    this.setState({ ...this.state, subcompanies: newSubcompanies });
  }

  handleNotificationChange({ target: { name, value } }, i) {
    const { subcompanies } = this.state;
    const newSubcompanies = subcompanies;
    newSubcompanies[i][name] = value;
    this.setState({
      subcompanies: newSubcompanies,
    });
  }

  handleChangeAddress(e, i) {
    const { name, value } = e.target;
    const { subcompanies } = this.state;

    let address;

    if (name==='defaultAddress1' && value) {
      address=1;
    }

    if (name==='defaultAddress2' && value) {
      address=2;
    }

    if (name==='defaultAddress3' && value) {
      address=3;
    }
    const newSubcompanies = subcompanies;
    newSubcompanies[i].defaultAddress = address;

    this.setState({ ...this.state, subcompanies: newSubcompanies });
  }

  handleChangePhone(e, i) {
    const { name, value } = e.target;
    const { subcompanies } = this.state;

    let phone;

    if (name==='defaultPhone1' && value) {
      phone=1;
    }

    if (name==='defaultPhone2' && value) {
      phone=2;
    }

    if (name==='defaultPhone3' && value) {
      phone=3;
    }
    const newSubcompanies = subcompanies;
    newSubcompanies[i].defaultPhone = phone;

    this.setState({ ...this.state, subcompanies: newSubcompanies });
  }

  handleWeekPicker(num) {
    this.setState({ ...this.state, activeDay: num });
  }

  onChangeTime(field, time, activeDay) {
    const { company } = this.state;

    const times=company.settings.companyTimetables;

    times[activeDay][field]=parseInt(time);

    this.setState({ company: { ...company, settings: { ...company.settings, companyTimetables: times } } });
  }

  handleSubmit(e, subcompany, i) {
    const { companyName, companyAddress, companyEmail, companyPhone, timezoneId } = subcompany;
    const { dispatch } = this.props;


    this.onClose();


    const phoneIndexes = [1, 2, 3];
    phoneIndexes.forEach((index) =>
      subcompany[`companyPhone${index}`] = subcompany[`companyPhone${index}`].replace(/[() ]/g, ''),
    );

    e.preventDefault();

    this.setState({ ...this.state, submitted: true, isAvatarOpened: false, saved: i });
    setTimeout(() => this.setState({ isAvatarOpened: true }), 100);

    if ((companyName || companyAddress || companyEmail || companyPhone) && timezoneId!=='') {
      const body = JSON.parse(JSON.stringify(subcompany));
      body.companyPhone1 = body.companyPhone1.length === 1 ? '' : `${body.companyPhone1}`;
      body.companyPhone1 = body.companyPhone1.startsWith('+') ? body.companyPhone1 : `+${body.companyPhone1}`;

      body.companyPhone2 = body.companyPhone2.length === 1 ? '' : `${body.companyPhone2}`;
      body.companyPhone2 = body.companyPhone2.startsWith('+') ? body.companyPhone2 : `+${body.companyPhone2}`;

      body.companyPhone3 = body.companyPhone3.length === 1 ? '' : `${body.companyPhone3}`;
      body.companyPhone3 = body.companyPhone3.startsWith('+') ? body.companyPhone3 : `+${body.companyPhone3}`;
      dispatch(companyActions.updateSubcompany(body));
    }
    dispatch(notificationActions.updateSubcompanySMS_EMAIL(
      JSON.stringify({ template: subcompany.template }), subcompany.companyId),
    );
  }

  onClose() {
    this.setState({ ...this.state, preview: null });
  }

  onCrop(preview, i) {
    const { subcompanies }=this.state;
    const newSubcompanies = subcompanies;
    newSubcompanies[i].imageBase64 = preview.split(',')[1];
    this.setState({ ...this.state, subcompanies: newSubcompanies });
  }

  componentDidMount() {
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
    document.title = this.props.t('Настройки компании | Онлайн-запись');
    initializeJs();
  }

  queryInitData(authentication = this.props.authentication) {
    if (authentication.user && authentication.user.profile && (authentication.user.profile.roleId === 4)) {
      this.props.dispatch(companyActions.getSubcompanies());
    }

    this.props.dispatch(notificationActions.getSMS_EMAIL());
    setTimeout(() => this.setState({ isLoading: false }), 800);
  }

  changeSound(e) {
    this.setState({ sound: e.target.checked });
  }


  render() {
    const { adding, submitted, isLoading, saved, status, company, isAvatarOpened, subcompanies } = this.state;
    const {t} = this.props;
    return (
      <div className="settings-page-container">
        {isLoading &&
          <div className="loader loader-company">
            <img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
          </div>
        }

        {company && company.settings &&
          <React.Fragment>
            {subcompanies[0] && <form className="content retreats company_fields" name="form">
              <h2 className="about-company-title">
                {t("О компании")}
              </h2>
              <div className="row">

                <div className="col-sm-4">

                  <p>{t("Заголовок компании")}</p>
                  <div className="name_company_wrapper form-control">
                    <input type="text" className="company_input" name="onlineCompanyHeader" maxLength="40"
                      value={subcompanies[0].onlineCompanyHeader} onChange={(e) => this.handleChange(e, 0)}/>
                    <span className="company_counter">{subcompanies[0].onlineCompanyHeader.length}/40</span>

                  </div>

                  <div className="buttons-container-setting d-none d-md-flex ">
                    {
                      <button
                        type="button"
                        className={((saved === 0 && (status === 'saved.settings' || submitted)) &&
                          'disabledField')+' button'
                        }
                        onClick={(e) => {
                          if (saved !== 0 && (status !== 'saved.settings' || !submitted)) {
                            this.handleSubmit(e, subcompanies[0], 0);
                          }
                        }}
                      >
                        {t("Сохранить")}
                      </button>
                    }
                  </div>
                </div>

                <div className="col-sm-8">
                  <p>{t("Банковские реквизиты")}</p>
                  <div style={{ height: '80px' }} className="name_company_wrapper bank form-control">
                    <textarea
                      style={{ paddingRight: '55px', height: '110px' }}
                      placeholder={t("Введите реквизиты")} className="company_input"
                      name="bankDetails"
                      maxLength="1800"
                      value={subcompanies[0].bankDetails} onChange={(e) => this.handleChange(e, 0)}
                    />
                    <span className="company_counter">{subcompanies[0].bankDetails.length}/1800</span>
                  </div>
                </div>

                <div className="buttons-container-setting d-md-none mx-auto">
                  {
                    <button
                      type="button"
                      className={((saved === 0 && (status === 'saved.settings' || submitted)) &&
                        'disabledField')+' button'}
                      onClick={(e) => {
                        if (saved !== 0 && (status !== 'saved.settings' || !submitted)) {
                          this.handleSubmit(e, subcompanies[0], 0);
                        }
                      }}
                    >
                      {t("Сохранить")}
                    </button>
                  }
                </div>

              </div>

            </form>}
            {subcompanies.map((subcompany, i) => (
              <form
                key={`settings-page_subcompanies-item-${i}`}
                className="content retreats company_fields"
                name="form"
              >
                <h3>{t("Филиал")} {i + 1}</h3>

                <div className="row">
                  <div className="col-md-4">
                    <p>{t("Название компании")}</p>
                    <div className="name_company_wrapper form-control">
                      <input
                        type="text"
                        className="company_input"
                        placeholder={t("Например Стоматология")}
                        name="companyName"
                        maxLength="40"
                        value={subcompany.companyName}
                        onChange={(e) => this.handleChange(e, i)}
                      />
                      <span className="company_counter">{subcompany.companyName.length}/40</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <p>{t("Вид деятельности")}</p>
                    <select
                      className="custom-select"
                      onChange={(e) => this.handleNotificationChange(e, i)}
                      name="companyTypeId"
                      value={subcompany && subcompany.companyTypeId}
                    >
                      <option value={1}>{t("Салоны красоты, барбершопы, SPA")}</option>
                      <option value={2}>{t("СТО, автомойки, шиномонтажи")}</option>
                      <option value={3}>{t("Коворкинг")}</option>
                      <option value={4}>{t("Медицинские центры")}</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <p>Email</p>
                    <div className="name_company_wrapper form-control">
                      <div className="input-text2">
                        <input
                          type="email"
                          placeholder={t("Например") + ": walkerfrank@gmail.com"}
                          name="companyEmail"
                          disabled
                          className="company_input disabledField"
                          value={subcompany.companyEmail}
                          onChange={(e) => this.handleChange(e, i)}
                          maxLength="60"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr/>

                <div className="row">
                  <div className="col-sm-4">
                    <p className="phone_hint_wrapper">
                      <p>{t("Номер телефона")} ({t("Владельца")})</p>
                      {subcompany.defaultPhone===1 && <p>({t("Будет указан в автоуведомлениях")})</p>}
                    </p>

                    <div style={{ border: 'none' }} className="name_company_wrapper form-control">
                      <div style={{ border: 'none' }} className="check-box-group2 input-text2">
                        {/* <div className="input-text2">*/}
                        {/*    <input type="radio" aria-label="" name="defaultPhone1"
                        disabled={!(subcompany.companyPhone1 && subcompany.companyPhone1.length > 4)}
                        checked={subcompany.defaultPhone===1} onChange={(e) => this.handleChangePhone(e, i)}/>*/}
                        {/* </div>*/}

                        <ReactPhoneInput
                          defaultCountry={'by'}
                          country={'by'}
                          regions={['america', 'europe']}
                          placeholder={t("Введите номер телефона владельца")}
                          value={subcompany.companyPhone1}
                          onChange={(companyPhone1) => {
                            const newSubcompanies = subcompanies;
                            newSubcompanies[i].companyPhone1 = companyPhone1.replace(/[() ]/g, '');
                            this.setState({ subcompanies: newSubcompanies });
                          }}
                        />
                      </div>
                      <span className="company_counter">{subcompany.companyPhone1.length - 2}/20</span>
                    </div>

                    <p>{t("Адрес компании")}</p>
                    <div className="check-box-group2 form-control">
                      {/* <div className="input-text2">*/}
                      {/*    <input type="radio" aria-label="" name="defaultAddress1"
                      disabled={!subcompany.companyAddress1}  checked={subcompany.defaultAddress===1}
                      onChange={(e) => this.handleChangeAddress(e, i)}/>*/}
                      {/* </div>*/}

                      <input
                        checked={true}
                        type="text"
                        placeholder={t("Введите адрес")}
                        name="companyAddress1"
                        className="company_input"
                        value={subcompany.companyAddress1}
                        onChange={(e) => this.handleChange(e, i)}
                        maxLength="40"
                      />
                      <span className="company_counter">{subcompany.companyAddress1.length}/40</span>
                    </div>

                    <div className="buttons-container-setting d-none d-md-flex">
                      {(adding && (i === subcompanies.length - 1))
                        ? null
                        :
                        <button
                          type="button"
                          className={((saved === i && (status === 'saved.settings' || submitted)) &&
                            'disabledField')+' button'}
                          onClick={(e) => {
                            if (saved !== i && (status !== 'saved.settings' || !submitted)) {
                              this.handleSubmit(e, subcompany, i);
                            }
                          }}
                        >
                          {t("Сохранить")}
                        </button>
                      }
                    </div>

                    {/* <p>Адрес компании</p>*/}
                    {/* <div className="check-box-group2 form-control">*/}
                    {/*    <div className="input-text2">*/}
                    {/*        <input type="radio" aria-label="" name="defaultAddress2"
                    disabled={!subcompany.companyAddress2} checked={subcompany.defaultAddress===2}
                    onChange={(e) => this.handleChangeAddress(e, i)}/>*/}
                    {/*    </div>*/}

                    {/*    <input type="text" placeholder="" name="companyAddress2" className="company_input"*/}
                    {/*           value={subcompany.companyAddress2}
                    onChange={(e) => this.handleChange(e, i)} maxLength="40"/>*/}
                    {/*    <span className="company_counter">{subcompany.companyAddress2.length}/40</span>*/}
                    {/* </div>*/}

                    {/* <p>Адрес компании</p>*/}
                    {/* <div className="check-box-group2 form-control">*/}
                    {/*    <div className="input-text2">*/}
                    {/*        <input type="radio" aria-label="" name="defaultAddress3"
                    disabled={!subcompany.companyAddress3} checked={subcompany.defaultAddress===3}
                    onChange={(e) => this.handleChangeAddress(e, i)}/>*/}
                    {/*    </div>*/}

                    {/*    <input type="text" placeholder="" name="companyAddress3" className="company_input"*/}
                    {/*           value={subcompany.companyAddress3} onChange={(e) => this.handleChange(e, i)}
                    maxLength="40"/>*/}
                    {/*    <span className="company_counter">{subcompany.companyAddress3.length}/40</span>*/}
                    {/* </div>*/}
                  </div>

                  <div className="col-sm-4">
                    <p className="phone_hint_wrapper">
                      <p>{t("Номер телефона")}</p>
                      {subcompany.defaultPhone===2 && <p>({t("Будет указан в автоуведомлениях")})</p>}
                    </p>

                    <div style={{ border: 'none' }} className="name_company_wrapper form-control">
                      <div style={{ border: 'none' }} className="check-box-group2 input-text2">
                        {/* <div className="input-text2">*/}
                        {/*    <input type="radio" aria-label="" name="defaultPhone3"
                        disabled={!(subcompany.companyPhone3 && subcompany.companyPhone3.length > 4)}
                        checked={subcompany.defaultPhone===3} onChange={(e) => this.handleChangePhone(e, i)}/>*/}
                        {/* </div>*/}

                        <ReactPhoneInput
                          defaultCountry={'by'}
                          country={'by'}
                          regions={['america', 'europe']}
                          placeholder={t("Введите номер телефона")}
                          value={subcompany.companyPhone3}
                          onChange={(companyPhone3) => {
                            const newSubcompanies = subcompanies;
                            newSubcompanies[i].companyPhone3 = companyPhone3.replace(/[() ]/g, '');
                            this.setState({ subcompanies: newSubcompanies });
                          }}
                        />
                      </div>
                      <span className="company_counter">{subcompany.companyPhone3.length - 2}/20</span>
                    </div>

                    <p className="mt-2">{t("Город")}</p>
                    <div className="name_company_wrapper form-control">
                      <input
                        type="text"
                        className="company_input"
                        placeholder={t("Введите название города")}
                        name="city"
                        maxLength="40"
                        value={subcompany.city}
                        onChange={(e) => this.handleChange(e, i)}
                      />
                      <span className="company_counter">{subcompany.city.length}/40</span>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <p className="phone_hint_wrapper">
                      <p>{t("Номер телефона")}</p>
                      {subcompany.defaultPhone===3 && <p>({t("Будет указан в автоуведомлениях")})</p>}
                    </p>

                    <div style={{ border: 'none' }} className="name_company_wrapper form-control">
                      <div style={{ border: 'none' }} className="check-box-group2 input-text2">
                        {/* <div className="input-text2">*/}
                        {/*    <input type="radio" aria-label="" name="defaultPhone2"
                        disabled={!(subcompany.companyPhone2 && subcompany.companyPhone2.length > 4)}
                        checked={subcompany.defaultPhone===2} onChange={(e) => this.handleChangePhone(e, i)}/>*/}
                        {/* </div>*/}
                        <ReactPhoneInput
                          defaultCountry={'by'}
                          country={'by'}
                          regions={['america', 'europe']}
                          placeholder={t("Введите номер телефона")}
                          value={subcompany.companyPhone2}
                          onChange={(companyPhone2) => {
                            const newSubcompanies = subcompanies;
                            newSubcompanies[i].companyPhone2 = companyPhone2.replace(/[() ]/g, '');
                            this.setState({ subcompanies: newSubcompanies });
                          }}
                        />
                      </div>
                      <span className="company_counter">{subcompany.companyPhone2.length - 2}/20</span>
                    </div>

                    <p className="text-center">{t("Фото компании")}</p>
                    <div className="upload_container">
                      <div className="setting image_picker">
                        <div className="settings_wrap">
                          <label className="drop_target">
                            <div className="image_preview">
                              <div className="existed-image">
                                <img
                                  src={subcompany.imageBase64 && subcompany.imageBase64!==''
                                    ?('data:image/png;base64,'+subcompany.imageBase64)
                                    :`${process.env.CONTEXT}public/img/add_new.svg`
                                  }
                                />
                              </div>

                              {isAvatarOpened &&
                                <Avatar
                                  height={117}
                                  cropRadius="100%"
                                  label=""
                                  onCrop={(e) => this.onCrop(e, i)}
                                  onClose={this.onClose}
                                />
                              }
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {saved === i && status === 'saved.settings' &&
                                  <p className="alert-success p-1 rounded pl-3 mb-2">{t("Настройки сохранены")}</p>
                    }
                  </div>

                  <div className="buttons-container-setting d-md-none mx-auto">
                    {(adding && (i === subcompanies.length - 1))
                      ? null
                      :
                      <button
                        type="button"
                        className={((saved === i && (status === 'saved.settings' || submitted)) &&
                          'disabledField')+' button'}
                        onClick={(e) => {
                          if (saved !== i && (status !== 'saved.settings' || !submitted)) {
                            this.handleSubmit(e, subcompany, i);
                          }
                        }}
                      >
                        {t("Сохранить")}
                      </button>
                    }
                  </div>
                </div>
              </form>
            ),
            )}

            <button
              style={{ display: 'block', margin: '0.5rem auto' }}
              type="button"
              className={' button-without-bg'}
              onClick={() => {
                if (!adding) {
                  const newSubcompanies = subcompanies;
                  newSubcompanies.push({
                    companyTypeId: subcompanies[0].companyTypeId,
                    city: '',
                    companyName: '',
                    companyAddress1: '',
                    companyAddress2: '',
                    companyAddress3: '',
                    defaultAddress: 1,
                    defaultPhone: 3,
                    companyPhone1: company.settings.companyPhone1.slice(0, 4),
                    companyPhone2: company.settings.companyPhone2.slice(0, 4),
                    companyPhone3: company.settings.companyPhone3.slice(0, 4),
                  });
                  this.setState({ adding: true, subcompanies: newSubcompanies });
                } else {
                  this.props.dispatch(companyActions.addSubcompany({
                    countryCode: company.settings.countryCode,
                    timezoneId: company.settings.timezoneId,
                    ...subcompanies[subcompanies.length - 1],
                  }));
                  this.setState({ adding: false });
                }
              }}
            >
              {adding ? t('Сохранить филиал') : t("Добавить филиал") + ' +'}
            </button>
          </React.Fragment>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { alert, authentication, notification, company } = state;
  return {
    alert, authentication, notification, company,
  };
}

export default connect(mapStateToProps)(withTranslation('common')(Index));
