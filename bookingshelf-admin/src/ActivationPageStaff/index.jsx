import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions/user.actions';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.queryInitData = this.queryInitData.bind(this);
  }

  componentDidMount() {
    if (this.props.authentication.loginChecked) {
      this.queryInitData();
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.authentication.loginChecked !== newProps.authentication.loginChecked) {
      this.queryInitData();
    }
  }

  queryInitData() {
    const { staff } = this.props.match.params;
    this.props.dispatch(userActions.logout());
    this.props.dispatch(userActions.activateStaff(staff));
  }

  render() {
    return <div id="outer">
      <div id="table-container">
        <div id="table-cell" className="loader">
          <img src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
        </div>
      </div>
    </div>;

    {/* <div>*/}

    {/* </div>*/}
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  return {
    authentication,
  };
}

export default connect(mapStateToProps)(Index);
