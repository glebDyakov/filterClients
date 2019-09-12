import { paymentsConstants } from '../_constants';

const initialState = {
    list: []
}

export function payments(state = initialState, action) {
    switch (action.type) {
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
                exceptionMessage: action.exceptionMessage
            }
        }
        case paymentsConstants.CANCEL_PAYMENT:
        case paymentsConstants.MAKE_PAYMENT:
        case paymentsConstants.MAKE_PAYMENT_SUCCESS:
            return {
                ...state,
                confirmationUrl: action.confirmationUrl
            };
        default:
            return state
    }
}
