import {paymentsConstants} from '../_constants';
import { paymentsService} from '../_services';
import { history } from '../_helpers';


export const paymentsActions = {
    getInvoiceList,
    getPackets,
    makePayment,
    getInvoice,
    cancelPayment,
    addInvoice
}
function getInvoiceList(activeInvoice) {
    return dispatch => {

        paymentsService.getInvoiceList()
            .then(
                list => {
                    dispatch(success(list))
                    if (activeInvoice) {
                        $('.make-payment-modal').modal('show')
                        dispatch(paymentsActions.makePayment(activeInvoice.invoiceId))
                    }
                },
            );
    };

    function success(list) { return { type: paymentsConstants.GET_INVOICE_LIST_SUCCESS, payload: {list, activeInvoice} }}
}

function getInvoice(invoiceId) {
    return dispatch => {

        paymentsService.getInvoice(invoiceId)
            .then(
                (invoice) => {
                    dispatch(success(invoice))
                },
                () => dispatch(failure()),
            );
    };

    function success(invoice) { return { type: paymentsConstants.GET_INVOICE_SUCCESS, pendingInvoice: invoice }}
    function failure() { return { type: paymentsConstants.GET_INVOICE_FAILURE, pendingInvoice: null }}
}

function makePayment(invoiceId) {
    return dispatch => {
        dispatch(request())
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

    function request() { return { type: paymentsConstants.MAKE_PAYMENT, confirmationUrl: null }}
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
                dispatch(getInvoiceList(data))
            });
    }
}
