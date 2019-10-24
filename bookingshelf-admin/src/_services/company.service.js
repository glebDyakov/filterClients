import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import moment from "moment";

export const companyService = {
    add,
    addSubcompany,
    updateSubcompany,
    switchSubcompany,
    get,
    getSubcompanies,
    updateBookingInfo,
    getBookingInfo,
    getNewAppointments
};

function add(params) {
    delete params.menu;
    delete params.profile;

    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/company`, requestOptions)
        .then(handleResponse)
        .then(company => {
            return company;
        });
}

function addSubcompany(params) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/subcompanies`, requestOptions)
        .then(handleResponse);
}

function updateSubcompany(params) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/subcompanies/${params.companyId}`, requestOptions)
        .then(handleResponse);
}

function switchSubcompany(params) {
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/subcompanies/${params.companyId}/switch`, requestOptions)
        .then(handleResponse);
}

function updateBookingInfo(params) {
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

    return fetch(`${config.apiUrl}/onlinebooking`, requestOptions)
        .then(handleResponse)
        .then(company => {
            return company;
        });
}


function get() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/company`, requestOptions).then(handleResponse);
}

function getSubcompanies() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/subcompanies`, requestOptions).then(handleResponse);
}

function getBookingInfo() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/onlinebooking`, requestOptions).then(handleResponse);
}

function getNewAppointments() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/appointments/count/false?dateFrom=${moment().startOf('day').format('x')}&dateTo=${moment().add(1, 'month').endOf('month').format('x')}`, requestOptions).then(handleResponse);
}
