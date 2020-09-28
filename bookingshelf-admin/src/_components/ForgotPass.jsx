import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import {withTranslation} from "react-i18next";

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
    const {t} = this.props;
    return (
      <div className="modal2 forgot_password">
        <div className="sign_in">
          <form name="form" onSubmit={this.handleSubmit}>
            <p className="modal_title">{t("Забыли пароль?")}</p>
            <p>{t("Введите Ваш E-mail и мы отправим письмо с инструкцией по изменению пароля")}</p>
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

const connectedApp = connect(mapStateToProps)(withTranslation("common")(ForgotPass));
export { connectedApp as ForgotPass };
