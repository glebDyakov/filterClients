import {clientConstants, notificationConstants} from '../_constants';

export function notification(state= {}, action) {
  switch (action.type) {
    case notificationConstants.GET_SMS_RECORD_SUCCESS:
        return {
            ...state,
            notification: action.notification,
            sr: Math.random()
    };
      case notificationConstants.GET_CLIENT_AMOUNT_SUCCESS:
        return {
            ...state,
            clientAmount: action.info.clientAmount
        }
    case notificationConstants.GET_SMS_EMAIL_BALANCE:
        return {
            ...state,
            balance: action.balance,
            sr: Math.random()
    };
      case notificationConstants.SMS_LETTER_SUCCESS_TIME:
          return {
              ...state,
              status: 209
          };
      case notificationConstants.SMS_LETTER_REQUEST:
          return {
              ...state,
              status: 208,
              adding: true
          };
      case notificationConstants.SMS_LETTER_SUCCESS:

          return {
              ...state,
              status: 200,
              error: null,
              adding: false
          };
    default:
      return state
  }
}