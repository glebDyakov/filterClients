import React from 'react';
import { connect } from 'react-redux';

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page404">
        <div className="container">
          <span className="error_code">404</span>
          <p className="error_text">Страница не найдена</p>
          <a className="button" href="/calendar">Перейти к журналу</a>
          <img className="error_image" src={`${process.env.CONTEXT}public/img/error_image.png`} alt="404 error image"/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  return {
    authentication,
  };
}

export default connect(mapStateToProps)(Index);
