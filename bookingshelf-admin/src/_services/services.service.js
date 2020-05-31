import config from 'config';
import { authHeader, handleResponse } from '../_helpers';

export const servicesService = {
    add,
    update,
    updateServiceGroups,
    get,
    _delete,
    getService,
    getServiceList,
    getServices,
    updateServices,
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

    return fetch(`${config.apiUrl}/servicegroups`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/services`, requestOptions).then((data) => handleResponse(data, requestOptions));
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
        .then((data) => handleResponse(data, requestOptions))
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
        .then((data) => handleResponse(data, requestOptions))
        .then(staff => {
            return staff;
        });
}

function updateServiceGroups(params) {
    const requestOptions = {
        method: 'PATCH',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    };

    return fetch(`${config.apiUrl}/servicegroups`, requestOptions)
        .then((data) => handleResponse(data, requestOptions))
}

function updateServices(params) {
    const requestOptions = {
        method: 'PATCH',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    };

    return fetch(`${config.apiUrl}/services`, requestOptions)
        .then((data) => handleResponse(data, requestOptions))
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

    return fetch(`${config.apiUrl}/servicegroups/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services/${idService}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services`, requestOptions).then((data) => handleResponse(data, requestOptions));
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
        .then((data) => handleResponse(data, requestOptions))
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
        body: JSON.stringify(params)
    };

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services`, requestOptions)
        .then((data) => handleResponse(data, requestOptions))
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

    return fetch(`${config.apiUrl}/servicegroups/${idGroup}/services/${idService}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}