import React, { Component } from 'react';
import moment from 'moment';
import StarRatings from 'react-star-ratings';

class AllReviews extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { feeds, rating } = this.props;
    return (
      <div className="user-feeds">
        <hr className="m-0"/>
        <div className="feeds-header">
          <h2 className="title">Всего отзывов: {feeds.length}</h2>
          <h2 className="title">Средняя оценка: {rating}</h2>
        </div>
        <hr className="m-0"/>

        <div className="feeds-container">
          {feeds && feeds.map((item, i) =>
            <React.Fragment key={`user-feeds-${i}`}>
              {i > 0 && <hr className="m-0"/>}
              <div className="review-container">
                <h2 className="review-user-name">{item.clientName}</h2>
                <span className="review-date">{moment(item.feedbackDate).format('DD MMMM YYYY, HH:ss')}</span>
                <StarRatings
                  rating={item.rating || 0}
                  starHoverColor={'#50A5F1'}
                  starRatedColor={'#50A5F1'}
                  starDimension="18px"
                  starSpacing="5px"
                />
                <p className="review-comment">{item.comment}</p>
              </div>
            </React.Fragment>,
          )}
        </div>
      </div>
    );
  }
}

export default AllReviews;
