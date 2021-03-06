import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar-edit';

import 'react-day-picker/lib/style.css';
import '../../../public/css_admin/date.css';
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import Modal from '@trendmicro/react-modal';
import { isValidEmailAddress } from '../../_helpers/validators';
import Hint from '../Hint';
import { DatePicker } from '../DatePicker';
import ReactPhoneInput from 'react-phone-input-2';
import {withTranslation} from "react-i18next";

const staffErrors = {
  emailFound: 'validation.email.found',
};

class NewStaff extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDayOff: (props.edit && props.staff_working.startDateOffMilis < props.staff_working.endDateOffMilis) ? moment(props.staff_working.startDateOffMilis).startOf('day').utc().toDate() : moment().utc().toDate(),
      selectedEndDayOff: (props.edit && props.staff_working.startDateOffMilis < props.staff_working.endDateOffMilis) ? moment(props.staff_working.endDateOffMilis).endOf('day').utc().toDate() : moment().utc().toDate(),
      staff: props.edit && props.edit ? props.staff_working : {
        'firstName': '',
        'lastName': '',
        'email': '',
        'phone': '',
        'roleId': 1,
        'workStartMilis': moment().format('x'),
        'workEndMilis': 1000000000000,
        'startDateOffMilis': moment().format('x'),
        'endDateOffMilis': moment().format('x'),
        'onlineBookingPercent': 100,
        'onlineBooking': true,
        'adminBooking': true,
        'imageBase64': '',
        'costaffs': [],
      },
      extraSuccessText: false,
      emailIsValid: props.edit && props.edit,
      edit: props.edit && props.edit,
      preview: null,
      selectedItems: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.addStaff = this.addStaff.bind(this);
    this.getFiles = this.getFiles.bind(this);
    this.onCrop = this.onCrop.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChangeMultiple = this.handleChangeMultiple.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayOffClick = this.handleDayOffClick.bind(this);
    this.handleChangeCoStaff = this.handleChangeCoStaff.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem('collapse') === 'true') {
      document.getElementsByClassName('modal---modal-overlay---3D5Nr')[0].style.marginLeft = '70px';
    }
  }

  onCrop(preview) {
    const { staff } = this.state;
    this.setState({ ...this.state, staff: { ...staff, imageBase64: preview.split(',')[1] } });
  }

  handleOutsideClick() {
    this.setState({
      isQuestionsDropdown: false,
      isCoworkerDropdown: false,
      isOnlineZapisDropdown: false,
    });
  }

  handleChangeMultiple(value, { action, removedValue }) {
    const { staff } = this.state;

    const st = [];

    value.map((m) => m.value && st.push({ 'staffId': m.value }));

    this.setState({ staff: { ...staff, 'costaffs': st } });
  }

  render() {
    const { authentication, staffs, company, t } = this.props;
    const { staff, edit, extraSuccessText, selectedStartDayOff, selectedEndDayOff, message } = this.state;
    const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;

    const isOwner = (authentication && authentication.user && authentication.user.profile && authentication.user.profile.roleId) === 4;
    const isAdmin = (authentication && authentication.user && authentication.user.profile && authentication.user.profile.roleId) === 3;
    const canUpdateEmail = isOwner && (authentication.user.profile.email !== staff.email) || isAdmin && staff.roleId !== 4;

    const options = [];
    const option = [];

    staffs && staffs.staff && staffs.staff.map((staffr) => {
      staff.staffId !== staffr.staffId && options.push({
        value: staffr.staffId,
        label: staffr.firstName + ' ' + (staffr.lastName ? staffr.lastName : ''),
      });
    });

    staff && staff.costaffs && staff.costaffs.map((st) =>
      staffs && staffs.staff && staffs.staff.map((staffr) => {
        st.staffId === staffr.staffId && option.push({
          value: staffr.staffId,
          label: staffr.firstName + ' ' + (staffr.lastName ? staffr.lastName : ''),
        });
      }),
    );

    const isLightTheme = company && company.settings && company.settings.lightTheme;

    const colourStyles = {
      menu: (provided, state) => ({
        ...provided,
        alignItems: 'center',
        height: 'fit-content',
        border: 'none',
        zIndex: 1001,
        boxShadow: (isLightTheme ? '0px 0px 10px rgba(0, 0, 0, 0.1)' : '0px 0px 10px rgba(0, 0, 0, 0.1)'),
        backgroundColor: (isLightTheme ? '#fff' : '#222736'),
      }),
      option: (provided, state) => ({
        ...provided,
        padding: '15px 10px',
        borderBottom: '1px solid',
        borderColor: (isLightTheme ? '#EEEFF0' : '#383D4A'),
        color: (isLightTheme ? '#2A3042' : '#fff'),
        fontSize: 13 + 'px',
        lineHeight: 18 + 'px',
        backgroundColor: (isLightTheme ? (state.isFocused ? '#DFDFE7' : '#fff') : (state.isFocused ? '#2A3042' : '#222736')),
      }),

      multiValue: (provided, state) => ({
        ...provided,
        backgroundColor: (isLightTheme ? '#DFDFE7' : '#2A3042'),
        color: (isLightTheme ? '#fff' : '#fff'),
      }),

      multiValueLabel: (provided, state) => ({
        ...provided,
        backgroundColor: (isLightTheme ? '#DFDFE7' : '#2A3042'),
        color: (isLightTheme ? '' : '#fff'),
      }),

      multiValueRemove: (provided, state) => ({
        ...provided,
        backgroundColor: (isLightTheme ? '#DFDFE7' : '#2A3042'),
        color: (isLightTheme ? '#2A3042' : '#fff'),

      }),
      valueContainer: (provided) => ({
        ...provided,
        minHeight: 36 + 'px',
        border: 'none',
      }),
      control: (provided) => ({
        ...provided,
        border: 'none',
        background: (isLightTheme ? '#F3F3F9' : '#222736'),
        borderRadius: 0,
      }),
      indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
      }),
      indicatorsContainer: (provided) => ({

      }),
      placeholder: (provided) => ({
        ...provided,
        fontSize: 13 + 'px',
        lineHeight: 18 + 'px',
        color: '#8F919E',
      }),
    };

    const emailInput = (
      <React.Fragment>
        <p>Email <Hint hintMessage={t(`?????????? ???????? ???????????? ?? ????????????????. ???????????????? ????????????, ???????? ???????????? ???? ??????????`)}/>
        </p>
        {staffs.errorMessageKey === staffErrors.emailFound &&
                <span className="red-text"> {t("?????????? ?????????? ?????? ???????????????????????? ?? ??????????????")}</span>}
        <input
          type="email"
          placeholder={t("?????????????? email") + ` (${t("??????????????????????")})`}
          name="email"
          value={staff.email}
          onChange={this.handleChange}
          className={((edit && !canUpdateEmail) ? 'disabledField' : '') + (((!staff.email || isValidEmailAddress(staff.email)) && (staffs.errorMessageKey !== staffErrors.emailFound)) ? '' : ' redBorder')}
          disabled={(edit && !canUpdateEmail)}
        />
      </React.Fragment>
    );

    const dayPickerProps = {
      month: new Date(),
      fromMonth: new Date(),
      toMonth: new Date(moment().utc().add(6, 'month').toDate()),
      disabledDays: [
        {
          before: new Date(),
        },
        {
          after: new Date(moment().utc().add(6, 'month').toDate()),
        },
      ],
    };

    return (
      <Modal size="lg" onClose={this.closeModal} showCloseButton={false}
        className="mod">

        <div className="new-staff-modal" tabIndex="-1" role="dialog"
          aria-hidden="true">
          {staff &&
                    <div className="modal-container" role="document">
                      <div className="modal-content">


                        <div className="form-group">
                          {!edit ?
                            <div className="modal-header">
                              <h5 className="modal-title">{(companyTypeId === 2 || companyTypeId === 3) ? t('?????????? ?????????????? ??????????') : (companyTypeId === 4 ? t('?????????? ????????') : t('?????????? ??????????????????'))}</h5>
                              <button type="button" className="close" onClick={this.closeModal}>
                                <span aria-hidden="true"/>
                              </button>
                            </div>
                            :
                            <div className="modal-header">
                              <h5 className="modal-title">{t("????????????????????????????")} {(companyTypeId === 2 || companyTypeId === 3) ? t('???????????????? ??????????') : (companyTypeId === 4 ? t('??????????'): t('????????????????????'))}</h5>
                              <button type="button" className="close" onClick={this.closeModal}
                                aria-label="Close">
                                <span aria-hidden="true"/>
                              </button>
                            </div>
                          }
                          <div className="modal-body">
                            <div className="container-fluid">
                              <div className="retreats">
                                <div className="row">
                                  <div className="col-md-4">
                                    <div style={{ position: 'relative' }}>
                                      <p>{(companyTypeId === 2 || companyTypeId === 3) ? t("????????????????") + ' 1' : t('??????')}</p>
                                      <input type="text"
                                        placeholder={(companyTypeId === 2 || companyTypeId === 3) ? t('?????????????? ????????????????') : t('?????????????? ??????')}
                                        value={staff.firstName} name="firstName"
                                        onChange={this.handleChange}
                                        className={!staff.firstName && (staff.phone || staff.email || staff.lastName) ? ' redBorder' : ''}
                                        maxLength="100"
                                      />
                                      <span
                                        className="max-count-letters">{staff.firstName ? staff.firstName.length : 0}/100</span>
                                    </div>
                                    <div style={{ position: 'relative' }} className="mobile-visible">
                                      <p>{(companyTypeId === 2 || companyTypeId === 3) ? t("????????????????") + ' 2' : t('??????????????')}</p>
                                      <input type="text"
                                        placeholder={(companyTypeId === 2 || companyTypeId === 3) ? t('?????????????? ????????????????') : t('?????????????? ??????????????')}
                                        value={staff.lastName} name="lastName"
                                        onChange={this.handleChange} maxLength="100"/>
                                      <span
                                        className="max-count-letters">{staff.lastName ? staff.lastName.length : 0}/100</span>
                                    </div>

                                    <p>{t("?????????? ????????????????")}</p>
                                    <ReactPhoneInput
                                      defaultCountry={'by'}
                                      country={'by'}
                                      regions={['america', 'europe']}
                                      placeholder="+375 (__) __ __ __"
                                      value={staff.phone}
                                      onChange={(phone) => this.setState({
                                        staff: {
                                          ...staff,
                                          phone: phone.replace(/[() ]/g, ''),
                                        },
                                      })}
                                    />

                                    <div className="mobile-visible">
                                      {emailInput}
                                    </div>

                                  </div>
                                  <div className="col-md-4">
                                    <div style={{ position: 'relative' }} className="desktop-visible">
                                      <p>{(companyTypeId === 2 || companyTypeId === 3) ? t("????????????????") + ' 2' : t('??????????????')}</p>
                                      <input type="text"
                                        placeholder={(companyTypeId === 2 || companyTypeId === 3) ? t("'????????????????: ???????????????? 1'") : t('?????????????? ??????????????')}
                                        value={staff.lastName} name="lastName"
                                        onChange={this.handleChange} maxLength="100"/>
                                      <span
                                        className="max-count-letters">{staff.lastName ? staff.lastName.length : 0}/100</span>
                                    </div>
                                    <div className="desktop-visible">
                                      {emailInput}
                                    </div>

                                  </div>
                                  <div className="col-md-4">
                                    <div className="upload_container">
                                      <p>{t("????????????????????")}</p>
                                      <div className="setting image_picker">
                                        <div className="settings_wrap">
                                          <label className="drop_target">

                                            <div className="image_preview">
                                              <div className="existed-image">
                                                <img
                                                  src={staff.imageBase64 && staff.imageBase64 !== '' ? ('data:image/png;base64,' + staff.imageBase64) : `${process.env.CONTEXT}public/img/add_new.svg`}/>

                                              </div>
                                              <Avatar
                                                height={180}
                                                width={260}
                                                // cropRadius="100%"
                                                label=""
                                                key={staff.staffId}
                                                onCrop={this.onCrop}
                                                onClose={this.onClose}
                                              />
                                            </div>
                                          </label>
                                        </div>
                                      </div>
                                    </div>


                                  </div>

                                </div>
                                <hr/>
                                <div className="row">

                                  <div className="col-md-4">
                                    <div className="input_limited_wrapper_3_digital">
                                      <p>{t("???????????????? (??????????????????????????)")} <Hint
                                        hintMessage={(companyTypeId === 2 || companyTypeId === 3) ? t("'???????????????? ???????????????????? 4 ??????????, ????????????????????????, ???????????? ??????????????????'") : t('???????????????? ?????????????????? ???????????? ??????????????????')}/>
                                      </p>

                                      <input
                                        type="text"
                                        placeholder={t("???????????????? ??????????????????")}
                                        name="description"
                                        value={staff.description}
                                        onChange={this.handleChange}
                                        maxLength="120"
                                      />
                                      <span className="max-count-letters">
                                        {staff.description ? staff.description.length : 0}/120
                                      </span>
                                    </div>


                                    <div>
                                      <p>{t("????????????")}</p>
                                      <select className="custom-select" value={staff.roleId}
                                        disabled={staff.roleId === 4 && true} name="roleId"
                                        onChange={this.handleChange}>
                                        {staff.roleId === 4 && <option value="4">{t("????????????????")}</option>}
                                        <option value="1">{t("????????????")}</option>
                                        <option value="2">{t("??????????????")}</option>
                                        <option value="3">{t("??????????")}</option>
                                      </select>
                                    </div>
                                    <div className="helper-input-container">
                                      <p>{t("????????????????")} <Hint
                                        hintMessage={(companyTypeId === 2 || companyTypeId === 3) ? t('???????????????? ???????? ?? ?????? 1 ???????????????? ???????????????????????? ???? 2 ?????????????? ??????????') : t('???????????????? ???????? ?? ?????? 2 ???????????????????? ???? 1 ??????????????')}/>
                                      </p>
                                      {/* <select className="custom-select" value={staff.costaffs && staff.costaffs[0] && staff.costaffs[0].staffId} name="costaffs" onChange={this.handleChangeCoStaff}>*/}
                                      {/* <option value="">-</option>*/}
                                      {/* { staffs && staffs.staff && staffs.staff.map((st)=>(!staff.staffId || (staff.staffId && staff.staffId !== st.staffId)) && <option value={st.staffId}>{st.lastName} {st.firstName}</option>)}*/}
                                      {/* </select>*/}
                                      <Select
                                        closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        value={option}
                                        isMulti={true}
                                        onChange={this.handleChangeMultiple}
                                        placeholder={t("?????????? ???? ??????????")}
                                        options={options}
                                        styles={colourStyles}
                                      />
                                    </div>


                                    <p className="start-work"
                                      style={{ margin: '12px 0', textAlign: 'left' }}>{t("???????????? ????????????")}: {moment(staff.workStartMilis, 'x').startOf('day').format('D MMMM YYYY')}</p>

                                    <div className="buttons new-staff-buttons">
                                      <button className={'small-button'} type="button"
                                        onClick={() => {
                                          if (!staff.firstName || (staff.email && !isValidEmailAddress(staff.email)) || staffs.adding) {
                                            this.setState({ message: t('???????????????????? ?????????????????? ?????? ????????????????????') });
                                          } else {
                                            this.setState({ message: '' });
                                            if (edit) {
                                              this.updateStaff();
                                            } else {
                                              this.addStaff();
                                            }
                                          }
                                        }}
                                      >{t("??????????????????")}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="col-md-8 p-0 d-flex flex-wrap">


                                    <div className="col-md-6 time-to-online-visit">
                                      <p>{t("?????????????????? ?????????? ?????? ????????????-????????????")}</p>
                                      <select className="custom-select" name="onlineBookingPercent"
                                        onChange={this.handleChange}
                                        value={staff.onlineBookingPercent}>
                                        <option value={25}>25%</option>
                                        <option value={50}>50%</option>
                                        <option value={75}>75%</option>
                                        <option selected value={100}>100%</option>
                                      </select>
                                    </div>

                                    <div className="col-md-12">
                                      <div className="check-box-container">
                                        <div className="check-box">
                                          <label>
                                            <input className="form-check-input" type="checkbox"
                                              checked={this.state.staff.onlineBooking}
                                              onChange={() => this.toggleChange('onlineBooking')}/>
                                            <span className="check-box-circle"/>
                                                                    {t("???????????????? ???????????? ????????????")}
                                          </label>&nbsp;
                                          <Hint
                                            hintMessage={`${t("???????????????? ?????????????????????? ????????????")} ${(companyTypeId === 2 || companyTypeId === 3) ? t('???? ?????????????? ??????????') : t('?? ????????????????????')} ${t("?????????? ????????????-????????????")}`}/>
                                        </div>

                                        <div className="check-box">
                                          <label>
                                            <input className="form-check-input" type="checkbox"
                                              checked={this.state.staff.adminBooking}
                                              onChange={() => this.toggleChange('adminBooking')}/>
                                            <span className="check-box-circle"/>
                                                                    {t("???????????????? ?????????????????????? ?? ??????????????")}
                                          </label>&nbsp;
                                          <Hint
                                            hintMessage={`${t("???????????????? ?????????????????????? ????????????")} ${(companyTypeId === 2 || companyTypeId === 3) ? t('???? ?????????????? ??????????') : t('?? ????????????????????')}\n${t("?? ??????????????")}`}/>
                                        </div>

                                        <div className="check-box">
                                          <label>
                                            <input className="form-check-input" type="checkbox"
                                              checked={(parseInt(moment(this.state.selectedStartDayOff).format('x')) < parseInt(moment(this.state.selectedEndDayOff).format('x'))) && this.state.staff.startDateOffMilis !== this.state.staff.endDateOffMilis}
                                              onChange={(e) => this.toggleOnlineZapisOffChange(e)}/>
                                            <span className="check-box-circle"/>
                                                                    {t("?????????????????? ????????????-???????????? ???? ???????????????????????? ????????????")}
                                          </label>&nbsp;
                                        </div>

                                        {(parseInt(moment(this.state.selectedStartDayOff).format('x')) < parseInt(moment(this.state.selectedEndDayOff).format('x'))) && this.state.staff.startDateOffMilis !== this.state.staff.endDateOffMilis &&
                                                            <div
                                                              className="staff-day-picker online-zapis-date-picker mb-3">
                                                              <p className="staff-day-picker-title">{t("????????????")}</p>
                                                              <DatePicker
                                                                // closedDates={staffAll.closedDates}
                                                                type="day"
                                                                selectedDay={selectedStartDayOff}
                                                                handleDayClick={(day, modifiers) => this.handleDayOffClick(day, modifiers, 'selectedStartDayOff')}
                                                                dayPickerProps={dayPickerProps}
                                                                language={this.props.i18n.language}
                                                              />
                                                            </div>
                                        }

                                        {(parseInt(moment(this.state.selectedStartDayOff).format('x')) < parseInt(moment(this.state.selectedEndDayOff).format('x'))) && this.state.staff.startDateOffMilis !== this.state.staff.endDateOffMilis &&
                                                            <div
                                                              className="staff-day-picker online-zapis-date-picker mb-3">
                                                              <p className="staff-day-picker-title">{t("??????????")}</p>
                                                              <DatePicker
                                                                // closedDates={staffAll.closedDates}
                                                                type="day"
                                                                language={this.props.i18n.language}
                                                                selectedDay={selectedEndDayOff}
                                                                handleDayClick={(day, modifiers) => this.handleDayOffClick(day, modifiers, 'selectedEndDayOff')}
                                                                dayPickerProps={{
                                                                  ...dayPickerProps,
                                                                  disabledDays: [
                                                                    {
                                                                      before: new Date(moment(selectedStartDayOff).utc().toDate()),
                                                                    },
                                                                    {
                                                                      after: new Date(moment().utc().add(6, 'month').toDate()),
                                                                    },
                                                                  ],
                                                                }}
                                                              />
                                                            </div>
                                        }
                                      </div>

                                      <p className="start-work-mob"
                                        style={{ marginTop: '12px', textAlign: 'center' }}>{t("???????????? ????????????")}: {moment(staff.workStartMilis, 'x').startOf('day').format('D MMMM YYYY')}</p>

                                      {staffs && staffs.status === 200 &&
                                                        <p className="alert-success p-1 rounded pl-3 mb-2">{t("??????????????????")}. {extraSuccessText && t('?????????????? ?????? ???????????????????? ?????????????? ???? ?????????????????? Email')}</p>
                                      }
                                      {staffs && staffs.status === 210 &&
                                                        <p className="alert-danger p-1 rounded pl-3 mb-2">{t("?????????? email ????????????????????!")}</p>
                                      }
                                      {staffs && staffs.adding && staffs.status !== 200 &&
                                                        <img style={{ width: '57px' }}
                                                          src="data:image/gif;base64,R0lGODlhIANYAuZHAAVq0svg9p7F7pfB7KPI7rnW8pO/7JrD7bfU8rrW86nM75/G7tzq+e30/LLR8dTl997r+Yq56pjC7PP4/b/Z9KXJ79no+OHt+oy76qfK79vp+IS26ff6/snf9dHk9/L3/fT5/c3h9uPu+qvN8D2L3JXA7Bd11UiS3lCW30uT33Wt5kCN3Vaa4TWH27PR8eny+7zX8zGE2pS/7PD2/LbU8id+2Obw++jy+93r+cfe9Rp21sPb9DCE2nGq5WWj46rM8Atu04Cz6JvD7Xat5lKY4CuB2YK06P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFMUUzNjc3RENCN0VFNTExODIyNkM4MzY4MjI5NDFBMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNDQ4RUJDRjdFRDIxMUU1QUJFRUFCODg1NTlFN0RBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNDQ4RUJDRTdFRDIxMUU1QUJFRUFCODg1NTlFN0RBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RkY5MDg5NUQwN0VFNTExODIyNkM4MzY4MjI5NDFBMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFMUUzNjc3RENCN0VFNTExODIyNkM4MzY4MjI5NDFBMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCN2QDDACqwQEINJgABABAm1EACCyoMAIP/Dfd8AEEABYwggAERbGDEBhEYIMAIBQQAwQcZb9zxxyGPXPLJKa9sj8YcewyyyCSbjLLKLN/sss4x90wz0GLNQEMQKegAwNNQRy310zqkEAQNM7zDgQYUVICBEWCHLfbYYGNQAQUacKA1116T7bbYZqOtdjtbd/3122/HnfbaduOd99l7b1XAEC1MbfjhUbcwRAHrMJDAAX5HLvYBCTDQ+OOSZ0655ek4DnnmkW9++eeg4y26VTcIgQLirLcOAApC3FDOBCFkUPrtGYQwwey131567ruPQ7vtvmcOPO/EFx/58VG9IMMKrkfP+goyvBAOCB0soPztC3QAwvXZb196//fff4O99uJnTj746Kcf+fpOEXCC9PSzfgIB33hAgPu3E+BB/vvjH+j85w39CXCA/ytgAA8YOQIuJQc+qJ8EWeeDHGxDBA5g4O0cIIILZlCDoOOgNjAIwhB2cIQfLGHkRIiUAcRggjA8XAwGkI0ASECFoJNAAGp4QxxK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3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAXfgBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4zxOjbAMIAKLJBQgwlAAACECTWQwIIKA8BgA6AcaEBBBRgY4fPPQAftMwYVUKABB+/kvHPPQjf9M9FGIz3ODDQEkYIOAGSt9dZcZ61DCkHQMIOeDCRwgNNoO31AAgysU/bZacf989ptf1PAEC10rffeW7cwRAF1ThBCBnIXLnQGIUxQjuCEG+64EYgrns0NQqDA9+WYA4CCEDfACUIHCzwuus8LdABCOJ+HPvrjpZ9ezQsyrJD57JevIMMLbXpAwOq8E+DBN7rzvrrv1BBwAu3IX34C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WI3WeI3YmI3auI3c2I3e+I3gGI7iOHmO5FiO5niO6JiO6riO7NiO7viO8BiP8jiP9FiP9niP+JiP+riP/NiP/viPABmQAjmQBFmQBnmQCJmQCrmQDNmQDvmQEBmREjmRFFmRFnmRGJmRGrmRHNmRHvmRIBmSIjmSJFmSJnmSKJmSKrmSLNmSLvmSMBmT8BAIACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz2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"/>
                                      }
                                      {message &&
                                                        <div style={{ padding: '4px 12px' }}
                                                          className="alert alert-danger">{message}</div>
                                      }

                                    </div>


                                    <div className="buttons buttons-mob new-staff-buttons">
                                      <button className='small-button' type="button"
                                        onClick={() => {
                                          if (!staff.firstName || (staff.email && !isValidEmailAddress(staff.email)) || staffs.adding) {
                                            this.setState({ message: t('???????????????????? ?????????????????? ?????? ????????????????????') });
                                          } else {
                                            this.setState({ message: '' });
                                            if (edit) {
                                              this.updateStaff();
                                            } else {
                                              this.addStaff();
                                            }
                                          }
                                        }}
                                      >{t("??????????????????")}
                                      </button>
                                    </div>


                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          }
        </div>
      </Modal>
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { staff } = this.state;

    if (name === 'email') {
      this.setState({ emailIsValid: isValidEmailAddress(value) });
    }

    this.setState({ staff: { ...staff, [name]: value } });
  }

  handleChangeCoStaff(e) {
    const { name, value } = e.target;
    const { staff } = this.state;

    this.setState({ staff: { ...staff, 'costaffs': [{ 'staffId': value }] } });
  }

  apply(file) {
    this.setState({ image: dropped[0] });
  }


  getFiles(files) {
    const { staff } = this.state;

    this.setState({ staff: { ...staff, imageBase64: files } });
  }


  toggleChange(checkboxKey) {
    const { staff } = this.state;

    this.setState({ staff: { ...staff, [checkboxKey]: !staff[checkboxKey] } });
  }

  handleDayOffClick(day, modifiers = {}, dayKey) {
    const { staff } = this.state;

    const daySelected = moment(day);


    const updatedState = {};
    if (dayKey === 'selectedStartDayOff') {
      updatedState.selectedStartDayOff = daySelected.startOf('day').toDate();
      updatedState.selectedEndDayOff = daySelected.endOf('day').toDate();

      updatedState.staff = {
        ...staff,
        startDateOffMilis: parseInt(moment(day).startOf('day').format('x')),
        endDateOffMilis: parseInt(moment(day).endOf('day').format('x')),
      };
    } else {
      updatedState.selectedEndDayOff = daySelected.endOf('day').toDate();

      updatedState.staff = {
        ...staff,
        endDateOffMilis: parseInt(moment(day).endOf('day').format('x')),
      };
    }


    this.setState(updatedState);
  }

  toggleOnlineZapisOffChange(e) {
    const { staff } = this.state;

    const updatedState = {};

    if (this.state.staff.startDateOffMilis === this.state.staff.endDateOffMilis) {
      updatedState.staff = {
        ...staff,
        startDateOffMilis: parseInt(moment().startOf('day').format('x')),
        endDateOffMilis: parseInt(moment().endOf('day').format('x')),
      };
      updatedState.selectedStartDayOff = moment().startOf('day').toDate();
      updatedState.selectedEndDayOff = moment().endOf('day').toDate();
    } else {
      updatedState.staff = {
        ...staff,
        startDateOffMilis: parseInt(moment().format('x')),
        endDateOffMilis: parseInt(moment().format('x')),
      };
      updatedState.selectedStartDayOff = moment().startOf('day').toDate();
      updatedState.selectedEndDayOff = moment().endOf('day').toDate();
    }

    this.setState(updatedState);
  }

  updateStaff() {
    const { updateStaff, edit, staff_working } = this.props;
    const { staff } = this.state;
    if (edit && (staff.email !== staff_working.email)) {
      this.setState({ extraSuccessText: true });
    } else {
      this.setState({ extraSuccessText: false });
    }


    if (staff.costaffs && staff.costaffs.length === 0) {
      staff.costaffs = [];
    }
    return updateStaff(staff);
  };

  addStaff() {
    const { addStaff } = this.props;
    const { staff } = this.state;
    if (staff.email) {
      this.setState({ extraSuccessText: true });
    } else {
      this.setState({ extraSuccessText: false });
    }

    return addStaff(staff);
  };

  handleDayClick(day, { selected }) {
    const { staff } = this.state;

    const daySelected = selected ? moment().format('x') : moment(day).format('x');

    this.setState({ staff: { ...staff, workStartMilis: daySelected } });
  }

  closeModal() {
    const { onClose } = this.props;

    return onClose();
  }
}

function mapStateToProps(state) {
  const { alert, staff, company, authentication } = state;
  return {
    alert, staffs: staff, company, authentication,
  };
}

NewStaff.propTypes = {
  staff_working: PropTypes.object,
  edit: PropTypes.bool.isRequired,
  updateStaff: PropTypes.func,
  addStaff: PropTypes.func,
  onClose: PropTypes.func,
};

const connectedApp = connect(mapStateToProps)(withTranslation("common")(NewStaff));
export { connectedApp as NewStaff };
