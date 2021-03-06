import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { DatePicker } from '../_components/DatePicker';
import Hint from '../_components/Hint';

import { companyActions } from '../_actions';

import { access } from '../_helpers/access';

import '../../public/scss/online_booking.scss';
import {withTranslation} from "react-i18next";
import SocialNetworks from './socialNetworks';

class Index extends Component {
  constructor(props) {
    super(props);
    if (!access(9)) {
      props.history.push('/denied');
    }

    this.state = {
      booking: props.company && props.company.booking,
      selectedDay: moment().utc().toDate(),
      urlButton: false,
      appointmentMessage: '',
      status: '',
      messageCopyModalOpen: false,
    };

    this.buttonColors = ['6A7187', '747474', '3B4B5C', '2A3042', '5B7465', '728399', 'A490F1', '7D785F', '991212', 'F7B83E', 'C959A3', '3E50F7'];
    this.onlineIntervalData = [
      { value: 60 * 15 , content: '15' },
      { value: 60 * 30 , content: '30' },
      { value: 60 * 60 , content: '60' },
    ]

    this.handleChange = this.handleChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.handleStepSubmit = this.handleStepSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setBookingCode = this.setBookingCode.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.queryInitData = this.queryInitData.bind(this);
    this.handleMessageCopyModal = this.handleMessageCopyModal.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }

