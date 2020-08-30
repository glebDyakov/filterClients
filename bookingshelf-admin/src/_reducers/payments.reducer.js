import { paymentsConstants } from '../_constants';

const initialState = {
  list: [],
};

export function payments(state = initialState, action) {
  if (action) {
    switch (action.type) {
      case paymentsConstants.GET_INVOICE_SUCCESS:
      case paymentsConstants.GET_INVOICE_FAILURE:
        return {
          ...state,
          pendingInvoice: action.pendingInvoice,
        };
      case paymentsConstants.GET_INVOICE_LIST_SUCCESS:
        const newState = {};
        if (action.payload.activeInvoice) {
          newState.activeInvoice = action.payload.activeInvoice;
        }
        return {
          ...state,
          list: action.payload.list,
          ...newState,
        };
      case paymentsConstants.GET_PACKETS_SUCCESS:
        return {
          ...state,
          packets: action.packets,
        };
      case paymentsConstants.MAKE_PAYMENT_FAILURE: {
        return {
          ...state,
          exceptionMessage: action.exceptionMessage,
          isLoading: false,
        };
      }
      case paymentsConstants.MAKE_PAYMENT:
        return {
          ...state,
          isLoading: true,
          confirmationUrl: action.confirmationUrl,
          exceptionMessage: null,
        };
      case paymentsConstants.CANCEL_PAYMENT:
        return {
          ...state,
          confirmationUrl: action.confirmationUrl,
        };
      case paymentsConstants.MAKE_PAYMENT_SUCCESS:
        return {
          ...state,
          confirmationUrl: action.confirmationUrl,
          isLoading: false,
        };
      default:
        return state;
    }
  } else {
    return state;
  }
}
