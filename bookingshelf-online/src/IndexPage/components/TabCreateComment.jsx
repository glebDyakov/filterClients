import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import ReactPhoneInput from 'react-phone-input-2';
import { isValidNumber } from "libphonenumber-js";
import {staffActions} from "../../_actions";
import {isValidEmailAddress} from "../../_helpers/validators";
import PhoneInput from "../../_components/PhoneInput";

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
        this.handleSendPassword = this.handleSendPassword.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.commentCreated && (newProps.commentCreated !== this.props.commentCreated)) {
            this.props.setScreen('staff-comments')
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

        dispatch(staffActions.createComment(company, staffCommentsStaff.staffId,  { clientPhone: sendPasswordPhone }))
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
    }

    render() {
        const { setScreen, staffCommentsStaff, isLoading, commentPassword, clientCookie } = this.props;
        const { group, tab, isValidSendPasswordPhone, sendPasswordPhone, loginPhone, loginPassword, isValidLoginPhone } = this.state;

        return(
            <div className="service_selection screen1 screen5">
                <div className="title_block n">
                    <span className="prev_block" onClick={() => {
                        setScreen('staff-comments');

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
                                className="book_button"
                                type="button" value="Вход" onClick={() => this.updateTab('login_tab')}
                            />
                            <input
                                style={{ backgroundColor: tab === 'sms_tab' ? '#39434f' : 'grey'}}
                                className="book_button"
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
                                        <input type="text" placeholder="" name="loginPassword" onChange={this.handleChange} value={loginPassword} />

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
                                                /> <span>Персональный пароль отправлен на номер {sendPasswordPhone}</span>
                                            </p>
                                        )}

                                        <input
                                            style={{ margin: '20px auto' }}
                                            className={(!isValidSendPasswordPhone ? 'disabledField': '')+" book_button"}
                                            disabled={!isValidSendPasswordPhone}
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
    const { staff: { staffComments, staffCommentsTotalPages, staffCommentsStaff, commentCreated, commentPassword, clientCookie } }=store;

    return {
        staffComments, staffCommentsTotalPages, staffCommentsStaff, commentCreated, commentPassword, clientCookie
    };
}

export default connect(mapStateToProps)(TabCreateComment);
