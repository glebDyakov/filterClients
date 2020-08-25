import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";


import '../../public/scss/payments.scss'

import moment from 'moment';
import {paymentsActions, companyActions} from "../_actions";
import {MakePayment} from "../_components/modals/MakePayment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {staffActions} from "../_actions/staff.actions";

import ForAccountant from "../_components/modals/ForAccountant";


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
            finalPrice: this.props.company.settings ? ((this.props.company.settings.countryCode) ? ((this.props.company.settings.countryCode) === 'BLR' ?
                '15' : ((this.props.company.settings.countryCode) === 'UKR' ?
                    '180' : ((this.props.company.settings.countryCode) === 'RUS' ?
                        '480' : '15'))) : '15') : '',
            finalPriceMonth: this.props.company.settings ? ((this.props.company.settings.countryCode) ? ((this.props.company.settings.countryCode) === 'BLR' ?
                '5' : ((this.props.company.settings.countryCode === 'UKR' ?
                    '60' : (this.props.company.settings.countryCode) === 'RUS' ?
                        '160' : '5'))) : '5') : ''
        }
    }

    componentDidMount() {
        this.props.dispatch(companyActions.get());
        this.props.dispatch(paymentsActions.getInvoiceList());
        this.props.dispatch(paymentsActions.getPackets());
        if (this.props.staff.staff && this.props.staff.staff.length) {
            this.setDefaultWorkersCount(this.props.staff.staff)
        }
        this.props.dispatch(staffActions.get());
        if (this.props.authentication.user && this.props.authentication.user.profile && (this.props.authentication.user.profile.roleId === 4)) {
            this.props.dispatch(companyActions.getSubcompanies());
        }

        const {user} = this.props.authentication
        if (user && (user.forceActive
            || (moment(user.trialEndDateMillis).format('x') >= moment().format('x'))
            || (user.invoicePacket && moment(user.invoicePacket.endDateMillis).format('x') >= moment().format('x'))
        )) {
        } else {
            this.setDefaultWorkersCount(this.props.staff.staff)
            this.props.dispatch(companyActions.get());
            this.props.dispatch(companyActions.getBookingInfo());
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.payments && this.props.payments.list && (JSON.stringify(this.props.payments.list) !== JSON.stringify(newProps.payments.list))) {
            this.setState({list: newProps.payments.list, defaultList: newProps.payments.list})
        }
        if (JSON.stringify(this.props.payments.activeInvoice) !== JSON.stringify(newProps.payments.activeInvoice)) {
            this.repeatPayment(newProps.payments.activeInvoice.invoiceId)
        }
        if (JSON.stringify(this.props.payments.packets) !== JSON.stringify(newProps.payments.packets)) {
            this.calculateRate(newProps.payments.packets)
        }
        if (newProps.payments.confirmationUrl && (this.props.payments.confirmationUrl !== newProps.payments.confirmationUrl)) {
            this.setState({invoiceSelected: false})
        }
        if (JSON.stringify(this.props.staff) !== JSON.stringify(newProps.staff)) {
            this.setDefaultWorkersCount(newProps.staff.staff)
        }
    }


    setDefaultWorkersCount(staff) {
        const {company} = this.props
        const companyTypeId = company.settings && company.settings.companyTypeId;
        const count = staff ? staff.length : -1;
        if ((companyTypeId === 2)) {
            if (count <= 5) {
                console.log(count)
                this.setState({staffCount: count, rate: {...this.state.rate, workersCount: count}}, () => this.calculateRate())
            } else {
                console.log(count)

                this.rateChangeSpecialWorkersCount('to 30', count)
                this.setState({staffCount: count});
            }
        } else {
            if (count <= 10) {
                this.setState({staffCount: count, rate: {...this.state.rate, workersCount: count}}, () => this.calculateRate())
            } else if (count > 10 && count <= 20) {
                this.rateChangeSpecialWorkersCount('to 20', count)
            } else if (count > 20 && count <= 30) {
                this.rateChangeSpecialWorkersCount('to 30', count)
            } else {
                this.rateChangeSpecialWorkersCount('from 30', count)
            }
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
        packetId = packets && packets
            .filter(item => item.packetType === 'USE_PACKET')
            .find(item => item.staffAmount === staffAmount).packetId;
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
        // this.setState({staffCount: count, rate: {...this.state.rate, workersCount: '', specialWorkersCount: value}});
        this.setState({rate: {...this.state.rate, workersCount: '', specialWorkersCount: value}}, () => this.calculateRate());
    }

    rateChangePeriod(e) {
        let {name, value} = e.target;

        this.setState({rate: {...this.state.rate, period: value}});
    }

    calculateRate(packets = this.props.payments.packets) {
        const {workersCount, specialWorkersCount, period} = this.state.rate;
        const {countryCode} = this.state.country;
        const {company} = this.props
        const companyTypeId = company.settings && company.settings.companyTypeId;

        const price1to10 = (packets && packets.find(item => item.packetId === parseInt(workersCount)) || {})
        const priceTo20packet = (packets && packets.find(item => item.packetId === 11) || {})
        const priceTo30packet = (packets && packets.find(item => item.packetId === 12) || {})
        const priceFrom30packet = (packets && packets.find(item => item.packetId === 13) || {})

        let finalPrice = 0, finalPriceMonth = 0, finalPriceMonthDiscount = 0;
        let priceTo20 = 60, priceTo30 = 70, priceFrom30 = 80;
        let priceForOneWorker = 5;

        if (countryCode && countryCode === 'UKR') {
            priceTo20 = priceTo20packet.price || 760;
            priceTo30 = priceTo30packet.price || 895;
            priceFrom30 = priceFrom30packet.price || 1020;
            priceForOneWorker = 60;
        } else if (countryCode && countryCode === 'RUS') {
            priceTo20 = priceTo20packet.price || 1800;
            priceTo30 = priceTo30packet.price || 2100;
            priceFrom30 = priceFrom30packet.price || 2400;
            priceForOneWorker = 160;
        } else {
            priceTo20 = priceTo20packet.price || 60;
            priceTo30 = priceTo30packet.price || 70;
            priceFrom30 = priceFrom30packet.price || 80;
            priceForOneWorker = 5;
        }


        switch (specialWorkersCount) {
            case 'to 20':
                finalPriceMonth = priceTo20packet.price
                finalPriceMonthDiscount = priceTo20packet.discountPrice
                break;
            case 'to 30':
                finalPriceMonth = priceTo30packet.price
                finalPriceMonthDiscount = priceTo30packet.discountPrice
                break;
            case 'from 30':
                finalPriceMonth = priceFrom30packet.price
                finalPriceMonthDiscount = priceFrom30packet.discountPrice
                break;
            case '':
                finalPriceMonth = price1to10.price
                finalPriceMonthDiscount = price1to10.discountPrice
                break;
        }

        finalPriceMonthDiscount = finalPriceMonthDiscount === finalPriceMonth ? null : finalPriceMonthDiscount

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
            finalPriceMonthDiscount: finalPriceMonthDiscount && finalPriceMonthDiscount.toFixed(2)
        });
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
        const {pendingInvoice} = this.props.payments
        this.props.dispatch(paymentsActions.getInvoice(invoiceId))
        if (pendingInvoice && pendingInvoice.invoiceStatus === 'ISSUED') {
            setTimeout(() => {
                this.repeatPayment(invoiceId)
            }, 30000)
        }
    }

    render() {
        const {authentication} = this.props;
        const {chosenAct, finalPriceMonthDiscount, staffCount, finalPrice, finalPriceMonth, chosenInvoice, invoiceSelected, list} = this.state;
        const {workersCount, period, specialWorkersCount} = this.state.rate;
        const {countryCode} = this.state.country;
        const {packets, isLoading} = this.props.payments;
        const companyTypeId = this.props.company.settings && this.props.company.settings.companyTypeId;
        let activePacket
        if (packets && authentication.user && authentication.user.invoicePacket) {
            activePacket = packets.find(packet => packet.packetId === authentication.user.invoicePacket.packetId)
        }

        const {pathname} = this.props.location;
        if (pathname === '/payments') {
            document.title = "Оплата | Онлайн-запись";
        } else if (pathname === '/invoices') {
            document.title = "Счета | Онлайн-запись";
        }
        const currentPacket = activePacket ? activePacket.packetName : authentication.user && (authentication.user && authentication.user.forceActive || (moment(authentication.user.trialEndDateMillis).format('x') >= moment().format('x')) ? 'Пробный период' : 'Нет выбранного пакета')
        const paymentId = authentication && authentication.user && authentication.user.menu.find(item => item.id === 'payments_menu_id')
        if (!paymentId && currentPacket === 'Нет выбранного пакета') {
            return (
                <div style={{color: '#0a1330', fontSize: '22px'}} className="payments-message">
                    Срок действия лицензии истек
                </div>
            )
        }

        const chosenPacket = packets && packets.find(packet => packet.packetId === (chosenInvoice.invoicePackets && chosenInvoice.invoicePackets[0].packetId)) || {};

        const pdfMarkup = <React.Fragment>


            <div id="divIdToPrint">
                <div className="row customer-seller">
                    {authentication.user && <div className="col-md-4 col-12 customer">
                        <p>Лицензиат: <strong>{authentication.user.companyName}</strong></p>
                        <p>Представитель: <strong>{authentication.user.profile ? authentication.user.profile.lastName : ''} {authentication.user.profile.firstName}</strong></p>
                        <p>Адрес: <strong>{authentication.user.companyAddress1 || authentication.user.companyAddress2 || authentication.user.companyAddress3}</strong></p>
                    </div>}

                    <div className="col-md-4 col-12 seller">
                        <p>Лицензиар: <strong>СОФТ-МЭЙК. УНП 191644633</strong></p>
                        <p>Адрес: <strong>220034, Беларусь, Минск, Марьевская 7а-1-6</strong></p>
                        <p>Телефон: <strong>+375 44 5655557</strong></p>
                    </div>

                    <div className="col-md-4 col-12 payments-type">
                        <p>Способ оплаты: <strong>Credit Card / WebMoney / Bank Transfer</strong></p>
                        {chosenInvoice.invoiceStatus !== 'PAID' && <p>
                            Заплатить до: <strong>{moment(chosenInvoice.dueDateMillis).format('DD.MM.YYYY')}</strong>
                        </p>}
                        <p>Статус: <span className="status"
                            style={{color: chosenInvoice.invoiceStatus === 'PAID' ? '#34C38F' : '#50A5F1'}}>{chosenInvoice.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                            (chosenInvoice.invoiceStatus === 'PAID' ? 'Оплачено' : (chosenInvoice.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))}
                    </span>
                        </p>
                    </div>
                </div>

                <hr/>

                <div className="table">
                    <div className="table-header row">
                        <div className="col-4 table-description"><p>Описание:</p></div>
                        <div className="col-4 table-count"><p
                            className="default">Количество:</p>
                            <p
                                className="mob">Кол-во {chosenPacket.packetType !== 'SMS_PACKET' ? 'мес.' : ''}</p>
                        </div>
                        <div className="col-4 table-price"><p>Стоимость:</p></div>
                    </div>
                    {chosenInvoice && chosenInvoice.invoicePackets && chosenInvoice.invoicePackets.map(packet => {
                        let name = packets && packets.find(item => item.packetId === packet.packetId)
                        return (
                            <div className="table-row row">
                                <div className="col-4 table-description">
                                    <p>{name && name.packetName} {chosenPacket.packetType !== 'SMS_PACKET' ? '' : `, ${chosenPacket.smsAmount} sms`}</p>
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
                               <p>Общая сумма:</p>
                           </div>
                           <div>
                               <p className="bold-text">{chosenInvoice.totalSum} {chosenInvoice.currency}</p>
                           </div>
                       </div>
                   </div>
                   <div className="col-12 col-md-4 result-price-container">
                       <div className="result-price">
                           <div>
                               <p>Без НДС</p>
                           </div>
                           <div>
                               <p className="bold-text">0.00 {chosenInvoice.currency}</p>
                           </div>
                       </div>
                   </div>
                   <div className="col-12 col-md-4 payment-button-container">
                       <p className="download"
                          onClick={() => this.downloadInPdf(pdfMarkup)}>Скачать в PDF</p>
                       {chosenInvoice.invoiceStatus !== 'PAID' && <div className="row-status">
                           <button className="inv-date" style={{
                               backgroundColor: chosenInvoice.invoiceStatus === 'ISSUED' ? '#0a1232' : '#fff',
                               color: chosenInvoice.invoiceStatus === 'ISSUED' ? '#fff' : '#000'
                           }}
                                   data-target=".make-payment-modal"
                                   data-toggle="modal"
                                   onClick={() => {
                                       this.props.dispatch(paymentsActions.makePayment(chosenInvoice.invoiceId))
                                       this.repeatPayment(chosenInvoice.invoiceId)
                                   }}>
                               {chosenInvoice.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                                   (chosenInvoice.invoiceStatus === 'PAID' ? 'Оплачено' : (chosenInvoice.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))}
                           </button>
                       </div>}

                   </div>
               </div>
            </div>
        </React.Fragment>

        const options = (companyTypeId === 2) ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <React.Fragment>
                {isLoading &&
                <div className="loader"><img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>}
                {!isLoading && <div className="retreats">


                    <div className="tab-content">
                        <div className={"tab-pane " + (pathname === '/payments' ? "active" : "")} id="payments">

                            <div className="d-flex flex-column-reverse flex-md-row align-items-start justify-content-between align-items-md-center mb-2">
                                <div className="payments-license-block">
                                    <a href={`${process.env.CONTEXT}public/_licenseDocument/license_agreement.pdf`}
                                       download>Лицензионный договор</a>
                                    <span data-toggle="modal" data-target=".accountant-modal-in">
                                Для бухгалтерии
                            </span>
                                </div>

                                {authentication.user && <div className="current-packet-container">
                                    <div className="current-packet text-left text-md-right">Текущий пакет: {currentPacket}</div>
                                    <div
                                        className="current-packet-timing text-left text-md-right">{activePacket ? 'Пакет действителен до: ' + moment(authentication.user.invoicePacket.endDateMillis).format('DD MMM YYYY') : ((moment(authentication.user.trialEndDateMillis).format('x') >= moment().format('x')) ? 'Пакет действителен до: ' + moment(authentication.user.trialEndDateMillis).format('DD MMM YYYY') : (authentication.user.forceActive ? 'Пробный период продлён' : ''))}</div>
                                </div>}
                            </div>
                            <div className="payments-inner d-flex flex-column flex-lg-row">



                                <div className="payments-list-block mb-2 mb-md-0">
                                    <p className="title-payments">Пакеты системы</p>
                                    <div id="range-staff">
                                        <p className="subtitle-payments mb-3 d-md-none">{(companyTypeId === 2 || companyTypeId === 3) ? 'Количество рабочих мест' : 'Количество сотрудников'}</p>


                                        <ul className="range-labels">
                                            {options.map(option => (
                                                <li className={(parseInt(workersCount) === option ? "active selected " : " ") + ((staffCount) <= option ? '' : 'disabledField')}
                                                    onClick={() => {
                                                        if ((staffCount) <= option) {
                                                            this.setState({
                                                                rate: {
                                                                    ...this.state.rate,
                                                                    workersCount: option,
                                                                    specialWorkersCount: ''
                                                                }
                                                            })
                                                        }
                                                    }}>{option}
                                                </li>
                                            ))}
                                        </ul>

                                        <div
                                            className={(specialWorkersCount !== '') ? "range range-hidden" : "range"}
                                            style={{position: "relative"}}>
                                            <input type="range" min="1" max={(companyTypeId === 2) ? 5 : 10}
                                                   value={workersCount}
                                                   onChange={(e) => {
                                                       if ((staffCount) <= e.target.value) {
                                                           this.rateChangeWorkersCount(e)
                                                       }
                                                   }}/>
                                            <div
                                                className={(specialWorkersCount !== '') ? "rateLine rateLineHidden" : "rateLine"}
                                                style={{width: ((workersCount - 1) * ((companyTypeId === 2) ? 25 : 11)) + "%"}}/>
                                        </div>


                                    </div>

                                    <div className="radio-buttons">
                                        <p className="subtitle-payments d-none d-md-flex">{(companyTypeId === 2 || companyTypeId === 3) ? 'Количество рабочих мест' : 'Количество сотрудников'}</p>

                                        {(companyTypeId === 2) ? (

                                            <div onClick={() => this.rateChangeSpecialWorkersCount('to 30')}>
                                                <input type="radio" className="radio" id="radio2"
                                                       name="staff-radio"
                                                       checked={specialWorkersCount === 'to 30'}/>
                                                <label htmlFor="radio2">Больше 5</label>
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                <div
                                                    onClick={() => ((staffCount) <= 20) && this.rateChangeSpecialWorkersCount('to 20')}>
                                                    <input type="radio" className="radio" id="radio"
                                                           name="staff-radio"
                                                           checked={specialWorkersCount === 'to 20'}/>
                                                    <label className={(staffCount) <= 20 ? '' : 'disabledField'}
                                                           htmlFor="radio">До 20</label>
                                                </div>
                                                <div
                                                    onClick={() => ((staffCount) <= 30) && this.rateChangeSpecialWorkersCount('to 30')}>
                                                    <input type="radio" className="radio" id="radio2"
                                                           name="staff-radio"
                                                           checked={specialWorkersCount === 'to 30'}/>
                                                    <label className={(staffCount) <= 30 ? '' : 'disabledField'}
                                                           htmlFor="radio2">До 30</label>
                                                </div>
                                                <div onClick={() => this.rateChangeSpecialWorkersCount('from 30')}>
                                                    <input type="radio" className="radio" id="radio3"
                                                           name="staff-radio"
                                                           checked={specialWorkersCount === 'from 30'}/>
                                                    <label htmlFor="radio3">Больше 30</label>
                                                </div>
                                            </React.Fragment>)}
                                    </div>

                                    <div id="range-month">
                                        <p className="subtitle-payments mb-3 d-md-none">Срок действия лицензии</p>

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
                                                })}>6 месяцев <br/> (+1 месяц бесплатно)
                                            </li>
                                            <li className={period === '3' ? "active selected" : ""}
                                                onClick={() => this.setState({
                                                    rate: {
                                                        ...this.state.rate,
                                                        period: "3"
                                                    }
                                                })}>12 месяцев <br/> (+3 бесплатно)
                                            </li>
                                        </ul>

                                        <div className="range" style={{position: "relative"}}>
                                            <input type="range" min="1" max="3" value={period}
                                                   onChange={(e) => this.rateChangePeriod(e)}/>
                                            <div className="rateLine" style={{width: ((period - 1) * 50) + "%"}}/>
                                        </div>

                                    </div>
                                    <p className="subtitle-payments d-none d-md-flex">Срок действия лицензии</p>

                                </div>

                                <div className="payments-list-block2 mb-2 mb-md-0">
                                    <div className="payments-content">
                                        <p className="title-payments">К оплате</p>
                                        <div>
                                            <p>Срок действия лицензии: </p>
                                            <span
                                                style={{textAlign: 'right'}}>{period === '1' ? '3 месяца' : (period === '2') ? '6 месяцев' : '12 месяцев'}</span>
                                        </div>
                                        <div>
                                            <p>Стоимость в месяц{finalPriceMonthDiscount ? ' без скидки ' : ''}: </p>
                                            <span
                                                style={{textAlign: 'right'}}>{finalPriceMonth} {countryCode ? (countryCode === 'BLR' ? 'руб' : (countryCode === 'UKR' ? 'грн' : (countryCode === 'RUS' ? 'руб' : 'руб'))) : 'руб'}</span>
                                        </div>

                                        {finalPriceMonthDiscount ? (
                                            <div>
                                                <p style={{color: '#F46A6A'}}>Стоимость в месяц со скидкой: </p>
                                                <span style={{
                                                    color: '#F46A6A',
                                                    textAlign: 'right'
                                                }}>{finalPriceMonthDiscount} {countryCode ? (countryCode === 'BLR' ? 'руб' : (countryCode === 'UKR' ? 'грн' : (countryCode === 'RUS' ? 'руб' : 'руб'))) : 'руб'}</span>
                                            </div>
                                        ) : ''}
                                        <div>
                                            <p className="total-price">Итоговая стоимость:
                                                <span>{finalPrice} {countryCode ? (countryCode === 'BLR' ? 'руб' : (countryCode === 'UKR' ? 'грн' : (countryCode === 'RUS' ? 'руб' : 'руб'))) : 'руб'}</span>
                                            </p>

                                        </div>
                                        <button className={"button " + (workersCount === -1 ? 'disabledField' : '')}
                                                type="button"
                                                disabled={workersCount === -1}
                                                onClick={() => this.AddingInvoiceStaff()}>Оплатить
                                        </button>
                                        {(countryCode && (countryCode === 'BLR' || countryCode === 'UKR')) && <div>
                                            <p className="description">
                                                (Цены в национальной валюте указаны для ознакомления. Оплата
                                                производится по
                                                курсу в рос. рублях)
                                            </p>
                                        </div>
                                        }
                                    </div>

                                </div>

                                <div className="payments-list-block3 mb-1 mb-md-0">
                                    <div className="payments-content buttons-change">
                                        <p className="title-payments">SMS ПАКЕТЫ</p>

                                        {packets && packets.filter(packet => packet.packetType === 'SMS_PACKET')
                                            .sort((a, b) => a.smsAmount - b.smsAmount)
                                            .map(packet => {
                                                return (
                                                    <div>
                                                        <label>
                                                            <input type="radio"
                                                                   checked={this.state.chosenAct === packet}
                                                                   onChange={() => {
                                                                       this.setState({chosenAct: packet});
                                                                   }} className="" name="sms-price-radio"/>

                                                            <span className="check-box-circle"></span>

                                                            <span className="packets-container">
                                                                <span className="packet-name">{packet.packetName}: <span
                                                                    className="sms-amount">{packet.smsAmount} SMS</span></span>
                                                            <span
                                                                className="sms-price">{packet.price} {packet.currency}</span>
                                                            </span>
                                                        </label>
                                                        {/*<button*/}
                                                        {/*    className={(this.state.chosenAct.packetId === packet.packetId) ? "button button-selected" : "button"}*/}
                                                        {/*    type="button"*/}
                                                        {/*    onClick={() => }>Выбрать*/}
                                                        {/*</button>*/}
                                                    </div>
                                                );
                                            })

                                        }
                                        {authentication && authentication.user && authentication.user.countryCode !== "BLR" && (
                                            <div style={{color: '#d41316', fontSize: '16px', fontWeight: 'bold'}}>
                                                Пожалуйста, свяжитесь с администрацией сайта перед покупкой смс пакетов,
                                                нажав на знак вопроса в правом верхнем углу.
                                            </div>)
                                        }
                                    </div>

                                    <div className="payments-content total-price">
                                        {chosenAct.packetName &&
                                        <React.Fragment>
                                            <div>
                                                <p className="total-price">Итоговая
                                                    стоимость: <span>{chosenAct.price ? chosenAct.price : 0} {chosenAct.currency}</span>
                                                </p>
                                            </div>
                                            <button className="button" type="button"
                                                    onClick={() => this.AddingInvoice()}>Оплатить
                                            </button>
                                            {(countryCode && (countryCode === 'BLR' || countryCode === 'UKR')) && <div>
                                                <p className="description">
                                                    (Цены в национальной валюте указаны для ознакомления. Оплата
                                                    производится
                                                    по курсу в рос. рублях)
                                                </p>
                                            </div>
                                            }
                                        </React.Fragment>
                                        }
                                    </div>

                                </div>

                            </div>

                            <div id="acts">
                                <h2 className="acts-title">Счета</h2>

                                <div className="invoice header-invoice">
                                    <div className="inv-number"><p className="d-none d-md-inline">Номер счета</p><p className="d-md-none"># счета</p></div>
                                    <div className="inv-date"><p>Дата</p></div>
                                    <div className="inv-date"><p>Сумма</p></div>
                                    <div className="inv-status"><p>Статус</p></div>
                                </div>

                                {list.length ? list.sort((a, b) => {
                                    if (a.invoiceStatus === 'ISSUED') {
                                        return parseInt(b.createdDateMillis) - parseInt(a.createdDateMillis);

                                    } else {

                                    }
                                }).map(invoice => {
                                    return (
                                        <div className="invoice" onClick={() => this.setState({
                                            chosenInvoice: invoice,
                                            invoiceSelected: true
                                        })}>
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
                                                    {invoice.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                                                        (invoice.invoiceStatus === 'PAID' ? 'Оплачено' : (invoice.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{textAlign: 'center'}}>Нет счетов для отображения</div>
                                )}

                                {/*--------------------*/}


                                {invoiceSelected &&
                                // !!0 && list.map(invoice => {
                                //  return(

                                    <div className="chosen-invoice-wrapper">
                                        <div className="chosen-invoice">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Счёт {chosenInvoice.customId}; {moment(chosenInvoice.createdDateMillis).format('DD.MM.YYYY')}</h4>
                                                <img src={`${process.env.CONTEXT}public/img/icons/cancel.svg`} alt=""
                                                     className="close" style={{height: "50px"}}
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
                                    // );})
                                }
                            </div>


                        </div>


                    </div>

                </div>}
                <ForAccountant/>
                {/*<div className="modal fade modal-new-subscription" role="dialog" aria-hidden="true">*/}
                {/*    <div className="modal-dialog modal-lg modal-dialog-centered">*/}
                {/*        <div className="modal-content">*/}
                {/*            <div className="modal-header">*/}
                {/*                <p>Новый абонемент</p>*/}
                {/*                <button type="button" className="close" data-dismiss="modal">&times;</button>*/}
                {/*            </div>*/}
                {/*            <div className="container pl-4 pr-4">*/}
                {/*                <p className="title mb-2">Среда 14 августа, 2018</p>*/}
                {/*                <div className="check-box row">*/}
                {/*                    <div className="form-check col">*/}
                {/*                        <input type="radio" className="form-check-input" name="radio422" id="radio2281"*/}
                {/*                               checked=""/>*/}
                {/*                        <label className="form-check-label" htmlFor="radio2281">Новый</label>*/}
                {/*                    </div>*/}
                {/*                    <div className="form-check-inline col">*/}
                {/*                        <input type="radio" className="form-check-input" name="radio422"*/}
                {/*                               id="radio8021"/>*/}
                {/*                        <label className="form-check-label" htmlFor="radio8021">Продление</label>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <p className="title mb-2">Клиент</p>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="col-sm-6">*/}
                {/*                        <p>Имя</p>*/}
                {/*                        <input type="text" placeholder="Например: Иван"/>*/}
                {/*                    </div>*/}
                {/*                    <div className="col-sm-6">*/}
                {/*                        <p>Фамилия</p>*/}
                {/*                        <input type="text" placeholder="Например: Иванов"/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="col-sm-6">*/}
                {/*                        <p>Номер телефона</p>*/}
                {/*                        <input type="text" placeholder="Например: +44095959599"/>*/}
                {/*                    </div>*/}
                {/*                    <div className="col-sm-6">*/}
                {/*                        <p>Дата рождения</p>*/}
                {/*                        <input type="text" placeholder="Например: 14.06.1991"/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="col-md-6">*/}
                {/*                        <p>Параметр</p>*/}
                {/*                        <input type="text" data-range="true" value="___"*/}
                {/*                               data-multiple-dates-separator=" - "*/}
                {/*                               className="datepicker-buttons-inline button-cal"/>*/}
                {/*                    </div>*/}
                {/*                    <div className="col-md-6">*/}
                {/*                        <p>Срок действия</p>*/}
                {/*                        <input type="text" placeholder=""/>*/}
                {/*                        <button type="button" className="button mt-3 mb-3">Сохранить</button>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}


                {/*<div className="modal fade modal_dates_change">*/}
                {/*    <div className="modal-dialog modal-dialog-centered">*/}
                {/*        <div className="modal-content">*/}
                {/*            <div className="modal-header">*/}
                {/*                <h4 className="modal-title">Изменить / продлить абонемент</h4>*/}
                {/*                <button type="button" className="close" data-dismiss="modal">&times;</button>*/}
                {/*            </div>*/}
                {/*            <div className="form-group mr-3 ml-3">*/}
                {/*                <div className="row">*/}
                {/*                    <div className="calendar col-xl-12">*/}
                {/*                        <div className="select-date">*/}
                {/*                            <div className="select-inner">*/}
                {/*                                <div className="button-calendar mb-2">*/}
                {/*                                    <label><span>Дата приобретения - Дата окончания</span>*/}
                {/*                                        <input type="button" data-range="true" value=""*/}
                {/*                                               data-multiple-dates-separator=" - "*/}
                {/*                                               className="datepicker-here calendar_modal_button button-cal"/>*/}
                {/*                                    </label>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}

                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <div className="modal-content-input  p-1  mb-2">*/}
                {/*                            <span>Тип</span>*/}
                {/*                            <select className="custom-select">*/}
                {/*                                <option>60 дней</option>*/}
                {/*                                <option>30 дней</option>*/}
                {/*                                <option>25 дней</option>*/}
                {/*                                <option>20 дней</option>*/}
                {/*                                <option>15 дней</option>*/}
                {/*                                <option selected="">12 дней</option>*/}
                {/*                                <option>10 дней</option>*/}
                {/*                                <option>8 дней</option>*/}
                {/*                                <option>6 дней</option>*/}
                {/*                            </select>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <div className="modal-content-input p-1  mb-2">*/}
                {/*                            <span>Осталось дней</span>*/}
                {/*                            <p>6 дней</p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="col-xl-12">*/}
                {/*                        <div className="modal-content-input p-1  mb-2">*/}
                {/*                            <span>Срок действия</span>*/}
                {/*                            <p>12 июля - 12 сентября</p>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <button className="button text-center" type="button">Продлить</button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="modal fade modal_user_setting">*/}
                {/*    <div className="modal-dialog modal-dialog-lg modal-dialog-centered">*/}
                {/*        <div className="modal-content">*/}
                {/*            <div className="modal-header">*/}
                {/*                <h4 className="modal-title">Настройки профиля</h4>*/}
                {/*                <button type="button" className="close" data-dismiss="modal">&times;</button>*/}
                {/*            </div>*/}
                {/*            <div className="form-group mr-3 ml-3">*/}
                {/*                <div className="row">*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <p>Имя</p>*/}
                {/*                        <input type="text" placeholder="Например: Иван"/>*/}
                {/*                    </div>*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <p>Номер телефона</p>*/}
                {/*                        <input type="text" placeholder="Например: +44-65-44-324-88"/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <p>Фамилия</p>*/}
                {/*                        <input type="text" placeholder="Например: Иванов"/>*/}
                {/*                    </div>*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <p>Электронный адрес</p>*/}
                {/*                        <input type="text" placeholder="Например: ivanov@gmail.com"/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="col-xl-12">*/}
                {/*                        <p>Текущий пароль</p>*/}
                {/*                        <p>*/}
                {/*                            <input data-toggle="password" data-placement="after" type="password"*/}
                {/*                                   placeholder="password" data-eye-class="material-icons"*/}
                {/*                                   data-eye-open-class="visibility"*/}
                {/*                                   data-eye-close-class="visibility_off"*/}
                {/*                                   data-eye-class-position-inside="true"/>*/}
                {/*                        </p>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="row">*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <p>Новый пароль</p>*/}
                {/*                        <input type="password" placeholder=""/>*/}
                {/*                    </div>*/}
                {/*                    <div className="calendar col-xl-6">*/}
                {/*                        <p>Повторить пароль</p>*/}
                {/*                        <input type="password" placeholder=""/>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <button className="button text-center" type="button">Сохранить</button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <MakePayment/>


            </React.Fragment>
        );
    }

    handleSearch() {
        const {defaultList} = this.state;

        const searchList = defaultList.filter((item) => {
            return String(item.customId).toLowerCase().includes(String(this.search.value).toLowerCase())
                || String(moment(item.createdDateMillis).format('DD.MM.YYYY')).toLowerCase().includes(String(this.search.value).toLowerCase())
                || String(item.totalSum + ' ' + item.currency).toLowerCase().includes(String(this.search.value).toLowerCase())
                || String(item.invoiceStatus === 'ISSUED' ? 'Оплатить' :
                    (item.invoiceStatus === 'PAID' ? 'Оплачено' : (item.invoiceStatus === 'CANCELLED' ? 'Закрыто' : ''))).toLowerCase().includes(String(this.search.value).toLowerCase())


        });


        this.setState({
            search: true,
            list: searchList
        });

        if (this.search.value === '') {
            this.setState({
                search: true,
                list: defaultList
            })
        }


    }


}


function mapStateToProps(state) {
    const {company, payments, authentication, staff} = state;
    return {
        company, payments, authentication, staff
    };
}

export default (withRouter(connect(mapStateToProps, null)(Index)));
