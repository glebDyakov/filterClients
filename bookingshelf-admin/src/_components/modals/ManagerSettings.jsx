import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
// import {calendarActions, companyActions, menuActions, userActions, staffActions, clientActions} from "../_actions";
// import moment from "moment";
// import Link from "react-router-dom/es/Link";
// import classNames from "classnames";
// import {UserSettings} from "./modals/UserSettings";
// import {HeaderMain} from "./HeaderMain";
// import AppointmentFromSocket from "./modals/AppointmentFromSocket";
import '../../../public/scss/managers-settings.scss'
import ReactPhoneInput from "react-phone-input-2";
import {isValidNumber} from "libphonenumber-js";
import moment from "./AddAppointment";
import Hint from "../Hint";
import InputCounter from "../InputCounter";
import {
    calendarActions, clientActions, staffActions
} from '../../_actions';
import { isValidEmailAddress } from "../../_helpers/validators";


class ManagerSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            message: {
                senderEmail: '',
                senderName: '',
                senderPhone: '',
                text: ''
            }
        };

        this.addManager=this.addManager.bind(this);
        this.sendMessage=this.sendMessage.bind(this);
        this.setterPhone=this.setterPhone.bind(this);
        this.handleChange=this.handleChange.bind(this);
        // this.getManagers=this.getManagers.bind(this);
        this.closeModal = this.closeModal.bind(this);


    }
    componentDidMount() {
        if (this.props.authentication.loginChecked) {
            this.queryInitData()
        }
        // initializeJs();
    }

    queryInitData() {
        this.props.dispatch(calendarActions.getManagers());

    }

    componentWillReceiveProps(newProps) {
        if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
            this.queryInitData()
        }
        // if ( JSON.stringify(this.props.client) !==  JSON.stringify(newProps.client)) {
        //     this.setState({ openedModal: newProps.client && newProps.client.status && newProps.client.status===209 ? false : this.state.openedModal, client: newProps.client, defaultClientsList:  newProps.client })
        // }
    }

    setterPhone(phone){
        const { message } = this.state
        debugger
        this.setState({ message: { ...message, senderPhone: phone.replace(/[()\- ]/g, '') } })
    }

    addManager(){
        const manager = {
            "email": "alex@gmail.com",
            "firstName": "Alex",
            "imageBase64": "test",
            "lastName": "Marty",
            "phone1": "+375298170912",
            "phone2": "+375298170913"
        }
        this.props.dispatch(calendarActions.addManager(JSON.stringify(manager)));

    }

    sendMessage(){
        const { message } = this.state;
        message.senderPhone =  message.senderPhone.startsWith('+') ? message.senderPhone : `+${ message.senderPhone}`;
        this.props.dispatch(calendarActions.sendMessage(message));
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { message } = this.state;

        this.setState({ message: {...message, [name]: value }});
    }

    closeModal(){
        const {onClose} = this.props;

        return onClose()
    }


    render() {
        const { managers } = this.props.calendar;
        const { message } = this.state;


        return (
                <div className="managers-settings">
                    <div className="modal-header">
                        <h4>Настройки</h4>
                        <button type="button" className="close"
                                onClick={this.closeModal}
                        />

                    </div>
                    <div className="theme-block">
                        <h5>Выбирите тему:</h5>
                        <p>Белая</p>
                        <div className="screen white"></div>
                        <p>Темная</p>
                        <div className="screen black"></div>
                        {/*<div className="row" style={{margin: 0}}>*/}
                        {/*    <div style={{paddingTop: '4px', display: 'flex', padding: 0}} className="col-sm-12 mt-2">*/}
                        {/*        <span className="add-helpers-text">Авто-тема</span>*/}
                        {/*        /!*<Hint hintMessage="При оказании услуги несколькими сотрудниками одновременно"/>*!/*/}

                        {/*        <span style={{width: 'auto', margin: '0'}} className="justify-content-end check-box">*/}
                        {/*                                <label>*/}
                        {/*                                    <input className="form-check-input" type="checkbox"*/}
                        {/*                                           // checked={isAddCostaff}*/}
                        {/*                                           // onChange={() => this.setState({isAddCostaff: !this.state.isAddCostaff})}*/}
                        {/*                                    />*/}
                        {/*                                    <span style={{margin: '0 0 0 20px'}} className="check"/>*/}
                        {/*                                </label>*/}
                        {/*                            </span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="manager-block">
                        <h5>Ваш менеджер</h5>
                        <div className="contact">
                            <div style={{position: "relative"}}>
                                {/*<a onClick={()=>this.openClientStats(client_user)}>*/}
                                    <span className="abbreviation">
                                {/* {client_user.firstName.substr(0, 1)}*/}
                                    </span>
                                    <p className="manager-name">
                                        {/*{client_user.firstName} {client_user.lastName}*/} {((managers[0].firstName ? managers[0].firstName : '') + ' ' + (managers[0].lastName ?  managers[0].lastName : ''))}
                                    </p>
                                    <p className="manager-questions">Ответит на ваши вопросы</p>
                                {/*</a>*/}
                            </div>
                        </div>
                        <div className="phone contact-details"><span className="phone_logo"></span><p>{managers && managers[0].phone1}</p></div>
                        <div className="phone contact-details"><span className="phone_logo"></span><p>{managers && managers[0].phone2}</p></div>
                        <div className="email contact-details"><span className="email_logo"></span><p>{managers && managers[0].email}</p></div>
                        {/*<div className="skype contact-details"><span className="skype_logo"></span><p>Skype: ttkstk</p></div>*/}
                    </div>
                    <div className="send-leader">
                        <h5>Написать руководству</h5>
                        <InputCounter
                            title="Имя"
                            placeholder="Введите Имя"
                            value={message.senderName}
                            name="senderName"
                            handleChange={this.handleChange}
                            maxLength={128}
                            withCounter={false}
                        />

                        <p>Телефон</p>
                        <ReactPhoneInput
                            defaultCountry={'by'}
                            country={'by'}
                            inputClass={'phone-number'}
                            regions={['america', 'europe']}
                            placeholder="Введите номер телефона"
                            disableAreaCodes={true}
                            value={ message.senderPhone }
                            onChange={phone => this.setterPhone(phone)}
                        />

                        <InputCounter
                            type="email"
                            placeholder="Введите email"
                            value={message.senderEmail}
                            name="senderEmail"
                            title="Email"
                            extraClassName={'' + (!isValidEmailAddress(message.senderEmail) && message.senderEmail!=='' ? ' redBorder' : '')}
                            handleChange={this.handleChange}
                            maxLength={128}
                            withCounter={false}
                        />

                        <div className="appointment-note">
                            <p>Текст</p>
                            <textarea
                                className="company_input"
                                placeholder="Введите текст"
                                name="text"
                                maxLength={120}
                                value={message.text}
                                onChange={this.handleChange}
                            />
                        </div>

                    </div>

                    <div className="send-button">
                        <button
                            disabled={(!(message.senderPhone) || !isValidEmailAddress(message.senderEmail) || !message.senderName || !message.text)}
                            className={(!(message.senderPhone) || !isValidEmailAddress(message.senderEmail) || !message.senderName || !message.text) ? 'disabledField' : ''}
                            type="button"
                            onClick={this.sendMessage}>Отправить
                        </button>
                    </div>




                </div>



        );
    }

}

function mapStateToProps(state) {
    const { authentication, calendar} = state;

    return {
        authentication, calendar
    };
}

ManagerSettings.proptypes = {
    location: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(ManagerSettings));
