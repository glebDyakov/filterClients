import config from 'config';
import { authHeader, handleResponse } from '../_helpers';

export const notificationService = {
    getSMS_EMAIL,
    updateSMS_EMAIL,
    updateSubcompanySMS_EMAIL,
    getClientAmount,
    setSMS,
    getBalance
};

function updateSMS_EMAIL(params) {
    const requestOptions = {
        method: 'PUT',
        body: params,
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/notifications`, requestOptions)
        .then((data) => handleResponse(data, requestOptions))
        .then(notification => {
            return notification;
        });
}

function updateSubcompanySMS_EMAIL(params, id) {
    const requestOptions = {
        method: 'PUT',
        body: params,
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/subcompanies/${id}/notifications`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function setSMS(params) {
    const requestOptions = {
        method: 'POST',
        body: params,
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/messages`, requestOptions)
        .then((data) => handleResponse(data, requestOptions))
        .then(notification => {
            return notification;
        });
}

function getSMS_EMAIL() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/notifications`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function getBalance() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/notifications/balances`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function getClientAmount() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/company/state`, requestOptions).then((data) => handleResponse(data, requestOptions));
}
