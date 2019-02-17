import config from 'config';
import { authHeader, handleResponse } from '../_helpers';

export const servicesService = {
    add,
    update,
    get,
    _delete,
    getService,
    getServiceList,
    getServices,
    addService,
    updateService,
    deleteService
};

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

    return fetch(`${config.apiUrl}/servicegroups`, requestOptions).then(handleResponse);
}

function getServices() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services`, requestOptions).then(handleResponse);
}

function add(params) {
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

    return fetch(`${config.apiUrl}/servicegroups`, requestOptions)
        .then(handleResponse)
        .then(staff => {
            return staff;
        });
}

function update(params) {
    let serv=params
    delete serv['services'];
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(serv)
    };

    return fetch(`${config.apiUrl}/servicegroups`, requestOptions)
        .then(handleResponse)
        .then(staff => {
            return staff;
        });
}

function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/servicegroups/${id}`, requestOptions).then(handleResponse);
}

function getService(idGroup, idService) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services/${idService}`, requestOptions).then(handleResponse);
}

function getServiceList(idGroup) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services`, requestOptions).then(handleResponse);
}

function addService(params, idGroup) {
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

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services`, requestOptions)
        .then(handleResponse)
        .then(staff => {
            return staff;
        });
}

function updateService(params, idGroup) {
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

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services`, requestOptions)
        .then(handleResponse)
        .then(staff => {
            return staff;
        });
}

function deleteService(idGroup, idService) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services/${idService}`, requestOptions).then(handleResponse);
}