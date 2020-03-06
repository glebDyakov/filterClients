import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import ReactPhoneInput from 'react-phone-input-2';
import { isValidNumber } from "libphonenumber-js";
import {staffActions} from "../../_actions";
import {isValidEmailAddress} from "../../_helpers/validators";
import moment from "moment";
import Paginator from "./Paginator";

class TabStaffComments extends  PureComponent{
    constructor(props) {
        super(props);
        const group = {
            clientPassword: null,
            clientPhone: '',
            rating: 0,
            comment: ''
        }
        this.state = {
            group,
            enteredCode: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.setterPhone = this.setterPhone.bind(this);
        this.changeRating = this.changeRating.bind(this);
    }
    componentWillReceiveProps(newProps) {
        const { movingVisit } = newProps
        if (newProps.services && newProps.isStartMovingVisit && movingVisit && (JSON.stringify(this.props.services) !== JSON.stringify(newProps.services))) {
            movingVisit && movingVisit.forEach(visit => {
                this.props.selectService({target: { checked: true} }, newProps.services.find(service => service.serviceId === visit.serviceId))

            })
            //this.props.refreshTimetable()
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

    handleSave(codeInfo) {
        const { dispatch, staffCommentsStaffId } = this.props;
        const { group } = this.state;

        const {company} = this.props.match.params

        // localStorage.setItem('userInfoOnlineZapis', JSON.stringify(group))

        const data = group;

        if (codeInfo) {
            data[0].clientActivationId = codeInfo.clientActivationId
            data[0].clientVerificationCode = codeInfo.clientVerificationCode
        }
        dispatch(staffActions.createComment(company, staffCommentsStaffId, data))
    }

    changeRating(newRating) {
        this.setState({
            group: {
                ...this.state.group,
                rating: newRating
            }
        });
    }

    handlePageChange(data) {
        const { company } = this.props.match.params;
        const { staffCommentsStaffId } = this.props;
        const { selected } = data;
        const currentPage = selected + 1;
        this.props.dispatch(staffActions.getStaffComments(company, staffCommentsStaffId, currentPage));
    }

    render() {
        const { staffComments, staffCommentsTotalPages, clientActivationId, staffId, staffs, isStartMovingVisit, setDefaultFlag, selectedServices, flagAllStaffs, movingVisit, services, subcompanies, history, match, clearStaff, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown} = this.props;
        const { group, enteredCode, addingCommentOpened } = this.state;

        return(
            <div className="service_selection screen1 screen5">
                <div className="title_block n">
                    {!isStartMovingVisit && subcompanies.length > 1 && (
                        <span className="prev_block" onClick={() => {
                            if (flagAllStaffs) {
                                setScreen(2);
                            } else {
                                clearStaff();
                                setDefaultFlag();
                                setScreen(0);
                                let {company} = match.params;
                                let url = company.includes('_') ? company.split('_')[0] : company
                                history.push(`/${url}`)
                            }
                        }}><span className="title_block_text">Назад</span></span>
                    )}
                    <p className="modal_title">Отзывы</p>
                    {staffId &&
                    <span className="next_block" onClick={() => {
                        setScreen(isStartMovingVisit ? 3 : 2);
                        refreshTimetable();
                    }}><span className="title_block_text">Далее</span></span>}
                </div>
                <ul className={`staff_popup ${staffs && staffs.length <= 3 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                    {staffComments && staffComments.length > 0 ? staffComments
                        .map((staff) =>
                            <li className={('staff_comment selected')}
                            >
                                <span className="staff_popup_item">
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{staff.clientName}</p>
                                        </div>

                                        <div style={{ display: 'flex' }}>
                                            <StarRatings
                                                rating={staff.rating}
                                                starHoverColor={'#ff9500'}
                                                starRatedColor={'#ff9500'}
                                                starDimension="18px"
                                                starSpacing="0"
                                            />
                                            <p style={{ marginLeft: '6px' }}>{moment(staff.feedbackDate).format('DD MMMM YYYY, HH:mm')}</p>

                                        </div>
                                        <div style={{ marginTop: '6px' }}>
                                            <p>{staff.comment}</p>
                                        </div>

                                    </div>


                                    {nearestTime && nearestTime.map((time, id)=>
                                        time.staffId===staff.staffId && time.availableDays.length!==0 &&
                                        <React.Fragment>
                                            <div className="mobile_block mobile-visible" key={'time'+id}>
                                                <span>Ближ. запись</span>
                                                <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                            </div>
                                            <div className="mobile_block desktop-visible" key={'time'+id}>
                                                <span className="staff-comments" onClick={(e) => {
                                                    e.preventDefault()
                                                    setScreen('staff-comments')
                                                    console.log(123)
                                                }}>Информация</span>
                                                <br />
                                                <span className="nearest_appointment">Ближайшая запись</span>
                                                <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                            </div>
                                        </React.Fragment>

                                    )}

                                </span>
                            </li>
                        )

                    : (
                            <div className="final-book">
                                <p style={{ fontSize: '18px' }}>
                                    Пока нет ни одного отзыва. <span
                                        style={{ textDecoration: 'underlined', fontSize: '18px'}}
                                        onClick={() => this.setState({ addingCommentOpened: !addingCommentOpened})}>Станьте первым!
                                    </span>
                                </p>
                            </div>
                        )}
                </ul>

                <Paginator
                    finalTotalPages={staffCommentsTotalPages}
                    onPageChange={this.handlePageChange}
                />



                <div className="">
                    <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '16px' }}>Добавить отзыв</p>

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

                    <p>Телефон</p>
                    <p style={{ display: 'flex' }}>
                        <img style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.png`}
                        /> <span>На этот номер вы получите SMS с персональным паролем</span>
                    </p>
                    <div className="phones_country">
                        <ReactPhoneInput
                            regions={['america', 'europe']}
                            disableAreaCodes={true}

                            inputClass={((!group.clientPhone && group.email && group.email!=='' && !isValidNumber(group.clientPhone)) ? ' redBorder' : '')} value={ group.clientPhone }  defaultCountry={'by'} onChange={clientPhone => this.setterPhone(clientPhone)}
                        />

                    </div>
                    <br/>

                    <p>Персональный пароль</p>
                    <p style={{ display: 'flex' }}>
                        <img style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.png`}
                        /> <span>Введите ваш персональный пароль. Если у вас нет пароля или вы забыли пароль, оставьте поле пустым для получения нового пароля в SMS сообщение</span>
                    </p>
                    <input type="text" placeholder="" name="clientPassword" onChange={this.handleCommentChange}
                           value={group.clientPassword}
                    />

                    <input
                        style={{ marginBottom: '20px' }}
                        className={((!group.clientPhone || !isValidNumber(group.clientPhone) || !group.comment || !group.rating || (group.email ? !isValidEmailAddress(group.email) : false)) ? 'disabledField': '')+" book_button"}
                        disabled={!group.clientPhone || !isValidNumber(group.clientPhone) || !group.comment || !group.rating || (group.email ? !isValidEmailAddress(group.email) : false)}
                        type="submit" value={group.clientPassword ? 'Оставить отзыв' : 'Оставить отзыв'} onClick={
                        ()=> {
                            if (clientActivationId) {
                                this.handleSave({
                                    clientActivationId,
                                    clientVerificationCode: enteredCode
                                })
                            } else {
                                this.handleSave()
                            }
                        }}/>


                </div>
            </div>
        );
    }
}

function mapStateToProps(store) {
    const { staff: { staffComments, staffCommentsTotalPages, staffCommentsStaffId } }=store;

    return {
        staffComments, staffCommentsTotalPages, staffCommentsStaffId
    };
}

export default connect(mapStateToProps)(TabStaffComments);
