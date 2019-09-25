import { paymentsConstants } from '../_constants';

const initialState = {
    list: []
}

export function payments(state = initialState, action) {
    if (action) {
        switch (action.type) {
            case paymentsConstants.GET_INVOICE_SUCCESS:
                return {
                    ...state,
                    pendingInvoice: action.pendingInvoice
                }
            case paymentsConstants.GET_INVOICE_LIST_SUCCESS:
                return {
                    ...state,
                    list: action.payload.list,
                    activeInvoice: action.payload.activeInvoice
                };
            case paymentsConstants.GET_PACKETS_SUCCESS:
                return {
                    ...state,
                    packets: action.packets
                };
            case paymentsConstants.MAKE_PAYMENT_FAILURE: {
                return {
                    ...state,
                    exceptionMessage: action.exceptionMessage,
                    isLoading: false
                }
            }
            case paymentsConstants.MAKE_PAYMENT:
                return {
                    ...state,
                    isLoading: true,
                    confirmationUrl: action.confirmationUrl
                }
            case paymentsConstants.CANCEL_PAYMENT:
                return {
                    ...state,
                    confirmationUrl: action.confirmationUrl
                };
            case paymentsConstants.MAKE_PAYMENT_SUCCESS:
                return {
                    ...state,
                    confirmationUrl: action.confirmationUrl,
                    isLoading: false
                };
            default:
                return state
        }
    } else {
        return state
    }
}
