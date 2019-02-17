import config from 'config';
import { authHeader } from '../_helpers';
import moment from "moment";

export const staffService = {
    get,
    add,
    getServices,
    getInfo,
    getTimetable,
    _delete,
    getByCustomId,
    getTimetableAvailable,
    getNearestTime
};

function get(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/${id}/staffs`, requestOptions).then(handleResponse);
}

function getServices(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/${id}/services`, requestOptions).then(handleResponse);
}

function getInfo(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/${id}`, requestOptions).then(handleResponse);
}

function getNearestTime(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/${id}/staffs/firstavailabletimes?dateFrom=${moment().utc().format('x')}&dateTo=${moment().add(3,'month').utc().endOf('month').format('x')}`, requestOptions).then(handleResponse);
}


function getTimetable(id, date1, date2) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/${id}/timetables?dateFrom=${date1}&dateTo=${date2}`, requestOptions).then(handleResponse);
}

function getTimetableAvailable(id, staffId, date1, date2, service) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.apiUrl}/${id}/staffs/${staffId}/services/${service}/availabletimes?dateFrom=${date1}&dateTo=${date2}`, requestOptions).then(handleResponse);
}

function add(id, staff, service, params) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: params
    };

    return fetch(`${config.apiUrl}/${id}/staffs/${staff}/services/${service}/appointments`, requestOptions).then(handleResponse);
}


function _delete(id) {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetch(`https://online-zapis.com/visits/v1/${id}`, requestOptions).then(handleResponse);
}


function getByCustomId(id) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json' }
    };

    return fetch(`https://online-zapis.com/visits/v1/${id}`, requestOptions).then(handleResponse);
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}