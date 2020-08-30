import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';
import moment from 'moment';

export const paymentsService = {
  getInvoiceList,
  addInvoice,
  getInvoice,
  makePayment,
  getPackets,
};

function getInvoiceList() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };
  const dataFrom = moment().subtract(1, 'year').format('x');
  const dataTo = moment().add(1, 'year').format('x');

  return fetch(`${origin}${config.apiUrl}/invoices?dateFrom=${dataFrom}&dateTo=${dataTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getInvoice(invoiceId) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/invoices/${invoiceId}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getPackets() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrlv2}/packets`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
function makePayment(invoiceId) {
  const requestOptions = {
    method: 'POST',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrl}/invoices/${invoiceId}/payments`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
function addInvoice(invoice) {
  const requestOptions = {
    method: 'POST',
    body: invoice,
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrl}/invoices`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
