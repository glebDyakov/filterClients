import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';
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
    getNewAppointments,
    updateCompany
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

    return fetch(`${origin}${config.apiUrl}/company`, requestOptions)
        .then((data) => handleResponse(data, requestOptions))
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

    return fetch(`${origin}${config.apiUrl}/subcompanies`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${origin}${config.apiUrl}/subcompanies/${params.companyId}`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function updateCompany(params) {
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

    return fetch(`${origin}${config.apiUrl}/company`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${origin}${config.apiUrl}/subcompanies/${params.companyId}/switch`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${origin}${config.apiUrl}/onlinebooking`, requestOptions)
        .then((data) => handleResponse(data, requestOptions))
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

    return fetch(`${origin}${config.apiUrl}/company`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${origin}${config.apiUrl}/subcompanies`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${origin}${config.apiUrl}/onlinebooking`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${origin}${config.apiUrl}/appointments/count/false?dateFrom=${moment().startOf('day').format('x')}&dateTo=${moment().add(7, 'month').endOf('month').format('x')}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}