    if (JSON.stringify(this.props.company.booking) !== JSON.stringify(newProps.company.booking)) {
      this.setState({
        booking: newProps.company.booking,
      });
    }
    if (newProps.company.settings) {
      this.setState({
        booktimeStep: newProps.company.settings.booktimeStep,
        selectedDay: newProps.company.settings.onlineZapisOn
          ? this.state.selectedDay
          : moment(newProps.company.settings.onlineZapisEndTimeMillis).utc().toDate(),
        appointmentMessage: newProps.company.settings.appointmentMessage,
        onlineZapisEndTimeMillis: newProps.company.settings.onlineZapisOn
          ? parseInt(moment(this.state.selectedDay).format('x'))
          : parseInt(newProps.company.settings.onlineZapisEndTimeMillis),
        onlineZapisOn: newProps.company.settings.onlineZapisOn,
        booktimeOnlineStepSec: newProps.company.settings.booktimeOnlineStepSec,
        existingAppointmentIgnored: newProps.company.settings.existingAppointmentIgnored,
      });
    }
    if (newProps.company && newProps.company.saved === 'stepSaved') {
      setTimeout(() => {
        this.props.dispatch(companyActions.updateSaved(newProps.company.saved));
      }, 3000);
    }
    if (newProps.company && newProps.company.status === 'saved.settings') {
      this.setState({ status: newProps.company.status });
      setTimeout(() => {
        this.setState({ status: '', submitted: false });
      }, 3000);
    }
  }

  handleCheckboxChange(checkboxKey) {
    const newState = {
      [checkboxKey]: !this.state[checkboxKey],
    };
    this.setState(newState);
  }

  handleServiceCheckboxChange(checkboxKey) {
    const newState = {
      [checkboxKey]: !this.state[checkboxKey],
    };
    this.setState(newState);

    const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies
      .find((item) => item.companyId === this.props.company.settings.companyId);
    this.props.dispatch(companyActions.updateCompanySettings({
      imageBase64: activeCompany && activeCompany.imageBase64,
      ...this.props.company.settings,
      [checkboxKey]: newState[checkboxKey],
    }, 'isServiceIntervalLoading'));
  }

  onIntervalChange = (value) => {
    this.setState({ booktimeOnlineStepSec: value });
    const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies
      .find((item) => item.companyId === this.props.company.settings.companyId);
    this.props.dispatch(companyActions.updateCompanySettings({
      imageBase64: activeCompany && activeCompany.imageBase64,
      ...this.props.company.settings,
      booktimeOnlineStepSec: value,
    }, 'isServiceIntervalLoading'));
  }


  handleScreenCheckboxChange(firstScreen) {
    this.setState({ firstScreen });
    const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies
      .find((item) => item.companyId === this.props.company.settings.companyId);
    this.props.dispatch(companyActions.updateCompanySettings({
      imageBase64: activeCompany && activeCompany.imageBase64,
      ...this.props.company.settings,
      firstScreen,
    }, 'isFirstScreenLoading'));
  }

  handleStepChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleStepSubmit() {
    const { booktimeStep } = this.state;
    const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies
      .find((item) => item.companyId === this.props.company.settings.companyId);

    this.props.dispatch(companyActions.updateCompanySettings({
      imageBase64: activeCompany && activeCompany.imageBase64,
      ...this.props.company.settings,
      booktimeStep,
    }, null, 'stepSaved'));
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { booking } = this.state;

    const { dispatch } = this.props;

    const bookElement = { ...booking, [name]: value };

    this.setState({ booking: bookElement });
    dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement)));
  }

  handleMessageChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleSubmit() {
    const { onlineZapisEndTimeMillis, onlineZapisOn, appointmentMessage, existingAppointmentIgnored } = this.state;
    const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies
      .find((item) => item.companyId === this.props.company.settings.companyId);
    this.props.dispatch(companyActions.add({
      imageBase64: activeCompany && activeCompany.imageBase64,
      ...this.props.company.settings,
      appointmentMessage,
      onlineZapisEndTimeMillis,
      onlineZapisOn,
      existingAppointmentIgnored,
    }));
  }

  componentDidMount() {
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
    document.title = this.props.t('????????????-???????????? | ????????????-????????????');

    initializeJs();
  }

  queryInitData() {
    this.props.dispatch(companyActions.getSubcompanies());
    this.props.dispatch(companyActions.getBookingInfo());
  }

  handleOutsideClick() {
    this.setState({
      isOnlineZapisOnDropdown: false,
    });
  }

  setColor(color) {
    const { booking } = this.state;
    const { dispatch } = this.props;

    const bookElement = { ...booking, bookingColor: parseInt(color, 16) };

    this.setState({ booking: bookElement });
    dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement)));
  }

  setBookingCode(type, updatePosition) {
    const { dispatch } = this.props;
    const { booking } = this.state;
    const { bookingCode } = booking;

    const bookingCodeClassNames = bookingCode.split(' ');
    bookingCodeClassNames[updatePosition ? 1 : 0] = type;

    const bookElement = { ...booking, bookingCode: bookingCodeClassNames[0] + ' ' + bookingCodeClassNames[1] };

    // this.setState({booking: bookElement})
    dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement), updatePosition));
  }

  copyToClipboard(e, key) {
    // this[key].select();

    const textField = document.createElement('textarea');
    textField.innerText = this[key].textContent;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    e.target.focus();
    this.setState({ copySuccess: 'Copied!', messageCopyModalOpen: true });
  };

  render() {
    const { company, t } = this.props;
    const {
      booking, booktimeStep, appointmentMessage, urlButton, selectedDay, onlineZapisOn, booktimeOnlineStepSec, status, existingAppointmentIgnored,
    } = this.state;

    const isOnlineZapisChecked = !onlineZapisOn;

    const { isServiceIntervalLoading, isBookingInfoLoading, isFirstScreenLoading, saved } = company;

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
      <div>
        {booking &&
          <div className="pages-content container-fluid online-zapis-page">
            <div className="row h-100 justify-content-between">
              <div className="col-xl-4 block-h p-0">
                <div className=" content-pages-bg mb-0 h-auto p-zapis your-page">
                  <p className="title mb-3">{t('???????? ????????????????')}</p>
                  <p className="text">
                    {t("?????????????????? ???? ???????????? ?????? ????????, ?????????? ?????????????? ???????? ???????????????????????? ???????????????? ????????????-????????????, ???? ?????????????? ???????????????? ???????? ?????????? ???????????? ????????????????????????. ?????????? ???? ???????????? ?????????????? ???????????? ???????????????? ?? ?????????????? ???????????? ????????????-???????????????????????? ???? ?????????? ??????????.")}
                  </p>
                  <div className="booking-page">
                    <a
                      target="_blank"
                      href={'https://online-zapis.com/online/' + booking.bookingPage}
                      className=""
                      ref={(text) => this.textLink = text}
                    >
                      {'online-zapis.com/online/' + booking.bookingPage}
                    </a>
                    <span onClick={(e) => this.copyToClipboard(e, 'textLink')}/>
                  </div>
                  <div className="clearfix"/>

                </div>
                <div className=" content-pages-bg mb-0 p-zapis h-auto extra-messages">
                  <p className="title">
                    {t("???????????????????????????? ?????????????????? ?? ????????????-????????????")}
                    <Hint
                      customLeft="-1px"
                      hintMessage={
                        t('???????????????? ???????????? ?????????????????? ???????????????? ????????????????????, ???????????????? ?????????????????? ???? ???????????????????????? ????????????????????')
                      }
                    />
                  </p>
                  <textarea
                    className="text"
                    onChange={this.handleMessageChange}
                    name="appointmentMessage"
                    value={appointmentMessage}
                  />

                  <p className="title limit-time">
                    {t("???????????????????? ?????????? ????????????-????????????")}
                    &nbsp;
                    <Hint
                      customLeft="-4px"
                      hintMessage={t("???? ?????????????????? (???????? ??????????????????), ???????????????? ???????????? ????????????-???????????? ???????????????????? 6 ??????")}
                    />
                  </p>

                  <div className="check-box">
                    <label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isOnlineZapisChecked}
                        onChange={() => this.handleCheckboxChange('onlineZapisOn')}
                      />
                      <span data-label-off={t("????????")} data-label-on={t("??????")} className="check"/>
                    </label>
                  </div>

                  {isOnlineZapisChecked &&
                    <div className="online-page-picker online-zapis-date-picker mb-3">
                      <DatePicker
                        // closedDates={staffAll.closedDates}
                        type="day"
                        selectedDay={selectedDay}
                        handleDayClick={this.handleDayClick}
                        dayPickerProps={dayPickerProps}
                        language={this.props.i18n.language}
                      />
                    </div>
                  }
                  {status === 'saved.settings' && <p className="alert-success p-1 rounded pl-3">{t("??????????????????")}</p>}
                  <button className="ahref button button-save" onClick={this.handleSubmit}>
                    {t("??????????????????")}
                  </button>
                </div>

                <div className=" content-pages-bg p-zapis h-auto start-window">
                  <p className="title">{t("?????????????????? ???????? ?? ????????????-????????????")}</p>
                  <div className="check-box">
                    <label>
                      {isFirstScreenLoading
                        ?
                        <div style={{ position: 'absolute', left: '-10px', width: 'auto' }} className="loader">
                          <img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
                        </div>
                        :
                        <React.Fragment>
                          <input
                            className="form-check-input"
                            checked={(company.settings && company.settings.firstScreen) === 'staffs'}
                            onChange={() => this.handleScreenCheckboxChange('staffs')}
                            type="checkbox"
                          />
                          <span className="check-box-circle"/>
                        </React.Fragment>
                      }
                      {t("????????????????????")}
                    </label>
                  </div>
                  <div className="check-box">
                    <label>
                      {isFirstScreenLoading
                        ?
                        <div style={{ position: 'absolute', left: '-10px', width: 'auto' }} className="loader">
                          <img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
                        </div>
                        :
                        <React.Fragment>
                          <input
                            className="form-check-input"
                            checked={(company.settings && company.settings.firstScreen) === 'services'}
                            onChange={() => this.handleScreenCheckboxChange('services')}
                            type="checkbox"
                          />
                          <span className="check-box-circle"/>
                        </React.Fragment>
                      }
                      {t("????????????")}
                    </label>
                  </div>
                </div>

                <div className=" content-pages-bg mb-0 h-auto p-zapis online-interval">
                  <p className="title mb-3">{t("???????????????? ????????????-????????????")}</p>
                  

                  {this.onlineIntervalData.map(({ value, content }) => (
                    <div className="check-box" key={value}>
                    <label>
                      {isServiceIntervalLoading
                        ?
                        <div style={{ position: 'absolute', left: '-10px', width: 'auto' }} className="loader">
                          <img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
                        </div>
                        :
                        <React.Fragment>
                          <input
                            className="form-check-input"
                            checked={booktimeOnlineStepSec === value}
                            onChange={() => this.onIntervalChange(value)}
                            type="checkbox"
                          />
                          <span className="check-box-circle"/>
                        </React.Fragment>
                      }
                      {content} {t("??????????")}
                    </label>
                  </div>
                  ))}

                  <div className="check-box">
                    <label>
                      {isServiceIntervalLoading
                        ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }}
                          className="loader"><img style={{ width: '40px' }}
                            src={`${process.env.CONTEXT}public/img/spinner.gif`}
                            alt=""/></div>
                        : <React.Fragment>
                          <input className="form-check-input"
                            checked={!booktimeOnlineStepSec}
                            onChange={() => this.onIntervalChange(0)}
                            type="checkbox"/>
                          <span className="check-box-circle"/>
                        </React.Fragment>
                      }
                      {t("?????????? ?????????????? ????????????")}
                    </label>
                  </div>
                </div>

                <div className="content-pages-bg mb-0 h-auto p-zapis journal-interval">
                  <p className="title">{t("?????????????????????????? ????????????")}</p>
                  <div className="check-box">
                    <label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={existingAppointmentIgnored}
                        onChange={() => this.handleCheckboxChange('existingAppointmentIgnored')}
                      />
                      <span data-label-off={t("????????")} data-label-on={t("??????")} className="check"/>
                    </label>
                    
                  {status === 'saved.settings' && <p className="alert-success p-1 rounded pl-3">{t("??????????????????")}</p>}
                  <button className="ahref button button-save mt-3" onClick={this.handleSubmit}>
                    {t("??????????????????")}
                  </button>
                  </div>
                </div>

                <div className="content-pages-bg mb-0 h-auto p-zapis journal-interval">
                  <p className="title">{t("???????????????? ???????????? ?? ????????????")}</p>
                  <select
                    className="custom-select"
                    name="booktimeStep"
                    onChange={this.handleStepChange}
                    value={booktimeStep}
                  >
                    <option value={300}>5 {t("??????????")}</option>
                    <option value={600}>10 {t("??????????")}</option>
                    <option value={900}>15 {t("??????????")}</option>
                    <option value={1800}>30 {t("??????????")}</option>
                  </select>
                  {saved === 'stepSaved' && <p className="alert-success p-1 rounded pl-3">{t("??????????????????")}</p>}
                  <button className="ahref button button-save" onClick={this.handleStepSubmit}>
                    {t("??????????????????")}
                  </button>
                </div>
              </div>

              <div className="col-xl-8 content-pages-bg main-tab">
                <p className="title mb-3">{t("?????????? ????????????")}</p>
                <p className="text">
                  {t("?????????? ???????????????????? ???????????? ????????????-???????????? ???? ????????, ???????????????? ???????? ??????????????, ???????????????????? ?????? ?? ?????????????????? ???? ????????.")}
                </p>

                <hr/>
                {/* <div className="form-button">
                  <div>
                    <p className="sub-title">{t("?????????? ????????????")}</p>
                  </div>
                  <div className="buttons">
                    <button
                      type="button"
                      className={(booking.bookingCode.split(' ')[0] === 'button-standart' && 'active') +
                      ' button-standart mb-3 ml-0 mr-2 mt-0'
                      }
                      onClick={() => this.setBookingCode('button-standart')} style={{
                        'animation': 'unset',
                        'height': '40px',
                        'width': '55px',
                        'backgroundColor': booking.bookingColor.toString(16),
                      }}
                    />

                    <button
                      type="button"
                      className={(booking.bookingCode.includes('button-site') && 'active') +
                      ' button-site mb-3 ml-0 mr-2 mt-0 '
                      }
                      onClick={() => this.setBookingCode('button-site')} style={{
                        'animation': 'unset',
                        'height': '40px',
                        'width': '55px',
                        'backgroundColor': booking.bookingColor.toString(16),
                      }}
                    />

                    <button
                      type="button"
                      className={(booking.bookingCode.includes('button-round-border') && 'active') +
                      ' button-round-border mb-3 ml-0 mr-2 mt-0'
                      }
                      onClick={() => this.setBookingCode('button-round-border')} style={{
                        'animation': 'unset',
                        'height': '40px',
                        'width': '55px',
                        'backgroundColor': booking.bookingColor.toString(16),
                      }}
                    />

                    <button
                      type="button"
                      className={(booking.bookingCode.split(' ')[0] === 'small-button-standart' && 'active') +
                      ' small-button-standart mb-3 ml-0 mr-2 mt-0'
                      }
                      onClick={() => this.setBookingCode('small-button-standart')} style={{
                        'animation': 'unset',
                        'height': '50px',
                        'width': '50px',
                        'backgroundColor': booking.bookingColor.toString(16),
                      }}
                    />

                    <button
                      type="button"
                      className={(booking.bookingCode.includes('small-button-round') && 'active') +
                      ' small-button-round mb-3 ml-0 mr-2 mt-0'
                      }
                      onClick={() => this.setBookingCode('small-button-round')} style={{
                        'animation': 'unset',
                        'height': '50px',
                        'width': '50px',
                        'backgroundColor': booking.bookingColor.toString(16),
                      }}
                    />
                  </div>
                </div> */}
                <p className="sub-title m-20">{t("???????????????? ???????? ??????????????")}</p>
                <div className="chose_button">
                  {this.buttonColors.map((color) => 
                  <a
                    className={(booking.bookingColor.toString(16).toUpperCase() === color && 'active') +
                    ` button-color color${color}`
                    }
                    onClick={() => this.setColor(color)}
                    key={color}
                    >
                  <span />
                </a>)}
                </div>

                <div className="form-button">
                  <div>
                    <p className="sub-title position-button">{t("???????????????????????? ????????????")}</p>
                  </div>

                  <div className="row position-button">
                    <div className="check-box">
                      <label>
                        {isBookingInfoLoading
                          ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }}
                            className="loader"><img style={{ width: '40px' }}
                              src={`${process.env.CONTEXT}public/img/spinner.gif`}
                              alt=""/></div>
                          : <React.Fragment>
                            <input className="form-check-input"
                              checked={booking.bookingCode.includes('left')}
                              onChange={() => this.setBookingCode('left', true)}
                              type="checkbox"/>
                            <span className="check-box-circle"/>
                          </React.Fragment>
                        }
                        {t("??????????")}
                      </label>
                    </div>
                    <div className="check-box">
                      <label>
                        {isBookingInfoLoading
                          ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }}
                            className="loader"><img style={{ width: '40px' }}
                              src={`${process.env.CONTEXT}public/img/spinner.gif`}
                              alt=""/></div>
                          : <React.Fragment>
                            <input className="form-check-input"
                              checked={!booking.bookingCode.includes('left')}
                              onChange={() => this.setBookingCode('right', true)}
                              type="checkbox"/>
                            <span className="check-box-circle"/>
                          </React.Fragment>
                        }
                        {t("????????????")}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="">
                  {/* <p className="sub-title mb-3">???????????????? ????????????</p>*/}
                  {/* <input type="text" placeholder="????????????????: ????????????-????????????" value={booking.bookingButton}
                  name="bookingButton" onChange={this.handleChange}/>*/}
                  <strong className="sub-title text-example">{t("????????????")}</strong>
                  <div style={{
                    display: 'flex',
                    justifyContent: (booking.bookingCode.includes('left') ? 'flex-start' : 'flex-end'),
                  }} className="buttons-container-color-form mb-4 but">
                    <button
                      type="button"
                      className={'exemple-buton ' + booking.bookingCode + ' color' +
                      booking.bookingColor.toString(16)}
                    >
                      {t("???????????? ????????????")}
                    </button>
                  </div>

                  <div className="row code-buttons">
                    <p className="sub-title">{t("??????")}: </p>
                    <div className="check-box">
                      <label>
                        {isBookingInfoLoading
                          ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }}
                            className="loader"><img style={{ width: '40px' }}
                              src={`${process.env.CONTEXT}public/img/spinner.gif`}
                              alt=""/></div>
                          : <React.Fragment>
                            <input className="form-check-input"
                              checked={!this.state.urlButton}
                              onChange={() => this.setState({
                                ...this.state,
                                urlButton: false,
                              })}
                              type="checkbox"/>
                            <span className="check-box-circle"/>
                          </React.Fragment>
                        }
                       {t("?????? ???????????? ???? ????????")}
                      </label>
                    </div>

                    <div className="check-box">
                      <label>
                        {isBookingInfoLoading
                          ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }}
                            className="loader"><img style={{ width: '40px' }}
                              src={`${process.env.CONTEXT}public/img/spinner.gif`}
                              alt=""/></div>
                          : <React.Fragment>
                            <input className="form-check-input"
                              checked={this.state.urlButton}
                              onChange={() => this.setState({
                                ...this.state,
                                urlButton: true,
                              })}
                              type="checkbox"/>
                            <span className="check-box-circle"/>
                          </React.Fragment>
                        }
                        {t("?????? ???????????? ???? ????????")}
                      </label>
                    </div>


                  </div>
                  {!urlButton &&
                    <textarea ref={(textarea) => this.textArea = textarea} spellCheck="off"
                      autoCorrect="off" className="copy-code" value={'' +
                    '<button type="button" onclick="displayFrame()" id=\'bb\' class=\'' + booking.bookingCode +
                    ' color' + booking.bookingColor.toString(16).toUpperCase() + '\' code=\'' +
                    booking.bookingPage + '\' style=\'visibility: hidden\'>' + t("???????????? ????????????") + '</button>\n' +
                    '<script type="text/javascript" src="https://online-zapis.com/bb/frame.js"></script>'}/>
                  }
                  {urlButton &&
                    <textarea ref={(textarea) => this.textArea = textarea} spellCheck="off"
                      autoCorrect="off" className="copy-code" value={'' +
                    '<a type="button" onclick="displayFrame()" id=\'bb\' class=\'url\' code=\'' +
                    booking.bookingPage + '\' style=\'visibility: hidden\'>'+ t("???????????? ????????????") +'</a>\n' +
                    '<script type="text/javascript" src="https://online-zapis.com/bb/frame.js"></script>'}/>
                  }
                  <p onClick={(e) => this.copyToClipboard(e, 'textArea')}
                    className="copy-code">{t("?????????????????????? ??????")}</p>
                </div>
              <SocialNetworks t={t} companyId={company?.settings?.companyId || null} />
              </div>
            </div>

            {this.state.messageCopyModalOpen &&
              <div className="message-is-sent-wrapper">
                <div className="message-is-sent-modal">
                  <button onClick={this.handleMessageCopyModal} className="close" />
                  <div className="modal-body">
                    <img src={`${process.env.CONTEXT}public/img/icons/Check_mark.svg`}
                      alt="message is sent image"/>
                    <p className="body-text">
                      {t("??????????????????????!")}
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    );
  }

  handleMessageCopyModal() {
    this.setState({ messageCopyModalOpen: false });
  }

  handleDayClick(day) {
    const daySelected = moment(day);

    this.setState({
      selectedDay: daySelected.utc().startOf('day').toDate(),
      onlineZapisEndTimeMillis: parseInt(moment(day).format('x')),
    });
  }
}

function mapStateToProps(state) {
  const { alert, company, authentication } = state;
  return {
    alert, company, authentication,
  };
}

export default connect(mapStateToProps)(withTranslation("common")(Index));
