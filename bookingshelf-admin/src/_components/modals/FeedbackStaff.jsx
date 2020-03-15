import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';
import moment from "moment";
import {access} from "../../_helpers/access";
import {calendarActions, clientActions} from "../../_actions";
import {staffActions} from "../../_actions/staff.actions";
import StarRatings from "react-star-ratings";
import Paginator from "../Paginator";

class FeedbackStaff extends React.Component {
    constructor(props) {
        super(props);

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    handlePageClick(data) {
        const { selected } = data;
        const currentPage = selected + 1;
        this.props.dispatch(staffActions.getFeedback(currentPage));
    };

    render() {
        const {editClient, services, staff, feedbackStaff, feedback}=this.props;
        const activeFeedbackStaff = feedback && feedback.find(item => item.staffId === feedbackStaff.staffId)

        return (

            <div className="modal fade feedback-staff">

                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content client-detail">
                        <div className="modal-header">
                            <h4 className="modal-title">Отзывы</h4>
                            <button type="button" className="close" data-dismiss="modal" />
                        </div>
                        <div className="client-info content-pages-bg">
                            {feedbackStaff &&
                            <div className="clients-list pt-4 pl-4 pr-4">
                                <div className="client">
                                    <img style={{ height: '40px' }} className="rounded-circle"
                                         src={(feedbackStaff && feedbackStaff.imageBase64) ? "data:image/png;base64," + feedbackStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                         alt=""
                                    />
                                    <span className="name_container">{feedbackStaff.firstName} {feedbackStaff.lastName}
                                        {access(12) && (
                                            <React.Fragment>
                                                <span className="email-user">{feedbackStaff.email}</span>
                                                <span>{feedbackStaff.phone}</span>
                                            </React.Fragment>
                                        )}
                                    </span>

                                </div>
                                <div className="row">
                                    <div className="col-6" style={{textAlign:'center'}}>
                                        <strong>{activeFeedbackStaff && activeFeedbackStaff.totalNumber} </strong><br/>
                                        <span className="gray-text">Всего отзывов</span>
                                    </div>

                                    <div className="col-6" style={{textAlign:'center'}}>
                                        <strong>{(activeFeedbackStaff && activeFeedbackStaff.averageStaffRating && activeFeedbackStaff.averageStaffRating.toFixed(2)) || 'Нет оценок'} </strong><br/>
                                        <span className="gray-text">Средняя оценка</span>
                                    </div>
                                </div>
                            </div>
                            }
                            <hr className="gray"/>
                            {activeFeedbackStaff && activeFeedbackStaff.content.length!==0 ?
                                <p className="pl-4 pr-4">Список отзывов</p> : <p className="pl-4 pr-4">Нет отзывов</p>
                            }

                            <div className="visit-info-wrapper">
                                {activeFeedbackStaff && activeFeedbackStaff.content
                                    .map((item)=>{
                                        return(
                                            <div style={{
                                                paddingTop: '4px',
                                                cursor: 'pointer',
                                                borderTop: '2px solid rgb(245, 245, 246)'
                                            }} className="visit-info row pl-4 pr-4 mb-2"
                                            >
                                                <div className="col">
                                                    <p>
                                                        <strong>{item.clientName}</strong>
                                                        <p>
                                                            <StarRatings
                                                                rating={item.rating}
                                                                starHoverColor={'#ff9500'}
                                                                starRatedColor={'#ff9500'}
                                                                starDimension="14px"
                                                                starSpacing="0"
                                                            />
                                                            <span style={{ marginLeft: '4px'}}>{moment(item.feedbackDate).format('DD MMMM YYYY, HH:mm')}</span>
                                                        </p>
                                                        <p>
                                                            {item.comment}
                                                        </p>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                )}
                            </div>

                            <Paginator
                                finalTotalPages={activeFeedbackStaff ? activeFeedbackStaff.totalPages : 0}
                                onPageChange={this.handlePageClick}
                            />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    const { staff: { feedbackStaff, feedback } } = state;
    return {
        feedbackStaff, feedback
    };
}

export default connect(mapStateToProps)(FeedbackStaff);;
