import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";

import '../../public/scss/payments.scss'
import '../../public/scss/styles.scss'

import moment from 'moment';
import {HeaderMain} from "../_components/HeaderMain";
import {userActions, paymentsActions} from "../_actions";
import {UserSettings} from "../_components/modals";
import {MakePayment} from "../_components/modals/MakePayment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


class PaymentsPage extends Component {

    constructor(props) {
        super(props);

        this.changeSMSResult = this.changeSMSResult.bind(this);
        this.repeatPayment = this.repeatPayment.bind(this);
        this.downloadInPdf = this.downloadInPdf.bind(this);
        this.calculateRate = this.calculateRate.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.AddingInvoice = this.AddingInvoice.bind(this);
        this.closeModalActs = this.closeModalActs.bind(this);
        this.AddingInvoiceStaff = this.AddingInvoiceStaff.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.redirect = this.redirect.bind(this);

        this.state = {
            list: this.props.payments.list,
            defaultList: this.props.payments.list,
            search: false,
            userSettings: false,
            SMSCountChose: 2,
            SMSCount: 5000,
            SMSPrice: 75,
            chosenAct: {},
            chosenInvoice: {},
            invoiceSelected: false,
            country: this.props.company.settings || {},
            // country: '',
            rate: {
                workersCount: '1',
                specialWorkersCount: '',
                period: '1',
            },
            finalPrice: this.props.company.settings ? ((this.props.company.settings.countryCode) ? ((this.props.company.settings.countryCode) === 'BLR' ?
                '15' : ((this.props.company.settings.countryCode) === 'UKR' ?
                    '180' : ((this.props.company.settings.countryCode) === 'RUS' ?
                        '480' : '15'))) : '15') : '',
            finalPriceMonth: this.props.company.settings ? ((this.props.company.settings.countryCode) ? ((this.props.company.settings.countryCode) === 'BLR' ?
                '5' : ((this.props.company.settings.countryCode === 'UKR' ?
                    '60' : (this.props.company.settings.countryCode) === 'RUS' ?
                        '160' : '5'))) : '5') : ''
        }

        this.props.dispatch(paymentsActions.getInvoiceList());
        this.props.dispatch(paymentsActions.getPackets());
    }

    componentWillReceiveProps(newProps) {
        if (this.props.payments && this.props.payments.list && (JSON.stringify(this.props.payments.list) !== JSON.stringify(newProps.payments.list))) {
            this.setState({list: newProps.payments.list, defaultList: newProps.payments.list})
        }
        if (JSON.stringify(this.props.payments.activeInvoice) !== JSON.stringify(newProps.payments.activeInvoice)) {
            this.repeatPayment(newProps.payments.activeInvoice.invoiceId)
        }
    }

    AddingInvoice() {
        let {chosenAct} = this.state;
        if (chosenAct && chosenAct.packetId) {
            this.props.dispatch(paymentsActions.addInvoice(JSON.stringify([
                    {
                        packetId: chosenAct.packetId,
                        amount: 1,
                        discountAmount: 0,
                        startDateMillis: moment().format('x')
                    },
                ]
            )));
        }
    }

