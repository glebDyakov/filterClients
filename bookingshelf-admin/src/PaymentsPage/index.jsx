import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import ForAccountant from '../_components/modals/ForAccountant';
import { MakePayment } from '../_components/modals/MakePayment';

import { paymentsActions, companyActions } from '../_actions';
import { staffActions } from '../_actions/staff.actions';

import '../../public/scss/payments.scss';
import {withTranslation} from "react-i18next";

class Index extends Component {
  constructor(props) {
    super(props);
    this.changeSMSResult = this.changeSMSResult.bind(this);
    this.repeatPayment = this.repeatPayment.bind(this);
    this.downloadInPdf = this.downloadInPdf.bind(this);
    this.calculateRate = this.calculateRate.bind(this);
    this.AddingInvoice = this.AddingInvoice.bind(this);
    this.closeModalActs = this.closeModalActs.bind(this);
    this.AddingInvoiceStaff = this.AddingInvoiceStaff.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.redirect = this.redirect.bind(this);
    this.setDefaultWorkersCount = this.setDefaultWorkersCount.bind(this);

    this.state = {
      list: this.props.payments.list,
      defaultList: this.props.payments.list,
      search: false,
      SMSCountChose: 2,
      SMSCount: 5000,
      SMSPrice: 75,
      chosenAct: {},
      staffCount: 0,
      chosenInvoice: {},
      invoiceSelected: false,
      country: this.props.company.settings || {},
      // country: '',
      rate: {
        workersCount: -1,
        specialWorkersCount: '',
        period: '1',
      },
      finalPrice: this.props.company.settings ? ((this.props.company.settings.countryCode) ?
        ((this.props.company.settings.countryCode) === 'BLR' ?
          '15' : ((this.props.company.settings.countryCode) === 'UKR' ?
            '180' : ((this.props.company.settings.countryCode) === 'RUS' ?
              '480' : '15'))) : '15') : '',
      finalPriceMonth: this.props.company.settings ? ((this.props.company.settings.countryCode) ?
        ((this.props.company.settings.countryCode) === 'BLR' ?
          '5' : ((this.props.company.settings.countryCode === 'UKR' ?
            '60' : (this.props.company.settings.countryCode) === 'RUS' ?
              '160' : '5'))) : '5') : '',
    };
  }

