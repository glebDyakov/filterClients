import React from 'react';
import { connect } from 'react-redux';
import {withTranslation} from "react-i18next";

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="page404">
        <div className="container">
          <span className="error_code">404</span>
          <p className="error_text">{t("Страница не найдена")}</p>
          <a className="button" href="/calendar">{t("Перейти к журналу")}</a>
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

export default connect(mapStateToProps)(withTranslation("common")(Index));
