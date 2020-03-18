import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import {staffActions} from "../../_actions";
import PhoneInput from "../../_components/PhoneInput";
import {getCookie} from "../../_helpers/cookie";
import moment from "moment";

class TabCreateComment extends  PureComponent{
    constructor(props) {
        super(props);
        const group = {
            rating: 0,
            comment: ''
        }
        this.state = {
            tab: 'login_tab',
            group,
            enteredCode: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.setterPhone = this.setterPhone.bind(this);
        this.changeRating = this.changeRating.bind(this);
        this.updateTab = this.updateTab.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.timer = this.timer.bind(this);
        this.handleSendPassword = this.handleSendPassword.bind(this);
    }

    componentDidMount() {
        if (this.props.sendSmsTimer) {
            this.runSendSmsTimerChecker()
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.commentCreated && (newProps.commentCreated !== this.props.commentCreated)) {
            this.props.setScreen('staff-comments')
        }
        if (newProps.commentPassword !== this.props.commentPassword) {
            this.setState({ commentPassword: newProps.commentPassword })
        }

        if (newProps.clientLoginMessage !== this.props.clientLoginMessage) {
            this.setState({ clientLoginMessage: newProps.clientLoginMessage })
        }
    }

    componentWillUnmount() {
        this.clearInterval()
    }
    clearInterval() {
        clearInterval(this.state.sendSmsTimerInterval)
        this.setState({ sendSmsTimerInterval: null, timeExpires: null })
    }

    runSendSmsTimerChecker() {
        const sendSmsTimerInterval = setInterval(this.timer, 1000);
        // store intervalId in the state so it can be accessed later:
        this.setState({ sendSmsTimerInterval });
    }

    timer() {
        const sendSmsTimer = getCookie('sendSmsTimer');
        if (sendSmsTimer) {
            const expires = moment(sendSmsTimer, 'YYYY/MM/DD HH:mm:ss').format('x');
            const now = moment().format('x')
            this.setState({ timeExpires: moment(expires - now).format('mm:ss')})
        }
        if (!sendSmsTimer) {
            this.props.dispatch(staffActions.clearSendSmsTimer())
            this.clearInterval()
        }
    }

    setterPhone(clientPhone){
        const {group} = this.state
        this.setState({ group: {...group, clientPhone: clientPhone.replace(/[()\- ]/g, '')} })
    }


    handleCommentChange({ target: { name, value } }) {
        this.setState({ group: { ...this.state.group, [name]: value } })
    }

    handleChange({ target: { name, value } }) {
        this.setState({ [name]: value })
    }

    handleSendPassword() {
        const { dispatch, staffCommentsStaff } = this.props;
        const { sendPasswordPhone } = this.state;
        const { company } = this.props.match.params

        dispatch(staffActions.sendPassword(company, staffCommentsStaff.staffId,  { clientPhone: sendPasswordPhone }))
        this.runSendSmsTimerChecker()
    }

    handleSave() {
        const { dispatch, staffCommentsStaff, clientCookie } = this.props;
        const { group } = this.state;
        const { company } = this.props.match.params

        const data = {
            ...group,
            clientPhone: clientCookie.phone,
            clientPassword: clientCookie.clientPassword
        }

        dispatch(staffActions.createComment(company, staffCommentsStaff.staffId, data))
    }

    handleLogin() {
        const { dispatch } = this.props;
        const { loginPhone, loginPassword } = this.state;
        const { company } = this.props.match.params
        const data = { clientPhone: loginPhone, clientPassword: loginPassword };

        dispatch(staffActions.clientLogin(company, data))
    }

    changeRating(newRating) {
        this.setState({
            group: {
                ...this.state.group,
                rating: newRating
            }
        });
    }
    updateTab(tab) {
        this.setState({ tab })
        this.props.dispatch(staffActions.clearMessages())
    }

    render() {
        const { setScreen, sendSmsTimer, staffCommentsStaff, isLoading, commentPassword, clientCookie, clientLoginMessage } = this.props;
        const { group, timeExpires, tab, isValidSendPasswordPhone, sendPasswordPhone, loginPhone, loginPassword, isValidLoginPhone } = this.state;

        return(
            <div className="service_selection screen1 screen5">
                <div className="title_block n">
                    <span className="prev_block" onClick={() => {
                        setScreen('staff-comments');
                        this.props.dispatch(staffActions.clearMessages())

                    }}><span className="title_block_text">Назад</span></span>
                    <p className="modal_title">Отзывы</p>
                </div>

                <div className="staff_popup staff_popup_large">
                    <div className="staff_popup_item">
                        <div className="img_container">
                            <img
                                src={staffCommentsStaff.imageBase64 ? "data:image/png;base64," + staffCommentsStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                alt=""/>
                            <span className="staff_popup_name">{staffCommentsStaff.firstName} {staffCommentsStaff.lastName ? ` ${staffCommentsStaff.lastName}` : ''}<br/>
                                <span style={{ fontSize: "13px"}}>{staffCommentsStaff.description}</span>
                            </span>
                        </div>

                    </div>
                </div>

                {clientCookie ? (
                    <div>
                        <div style={{ textAlign: 'right' }}>
                            <p>Вы вошли как {`${clientCookie.firstName}${clientCookie.lastName ? ` ${clientCookie.lastName}` : ''}`}, {clientCookie.phone}</p>
                            <p style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.props.dispatch(staffActions.clearClientLogin())}>Сменить аккаунт</p>
                        </div>
                        <br/>
                        <p>Рейтинг</p>
                        <StarRatings
                            rating={group.rating}
                            changeRating={this.changeRating}
                            starHoverColor={'#ff9500'}
                            starRatedColor={'#ff9500'}
                            name='rating'
                            starDimension="20px"
                            starSpacing="5px"
                        />

                        <p style={{ marginTop: '15px' }}>Комментарии</p>
                        <textarea placeholder=""  name="comment" onChange={this.handleCommentChange} value={group.comment}/>

                        <input
                            style={{ marginBottom: '20px' }}
                            className={((!group.comment || !group.rating) ? 'disabledField': '')+" book_button"}
                            disabled={!group.comment || !group.rating}
                            type="submit" value={group.clientPassword ? 'Добавить отзыв' : 'Добавить отзыв'} onClick={this.handleSave}
                        />
                    </div>
                ) : (
                    <React.Fragment>
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <input
                                style={{ backgroundColor: tab === 'login_tab' ? '#39434f' : 'grey'}}
                                className="book_button book_button_tab"
                                type="button" value="Вход" onClick={() => this.updateTab('login_tab')}
                            />
                            <input
                                style={{ backgroundColor: tab === 'sms_tab' ? '#39434f' : 'grey'}}
                                className="book_button book_button_tab"
                                type="button" value="SMS авторизация" onClick={() => this.updateTab('sms_tab')}
                            />
                        </div>

                        {!isLoading && (
                            <React.Fragment>
                                {tab === 'login_tab' && (
                                    <React.Fragment>
                                        <p>Телефон</p>
                                        <div className="phones_country">
                                            <PhoneInput
                                                value={loginPhone}
                                                onChange={clientPhone => this.handleChange({target: { name: 'loginPhone', value: clientPhone} })}
                                                getIsValidPhone={isValidLoginPhone => this.setState({ isValidLoginPhone })}
                                            />
                                        </div>
                                        <br/>

                                        <p>Персональный пароль</p>
                                        <p style={{ display: 'flex' }}>
                                            <img style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                            /> <span>Введите ваш персональный пароль. Если у вас нет пароля или вы забыли пароль, перейдите во вкладку SMS авторизации</span>
                                        </p>
                                        <input type="text" placeholder="Введите пароль" name="loginPassword" onChange={this.handleChange} value={loginPassword} />
                                        {clientLoginMessage && (
                                            <p style={{ display: 'flex' }}>
                                                <img style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                                /> <span style={{ color: 'red' }}>{clientLoginMessage}</span>
                                            </p>
                                        )}
                                        <input
                                            style={{ margin: '20px auto' }}
                                            className={((!isValidLoginPhone || !loginPassword) ? 'disabledField': '')+" book_button"}
                                            disabled={!isValidLoginPhone || !loginPassword}
                                            type="submit" value="Войти" onClick={this.handleLogin}
                                        />
                                    </React.Fragment>
                                )}
                                {tab === 'sms_tab' && (
                                    <React.Fragment>
                                        <p>Телефон</p>
                                        <p style={{ display: 'flex' }}>
                                            <img style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                            /> <span>
                                    Введите номер телефона, на него мы отправим SMS с персональным паролем для входа.
                                </span>
                                        </p>
                                        <div className="phones_country">
                                            <PhoneInput
                                                value={sendPasswordPhone}
                                                onChange={sendPasswordPhone => this.setState({ sendPasswordPhone })}
                                                getIsValidPhone={isValidSendPasswordPhone => this.setState({ isValidSendPasswordPhone })}
                                            />
                                        </div>

                                        {commentPassword && (
                                            <p style={{ display: 'flex', marginTop: '10px' }}>
                                                <img style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                                /> <span style={{ color: 'red' }}>{commentPassword}</span>
                                            </p>
                                        )}

                                        {timeExpires && (
                                            <p style={{ display: 'flex', marginTop: '10px' }}>
                                                <span>Осталось времени: {timeExpires}</span>
                                            </p>
                                        )}

                                        <input
                                            style={{ margin: '20px auto' }}
                                            className={((!isValidSendPasswordPhone || sendSmsTimer) ? 'disabledField': '')+" book_button"}
                                            disabled={!isValidSendPasswordPhone || sendSmsTimer}
                                            type="submit" value="Отправить" onClick={this.handleSendPassword}
                                        />
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )
                }
            </div>
        );
    }
}

function mapStateToProps(store) {
    const { staff: { staffComments, sendSmsTimer, staffCommentsTotalPages, staffCommentsStaff, commentCreated, commentPassword, clientCookie, clientLoginMessage } }=store;

    return {
        staffComments, sendSmsTimer, staffCommentsTotalPages, staffCommentsStaff, commentCreated, commentPassword, clientCookie, clientLoginMessage
    };
}

export default connect(mapStateToProps)(TabCreateComment);
