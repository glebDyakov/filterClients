import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions/user.actions';

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { company } = this.props.match.params;
    this.props.dispatch(userActions.activate(company));
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
  const { registering, loginChecked } = state.authentication;
  return {
    registering, loginChecked,
  };
}

export default connect(mapStateToProps)(Index);
