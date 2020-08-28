import React, {Component} from 'react';
import {isMobile} from "react-device-detect";
import StarRatings from "react-star-ratings";
import AllReviews from "./AllReviews";
import {staffActions} from "../_actions";

class FeedStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenReview: false,
            rating: 'Отсутствует',
            feeds: [],
        }

        this.handleOpenReview = this.handleOpenReview.bind(this);
        this.handleAllFeedbackClick = this.handleAllFeedbackClick.bind(this);

    }

    handleAllFeedbackClick(activeStaff) {
        const staffFeeds = this.props.staff.feedback.find(item => item.staffId === activeStaff.staffId);
        const staffRating = staffFeeds.averageStaffRating || "Отсутствует";
        this.setState({rating: staffRating});
        this.setState({feeds: staffFeeds.content});
        this.handleOpenReview();
    }

    handleOpenReview() {
        this.setState({isOpenReview: !this.state.isOpenReview});
    }

    render() {
        const {activeStaff, feedbackStaff} = this.props;
        return (
            <React.Fragment>
                <div className={"holiday-list rating-list" + (this.state.isOpenReview ? " active" : '')}>
                    {activeStaff && (
                        <React.Fragment>
                            <div style={{
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }} className="row holiday-row-container flex-md-row flex-md-nowrap">
                                <div className="justify-content-start flex-column flex-md-row" style={{
                                    display: 'flex',
                                    width: isMobile ? '100%' : 'calc(100% - 200px)'
                                }}>
                                    <div className="d-flex align-items-center">
                                        <img style={{
                                            display: 'block',
                                            height: '24px',
                                            margin: '0 15px 0 0'
                                        }} className="rounded-circle user-star-image"
                                             src={(activeStaff && activeStaff.imageBase64) ? "data:image/png;base64," + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                                             alt=""
                                        />
                                        <div className="star-ratings-container" style={{width: '130px'}}>
                                            <StarRatings
                                                rating={feedbackStaff.averageStaffRating || 0}
                                                starHoverColor={'#50A5F1'}
                                                starRatedColor={'#50A5F1'}
                                                starDimension="18px"
                                                starSpacing="5px"
                                            />
                                        </div>

                                        <div className="container-user-name-mob">
                                            <div className="user-name-container flex-column flex-md-row">
                                                <strong
                                                    className="user-name">{activeStaff.firstName} {activeStaff.lastName ? activeStaff.lastName : ''}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container-user-name" style={{
                                        width: isMobile ? '100%' : '60%',
                                        marginLeft: '24px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <div className="user-name-container flex-column flex-md-row">
                                            <strong
                                                className="user-name">{activeStaff.firstName} {activeStaff.lastName ? activeStaff.lastName : ''}</strong>
                                            <p className="user-description">{activeStaff.description}</p>
                                        </div>
                                    </div>

                                    <div className="star-ratings-container-mob" style={{width: '130px'}}>
                                        <StarRatings
                                            rating={feedbackStaff.averageStaffRating || 0}
                                            starHoverColor={'#50A5F1'}
                                            starRatedColor={'#50A5F1'}
                                            starDimension="12px"
                                            starSpacing="3px"
                                        />
                                    </div>

                                    <div className="container-user-name-mob">
                                        <div className="user-name-container flex-column flex-md-row">
                                            <p className="user-description">{activeStaff.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={() => {
                                    this.handleAllFeedbackClick(activeStaff)
                                }} className={"button desktop-visible" + (this.state.isOpenReview? " red-text" : '')}>{this.state.isOpenReview ? "Скрыть" : "Все отзывы"}
                                </button>

                                <button type="button" onClick={() => {
                                    this.handleAllFeedbackClick(activeStaff)
                                }} className={"button mobile-visible desktop-visible" + (this.state.isOpenReview? " red-text" : '')}>{this.state.isOpenReview ? "Скрыть" : "Все отзывы"}
                                </button>
                            </div>


                        </React.Fragment>
                    )}

                </div>
                {this.state.isOpenReview &&
                <AllReviews
                    rating={this.state.rating}
                    feeds={this.state.feeds}
                />}
            </React.Fragment>

        );
    }
}

export default FeedStaff;