import React, {Component} from 'react';
import {connect} from 'react-redux';

import '../../public/scss/online_booking.scss'
import {companyActions} from "../_actions";
import {access} from "../_helpers/access";
import {DatePicker} from "../_components/DatePicker";
import moment from 'moment';
import Hint from "../_components/Hint";

class Index extends Component {
    constructor(props) {
        super(props);

        if (!access(9)) {
            props.history.push('/denied')
        }


        this.state = {
            booking: props.company && props.company.booking,
            selectedDay: moment().utc().toDate(),
            urlButton: false,
            appointmentMessage: '',
            status: '',
            messageCopyModalOpen: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleStepChange = this.handleStepChange.bind(this);
        this.handleStepSubmit = this.handleStepSubmit.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setBookingCode = this.setBookingCode.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.queryInitData = this.queryInitData.bind(this);
        this.handleMessageCopyModal = this.handleMessageCopyModal.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }

        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                booking: newProps.company.booking,
            })
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
                serviceIntervalOn: newProps.company.settings.serviceIntervalOn
            })
        }
        if (newProps.company && newProps.company.saved === 'stepSaved') {
            setTimeout(() => {
                this.props.dispatch(companyActions.updateSaved(newProps.company.saved));
            }, 3000)
        }
        if (newProps.company && newProps.company.status === 'saved.settings') {
            this.setState({status: newProps.company.status})
            setTimeout(() => {
                this.setState({status: '', submitted: false})
            }, 3000)
        }
    }

    handleCheckboxChange(checkboxKey) {
        const newState = {
            [checkboxKey]: !this.state[checkboxKey]
        }
        this.setState(newState)
    }

    handleServiceCheckboxChange(checkboxKey) {
        const newState = {
            [checkboxKey]: !this.state[checkboxKey]
        }
        this.setState(newState)

        const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies.find(item => item.companyId === this.props.company.settings.companyId)
        this.props.dispatch(companyActions.updateCompanySettings({
            imageBase64: activeCompany && activeCompany.imageBase64,
            ...this.props.company.settings,
            [checkboxKey]: newState[checkboxKey]
        }, 'isServiceIntervalLoading'));
    }

    handleScreenCheckboxChange(firstScreen) {
        this.setState({firstScreen})
        const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies.find(item => item.companyId === this.props.company.settings.companyId)
        this.props.dispatch(companyActions.updateCompanySettings({
            imageBase64: activeCompany && activeCompany.imageBase64,
            ...this.props.company.settings,
            firstScreen
        }, 'isFirstScreenLoading'));
    }

    handleStepChange({target: {name, value}}) {
        this.setState({[name]: value});
    }

    handleStepSubmit() {
        const {booktimeStep} = this.state;
        const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies.find(item => item.companyId === this.props.company.settings.companyId)

        this.props.dispatch(companyActions.updateCompanySettings({
            imageBase64: activeCompany && activeCompany.imageBase64,
            ...this.props.company.settings,
            booktimeStep
        }, null, 'stepSaved'));
    }

    handleChange(e) {
        const {name, value} = e.target;
        const {booking} = this.state;

        const {dispatch} = this.props;

        const bookElement = {...booking, [name]: value}

        this.setState({booking: bookElement})
        dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement)));
    }

    handleMessageChange({target: {name, value}}) {
        this.setState({[name]: value})
    }

    handleSubmit() {
        const {onlineZapisEndTimeMillis, onlineZapisOn, appointmentMessage} = this.state;
        const activeCompany = this.props.company.subcompanies && this.props.company.subcompanies.find(item => item.companyId === this.props.company.settings.companyId)
        this.props.dispatch(companyActions.add({
            imageBase64: activeCompany && activeCompany.imageBase64,
            ...this.props.company.settings,
            appointmentMessage,
            onlineZapisEndTimeMillis,
            onlineZapisOn
        }));

    }

    componentDidMount() {
        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }
        document.title = "Онлайн-запись | Онлайн-запись";

        initializeJs();
    }

    queryInitData() {
        this.props.dispatch(companyActions.getSubcompanies());
        this.props.dispatch(companyActions.getBookingInfo());
    }

    handleOutsideClick() {
        this.setState({
            isOnlineZapisOnDropdown: false,
        })
    }

    setColor(color) {
        const {booking} = this.state;
        const {dispatch} = this.props;

        const bookElement = {...booking, bookingColor: parseInt(color, 16)}

        this.setState({booking: bookElement})
        dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement)));

    }

    setBookingCode(type, updatePosition) {
        const {dispatch} = this.props;
        const {booking} = this.state;
        const {bookingCode} = booking;

        const bookingCodeClassNames = bookingCode.split(' ')
        bookingCodeClassNames[updatePosition ? 1 : 0] = type

        const bookElement = {...booking, bookingCode: bookingCodeClassNames[0] + ' ' + bookingCodeClassNames[1]}

        // this.setState({booking: bookElement})
        dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement), updatePosition));
    }

    copyToClipboard(e, key) {
        //this[key].select();

        var textField = document.createElement('textarea')
        textField.innerText = this[key].textContent
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()

        e.target.focus();
        this.setState({copySuccess: 'Copied!', messageCopyModalOpen: true});
    };

    render() {
        const {company} = this.props
        const {booking, submitted, booktimeStep, appointmentMessage, urlButton, selectedDay, onlineZapisOn, serviceIntervalOn, status} = this.state;

        const isOnlineZapisChecked = !onlineZapisOn

        const {isServiceIntervalLoading, settings, isBookingInfoLoading, isFirstScreenLoading, saved} = company;

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
            ]
        }

        return (
            <div>
                {booking &&
                <div className="pages-content container-fluid online-zapis-page">
                    <div className="row justify-content-between">
                        <div className="col-xl-4 block-h p-0">
                            <div className=" content-pages-bg mb-0 h-auto p-zapis your-page">
                                <p className="title mb-3">Ваша страница</p>
                                <p className="text">Перейдите по ссылке для того, чтобы открыть вашу персональную
                                    страницу онлайн-записи, вы увидите страницу всех ваших онлайн бронирований. Также вы
                                    можете открыть данную страницу с помощью кнопки онлайн-бронирования на вашем
                                    сайте.</p>
                                <div className="booking-page">
                                    <a
                                        target="_blank"
                                        href={"https://online-zapis.com/online/" + booking.bookingPage}
                                        className=""
                                        ref={(text) => this.textLink = text}
                                    >{"online-zapis.com/online/" + booking.bookingPage}
                                    </a>
                                    <span onClick={(e) => this.copyToClipboard(e, 'textLink')}/>
                                </div>
                                <div className="clearfix"/>

                            </div>
                            <div className=" content-pages-bg mb-0 p-zapis h-auto extra-messages">
                                <p className="title">
                                    Дополнительное сообщение в онлайн-записи
                                    <Hint customLeft="-1px"
                                          hintMessage="Например: Оплата карточкой временно недоступна, приносим извинения за доставленные неудобства."/>
                                </p>
                                <textarea className="text" onChange={this.handleMessageChange} name="appointmentMessage"
                                          value={appointmentMessage}/>
                                {/*<p className="text">{appointmentMessage}</p>*/}


                                <p className="title limit-time">
                                    Ограничить время онлайн-записи
                                    &nbsp;
                                    <Hint customLeft="-4px"
                                          hintMessage="По умолчанию (если выключено), открытый период онлайн-записи составляет 6 мес."/>

                                </p>
                                <div className="check-box">
                                    <label>
                                        <input className="form-check-input" type="checkbox"
                                               checked={isOnlineZapisChecked}
                                               onChange={() => this.handleCheckboxChange('onlineZapisOn')}/>
                                        <span className="check"/>
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
                                    />
                                </div>
                                }
                                {status === 'saved.settings' &&
                                <p className="alert-success p-1 rounded pl-3">Сохранено</p>
                                }
                                <button className="ahref button button-save" onClick={this.handleSubmit}>
                                    Сохранить
                                </button>
                            </div>

                            <div className=" content-pages-bg p-zapis h-auto start-window">
                                <p className="title">Начальное окно в онлайн-записи</p>
                                <div className="check-box">
                                    <label>
                                        {isFirstScreenLoading
                                            ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                   className="loader"><img style={{width: '40px'}}
                                                                           src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                                           alt=""/></div>
                                            : <React.Fragment>
                                                <input className="form-check-input"
                                                       checked={(company.settings && company.settings.firstScreen) === 'staffs'}
                                                       onChange={() => this.handleScreenCheckboxChange('staffs')}
                                                       type="checkbox"/>
                                                <span className="check-box-circle"/>
                                            </React.Fragment>
                                        }
                                        Сотрудники
                                    </label>
                                </div>
                                <div className="check-box">
                                    <label>
                                        {isFirstScreenLoading
                                            ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                   className="loader"><img style={{width: '40px'}}
                                                                           src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                                           alt=""/></div>
                                            : <React.Fragment>
                                                <input className="form-check-input"
                                                       checked={(company.settings && company.settings.firstScreen) === 'services'}
                                                       onChange={() => this.handleScreenCheckboxChange('services')}
                                                       type="checkbox"/>
                                                <span className="check-box-circle"/>
                                            </React.Fragment>
                                        }
                                        Услуги
                                    </label>
                                </div>

                            </div>

                            <div className=" content-pages-bg mb-0 h-auto p-zapis online-interval">
                                <p className="title mb-3">Интервал онлайн-записи</p>

                                <div className="check-box">
                                    <label>
                                        {isServiceIntervalLoading
                                            ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                   className="loader"><img style={{width: '40px'}}
                                                                           src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                                           alt=""/></div>
                                            : <React.Fragment>
                                                <input className="form-check-input"
                                                       checked={!serviceIntervalOn}
                                                       onChange={() => this.handleServiceCheckboxChange('serviceIntervalOn')}
                                                       type="checkbox"/>
                                                <span className="check-box-circle"/>
                                            </React.Fragment>
                                        }
                                        15 минут
                                    </label>
                                </div>
                                <div className="check-box">
                                    <label>
                                        {isServiceIntervalLoading
                                            ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                   className="loader"><img style={{width: '40px'}}
                                                                           src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                                           alt=""/></div>
                                            : <React.Fragment>
                                                <input className="form-check-input"
                                                       checked={serviceIntervalOn}
                                                       onChange={() => this.handleServiceCheckboxChange('serviceIntervalOn')}
                                                       type="checkbox"/>
                                                <span className="check-box-circle"/>
                                            </React.Fragment>
                                        }
                                        Равен времени услуги
                                    </label>
                                </div>

                            </div>

                            <div className=" content-pages-bg mb-0 h-auto p-zapis journal-interval">
                                <p className="title">Интервал записи в журнал</p>
                                <select className="custom-select" name="booktimeStep" onChange={this.handleStepChange}
                                        value={booktimeStep}>
                                    <option value={300}>5 мин</option>
                                    <option value={600}>10 мин</option>
                                    <option value={900}>15 мин</option>
                                </select>
                                {saved === 'stepSaved' &&
                                <p className="alert-success p-1 rounded pl-3">Сохранено</p>
                                }
                                <button className="ahref button button-save" onClick={this.handleStepSubmit}>
                                    Сохранить
                                </button>
                            </div>

                        </div>
                        <div className="col-xl-8 content-pages-bg main-tab">
                            <p className="title mb-3">Стили кнопок</p>
                            <p className="text">Чтобы установить кнопку онлайн-записи на сайт,
                                выберите цвет и форму кнопки, скопируйте код и поместите на сайт.</p>

                            <hr/>
                            <div className="form-button">
                                <div>
                                    <p className="sub-title">Форма кнопки</p>
                                </div>
                                <div className="buttons">
                                    <button type="button"
                                            className={(booking.bookingCode.split(' ')[0] === "button-standart" && 'active') + " button-standart mb-3 ml-0 mr-2 mt-0"}
                                            onClick={() => this.setBookingCode("button-standart")} style={{
                                        'animation': 'unset',
                                        'height': '40px',
                                        'width': '55px',
                                        backgroundColor: booking.bookingColor.toString(16)
                                    }}/>
                                    <button type="button"
                                            className={(booking.bookingCode.includes("button-site") && 'active') + " button-site mb-3 ml-0 mr-2 mt-0 "}
                                            onClick={() => this.setBookingCode("button-site")} style={{
                                        'animation': 'unset',
                                        'height': '40px',
                                        'width': '55px',
                                        backgroundColor: booking.bookingColor.toString(16)
                                    }}/>
                                    <button type="button"
                                            className={(booking.bookingCode.includes("button-round-border") && 'active') + " button-round-border mb-3 ml-0 mr-2 mt-0"}
                                            onClick={() => this.setBookingCode("button-round-border")} style={{
                                        'animation': 'unset',
                                        'height': '40px',
                                        'width': '55px',
                                        backgroundColor: booking.bookingColor.toString(16)
                                    }}/>
                                    <button type="button"
                                            className={(booking.bookingCode.split(' ')[0] === "small-button-standart" && 'active') + " small-button-standart mb-3 ml-0 mr-2 mt-0"}
                                            onClick={() => this.setBookingCode("small-button-standart")} style={{
                                        'animation': 'unset',
                                        'height': '50px',
                                        'width': '50px',
                                        backgroundColor: booking.bookingColor.toString(16)
                                    }}/>
                                    <button type="button"
                                            className={(booking.bookingCode.includes("small-button-round") && 'active') + " small-button-round mb-3 ml-0 mr-2 mt-0"}
                                            onClick={() => this.setBookingCode("small-button-round")} style={{
                                        'animation': 'unset',
                                        'height': '50px',
                                        'width': '50px',
                                        backgroundColor: booking.bookingColor.toString(16)
                                    }}/>
                                </div>
                            </div>
                            <p className="sub-title m-20">Выберите цвет</p>
                            <div className="chose_button">
                                <a className={(booking.bookingColor.toString(16) === '39434f' && 'active') + " button-color color39434F"}
                                   onClick={() => this.setColor("39434F")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === 'ea3e3e' && 'active') + " button-color colorEA3E3E"}
                                   onClick={() => this.setColor("EA3E3E")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === '2f84' && 'active') + " button-color color002F84"}
                                   onClick={() => this.setColor("002F84")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === 'a300b7' && 'active') + " button-color colorA300B7"}
                                   onClick={() => this.setColor("A300B7")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === '14a736' && 'active') + " button-color color14A736"}
                                   onClick={() => this.setColor("14A736")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === 'fec81d' && 'active') + " button-color colorFEC81D"}
                                   onClick={() => this.setColor("FEC81D")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === '0' && 'active') + " button-color color000000"}
                                   onClick={() => this.setColor("000000")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === '5b88a8' && 'active') + " button-color color5B88A8"}
                                   onClick={() => this.setColor("5B88A8")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === '7a7a7a' && 'active') + " button-color color7A7A7A"}
                                   onClick={() => this.setColor("7A7A7A")}><span></span></a>
                                <a className={(booking.bookingColor.toString(16) === '23d2cc' && 'active') + " button-color color23D2CC"}
                                   onClick={() => this.setColor("23D2CC")}><span></span></a>
                            </div>

                            <div className="form-button">
                                <div>
                                    <p className="sub-title position-button">Расположение кнопки</p>
                                </div>
                                <div className="row position-button">
                                    <div className="check-box">
                                        <label>
                                            {isBookingInfoLoading
                                                ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                       className="loader"><img style={{width: '40px'}}
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
                                            Слева
                                        </label>
                                    </div>
                                    <div className="check-box">
                                        <label>
                                            {isBookingInfoLoading
                                                ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                       className="loader"><img style={{width: '40px'}}
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
                                            Справа
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                {/*<p className="sub-title mb-3">Название кнопки</p>*/}
                                {/*<input type="text" placeholder="Например: Онлайн-запись" value={booking.bookingButton} name="bookingButton" onChange={this.handleChange}/>*/}
                                <strong className="sub-title text-example">Пример</strong>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: (booking.bookingCode.includes('left') ? 'flex-start' : 'flex-end')
                                }} className="buttons-container-color-form mb-4 but">
                                    <button type="button"
                                            className={"exemple-buton " + booking.bookingCode + " color" + booking.bookingColor.toString(16)}>Онлайн
                                        запись
                                    </button>
                                </div>
                                <div className="row code-buttons">
                                    <p className="sub-title">Код: </p>
                                    <div className="check-box">
                                        <label>
                                            {isBookingInfoLoading
                                                ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                       className="loader"><img style={{width: '40px'}}
                                                                               src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                                               alt=""/></div>
                                                : <React.Fragment>
                                                    <input className="form-check-input"
                                                           checked={!this.state.urlButton}
                                                           onChange={() => this.setState({
                                                               ...this.state,
                                                               urlButton: false
                                                           })}
                                                           type="checkbox"/>
                                                    <span className="check-box-circle"/>
                                                </React.Fragment>
                                            }
                                            Код кнопки на сайт
                                        </label>
                                    </div>
                                    <div className="check-box">
                                        <label>
                                            {isBookingInfoLoading
                                                ? <div style={{position: 'absolute', left: '-10px', width: 'auto'}}
                                                       className="loader"><img style={{width: '40px'}}
                                                                               src={`${process.env.CONTEXT}public/img/spinner.gif`}
                                                                               alt=""/></div>
                                                : <React.Fragment>
                                                    <input className="form-check-input"
                                                           checked={this.state.urlButton}
                                                           onChange={() => this.setState({
                                                               ...this.state,
                                                               urlButton: true
                                                           })}
                                                           type="checkbox"/>
                                                    <span className="check-box-circle"/>
                                                </React.Fragment>
                                            }
                                            Код ссылки на сайт
                                        </label>
                                    </div>


                                </div>
                                {!urlButton &&
                                <textarea ref={(textarea) => this.textArea = textarea} spellCheck="off"
                                          autoCorrect="off" className="copy-code" value={"" +
                                "<button type=\"button\" onclick=\"displayFrame()\" id='bb' class='" + booking.bookingCode + " color" + booking.bookingColor.toString(16).toUpperCase() + "' code='" + booking.bookingPage + "' style='visibility: hidden'>Онлайн запись</button>\n" +
                                "<script type=\"text/javascript\" src=\"https://online-zapis.com/bb/frame.js\"></script>"}/>
                                }
                                {urlButton &&
                                <textarea ref={(textarea) => this.textArea = textarea} spellCheck="off"
                                          autoCorrect="off" className="copy-code" value={"" +
                                "<a type=\"button\" onclick=\"displayFrame()\" id='bb' class='url' code='" + booking.bookingPage + "' style='visibility: hidden'>Онлайн запись</a>\n" +
                                "<script type=\"text/javascript\" src=\"https://online-zapis.com/bb/frame.js\"></script>"}/>
                                }
                                <p onClick={(e) => this.copyToClipboard(e, 'textArea')}
                                   className="copy-code">Скопировать код</p>
                            </div>
                        </div>
                    </div>
                    {this.state.messageCopyModalOpen &&
                    <div className="message-is-sent-wrapper">
                        <div className="message-is-sent-modal">
                            <button onClick={this.handleMessageCopyModal} className="close"></button>
                            <div className="modal-body">
                                <img src={`${process.env.CONTEXT}public/img/icons/Check_mark.svg`}
                                     alt="message is sent image"/>
                                <p className="body-text">
                                    Скопировано!
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
        this.setState({messageCopyModalOpen: false})
    }

    handleDayClick(day) {

        let daySelected = moment(day);

        this.setState({
            selectedDay: daySelected.utc().startOf('day').toDate(),
            onlineZapisEndTimeMillis: parseInt(moment(day).format('x'))
        });
    }
}

function mapStateToProps(state) {
    const {alert, company, authentication} = state;
    return {
        alert, company, authentication
    };
}

export default connect(mapStateToProps)(Index);