    AddingInvoiceStaff() {
        let {rate} = this.state;
        let {packets} = this.props.payments;


        let amount;
        switch (rate.period) {
            case "1":
                amount = 3;
                break;
            case "2":
                amount = 6;
                break;
            case "3":
                amount = 12;
                break;
        }
        let packetId;
        let staffAmount;
        if (rate.specialWorkersCount === '') {
            staffAmount = parseInt(rate.workersCount);
        } else {
            switch (rate.specialWorkersCount) {
                case "to 20":
                    staffAmount = 20;
                    break;
                case "to 30":
                    staffAmount = 30;
                    break;
                case "from 30":
                    staffAmount = 50;
                    break;
            }
        }
        packetId = packets && packets.find(item => item.staffAmount === staffAmount).packetId;
        let discountAmount
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
                    startDateMillis: moment().format('x')
                }
            ]
        )));

    }

    redirect(url) {
       this.props.history.push(url);
    }

    onOpen() {
        this.setState({...this.state, userSettings: true});
    }

    onClose() {
        this.setState({...this.state, userSettings: false});
    }

    closeModalActs() {
        this.setState({invoiceSelected: false});
    }

    downloadInPdf(pdfMarkup) {
        html2canvas(document.getElementById('divIdToPrint')).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("invoice.pdf");
        })
    }

    rateChangeWorkersCount(e) {
        let {name, value} = e.target;

        this.setState({rate: {...this.state.rate, workersCount: value, specialWorkersCount: ''}});
    }

    rateChangeSpecialWorkersCount(value) {
        this.setState({rate: {...this.state.rate, workersCount: '', specialWorkersCount: value}});
    }

    rateChangePeriod(e) {
        let {name, value} = e.target;

        this.setState({rate: {...this.state.rate, period: value}});
    }

    calculateRate() {
        const {workersCount, specialWorkersCount, period} = this.state.rate;
        const {countryCode} = this.state.country;
        let finalPrice = 0, finalPriceMonth = 0;
        let priceTo20 = 60, priceTo30 = 70, priceFrom30 = 80;
        let priceForOneWorker = 5;

        if (countryCode && countryCode === 'BLR') {
            priceTo20 = 60;
            priceTo30 = 70;
            priceFrom30 = 80;
            priceForOneWorker = 5;
        } else if (countryCode && countryCode === 'UKR') {
            priceTo20 = 760;
            priceTo30 = 895;
            priceFrom30 = 1020;
            priceForOneWorker = 60;
        } else if (countryCode && countryCode === 'RUS') {
            priceTo20 = 1800;
            priceTo30 = 2100;
            priceFrom30 = 2400;
            priceForOneWorker = 160;
        }

        switch (period) {
            case '1':
                switch (specialWorkersCount) {
                    case 'to 20':
                        finalPrice = priceTo20 * 3;
                        break;
                    case 'to 30':
                        finalPrice = priceTo30 * 3;

                        break;
                    case 'from 30':
                        finalPrice = priceFrom30 * 3;
                        break;
                    case '':
                        finalPrice = workersCount * priceForOneWorker * 3;
                        break;
                }
                finalPriceMonth = finalPrice / 3;
                break;
            case '2':
                switch (specialWorkersCount) {
                    case 'to 20':
                        finalPrice = priceTo20 * 5;
                        break;
                    case 'to 30':
                        finalPrice = priceTo30 * 5;
                        break;
                    case 'from 30':
                        finalPrice = priceFrom30 * 5;
                        break;
                    case '':
                        finalPrice = workersCount * priceForOneWorker * 5;
                        break;
                }
                finalPriceMonth = finalPrice / 6;
                break;
            case '3':
                switch (specialWorkersCount) {
                    case 'to 20':
                        finalPrice = priceTo20 * 9;
                        break;
                    case 'to 30':
                        finalPrice = priceTo30 * 9;
                        break;
                    case 'from 30':
                        finalPrice = priceFrom30 * 9;
                        break;
                    case '':
                        finalPrice = workersCount * priceForOneWorker * 9;
                        break;
                }
                finalPriceMonth = finalPrice / 12;
                break;
        }
        finalPriceMonth = finalPriceMonth.toFixed(2);
        this.setState({finalPrice: finalPrice, finalPriceMonth: finalPriceMonth});
    }

    changeSMSResult() {

        const {SMSCountChose} = this.state;

        switch (SMSCountChose) {
            case 1:
                this.setState({SMSCount: 1000, SMSPrice: 17});
                break;
            case 2:
                this.setState({SMSCount: 5000, SMSPrice: 75});
                break;
            case 3:
                this.setState({SMSCount: 10000, SMSPrice: 140});
                break;

        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.SMSCountChose !== prevState.SMSCountChose)) {
            this.changeSMSResult();
        }
        if (JSON.stringify(prevState.rate) !== JSON.stringify(this.state.rate)) {
            this.calculateRate();
        }

    }

    repeatPayment(invoiceId) {
        const { pendingInvoice } = this.props.payments
        if (!pendingInvoice || (pendingInvoice && pendingInvoice.invoiceStatus === 'ISSUED')) {
            setTimeout(() => {
                this.props.dispatch(paymentsActions.getInvoice(invoiceId))
                this.repeatPayment(invoiceId)
            }, 30000)
        }
    }

    render() {
        const {authentication} = this.props;
        const {SMSCountChose, SMSCount, SMSPrice, chosenAct} = this.state;
        const {country, finalPrice, finalPriceMonth, chosenInvoice, invoiceSelected, list, defaultList, search, userSettings} = this.state;
        const {workersCount, period, specialWorkersCount} = this.state.rate;
        const {countryCode} = this.state.country;
        const {packets} = this.props.payments;

        const { pathname } = this.props.location;
        if (pathname === '/payments') {
            document.title = "Оплата | Онлайн-запись";
        } else if (pathname === '/invoices' ) {
            document.title = "Счета | Онлайн-запись";
        }

        const pdfMarkup = <React.Fragment>

            <div className="row-status">
                <button className="inv-date" style={{backgroundColor: chosenInvoice.invoiceStatus === 'ISSUED' ? '#0a1232': '#fff', color: chosenInvoice.invoiceStatus === 'ISSUED' ? '#fff': '#000'  }}
                        data-target=".make-payment-modal"
                        data-toggle="modal"
                        onClick={() => {
                            this.props.dispatch(paymentsActions.makePayment(chosenInvoice.invoiceId))
                            this.repeatPayment(chosenInvoice.invoiceId)
                        }}>
                    {chosenInvoice.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                        (chosenInvoice.invoiceStatus === 'PAID' ? 'Оплачено' : (chosenInvoice.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))}
                </button>
            </div>
            <div id="divIdToPrint">
            <div className="account-info col-12">
                <h3>Счёт {chosenInvoice.invoiceId}</h3>
                <p style={{fontSize: "1.2em"}}>{moment(chosenInvoice.createdDateMillis).format('DD.MM.YYYY')}</p>
            </div>
            <div className="customer-seller">
                <div className="col-md-6 col-12 customer">
                    <p>Лицензиат: <strong>{authentication.user.companyName}</strong></p>
                    <p>Представитель: {authentication.user.profile.lastName} {authentication.user.profile.firstName}</p>
                    <p>Адрес: {authentication.user.companyAddress1 || authentication.user.companyAddress2 || authentication.user.companyAddress3}</p>
                </div>

                <div className="col-md-6 col-12 seller">
                    <p>Лицензиар: <strong>СОФТ-МЕЙК. УНП 191644633</strong></p>
                    <p>Адрес: 220034, Минск, Марьевская 7а-1-6</p>
                    <p>Тел +375 44 5655557</p>
                </div>
            </div>

            <div className="payments-type">
                <p>Способ оплаты: Credit Card / WebMoney / Bank Transfer</p>
                <p><strong>Заплатить
                    до: {moment(chosenInvoice.dueDateMillis).format('DD.MM.YYYY')}</strong>
                </p>
                <p>Статус: {chosenInvoice.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                    (chosenInvoice.invoiceStatus === 'PAID' ? 'Оплачено' : (chosenInvoice.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))}</p>
            </div>

            <div className="table">
                <div className="table-header">
                    <div className="table-description"><p>Описание</p></div>
                    <div className="table-count"><p
                        className="default">Количество мес.</p><p
                        className="mob">Кол-во мес.</p></div>
                    <div className="table-price"><p>Стоимость</p></div>
                </div>
                {chosenInvoice && chosenInvoice.invoicePackets && chosenInvoice.invoicePackets.map(packet => {
                    let name = packets && packets.find(item => item.packetId === packet.packetId)
                    return (
                        <div className="table-row">
                            <div className="table-description">
                                <p>{name.packetName}</p></div>
                            <div className="table-count"><p>{packet.amount}</p>
                            </div>
                            <div className="table-price">
                                <p>{packet.sum} {packet.currency}</p></div>
                        </div>
                    );
                })}
            </div>

            <div className="result-price">
                <div>
                    <p>Общая сумма</p>
                </div>
                <div>
                    <p>{chosenInvoice.totalSum} {chosenInvoice.currency}</p>
                </div>
            </div>
            <div className="result-price">
                <div>
                    <p>Без НДС</p>
                </div>
                <div>
                    <p>0.00 EUR</p>
                </div>
            </div>
            </div>
        </React.Fragment>
        return (
            <React.Fragment>
                <div className="container_wrapper">


                    <div className="content-wrapper">
                        <div className="container-fluid">

                            <HeaderMain
                                onOpen={this.onOpen}
                            />

                            <div className="retreats">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item" >
                                        <a className={"nav-link " + (pathname === '/payments' ? "active show" : "")} data-toggle="tab" href="#payments" onClick={() => this.redirect('/payments')}>Оплата</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={"nav-link " + (pathname === '/invoices' ? "active show" : "")} data-toggle="tab" href="#acts" onClick={() => this.redirect('/invoices')}>Счета</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className={"tab-pane " + (pathname === '/payments' ? "active" : "")} id="payments">
                                        <div className="payments-inner">
                                            <div className="payments-list-block">
                                                <p className="title-payments">Количество сотрудников</p>
                                                <div id="range-staff">
                                                    <ul className="range-labels">
                                                        <li className={workersCount === '1' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "1",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>1
                                                        </li>
                                                        <li className={workersCount === '2' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "2",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>2
                                                        </li>
                                                        <li className={workersCount === '3' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "3",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>3
                                                        </li>
                                                        <li className={workersCount === '4' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "4",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>4
                                                        </li>
                                                        <li className={workersCount === '5' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "5",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>5
                                                        </li>
                                                        <li className={workersCount === '6' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "6",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>6
                                                        </li>
                                                        <li className={workersCount === '7' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "7",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>7
                                                        </li>
                                                        <li className={workersCount === '8' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "8",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>8
                                                        </li>
                                                        <li className={workersCount === '9' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "9",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>9
                                                        </li>
                                                        <li className={workersCount === '10' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: "10",
                                                                    specialWorkersCount: ''
                                                                }
                                                            })}>10
                                                        </li>
                                                    </ul>

                                                    <div
                                                        className={(specialWorkersCount !== '') ? "range range-hidden" : "range"}
                                                        style={{position: "relative"}}>
                                                        <input type="range" min="1" max="10" value={workersCount}
                                                               onChange={(e) => this.rateChangeWorkersCount(e)}/>
                                                        <div
                                                            className={(specialWorkersCount !== '') ? "rateLine rateLineHidden" : "rateLine"}
                                                            style={{width: ((workersCount - 1) * 11) + "%"}}></div>
                                                    </div>


                                                </div>
                                                <div className="radio-buttons">
                                                    <div onClick={() => this.rateChangeSpecialWorkersCount('to 20')}>
                                                        <input type="radio" className="radio" id="radio"
                                                               name="staff-radio"
                                                               checked={specialWorkersCount === 'to 20'}/>
                                                        <label htmlFor="radio">До 20</label>
                                                    </div>
                                                    <div onClick={() => this.rateChangeSpecialWorkersCount('to 30')}>
                                                        <input type="radio" className="radio" id="radio2"
                                                               name="staff-radio"
                                                               checked={specialWorkersCount === 'to 30'}/>
                                                        <label htmlFor="radio2">До 30</label>
                                                    </div>
                                                    <div onClick={() => this.rateChangeSpecialWorkersCount('from 30')}>
                                                        <input type="radio" className="radio" id="radio3"
                                                               name="staff-radio"
                                                               checked={specialWorkersCount === 'from 30'}/>
                                                        <label htmlFor="radio3">Больше 30</label>
                                                    </div>
                                                </div>

                                                <p className="title-payments">Срок действия лицензии</p>
                                                <div id="range-month">
                                                    <ul className="range-labels">
                                                        <li className={period === '1' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    period: "1"
                                                                }
                                                            })}>3 месяца
                                                        </li>
                                                        <li className={period === '2' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    period: "2"
                                                                }
                                                            })}>6 месяцев <span>+1 месяц бесплатно</span></li>
                                                        <li className={period === '3' ? "active selected" : ""}
                                                            onClick={() => this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    period: "3"
                                                                }
                                                            })}>12 месяцев <span>+3 месяца бесплатно</span></li>
                                                    </ul>

                                                    <div className="range" style={{position: "relative"}}>
                                                        <input type="range" min="1" max="3" value={period}
                                                               onChange={(e) => this.rateChangePeriod(e)}/>
                                                        <div className="rateLine"
                                                             style={{width: ((period - 1) * 50) + "%"}}></div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="payments-list-block2">
                                                <div className="payments-content">
                                                    <p className="title-payments">К оплате</p>
                                                    <div>
                                                        <p>Срок действия лицензии: </p>
                                                        <span>{period === '1' ? '3 месяца' : (period === '2') ? '6 месяцев' : '12 месяцев'}</span>
                                                    </div>
                                                    <div>
                                                        <p>Стоимость в месяц: </p>
                                                        <span>{finalPriceMonth} {countryCode ? (countryCode === 'BLR' ? 'руб' : (countryCode === 'UKR' ? 'грн' : (countryCode === 'RUS' ? 'руб' : 'руб'))) : 'руб'}</span>
                                                    </div>
                                                    <hr/>
                                                    <div>
                                                        <p className="total-price">Итоговая стоимость:
                                                            <span>{finalPrice} {countryCode ? (countryCode === 'BLR' ? 'руб' : (countryCode === 'UKR' ? 'грн' : (countryCode === 'RUS' ? 'руб' : 'руб'))) : 'руб'}</span>
                                                        </p>

                                                    </div>
                                                    <button className="button" type="button"
                                                            onClick={() => this.AddingInvoiceStaff()}>Оплатить
                                                    </button>
                                                    {(countryCode && (countryCode === 'BLR' || countryCode === 'UKR')) && <div>
                                                                Цены в национальной валюте указаны для ознакомления. Оплата производится по курсу в рос. рублях
                                                        </div>
                                                    }
                                                </div>

                                            </div>

                                        </div>

                                        <div className="payments-inner">
                                            <div className="payments-list-block">
                                                <div className="payments-content buttons-change">
                                                    <p className="title-payments">SMS Пакеты</p>
                                                    {/*<div>*/}
                                                    {/*    <label>*/}
                                                    {/*        <input type="radio" name="sms-price-radio"/>*/}
                                                    {/*        <span className="sms-price">Старт</span>*/}
                                                    {/*        <span>1000 <span>SMS</span> 17 руб</span>*/}
                                                    {/*    </label>*/}
                                                    {/*    <button className={(SMSCountChose === 1)?"button button-selected":"button"}*/}
                                                    {/*            type="button"*/}
                                                    {/*    onClick={()=>this.setState({SMSCountChose: 1})}>Выбрать</button>*/}
                                                    {/*</div>*/}
                                                    {/*<div>*/}
                                                    {/*    <label>*/}
                                                    {/*        <input checked type="radio" name="sms-price-radio"/>*/}
                                                    {/*        <span className="sms-price">Экспресс</span>*/}
                                                    {/*        <span>5000 <span>SMS</span> 75 руб</span>*/}
                                                    {/*    </label>*/}
                                                    {/*    <button className={(SMSCountChose === 2)?"button button-selected":"button"}*/}
                                                    {/*            type="button"*/}
                                                    {/*            onClick={()=>this.setState({SMSCountChose: 2})}>Выбрано*/}
                                                    {/*    </button>*/}
                                                    {/*</div>*/}
                                                    {/*<div>*/}
                                                    {/*    <label>*/}
                                                    {/*        <input type="radio" name="sms-price-radio"/>*/}
                                                    {/*        <span className="sms-price">Профессионал</span>*/}
                                                    {/*        <span>10000 <span>SMS</span> 140 руб</span>*/}
                                                    {/*    </label>*/}
                                                    {/*    <button className={(SMSCountChose === 3)?"button button-selected":"button"}*/}
                                                    {/*            type="button"*/}
                                                    {/*            onClick={()=>this.setState({SMSCountChose: 3})}>Выбрать</button>*/}
                                                    {/*</div>*/}
                                                    {packets && packets.filter(packet => packet.packetType === 'SMS_PACKET')
                                                        .sort((a, b) => a.smsAmount - b.smsAmount)
                                                        .map(packet => {
                                                        return (
                                                            <div>
                                                                <label>
                                                                    <input type="radio" name="sms-price-radio"/>
                                                                    <span
                                                                        className="sms-price">{packet.packetName}</span>
                                                                    <span>{packet.smsAmount} <span>SMS</span> {packet.price} {packet.currency}</span>
                                                                </label>
                                                                <button
                                                                    className={(this.state.chosenAct.packetId === packet.packetId) ? "button button-selected" : "button"}
                                                                    type="button"
                                                                    onClick={() => this.setState({chosenAct: packet})}>Выбрать
                                                                </button>
                                                            </div>
                                                        );
                                                    })

                                                    }
                                                </div>

                                            </div>

                                            <div className="payments-list-block2">
                                                <div className="payments-content">
                                                    {chosenAct.packetName && <p className="title-payments">К оплате</p>}
                                                    <div>
                                                        {chosenAct.packetName ?
                                                            <p>Пакет {chosenAct.packetName} {chosenAct.smsAmount} SMS</p> : <p className="payment-choose-packet">Выберите SMS пакет</p>}
                                                    </div>
                                                    <hr/>
                                                    {chosenAct.packetName &&
                                                        <React.Fragment>
                                                            <div>
                                                                <p className="total-price">Итоговая
                                                                    стоимость <span>{chosenAct.price ? chosenAct.price : 0} {chosenAct.currency}</span>
                                                                </p>
                                                            </div>
                                                            <button className="button" type="button"
                                                                    onClick={() => this.AddingInvoice()}>Оплатить
                                                            </button>
                                                            {(countryCode && (countryCode === 'BLR' || countryCode === 'UKR')) && <div>
                                                                Цены в национальной валюте указаны для ознакомления. Оплата производится по курсу в рос. рублях
                                                            </div>
                                                            }
                                                        </React.Fragment>
                                                    }
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div className={"tab-pane " + (pathname === '/invoices' ? "active" : "")} id="acts">


                                        {list.length ? list.sort((a, b) => parseInt(a.createdDateMillis) - parseInt(b.createdDateMillis)).map(invoice => {
                                            return (
                                                <div className="invoice" onClick={() => this.setState({
                                                    chosenInvoice: invoice,
                                                    invoiceSelected: true
                                                })}>
                                                    <div className="inv-number"><p>Счёт {invoice.invoiceId}</p></div>
                                                    <div className="inv-date">
                                                        <p>{moment(invoice.createdDateMillis).format('DD.MM.YYYY')}</p>
                                                    </div>
                                                    <div className="inv-date">
                                                        <p>{invoice.totalSum} {invoice.currency}</p></div>
                                                    <div className="inv-date" style={{backgroundColor: invoice.invoiceStatus === 'ISSUED' ? '#0a1232': '#fff' }}><p style={{color: invoice.invoiceStatus === 'ISSUED' ? '#fff': '#000' }}>
                                                        {invoice.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                                                            (invoice.invoiceStatus === 'PAID' ? 'Оплачено' : (invoice.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))}
                                                    </p></div>
                                                </div>
                                            );
                                        }) : (
                                            <div style={{ textAlign: 'center' }}>Нет счетов для отображения</div>
                                        )}

                                        {/*--------------------*/}


                                        {invoiceSelected &&
                                        // !!0 && list.map(invoice => {
                                        //  return(


                                        <div className="chosen-invoice">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Счёт</h4>
                                                <img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt=""
                                                     className="close" style={{height: "50px"}}
                                                     onClick={() => this.closeModalActs()}
                                                />
                                            </div>
                                            <div className="act-body-wrapper">
                                                <div className="acts-body">

                                                    {pdfMarkup}

                                                    <p className="download" onClick={() => this.downloadInPdf(pdfMarkup)}>Скачать в PDF</p>
                                                </div>

                                            </div>

                                        </div>
                                            // );})
                                        }
                                    </div>


                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="modal fade modal-new-subscription" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <p>Новый абонемент</p>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="container pl-4 pr-4">
                                <p className="title mb-2">Среда 14 августа, 2018</p>
                                <div className="check-box row">
                                    <div className="form-check col">
                                        <input type="radio" className="form-check-input" name="radio422" id="radio2281"
                                               checked=""/>
                                        <label className="form-check-label" htmlFor="radio2281">Новый</label>
                                    </div>
                                    <div className="form-check-inline col">
                                        <input type="radio" className="form-check-input" name="radio422"
                                               id="radio8021"/>
                                        <label className="form-check-label" htmlFor="radio8021">Продление</label>
                                    </div>
                                </div>
                                <p className="title mb-2">Клиент</p>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p>Имя</p>
                                        <input type="text" placeholder="Например: Иван"/>
                                    </div>
                                    <div className="col-sm-6">
                                        <p>Фамилия</p>
                                        <input type="text" placeholder="Например: Иванов"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p>Номер телефона</p>
                                        <input type="text" placeholder="Например: +44095959599"/>
                                    </div>
                                    <div className="col-sm-6">
                                        <p>Дата рождения</p>
                                        <input type="text" placeholder="Например: 14.06.1991"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>Параметр</p>
                                        <input type="text" data-range="true" value="___"
                                               data-multiple-dates-separator=" - "
                                               className="datepicker-buttons-inline button-cal"/>
                                    </div>
                                    <div className="col-md-6">
                                        <p>Срок действия</p>
                                        <input type="text" placeholder=""/>
                                        <button type="button" className="button mt-3 mb-3">Сохранить</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade modal_dates_change">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Изменить / продлить абонемент</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="form-group mr-3 ml-3">
                                <div className="row">
                                    <div className="calendar col-xl-12">
                                        <div className="select-date">
                                            <div className="select-inner">
                                                <div className="button-calendar mb-2">
                                                    <label><span>Дата приобретения - Дата окончания</span>
                                                        <input type="button" data-range="true" value=""
                                                               data-multiple-dates-separator=" - "
                                                               className="datepicker-here calendar_modal_button button-cal"/>
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="calendar col-xl-6">
                                        <div className="modal-content-input  p-1  mb-2">
                                            <span>Тип</span>
                                            <select className="custom-select">
                                                <option>60 дней</option>
                                                <option>30 дней</option>
                                                <option>25 дней</option>
                                                <option>20 дней</option>
                                                <option>15 дней</option>
                                                <option selected="">12 дней</option>
                                                <option>10 дней</option>
                                                <option>8 дней</option>
                                                <option>6 дней</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="calendar col-xl-6">
                                        <div className="modal-content-input p-1  mb-2">
                                            <span>Осталось дней</span>
                                            <p>6 дней</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="modal-content-input p-1  mb-2">
                                            <span>Срок действия</span>
                                            <p>12 июля - 12 сентября</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="button text-center" type="button">Продлить</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade modal_user_setting">
                    <div className="modal-dialog modal-dialog-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Настройки профиля</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="form-group mr-3 ml-3">
                                <div className="row">
                                    <div className="calendar col-xl-6">
                                        <p>Имя</p>
                                        <input type="text" placeholder="Например: Иван"/>
                                    </div>
                                    <div className="calendar col-xl-6">
                                        <p>Номер телефона</p>
                                        <input type="text" placeholder="Например: +44-65-44-324-88"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="calendar col-xl-6">
                                        <p>Фамилия</p>
                                        <input type="text" placeholder="Например: Иванов"/>
                                    </div>
                                    <div className="calendar col-xl-6">
                                        <p>Электронный адрес</p>
                                        <input type="text" placeholder="Например: ivanov@gmail.com"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <p>Текущий пароль</p>
                                        <p>
                                            <input data-toggle="password" data-placement="after" type="password"
                                                   placeholder="password" data-eye-class="material-icons"
                                                   data-eye-open-class="visibility"
                                                   data-eye-close-class="visibility_off"
                                                   data-eye-class-position-inside="true"/>
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="calendar col-xl-6">
                                        <p>Новый пароль</p>
                                        <input type="password" placeholder=""/>
                                    </div>
                                    <div className="calendar col-xl-6">
                                        <p>Повторить пароль</p>
                                        <input type="password" placeholder=""/>
                                    </div>
                                </div>
                                <button className="button text-center" type="button">Сохранить</button>
                            </div>
                        </div>
                    </div>
                </div>
                {userSettings &&
                <UserSettings
                    onClose={this.onClose}
                />
                }
                <MakePayment />


            </React.Fragment>
        );
    }
    handleSearch(){
        const {defaultList}= this.state;

        const searchList = defaultList.filter((item)=>{
            return  String(item.invoiceId).toLowerCase().includes(String(this.search.value).toLowerCase())
                || String(moment(item.createdDateMillis).format('DD.MM.YYYY')).toLowerCase().includes(String(this.search.value).toLowerCase())
            || String(item.totalSum + ' ' + item.currency).toLowerCase().includes(String(this.search.value).toLowerCase())
            || String(item.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                    (item.invoiceStatus === 'PAID' ? 'Оплачено' : (item.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))).toLowerCase().includes(String(this.search.value).toLowerCase())



        });


        this.setState({
            search: true,
            list: searchList
        });

        if(this.search.value===''){
            this.setState({
                search: true,
                list: defaultList
            })
        }


    }


}



function mapStateToProps(state) {
    const { company, payments, authentication} = state;
    return {
        company, payments, authentication
    };
}

const connectedApp =(withRouter(connect(mapStateToProps,null)(PaymentsPage)));
export { connectedApp as PaymentsPage };
