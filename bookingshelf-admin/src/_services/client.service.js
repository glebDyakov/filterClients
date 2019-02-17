import config from 'config';
import { authHeader, handleResponse } from '../_helpers';

export const clientService = {
    addClient,
    updateClient,
    getClient,
    deleteClient,
    getClientWithInfo
};

function addClient(params) {
    const requestOptions = {
        method: 'POST',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: params
    };

    return fetch(`${config.apiUrl}/clients`, requestOptions)
        .then(handleResponse)
        .then(client => {
            return client;
        });
}

function updateClient(params) {
    delete params.appointments
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: params
    };

    return fetch(`${config.apiUrl}/clients`, requestOptions)
        .then(handleResponse)
        .then(client => {
            return client;
        });
}


function getClient() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/clients`, requestOptions).then(handleResponse);
}

function getClientWithInfo() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/appointments/clients?dateFrom=1&dateTo=1550128218518`, requestOptions).then(handleResponse);
}

function deleteClient(id) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/clients/${id}`, requestOptions).then(handleResponse);
}