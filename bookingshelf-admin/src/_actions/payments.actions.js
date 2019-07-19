import {paymentsConstants} from '../_constants';
import {calendarService, paymentsService} from '../_services';
import moment from 'moment';



export const paymentsActions = {
    getInvoiceList,
    getPackets,
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
