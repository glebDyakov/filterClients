import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import moment from 'moment';


export const paymentsService = {
    getInvoiceList,
    addInvoice,
    getPackets
};
function getInvoiceList() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };
    let dataFrom = moment().startOf('year').format('x');
    let dataTo = moment().endOf('year').format('x');

    return fetch(`${config.apiUrl}/invoices?dateFrom=${dataFrom}&dateTo=${dataTo}`, requestOptions).then(handleResponse);
}
function getPackets() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/packets`, requestOptions).then(handleResponse);
}
function addInvoice(invoice) {
    const requestOptions = {
        method: 'POST',
        body: invoice,
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/invoices`, requestOptions)
        .then(handleResponse);
}
