import React, { Component } from 'react';
import { connect } from 'react-redux';

import { companyActions, notificationActions } from '../_actions';
import Avatar from 'react-avatar-edit';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import { access } from '../_helpers/access';
import ReactPhoneInput from 'react-phone-input-2';
import {withTranslation} from "react-i18next";
import { COMPANY_SOCIAL_NETWORKS, SOCIAL_NETWORK_MAP, VISITS_STORAGE_DURATIONS } from '../_constants';
import ConfirmModal from '../_components/modals/ConfirmModal';
import SocialNetworks from './socialNetworks';
import SubCompany from './subCompany';


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
      errors: {},
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
      this.setState({ status: 'saved.settings' });
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

  async handleSubmit(e, subcompany, i) {
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
      const socials = COMPANY_SOCIAL_NETWORKS.map(({ name }) => ({ socialNetwork: SOCIAL_NETWORK_MAP[name], companyUrl: body[name] || '', companyId: body.companyId }))

      await Promise.all([dispatch(companyActions.updateCompanySocialNetworks(socials, body.companyId)), dispatch(companyActions.updateSubcompany(body))]);
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

  onVisitStorageDurationChange = ({target: {value}}, index)  => {
    this.setState({
      confirmModal: {value, index},
    })
  }

  onDurationSubmit = () => {
    const { subcompanies, confirmModal } = this.state;
    const newSubcompanies = subcompanies;
    newSubcompanies[confirmModal.index]["appointmentStoragePeriod"] = +confirmModal.value;

    this.setState({ ...this.state, subcompanies: newSubcompanies, confirmModal: false });
  }

  setErrors = (errors) => this.setState({ errors });

  render() {
    const { adding, submitted, isLoading, saved, status, company, isAvatarOpened, subcompanies, confirmModal, errors } = this.state;
    const {t} = this.props;
    return (
      <div className="settings-page-container">
        {confirmModal && 
        <ConfirmModal
          title="Вы уверены, что хотите изменить срок хранения истории визитов?" 
          submitHandler={() => this.onDurationSubmit(confirmModal)}
          closeHandler={() => this.setState({ confirmModal: false })}
          />}
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
              <SubCompany
                key={i}
                subcompany={subcompany}
                i={i}
                t={t}
                handleChange={this.handleChange}
                handleNotificationChange={this.handleNotificationChange}
                setState={this.setState}
                handleSubmit={this.handleSubmit}
                onClose={this.onClose}
                onCrop={this.onCrop}
                errors={errors}
                setErrors={this.setErrors}
                adding={adding}
                saved={saved}
                isAvatarOpened={isAvatarOpened}
                submitted={submitted}
              />
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
