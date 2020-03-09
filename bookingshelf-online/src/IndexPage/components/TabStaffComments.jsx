import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import {staffActions} from "../../_actions";
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
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(data) {
        const { company } = this.props.match.params;
        const { staffCommentsStaff } = this.props;
        const { selected } = data;
        const currentPage = selected + 1;
        this.props.dispatch(staffActions.getStaffComments(company, staffCommentsStaff, currentPage));
    }

    render() {
        const { staffComments, staffCommentsStaff, staffCommentsTotalPages, setScreen, isLoading } = this.props;

        return(
            <div className="service_selection screen1 screen5">
                <div className="title_block n">
                    <span className="prev_block" onClick={() => {
                        setScreen(1);

                    }}><span className="title_block_text">Назад</span></span>
                    <p className="modal_title">Отзывы</p>
                </div>
                {!isLoading && (
                    <React.Fragment>
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
                        <ul style={{ marginTop: '20px' }} className={`staff_popup`}>
                            {staffComments && staffComments.length > 0
                                ? staffComments.map((staff) =>
                                    <li className={('staff_comment selected')}>
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
                                </span>
                                    </li>)
                                : (
                                    <div className="final-book">
                                        <p style={{ fontSize: '18px' }}>
                                            Пока нет ни одного отзыва. <span
                                            style={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '18px'}}
                                            onClick={() => setScreen('staff-create-comment')}>Станьте первым!
                                    </span>
                                        </p>
                                    </div>
                                )}
                        </ul>

                    </React.Fragment>
                )}

                <div style={{ display: isLoading ? 'none' : 'block', marginBottom: '50px' }}>
                    <Paginator
                        finalTotalPages={staffCommentsTotalPages}
                        onPageChange={this.handlePageChange}
                    />
                </div>

                <p className="skip_employee" onClick={() =>  setScreen('staff-create-comment')}>Оставить отзыв</p>
            </div>
        );
    }
}

function mapStateToProps(store) {
    const { staff: { staffComments, staffCommentsTotalPages, staffCommentsStaff } }=store;

    return {
        staffComments, staffCommentsTotalPages, staffCommentsStaff
    };
}

export default connect(mapStateToProps)(TabStaffComments);
