import {paymentsConstants} from '../_constants';
import { paymentsService} from '../_services';



export const paymentsActions = {
    getInvoiceList,
    getPackets,
    makePayment,
    cancelPayment,
    addInvoice
}
function getInvoiceList() {
    return dispatch => {

        paymentsService.getInvoiceList()
            .then(
                list => dispatch(success(list)),
            );
    };

    function success(list) { return { type: paymentsConstants.GET_INVOICE_LIST_SUCCESS, list }}
}

function makePayment(invoiceId) {
    return dispatch => {

        paymentsService.makePayment(invoiceId)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure("Нельзя оплатить. Попробуйте позже"))
                }
            );
    };

    function success(data) { return { type: paymentsConstants.MAKE_PAYMENT_SUCCESS, confirmationUrl: data.confirmationUrl }}
    function failure(error) { return { type: paymentsConstants.MAKE_PAYMENT_FAILURE, exceptionMessage: error }}
}

function cancelPayment() {
    return dispatch => {
        dispatch(success())
    };

    function success() { return { type: paymentsConstants.CANCEL_PAYMENT, confirmationUrl: null }}
}

function getPackets() {
    return dispatch => {

        paymentsService.getPackets()
            .then(
                packets => dispatch(success(packets)),
            );
    };

    function success(packets) { return { type: paymentsConstants.GET_PACKETS_SUCCESS, packets }}
}

function addInvoice(invoice) {
    return dispatch => {
        paymentsService.addInvoice(invoice)
            .then((data) => {
                dispatch(getInvoiceList())
            });
    }
}
