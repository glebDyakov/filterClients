import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import FileSaver from 'file-saver';
import moment from "moment";

export const clientService = {
    addClient,
    updateClient,
    getClient,
    deleteClient,
    getClientWithInfo,
    getClientV2,
    getActiveClient,
    downloadFile,
    uploadFile
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

function uploadFile(uploadFile) {
    const requestOptions = {
        method: 'POST',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader(),
        body: uploadFile
    };

    return fetch(`${config.apiUrl}/clients/upload`, requestOptions)
}

function downloadFile() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/clients/download`, requestOptions).then(function(response) {
        return response.blob();
    }).then(function(blob) {
        FileSaver.saveAs(blob, 'clients.csv');
    })
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

    return fetch(`${config.apiUrl}/appointments/clients?dateFrom=${moment().subtract(1, 'year')}&dateTo=${moment().add(6, 'month').endOf('month').format('x')}`, requestOptions).then(handleResponse);
}

function getClientV2(pageNum, searchValue) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrlv2}/clients?pageNum=${pageNum}&pageSize=2${searchValue ? `&searchValue=${searchValue}` : ''}`, requestOptions).then(handleResponse);
}

function getActiveClient(clientId = 280) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/clients/${clientId}/appointments`, requestOptions).then(handleResponse);
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