  componentDidMount() {
    this.props.dispatch(companyActions.get());
    this.props.dispatch(paymentsActions.getInvoiceList());
    this.props.dispatch(paymentsActions.getPackets());
    if (this.props.staff.staff && this.props.staff.staff.length) {
      this.setDefaultWorkersCount(this.props.staff.staff);
    }
    this.props.dispatch(staffActions.get());
    if (this.props.authentication.user && this.props.authentication.user.profile &&
      (this.props.authentication.user.profile.roleId === 4)
    ) {
      this.props.dispatch(companyActions.getSubcompanies());
    }

    const { user } = this.props.authentication;
    if (user && (user.forceActive
            || (moment(user.trialEndDateMillis).format('x') >= moment().format('x'))
            || (user.invoicePacket && moment(user.invoicePacket.endDateMillis).format('x') >= moment().format('x'))
    )) {
    } else {
      this.setDefaultWorkersCount(this.props.staff.staff);
      this.props.dispatch(companyActions.get());
      this.props.dispatch(companyActions.getBookingInfo());
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.payments && this.props.payments.list &&
      (JSON.stringify(this.props.payments.list) !== JSON.stringify(newProps.payments.list))
    ) {
      this.setState({ list: newProps.payments.list, defaultList: newProps.payments.list });
    }
    if (JSON.stringify(this.props.payments.activeInvoice) !== JSON.stringify(newProps.payments.activeInvoice)) {
      this.repeatPayment(newProps.payments.activeInvoice.invoiceId);
    }
    if (JSON.stringify(this.props.payments.packets) !== JSON.stringify(newProps.payments.packets)) {
      this.calculateRate(newProps.payments.packets);
    }
    if (newProps.payments.confirmationUrl &&
      (this.props.payments.confirmationUrl !== newProps.payments.confirmationUrl)
    ) {
      this.setState({ invoiceSelected: false });
    }
    if (JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff)) {
      this.setDefaultWorkersCount(newProps.staff.staff);
    }
  }


  setDefaultWorkersCount(staff) {
    const { company } = this.props;
    const companyTypeId = company.settings && company.settings.companyTypeId;
    const count = staff ? staff.length : -1;
    if ((companyTypeId === 2)) {
      if (count <= 5) {
        console.log(count);
        this.setState(
          { staffCount: count, rate: { ...this.state.rate, workersCount: count } },
          () => this.calculateRate(),
        );
      } else {
        console.log(count);

        this.rateChangeSpecialWorkersCount('to 30', count);
        this.setState({ staffCount: count });
      }
    } else {
      this.setState({ staffCount: count });
      if (count <= 10) {
        this.setState(
          { staffCount: count, rate: { ...this.state.rate, workersCount: count } },
          () => this.calculateRate(),
        );
      } else if (count > 10 && count <= 20) {
        this.rateChangeSpecialWorkersCount('to 20', count);
      } else if (count > 20 && count <= 30) {
        this.rateChangeSpecialWorkersCount('to 30', count);
      } else {
        this.rateChangeSpecialWorkersCount('from 30', count);
      }
    }
  }

  AddingInvoice() {
    const { chosenAct } = this.state;
    if (chosenAct && chosenAct.packetId) {
      this.props.dispatch(paymentsActions.addInvoice(JSON.stringify([
        {
          packetId: chosenAct.packetId,
          amount: 1,
          discountAmount: 0,
          startDateMillis: moment().format('x'),
        },
      ],
      )));
    }
  }

  AddingInvoiceStaff() {
    const { rate } = this.state;
    const { packets } = this.props.payments;

    let amount;
    switch (rate.period) {
      case '1':
        amount = 3;
        break;
      case '2':
        amount = 6;
        break;
      case '3':
        amount = 12;
        break;
    }
    let staffAmount;
    if (rate.specialWorkersCount === '') {
      staffAmount = parseInt(rate.workersCount);
    } else {
      switch (rate.specialWorkersCount) {
        case 'to 20':
          staffAmount = 20;
          break;
        case 'to 30':
          staffAmount = 30;
          break;
        case 'from 30':
          staffAmount = 50;
          break;
      }
    }
    const packetId = packets && packets
      .filter((item) => item.packetType === 'USE_PACKET')
      .find((item) => item.staffAmount === staffAmount).packetId;

    let discountAmount;
    switch (amount) {
      case 6:
        discountAmount = 1;
        break;
      case 12:
        discountAmount = 3;
        break;
      default:
        discountAmount = 0;
    }

    this.props.dispatch(paymentsActions.addInvoice(JSON.stringify([
      {
        packetId: packetId,
        amount: amount,
        discountAmount,
        startDateMillis: moment().format('x'),
      },
    ],
    )));
  }

  redirect(url) {
    this.props.history.push(url);
  }

  closeModalActs() {
    this.setState({ invoiceSelected: false });
  }

  downloadInPdf(pdfMarkup) {
    html2canvas(document.getElementById('divIdToPrint')).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('invoice.pdf');
    });
  }


  rateChangeWorkersCount(e) {
    const { value } = e.target;

    this.setState({ rate: { ...this.state.rate, workersCount: value, specialWorkersCount: '' } });
  }

  rateChangeSpecialWorkersCount(value) {
    // this.setState({staffCount: count, rate: {...this.state.rate, workersCount: '', specialWorkersCount: value}});
    this.setState(
      { rate: { ...this.state.rate, workersCount: '', specialWorkersCount: value } },
      () => this.calculateRate(),
    );
  }

  rateChangePeriod(e) {
    const { value } = e.target;

    this.setState({ rate: { ...this.state.rate, period: value } });
  }

  calculateRate(packets = this.props.payments.packets) {
    const { workersCount, specialWorkersCount, period } = this.state.rate;
    const { countryCode } = this.state.country;

    const price1to10 = (packets && packets.find((item) => item.packetId === parseInt(workersCount)) || {});
    const priceTo20packet = (packets && packets.find((item) => item.packetId === 11) || {});
    const priceTo30packet = (packets && packets.find((item) => item.packetId === 12) || {});
    const priceFrom30packet = (packets && packets.find((item) => item.packetId === 13) || {});

    let finalPrice = 0; let finalPriceMonth = 0; let finalPriceMonthDiscount = 0;

    switch (specialWorkersCount) {
      case 'to 20':
        finalPriceMonth = priceTo20packet.price;
        finalPriceMonthDiscount = priceTo20packet.discountPrice;
        break;
      case 'to 30':
        finalPriceMonth = priceTo30packet.price;
        finalPriceMonthDiscount = priceTo30packet.discountPrice;
        break;
      case 'from 30':
        finalPriceMonth = priceFrom30packet.price;
        finalPriceMonthDiscount = priceFrom30packet.discountPrice;
        break;
      case '':
        finalPriceMonth = price1to10.price;
        finalPriceMonthDiscount = price1to10.discountPrice;
        break;
    }

    finalPriceMonthDiscount = finalPriceMonthDiscount === finalPriceMonth ? null : finalPriceMonthDiscount;

    switch (period) {
      case '1':
        finalPrice = (finalPriceMonthDiscount || finalPriceMonth) * 3;
        break;
      case '2':
        finalPrice = (finalPriceMonthDiscount || finalPriceMonth) * 5;
        finalPriceMonth *= 5 / 6;
        finalPriceMonthDiscount *= 5 / 6;
        break;
      case '3':
        finalPrice = (finalPriceMonthDiscount || finalPriceMonth) * 9;
        finalPriceMonth *= 9 / 12;
        finalPriceMonthDiscount *= 9 / 12;
        break;
    }

    this.setState({
      finalPrice: finalPrice.toFixed(2),
      finalPriceMonth: finalPriceMonth && finalPriceMonth.toFixed(2),
      finalPriceMonthDiscount: finalPriceMonthDiscount && finalPriceMonthDiscount.toFixed(2),
    });
  }

  changeSMSResult() {
    const { SMSCountChose } = this.state;

    switch (SMSCountChose) {
      case 1:
        this.setState({ SMSCount: 1000, SMSPrice: 17 });
        break;
      case 2:
        this.setState({ SMSCount: 5000, SMSPrice: 75 });
        break;
      case 3:
        this.setState({ SMSCount: 10000, SMSPrice: 140 });
        break;
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if ((this.state.SMSCountChose !== prevState.SMSCountChose)) {
      this.changeSMSResult();
    }
    if (JSON.stringify(prevState.rate) !== JSON.stringify(this.state.rate)) {
      this.calculateRate();
    }
  }

  repeatPayment(invoiceId) {
    const { pendingInvoice } = this.props.payments;
    this.props.dispatch(paymentsActions.getInvoice(invoiceId));
    if (pendingInvoice && pendingInvoice.invoiceStatus === 'ISSUED') {
      setTimeout(() => {
        this.repeatPayment(invoiceId);
      }, 30000);
    }
  }

  render() {
    const { authentication, t } = this.props;
    const {
      chosenAct, finalPriceMonthDiscount, staffCount, finalPrice, finalPriceMonth,
      chosenInvoice, invoiceSelected, list,
    } = this.state;
    const { workersCount, period, specialWorkersCount } = this.state.rate;
    const { countryCode } = this.state.country;
    const { packets, isLoading } = this.props.payments;
    const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
    let activePacket;
    if (packets && authentication.user && authentication.user.invoicePacket) {
      activePacket = packets.find((packet) => packet.packetId === authentication.user.invoicePacket.packetId);
    }

    const { pathname } = this.props.location;
    if (pathname === '/payments') {
      document.title = t('Оплата | Онлайн-запись');
    } else if (pathname === '/invoices') {
      document.title = t('Счета | Онлайн-запись');
    }
    const currentPacket = activePacket
      ? activePacket.packetName
      : authentication.user && (authentication.user && authentication.user.forceActive ||
        (moment(authentication.user.trialEndDateMillis).format('x') >= moment().format('x'))
        ? t('Пробный период')
        : t('Нет выбранного пакета')
      );
    const paymentId = authentication && authentication.user && authentication.user.menu
      .find((item) => item.id === 'payments_menu_id');
    if (!paymentId && currentPacket === t('Нет выбранного пакета')) {
      return (
        <div style={{ color: '#0a1330', fontSize: '22px' }} className="payments-message">
                    {t("Срок действия лицензии истек")}
        </div>
      );
    }

    const chosenPacket = packets && packets
      .find((packet) => packet.packetId ===
        (chosenInvoice.invoicePackets && chosenInvoice.invoicePackets[0].packetId),
      ) || {};

    const pdfMarkup =
      <React.Fragment>
        <div id="divIdToPrint">
          <div className="row customer-seller">
            {authentication.user && <div className="col-md-4 col-12 customer">
              <p>{t("Лицензиат")}: <strong>{authentication.user.companyName}</strong></p>
              <p>{t("Представитель")}: <strong>
                {authentication.user.profile
                  ? authentication.user.profile.lastName
                  : ''} {authentication.user.profile.firstName}
              </strong></p>
              <p>{t("Адрес")}: <strong>
                {authentication.user.companyAddress1 || authentication.user.companyAddress2
                || authentication.user.companyAddress3}
              </strong>
              </p>
            </div>}

            <div className="col-md-4 col-12 seller">
              <p>{t("Лицензиар")}: <strong>{t("СОФТ-МЭЙК. УНП 191644633")}</strong></p>
              <p>{t("Адрес")}: <strong>{t("220034, Беларусь, Минск, Марьевская 7а-1-6")}</strong></p>
              <p>{t("Телефон")}: <strong>+375 44 5655557</strong></p>
            </div>

            <div className="col-md-4 col-12 payments-type">
              <p>{t("Способ оплаты")}: <strong>Credit Card / WebMoney / Bank Transfer</strong></p>
              {chosenInvoice.invoiceStatus !== 'PAID' && <p>
                              {t("Заплатить до")}: <strong>{moment(chosenInvoice.dueDateMillis).format('DD.MM.YYYY')}</strong>
              </p>}
              <p>{t("Статус")}: <span
                className="status"
                style={{ color: chosenInvoice.invoiceStatus === 'PAID' ? '#34C38F' : '#50A5F1' }}
              >
                {chosenInvoice.invoiceStatus === 'ISSUED' ? t('Оплатить') :
                  (chosenInvoice.invoiceStatus === 'PAID' ? t('Оплачено') :
                    (chosenInvoice.invoiceStatus === 'CANCELLED' ? t('Закрыто') : ''))
                }
              </span>
              </p>
            </div>
          </div>

          <hr/>

          <div className="table">
            <div className="table-header row">
              <div className="col-4 table-description"><p>{t("Описание")}:</p></div>
              <div className="col-4 table-count"><p
                className="default">{t("Количество")}:</p>
              <p
                className="mob">{t("Количество")} {chosenPacket.packetType !== 'SMS_PACKET' ? 'мес.' : ''}</p>
              </div>
                <div className="col-4 table-price"><p>{t("Стоимость")}:</p></div>
            </div>
            {chosenInvoice && chosenInvoice.invoicePackets && chosenInvoice.invoicePackets.map((packet, i) => {
              const name = packets && packets.find((item) => item.packetId === packet.packetId);
              return (
                <div key={`payments-page_table-item-${i}`} className="table-row row">
                  <div className="col-4 table-description">
                    <p>{name && name.packetName} {chosenPacket.packetType !== 'SMS_PACKET'
                      ? ''
                      : `, ${chosenPacket.smsAmount} sms`}
                    </p>
                  </div>
                  <div className="col-4 table-count"><p>{packet.amount}</p>
                  </div>
                  <div className="col-4 table-price">
                    <p>{packet.sum} {packet.currency}</p></div>
                </div>
              );
            })}
          </div>

          <hr/>

          <div className="row footer-container">
            <div className="col-12 col-md-4 result-price-container">
              <div className="result-price">
                <div>
                  <p>{t("Общая сумма")}:</p>
                </div>
                <div>
                  <p className="bold-text">{chosenInvoice.totalSum} {chosenInvoice.currency}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 result-price-container">
              <div className="result-price">
                <div>
                  <p>{t("Без НДС")}</p>
                </div>
                <div>
                  <p className="bold-text">0.00 {chosenInvoice.currency}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 payment-button-container">
              <p className="download"
                onClick={() => this.downloadInPdf(pdfMarkup)}>{t("Скачать в PDF")}</p>
              {chosenInvoice.invoiceStatus !== 'PAID' && <div className="row-status">
                <button className="inv-date" style={{
                  backgroundColor: chosenInvoice.invoiceStatus === 'ISSUED' ? '#0a1232' : '#fff',
                  color: chosenInvoice.invoiceStatus === 'ISSUED' ? '#fff' : '#000',
                }}
                data-target=".make-payment-modal"
                data-toggle="modal"
                onClick={() => {
                  this.props.dispatch(paymentsActions.makePayment(chosenInvoice.invoiceId));
                  this.repeatPayment(chosenInvoice.invoiceId);
                }}>
                  {chosenInvoice.invoiceStatus === 'ISSUED' ? t('Оплатить') :
                    (chosenInvoice.invoiceStatus === 'PAID' ? t('Оплачено') :
                      (chosenInvoice.invoiceStatus === 'CANCELLED' ? t('Закрыто') : ''))
                  }
                </button>
              </div>}

            </div>
          </div>
        </div>
      </React.Fragment>;

    const options = (companyTypeId === 2) ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <React.Fragment>
        {isLoading &&
                <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
        {!isLoading && <div className="h-100 retreats">


          <div className="tab-content">
            <div className={'tab-pane ' + (pathname === '/payments' ? 'active' : '')} id="payments">

              <div className={'d-flex flex-column-reverse flex-md-row align-items-start'+
                ' justify-content-between align-items-md-center mb-2'}
              >
                <div className="payments-license-block">
                  <a href={`${process.env.CONTEXT}public/_licenseDocument/license_agreement.pdf`} download>
                    {t("Лицензионный договор")}
                  </a>
                  <span data-toggle="modal" data-target=".accountant-modal-in">
                      {t("Для бухгалтерии")}
                  </span>
                </div>

                {authentication.user &&
                  <div className="current-packet-container">
                    <div className="current-packet text-left text-md-right">{t("Текущий пакет")}: {currentPacket}</div>
                    <div className="current-packet-timing text-left text-md-right">
                      {activePacket
                        ? t("Пакет действителен до") + ': ' +
                          moment(authentication.user.invoicePacket.endDateMillis).format('DD MMM YYYY')
                        : ((moment(authentication.user.trialEndDateMillis).format('x')
                          >= moment().format('x'))
                          ? t("Пакет действителен до") + ': ' +
                          moment(authentication.user.trialEndDateMillis).format('DD MMM YYYY')
                          : (authentication.user.forceActive ? t('Пробный период') + " " + t('продлён') : ''))
                      }
                    </div>
                  </div>
                }
              </div>

              <div className="payments-inner d-flex flex-column flex-lg-row">
                <div className="payments-list-block mb-2 mb-md-0">
                  <p className="title-payments">{t("Пакеты системы")}</p>
                  <div id="range-staff">
                    <p className="subtitle-payments mb-3 d-md-none">
                      {(companyTypeId === 2 || companyTypeId === 3)
                        ? t('Количество рабочих мест')
                        : (companyTypeId === 4 ? t('Количество врачей') : t('Количество сотрудников'))
                      }
                    </p>

                    <ul className="range-labels">
                      {options.map((option, i) => (
                        <li
                          key={`payments-page_range-labels-item-${i}`}
                          className={(parseInt(workersCount) === option
                            ? 'active selected ' : ' ') + ((staffCount) <= option ? ''
                            : 'disabledField')
                          }
                          onClick={() => {
                            if ((staffCount) <= option) {
                              this.setState({
                                rate: {
                                  ...this.state.rate,
                                  workersCount: option,
                                  specialWorkersCount: '',
                                },
                              });
                            }
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>

                    <div
                      className={(specialWorkersCount !== '') ? 'range range-hidden' : 'range'}
                      style={{ position: 'relative' }}
                    >
                      <input
                        type="range" min="1" max={(companyTypeId === 2) ? 5 : 10}
                        value={workersCount}
                        onChange={(e) => {
                          if ((staffCount) <= e.target.value) {
                            this.rateChangeWorkersCount(e);
                          }
                        }}
                      />
                      <div
                        className={(specialWorkersCount !== '') ? 'rateLine rateLineHidden' : 'rateLine'}
                        style={{ width: ((workersCount - 1) * ((companyTypeId === 2) ? 25 : 11)) + '%' }}
                      />
                    </div>
                  </div>

                  <div className="radio-buttons">
                    <p className="subtitle-payments d-none d-md-flex">
                      {(companyTypeId === 2 || companyTypeId === 3)
                        ? t('Количество рабочих мест')
                        : (companyTypeId === 4 ? t("Количество врачей") : t('Количество сотрудников'))
                      }
                    </p>

                    {(companyTypeId === 2) ? (
                      <div onClick={() => this.rateChangeSpecialWorkersCount('to 30')}>
                        <input type="radio" className="radio" id="radio2"
                          name="staff-radio"
                          checked={specialWorkersCount === 'to 30'}/>
                        <label htmlFor="radio2">{t("Больше 5")}</label>
                      </div>
                    ) : (
                      <React.Fragment>
                        <div
                          onClick={() => ((staffCount) <= 20) && this.rateChangeSpecialWorkersCount('to 20')}>
                          <input type="radio" className="radio" id="radio"
                            name="staff-radio"
                            checked={specialWorkersCount === 'to 20'}/>
                          <label className={(staffCount) <= 20 ? '' : 'disabledField'}
                            htmlFor="radio">{t("До 20")}</label>
                        </div>
                        <div
                          onClick={() => ((staffCount) <= 30) && this.rateChangeSpecialWorkersCount('to 30')}>
                          <input type="radio" className="radio" id="radio2"
                            name="staff-radio"
                            checked={specialWorkersCount === 'to 30'}/>
                          <label className={(staffCount) <= 30 ? '' : 'disabledField'}
                            htmlFor="radio2">{t("До 30")}</label>
                        </div>
                        <div onClick={() => this.rateChangeSpecialWorkersCount('from 30')}>
                          <input type="radio" className="radio" id="radio3"
                            name="staff-radio"
                            checked={specialWorkersCount === 'from 30'}/>
                          <label htmlFor="radio3">{t("Больше 30")}</label>
                        </div>
                      </React.Fragment>)}
                  </div>

                  <div id="range-month">
                    <p className="subtitle-payments mb-3 d-md-none">{t("Срок действия лицензии")}</p>

                    <ul className="range-labels">
                      <li className={period === '1' ? 'active selected' : ''}
                        onClick={() => this.setState({
                          rate: {
                            ...this.state.rate,
                            period: '1',
                          },
                        })}>{t("3 месяца")}
                      </li>
                      <li className={period === '2' ? 'active selected' : ''}
                        onClick={() => this.setState({
                          rate: {
                            ...this.state.rate,
                            period: '2',
                          },
                        })}>{t("6 месяцев")} <br/> ({t("+1 месяц бесплатно")})
                      </li>
                      <li className={period === '3' ? 'active selected' : ''}
                        onClick={() => this.setState({
                          rate: {
                            ...this.state.rate,
                            period: '3',
                          },
                        })}>{t("12 месяцев")} <br/> ({t("+3 бесплатно")})
                      </li>
                    </ul>

                    <div className="range" style={{ position: 'relative' }}>
                      <input type="range" min="1" max="3" value={period}
                        onChange={(e) => this.rateChangePeriod(e)}/>
                      <div className="rateLine" style={{ width: ((period - 1) * 50) + '%' }}/>
                    </div>

                  </div>
                  <p className="subtitle-payments d-none d-md-flex">{t("Срок действия лицензии")}</p>

                </div>

                <div className="payments-list-block2 mb-2 mb-md-0">
                  <div className="payments-content">
                    <p className="title-payments">{t("К оплате")}</p>
                    <div>
                      <p>{t("Срок действия лицензии")}: </p>
                      <span style={{ textAlign: 'right' }}>
                        {period === '1' ? t('3 месяца') : (period === '2') ? t('6 месяцев') : t('12 месяцев')}
                      </span>
                    </div>
                    <div>
                      <p>{t("Стоимость в месяц")}{finalPriceMonthDiscount ? ' ' + t("без скидки") + ' ' : ''}: </p>
                      <span style={{ textAlign: 'right' }}>
                        {finalPriceMonth} {countryCode ? (countryCode === 'BLR'
                          ? t('руб')
                          : (countryCode === 'UKR' ? t('грн') : (countryCode === 'RUS' ? 'руб' : 'руб'))) : t('руб')
                        }
                      </span>
                    </div>

                    {finalPriceMonthDiscount ? (
                      <div>
                        <p style={{ color: '#F46A6A' }}>{t("Стоимость в месяц со скидкой")}: </p>
                        <span style={{ color: '#F46A6A', textAlign: 'right' }}>
                          {finalPriceMonthDiscount} {countryCode
                            ? (countryCode === 'BLR' ? t('руб') : (countryCode === 'UKR'
                              ? t('грн')
                              : (countryCode === 'RUS' ? t('руб') : t('руб'))))
                            : t('руб')
                          }
                        </span>
                      </div>
                    ) : ''}
                    <div>
                      <p className="total-price">{t("Итоговая стоимость")}:
                        <span>
                          {finalPrice} {countryCode
                            ? (countryCode === 'BLR' ? t('руб') : (countryCode === 'UKR'
                              ? t('грн') : (countryCode === 'RUS' ? t('руб') : t('руб')))) : t('руб')
                          }
                        </span>
                      </p>
                    </div>

                    <button className={'button ' + (workersCount === -1 ? 'disabledField' : '')}
                      type="button"
                      disabled={workersCount === -1}
                      onClick={() => this.AddingInvoiceStaff()}>{t("Оплатить")}
                    </button>

                    {(countryCode && (countryCode === 'BLR' || countryCode === 'UKR')) &&
                      <div>
                        <p className="description">
                          ({t("Цены в национальной валюте указаны для ознакомления. Оплата производится по курсу в рос. рублях")})
                        </p>
                      </div>
                    }
                  </div>
                </div>

                <div className="payments-list-block3 mb-1 mb-md-0">
                  <div className="payments-content buttons-change">
                    <p className="title-payments">{t("SMS ПАКЕТЫ")}</p>

                    {packets && packets.filter((packet) => packet.packetType === 'SMS_PACKET')
                      .sort((a, b) => a.smsAmount - b.smsAmount)
                      .map((packet, i) => {
                        return (
                          <div key={`payments-page_payments-list-item-${i}`}>
                            <label>
                              <input
                                type="radio"
                                checked={this.state.chosenAct === packet}
                                onChange={() => this.setState({ chosenAct: packet })}
                                className=""
                                name="sms-price-radio"
                              />
                              <span className="check-box-circle" />
                              <span className="packets-container">
                                <span className="packet-name">{packet.packetName}: <span className="sms-amount">
                                  {packet.smsAmount} SMS</span>
                                </span>
                                <span className="sms-price">{packet.price} {packet.currency}</span>
                              </span>
                            </label>
                          </div>
                        );
                      })
                    }

                    {authentication && authentication.user && authentication.user.countryCode !== 'BLR' && (
                      <div style={{ color: '#d41316', fontSize: '16px', fontWeight: 'bold' }}>
                        {t("Пожалуйста, свяжитесь с администрацией сайта перед покупкой смс пакетов, нажав на знак вопроса в правом верхнем углу.")}
                      </div>)
                    }
                  </div>

                  <div className="payments-content total-price">
                    {chosenAct.packetName &&
                      <React.Fragment>
                        <div>
                          <p className="total-price">{t("Итоговая стоимость")}: <span>
                            {chosenAct.price ? chosenAct.price : 0} {chosenAct.currency}
                          </span>
                          </p>
                        </div>
                        <button className="button" type="button"
                          onClick={() => this.AddingInvoice()}>{t("Оплатить")}
                        </button>
                        {(countryCode && (countryCode === 'BLR' || countryCode === 'UKR')) && <div>
                          <p className="description">
                            ({t("Цены в национальной валюте указаны для ознакомления. Оплата производится по курсу в рос. рублях")})
                          </p>
                        </div>
                        }
                      </React.Fragment>
                    }
                  </div>
                </div>
              </div>

              <div id="acts">
                <h2 className="acts-title">{t("Счета")}</h2>
                <div className="invoice header-invoice">
                  <div className="inv-number">
                    <p className="d-none d-md-inline">{t("Номер счета")}</p>
                    <p className="d-md-none"># счета</p>
                  </div>
                  <div className="inv-date"><p>{t("Дата")}</p></div>
                  <div className="inv-date"><p>{t("Сумма")}</p></div>
                  <div className="inv-status"><p>{t("Статус")}</p></div>
                </div>

                {list.length ? list.sort((a, b) => {
                  if (a.invoiceStatus === 'ISSUED') {
                    return parseInt(b.createdDateMillis) - parseInt(a.createdDateMillis);
                  } else {
                  }
                }).map((invoice, i) => {
                  return (
                    <div
                      key={`payments-page_acts-list-item-${i}`}
                      className="invoice"
                      onClick={() => this.setState({
                        chosenInvoice: invoice,
                        invoiceSelected: true,
                      })}
                    >
                      <div className="inv-number"><p>{invoice.customId}</p></div>
                      <div className="inv-date">
                        <p>{moment(invoice.createdDateMillis).format('DD.MM.YYYY')}</p>
                      </div>
                      <div className="inv-date">
                        <p>{invoice.totalSum} {invoice.currency}</p></div>
                      <div className="inv-status">
                        <p style={{
                          color: invoice.invoiceStatus === 'ISSUED' ? '#50A5F1' : '#34C38F',
                        }}>
                          {invoice.invoiceStatus === 'ISSUED' ? t('Оплатить') :
                            (invoice.invoiceStatus === 'PAID' ? t('Оплачено') :
                              (invoice.invoiceStatus === 'CANCELLED' ? t('Закрыто') : ''))
                          }
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: 'center' }}>{t("Нет счетов для отображения")}</div>
                )}


                {invoiceSelected &&
                  <div className="chosen-invoice-wrapper">
                    <div className="chosen-invoice">
                      <div className="modal-header">
                        <h4 className="modal-title">
                          {t("Счет")} {chosenInvoice.customId}; {
                            moment(chosenInvoice.createdDateMillis).format('DD.MM.YYYY')
                          }
                        </h4>
                        <img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt=""
                          className="close" style={{ height: '50px' }}
                          onClick={() => this.closeModalActs()}
                        />
                      </div>
                      <div className="act-body-wrapper">
                        <div className="acts-body">
                          {pdfMarkup}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        }

        <ForAccountant />
        <MakePayment/>
      </React.Fragment>
    );
  }

  handleSearch() {
    const { defaultList } = this.state;

    const searchList = defaultList.filter((item) => {
      return String(item.customId).toLowerCase().includes(String(this.search.value).toLowerCase())
        || String(moment(item.createdDateMillis).format('DD.MM.YYYY'))
          .toLowerCase().includes(String(this.search.value).toLowerCase())
        || String(item.totalSum + ' ' + item.currency)
          .toLowerCase().includes(String(this.search.value).toLowerCase())
        || String(item.invoiceStatus === 'ISSUED' ? 'Оплатить' :
          (item.invoiceStatus === 'PAID' ? 'Оплачено' : (item.invoiceStatus === 'CANCELLED' ? 'Закрыто' : '')))
          .toLowerCase().includes(String(this.search.value).toLowerCase());
    });

    this.setState({
      search: true,
      list: searchList,
    });

    if (this.search.value === '') {
      this.setState({
        search: true,
        list: defaultList,
      });
    }
  }
}


function mapStateToProps(state) {
  const { company, payments, authentication, staff } = state;
  return {
    company, payments, authentication, staff,
  };
}

export default (withRouter(connect(mapStateToProps, null)(withTranslation("common")(Index))));
