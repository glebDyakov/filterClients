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
        <div className="container" style={{ marginRight: '5%' }}>
          <span className="red_center_text" style={{ paddingTop: '15%' }}>403</span>
          <p className="title">{t("У вас нет доступа к этой странице")}</p>
          <div className="clear" />
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
