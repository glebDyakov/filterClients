import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router';

import { userActions } from '../_actions';
import {withTranslation} from "react-i18next";

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.logout=this.logout.bind(this);
  }

  logout() {
    const { dispatch } = this.props;
    dispatch(userActions.logout());
    // this.props.history.push('/login');
  }

  render() {
    return (
      <a onClick={()=>this.logout()}>{this.props.t("Выход")}</a>
    );
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert,
  };
}

Index.proptypes = {
  location: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(withTranslation("common")(Index)));
