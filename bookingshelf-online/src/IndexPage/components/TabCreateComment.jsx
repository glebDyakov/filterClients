import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import { staffActions } from "../../_actions";
import PhoneInput from "../../_components/PhoneInput";
import { getCookie } from "../../_helpers/cookie";
import moment from "moment";
import { withTranslation } from "react-i18next";
import skip_arrow from "../../../public/img/icons/skip-arrow.svg"

class TabCreateComment extends PureComponent {
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
            this.setState({ timeExpires: moment(expires - now).format('mm:ss') })
        }
        if (!sendSmsTimer) {
            this.props.dispatch(staffActions.clearSendSmsTimer())
            this.clearInterval()
        }
    }

    setterPhone(clientPhone) {
        const { group } = this.state
        this.setState({ group: { ...group, clientPhone: clientPhone.replace(/[()\- ]/g, '') } })
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

        dispatch(staffActions.sendPassword(company, staffCommentsStaff.staffId, { clientPhone: sendPasswordPhone }))
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
        const { setScreen, sendSmsTimer, staffCommentsStaff, isLoading, commentPassword, clientCookie, clientLoginMessage, t } = this.props;
        const { group, timeExpires, tab, isValidSendPasswordPhone, sendPasswordPhone, loginPhone, loginPassword, isValidLoginPhone } = this.state;

        return (
            <div className="service_selection">
                <div className="title_block n data_title">
                    <span className="prev_block" onClick={() => {
                        setScreen('staff-comments');
                        this.props.dispatch(staffActions.clearMessages())

                    }}><span className="title_block_text">{t("Назад")}</span></span>
                    <p className="modal_title">{t("Отзывы")}</p>
                </div>
                <div className="create_comments">
                    <div className="staff_popup staff_popup_large">
                        <div className="staff_popup_item">
                            <div className="img_container">
                                <img
                                    src={staffCommentsStaff.imageBase64 ? "data:image/png;base64," + staffCommentsStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                    alt="" />
                                <div className="staff_popup_name">{staffCommentsStaff.firstName} {staffCommentsStaff.lastName ? ` ${staffCommentsStaff.lastName}` : ''}
                                    <span >{staffCommentsStaff.description}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {clientCookie ? (
                        <div>
                            <div style={{ textAlign: 'right' }}>
                                <p>{t("Вы вошли как")} {`${clientCookie.firstName}${clientCookie.lastName ? ` ${clientCookie.lastName}` : ''}`}, {clientCookie.phone}</p>
                                <p style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.props.dispatch(staffActions.clearClientLogin())}>{t("Сменить аккаунт")}</p>
                            </div>
                            <br />
                            <p>{t("Рейтинг")}</p>
                            <StarRatings
                                rating={group.rating}
                                changeRating={this.changeRating}
                                starHoverColor={'#ff9500'}
                                starRatedColor={'#ff9500'}
                                name='rating'
                                starDimension="20px"
                                starSpacing="5px"
                            />

                            <p style={{ marginTop: '15px' }}>{t("Комментарии")}</p>
                            <textarea placeholder="" name="comment" onChange={this.handleCommentChange} value={group.comment} />

                            <input
                                style={{ marginBottom: '20px' }}
                                className={((!group.comment || !group.rating) ? 'disabledField' : '') + " book_button"}
                                disabled={!group.comment || !group.rating}
                                type="submit" value={group.clientPassword ? t('Добавить отзыв') : t('Добавить отзыв')} onClick={this.handleSave}
                            />
                        </div>
                    ) : (
                            <React.Fragment>
                                {tab === 'login_tab' ? (
                                    <div className="comment_sms_btn_block">
                                        <button
                                            className=" comment_sms_btn_active" onClick={() => this.updateTab('login_tab')}>{t("Вход")}</button>
                                        <button
                                            className="comment_sms_btn" onClick={() => this.updateTab('sms_tab')}>{t("Sms авторизация")}</button>
                                        <img onClick={() => this.updateTab('sms_tab')} src={skip_arrow} alt="" />
                                    </div>) : (
                                        <div className="comment_sms_btn_block">
                                            <button className="comment_sms_btn_active" onClick={() => this.updateTab('sms_tab')}
                                            >{t("Sms авторизация")}</button>
                                            <button className="comment_sms_btn" onClick={() => this.updateTab('login_tab')}
                                            >{t("Вход")}</button>
                                            <img onClick={() => this.updateTab('login_tab')} src={skip_arrow} alt="" />
                                        </div>
                                    )}

                                {!isLoading && (
                                    <React.Fragment>
                                        {tab === 'login_tab' && (
                                            <React.Fragment>
                                                <div className="regist_block">
                                                    <p>{t("Телефон")}</p>
                                                    <div className="phones_country">
                                                        <PhoneInput
                                                            value={loginPhone}
                                                            handleChange={clientPhone => this.handleChange({ target: { name: 'loginPhone', value: clientPhone[0] === "+" ? clientPhone : "+" + clientPhone } })}
                                                            getIsValidPhone={isValidLoginPhone => this.setState({ isValidLoginPhone })}
                                                        />
                                                    </div>

                                                    <p>{t("Персональный пароль")}</p>
                                                    <input className="tel" type="text" placeholder={t("Введите пароль")} name="loginPassword" onChange={this.handleChange} value={loginPassword} />
                                                    <span> {t("Введите ваш персональный пароль. Если у вас нет пароля или вы забыли пароль, перейдите во вкладку")} <a onClick={() => this.updateTab('sms_tab')}>{t("SMS авторизации")}</a><img src={skip_arrow} alt="" /> </span>
                                                    {clientLoginMessage && (
                                                        <p className="regist_block_login_p">
                                                            <img src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                                            /> <span >{clientLoginMessage}</span>
                                                        </p>
                                                    )}
                                                    <div >
                                                        <input
                                                            // className={((!isValidLoginPhone || !loginPassword) ? 'disabledField' : '') +" comments_book_button" }
                                                            className={" comments_book_button"}
                                                            disabled={!isValidLoginPhone || !loginPassword}
                                                            type="submit" value={t("Войти")} onClick={this.handleLogin}
                                                        />
                                                    </div>

                                                </div>

                                            </React.Fragment>
                                        )}
                                        {tab === 'sms_tab' && (
                                            <React.Fragment>
                                                <div className="regist_block">
                                                    <p>{t("Телефон")}</p>
                                                    <div className="phones_country">
                                                        <PhoneInput
                                                            value={sendPasswordPhone}
                                                            handleChange={sendPasswordPhone => this.setState({ sendPasswordPhone: sendPasswordPhone === "+" ? sendPasswordPhone : "+" + sendPasswordPhone })}
                                                            getIsValidPhone={isValidSendPasswordPhone => this.setState({ isValidSendPasswordPhone })}
                                                        />
                                                    </div>
                                                    <span className="regist_block_sms_span">
                                                        {t("Введите номер телефона, на него будет отправлено SMS с паролем для входа.")}
                                                    </span>
                                                    {commentPassword && (
                                                        <p className="regist_block_sms_p">
                                                            <img src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                                            /> <span>{commentPassword}</span>
                                                        </p>
                                                    )}
                                                    {timeExpires && (
                                                        <p className="regist_block_sms_p">
                                                            <span>{t("Осталось времени")}: {timeExpires}</span>
                                                        </p>
                                                    )}
                                                    <input
                                                        className={" comments_book_button comments_sub_btn"}
                                                        disabled={!isValidSendPasswordPhone || sendSmsTimer}
                                                        type="submit" value={t("Отправить")} onClick={this.handleSendPassword}
                                                    />
                                                </div>
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(store) {
    const { staff: { staffComments, sendSmsTimer, staffCommentsTotalPages, staffCommentsStaff, commentCreated, commentPassword, clientCookie, clientLoginMessage } } = store;

    return {
        staffComments, sendSmsTimer, staffCommentsTotalPages, staffCommentsStaff, commentCreated, commentPassword, clientCookie, clientLoginMessage
    };
}

export default connect(mapStateToProps)(withTranslation("common")(TabCreateComment));
