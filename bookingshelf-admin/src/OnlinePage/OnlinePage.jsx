import React, {Component} from 'react';
import { connect } from 'react-redux';

import {HeaderMain} from "../_components/HeaderMain";

import '../../public/scss/online_booking.scss'
import {UserSettings} from "../_components/modals";
import {UserPhoto} from "../_components/modals/UserPhoto";
import Pace from 'react-pace-progress'
import {companyActions} from "../_actions";
import {access} from "../_helpers/access";

class OnlinePage extends Component {
    constructor(props) {
        super(props);

        if(!access(9)){
            props.history.push('/denied')
        }



        this.state = {
            booking: props.company && props.company.booking,
            isLoading: true,
            urlButton: false,
            userSettings: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setType = this.setType.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if ( JSON.stringify(this.props) !==  JSON.stringify(newProps)) {
            this.setState({ booking: newProps.company.booking,
                userSettings: newProps.authentication.status && newProps.authentication.status===209 ? false : this.state.userSettings
            })
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { booking } = this.state;

        const { dispatch } = this.props;

        const bookElement={...booking, [name]: value }

        this.setState({booking: bookElement})
        dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement)));
    }

    handleSubmit(e) {

    }

    componentDidMount(){
        document.title = "Онлайн-запись | Онлайн-запись";

        this.props.dispatch(companyActions.getBookingInfo());
        setTimeout(() => this.setState({ isLoading: false }), 800);
        initializeJs();
    }

    setColor (color) {
        const {booking}=this.state;
        const { dispatch } = this.props;

        const bookElement={...booking, bookingColor: parseInt(color, 16)}

        this.setState({booking: bookElement})
        dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement)));

    }

    setType (type) {
        const {booking}=this.state;

        const { dispatch } = this.props;

        const bookElement={...booking, bookingCode: type}

        this.setState({booking: bookElement})
        dispatch(companyActions.updateBookingInfo(JSON.stringify(bookElement)));
    }

    copyToClipboard () {
        this.textArea.select();
        document.execCommand('copy');

        e.target.focus();
        this.setState({ copySuccess: 'Copied!' });
    };

    render() {
        const { booking, submitted, isLoading, urlButton, userSettings } = this.state;

        return (
            <div>
                {/*{isLoading ? <div className="zIndex"><Pace color="rgb(42, 81, 132)" height="3"  /></div> : null}*/}
                <div className={"container_wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>


                    <div className={"content-wrapper "+(localStorage.getItem('collapse')=='true'&&' content-collapse')}>
                        <div className="container-fluid">
                            <HeaderMain
                                onOpen={this.onOpen}
                            />
                            {booking &&
                            <div className="pages-content container-fluid">
                                <div className="row justify-content-between">
                                    <div className="col-xl-8 mb-3 content-pages-bg p-4">
                                        <p className="title mb-3">Стили кнопок</p>
                                        <p className="gray-text mb-3">Чтобы установить кнопку онлайн-записи на сайт,
                                            выберите цвет и форму кнопки, скопируйте код и поместите на сайт.</p>
                                        <div className="chose_button">
                                            <a className={(booking.bookingColor.toString(16) === '39434f' && 'active') + " button-color color39434F"}
                                               onClick={() => this.setColor("39434F")}><span></span>39434F</a>
                                            <a className={(booking.bookingColor.toString(16) === 'ea3e3e' && 'active') + " button-color colorEA3E3E"}
                                               onClick={() => this.setColor("EA3E3E")}><span></span>EA3E3E</a>
                                            <a className={(booking.bookingColor.toString(16) === '2f84' && 'active') + " button-color color002F84"}
                                               onClick={() => this.setColor("002F84")}><span></span>002F84</a>
                                            <a className={(booking.bookingColor.toString(16) === 'a300b7' && 'active') + " button-color colorA300B7"}
                                               onClick={() => this.setColor("A300B7")}><span></span>A300B7</a>
                                            <a className={(booking.bookingColor.toString(16) === '14a736' && 'active') + " button-color color14A736"}
                                               onClick={() => this.setColor("14A736")}><span></span>14A736</a>
                                            <a className={(booking.bookingColor.toString(16) === 'fec81d' && 'active') + " button-color colorFEC81D"}
                                               onClick={() => this.setColor("FEC81D")}><span></span>FEC81D</a>
                                            <a className={(booking.bookingColor.toString(16) === '0' && 'active') + " button-color color000000"}
                                               onClick={() => this.setColor("000000")}><span></span>000000</a>
                                            <a className={(booking.bookingColor.toString(16) === '5b88a8' && 'active') + " button-color color5B88A8"}
                                               onClick={() => this.setColor("5B88A8")}><span></span>5B88A8</a>
                                            <a className={(booking.bookingColor.toString(16) === '7a7a7a' && 'active') + " button-color color7A7A7A"}
                                               onClick={() => this.setColor("7A7A7A")}><span></span>7A7A7A</a>
                                            <a className={(booking.bookingColor.toString(16) === '23d2cc' && 'active') + " button-color color23D2CC"}
                                               onClick={() => this.setColor("23D2CC")}><span></span>23D2CC</a>
                                        </div>
                                        <div className="form-button">
                                            <div>
                                                <p className="sub-title mb-3 mt-3">Форма кнопки</p>
                                            </div>
                                            <div className="buttons">
                                                <button type="button"
                                                        className={(booking.bookingCode === "button-standart" && 'active') + " button-standart mb-3 ml-0 mr-2 mt-0"}
                                                        onClick={() => this.setType("button-standart")} style={{
                                                    'animation': 'unset',
                                                    'height': '40px',
                                                    'width': '55px'
                                                }}/>
                                                <button type="button"
                                                        className={(booking.bookingCode === "button-site" && 'active') + " button-site mb-3 ml-0 mr-2 mt-0 "}
                                                        onClick={() => this.setType("button-site")} style={{
                                                    'animation': 'unset',
                                                    'height': '40px',
                                                    'width': '55px'
                                                }}/>
                                                <button type="button"
                                                        className={(booking.bookingCode === "button-round-border" && 'active') + " button-round-border mb-3 ml-0 mr-2 mt-0"}
                                                        onClick={() => this.setType("button-round-border")} style={{
                                                    'animation': 'unset',
                                                    'height': '40px',
                                                    'width': '55px'
                                                }}/>
                                                <button type="button"
                                                        className={(booking.bookingCode === "small-button-standart" && 'active') + " small-button-standart mb-3 ml-0 mr-2 mt-0"}
                                                        onClick={() => this.setType("small-button-standart")} style={{
                                                    'animation': 'unset',
                                                    'height': '50px',
                                                    'width': '50px'
                                                }}/>
                                                <button type="button"
                                                        className={(booking.bookingCode === "small-button-round" && 'active') + " small-button-round mb-3 ml-0 mr-2 mt-0"}
                                                        onClick={() => this.setType("small-button-round")} style={{
                                                    'animation': 'unset',
                                                    'height': '50px',
                                                    'width': '50px'
                                                }}/>
                                            </div>
                                        </div>
                                        <div className="">
                                            {/*<p className="sub-title mb-3">Название кнопки</p>*/}
                                            {/*<input type="text" placeholder="Например: Онлайн-запись" value={booking.bookingButton} name="bookingButton" onChange={this.handleChange}/>*/}
                                            <strong className="sub-title mb-4 mt-4">Пример</strong>
                                            <div className="buttons-container-color-form mb-4 but">
                                                <button type="button"
                                                        className={"exemple-buton " + booking.bookingCode + " color" + booking.bookingColor.toString(16)}>Онлайн
                                                    запись
                                                </button>
                                            </div>
                                            <button type="button" className={"float-left button copy-code "}
                                                    onClick={()=>this.setState({...this.state, urlButton: false})}>Код кнопки на сайт
                                            </button>
                                            <button type="button" className={"float-left ml-3  button copy-code "}
                                                    onClick={()=>this.setState({...this.state, urlButton: true})}>Код ссылки на сайт
                                            </button>
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
                                            <button type="button" className="float-right button copy-code"
                                                    onClick={this.copyToClipboard}>Скопировать
                                                код
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 mb-3 block-h">
                                        <div className=" content-pages-bg p-4">
                                            <p className="title mb-3">Ваша страница</p>
                                            <p className="gray-text mb-3">Перейдите по ссылке для того что бы открыть
                                                вашу персональную страницу онлайн записи. Вы увидете полную страницу
                                                всех ваших онлайн бронирований. Также можете перейти по ссылке: через
                                                свою электронную почту или с помощью кнопки онлайн-бронирования на
                                                сайте:</p>
                                            <p className="sub-title mb-3">Ваша страница Онлайн-запись</p>
                                            <textarea value={"online-zapis.com/online/" + booking.bookingPage}/>
                                            <a target="_blank"
                                               href={"https://online-zapis.com/online/" + booking.bookingPage}
                                               className="ahref button mt-3 mb-3 float-right button-url">Посмотреть
                                                страницу в интернете
                                            </a>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>


                </div>
                {userSettings &&
                <UserSettings
                    onClose={this.onClose}
                />
                }
                <UserPhoto/>
            </div>

        );
    }
    onClose(){
        this.setState({...this.state, userSettings: false});
    }

    onOpen(){

        this.setState({...this.state, userSettings: true});
    }
}

function mapStateToProps(state) {
    const { alert, company, authentication } = state;
    return {
        alert, company, authentication
    };
}

const connectedOnlinePage = connect(mapStateToProps)(OnlinePage);
export { connectedOnlinePage as OnlinePage };
