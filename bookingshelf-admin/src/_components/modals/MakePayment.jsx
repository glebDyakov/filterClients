import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { calendarActions, paymentsActions } from '../../_actions';

class MakePayment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
    };

    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if ( JSON.stringify(this.props) !== JSON.stringify(newProps)) {
      this.setState({ ...this.state, id: newProps.id });
    }
  }

  render() {
    const { confirmationUrl, exceptionMessage } = this.props.payments;

    return (
      <div className="modal fade make-payment-modal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Вы будете перенаправлены на окно оплаты</h4>
              <button type="button" className="close" onClick={this.handleNo} data-dismiss="modal" />
            </div>
            <div className="modal-body">
              {!exceptionMessage && (confirmationUrl
                ? <React.Fragment>
                  <button type="button" className="button" onClick={this.handleYes} data-dismiss="modal">Перейти к оплате</button>
                  <button type="button" className="gray-button" onClick={this.handleNo} data-dismiss="modal">Отмена</button>
                </React.Fragment>
                : <img className="payment-loader" src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
              )}
              {exceptionMessage && <p style={{ textAlign: 'center' }}>{exceptionMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleYes() {
    window.open(this.props.payments.confirmationUrl);
  }

  handleNo() {
    this.props.dispatch(paymentsActions.cancelPayment());
  }
}

function mapStateToProps(state) {
  const { payments } = state;
  return {
    payments,
  };
}
const connectedApp = connect(mapStateToProps)(MakePayment);
export { connectedApp as MakePayment };
