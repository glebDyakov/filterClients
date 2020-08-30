import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

class ForgotPass extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      email: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { email, submitted } = this.state;

    return (
      <div className="modal2 forgot_password">
        <div className="sign_in">
          <form name="form" onSubmit={this.handleSubmit}>
            <p className="modal_title">Забыли пароль?</p>
            <p>Введите Ваш E-mail и мы отправим письмо с инструкцией по изменению пароля</p>
            <span>E-mail</span>
            <input type="text"
              className={'form-group' + (submitted && !email ? ' redBorder' : '')}
              name="email"
              value={email}
              onChange={this.handleChange} />
            <input type="submit" defaultValue="ОТПРАВИТЬ" />
            <span className="closer" />
          </form>
        </div>
        <span className="bg-modal" />
      </div>
    );
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });

    const { email } = this.state;
    const { dispatch } = this.props;
    if (email) {
      dispatch(userActions.forgotPass(email));
    }
  }
}

function mapStateToProps(state) {
  const { alert } = state;
  const { status } = state.authentication;

  return {
    alert,
    status,
  };
}

const connectedApp = connect(mapStateToProps)(ForgotPass);
export { connectedApp as ForgotPass };
