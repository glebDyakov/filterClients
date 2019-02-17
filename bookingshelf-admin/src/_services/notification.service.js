import config from 'config';
import { authHeader, handleResponse } from '../_helpers';

export const notificationService = {
    getSMS_EMAIL,
    updateSMS_EMAIL,
    setSMS
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
        .then(handleResponse)
        .then(notification => {
            return notification;
        });
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
        .then(handleResponse)
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

    return fetch(`${config.apiUrl}/notifications`, requestOptions).then(handleResponse);
}