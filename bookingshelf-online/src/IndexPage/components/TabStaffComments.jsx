import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import { staffActions } from "../../_actions";
import moment from "moment";
import Paginator from "./Paginator";
import { withTranslation } from "react-i18next";
import skip_arrow from "../../../public/img/icons/skip-arrow-white.svg"
import MediaQuery from 'react-responsive'
import {TABLET_WIDTH} from '../../_constants/global.constants'

class TabStaffComments extends PureComponent {
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
        const { staffComments, staffCommentsStaff, staffCommentsTotalPages, setScreen, isLoading, t } = this.props;
        return (
            <div className="service_selection screen1">
                <div className="title_block n data_title">
                    <span className="prev_block" onClick={() => {
                        setScreen(1);

                    }}><span className="title_block_text">{t("Назад")}</span></span>
                    <p className="modal_title">{t("Отзывы клиентов")}</p>
                </div>
                <div className="comments">
                    {!isLoading && (
                        <React.Fragment>
                            <div className="staff_popup staff_popup_large">
                                <div className="staff_popup_item">
                                    <MediaQuery maxWidth={TABLET_WIDTH-1}>
                                        <div className="img_container">

                                            <span className="staff_popup_name">
                                                <img
                                                    src={staffCommentsStaff.imageBase64 ? "data:image/png;base64," + staffCommentsStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                    alt="" />


                                            </span>
                                            {staffCommentsStaff.rating !== 0 ? (
                                                <div className="comments_rating">
                                                    <p>
                                                        {staffCommentsStaff.firstName} {staffCommentsStaff.lastName ? ` ${staffCommentsStaff.lastName}` : ''}
                                                    </p>
                                                    <div className="display_flex">
                                                        <StarRatings
                                                            rating={staffCommentsStaff.rating}
                                                            starHoverColor={'#ff9500'}
                                                            starRatedColor={'#ff9500'}
                                                            starDimension="20px"
                                                            starSpacing="3px"
                                                        />
                                                        <p className="rating_text">
                                                            &nbsp;{staffCommentsStaff.rating.toFixed(1)}
                                                        </p>
                                                    </div>

                                                </div>
                                            ) : (
                                                    <div className="comments_rating">
                                                        <p>
                                                            {staffCommentsStaff.firstName} {staffCommentsStaff.lastName ? ` ${staffCommentsStaff.lastName}` : ''}
                                                        </p>
                                                        <p>{t("Рейтинг отсутствует")}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </MediaQuery>
                                    <MediaQuery minWidth={TABLET_WIDTH}>
                                        <div className="img_container">

                                            <span className="staff_popup_name">
                                                <img
                                                    src={staffCommentsStaff.imageBase64 ? "data:image/png;base64," + staffCommentsStaff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                    alt="" />
                                                <p>
                                                    {staffCommentsStaff.firstName} {staffCommentsStaff.lastName ? ` ${staffCommentsStaff.lastName}` : ''}
                                                </p>

                                            </span>
                                            {staffCommentsStaff.rating !== 0 ? (
                                                <div className="comments_rating">
                                                    <p>{t("Усредненный рейтинг")}:</p>
                                                    <div className="display_flex">
                                                        <StarRatings
                                                            rating={staffCommentsStaff.rating}
                                                            starHoverColor={'#ff9500'}
                                                            starRatedColor={'#ff9500'}
                                                            starDimension="20px"
                                                            starSpacing="3px"
                                                        />
                                                        <p className="rating_text">
                                                            &nbsp;{staffCommentsStaff.rating.toFixed(1)}
                                                        </p>
                                                    </div>

                                                </div>
                                            ) : (
                                                    <div className="comments_rating">
                                                        <p>{t("Рейтинг отсутствует")}</p>
                                                    </div>
                                                )
                                            }


                                        </div>
                                    </MediaQuery>


                                </div>
                            </div>
                            <ul >
                                {staffComments && staffComments.length > 0
                                    ? staffComments.map((staff, index) =>
                                        <li key={index} className="staff_popup_comment">
                                            <p >{staff.clientName}</p>
                                            <div className="display_flex">
                                                <StarRatings
                                                    rating={staff.rating}
                                                    starHoverColor={'#ff9500'}
                                                    starRatedColor={'#ff9500'}
                                                    starDimension="17px"
                                                    starSpacing="0px"
                                                />
                                                <p className="rating_text">&nbsp;{staff.rating.toFixed(1)}</p>
                                            </div>
                                            <span >
                                                <p style={{ wordBreak: 'break-word' }}>{staff.comment}</p>
                                            </span>
                                        </li>)
                                    : (
                                        <div className="final-book">
                                            <p >
                                                {t('Нет ни одного отзыва')}
                                            </p>
                                            <span
                                                onClick={() => setScreen('staff-create-comment')}>{t("Станьте первым!")}
                                            </span>
                                        </div>
                                    )}
                            </ul>
                        </React.Fragment>
                    )}
                    <div className="comments_btn_footer" onClick={() => setScreen('staff-create-comment')}>{t("Оставить отзыв")}<img src={skip_arrow} alt="skip_arrow" /></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(store) {
    const { staff: { staffComments, staffCommentsTotalPages, staffCommentsStaff } } = store;

    return {
        staffComments, staffCommentsTotalPages, staffCommentsStaff
    };
}

export default connect(mapStateToProps)(withTranslation("common")(TabStaffComments));
