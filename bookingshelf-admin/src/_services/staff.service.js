import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import {alertActions} from "../_actions";

export const staffService = {
    add,
    update,
    get,
    getAccess,
    updateAccess,
    getClosedDates,
    addClosedDates,
    deleteClosedDates,
    deleteWorkingHours,
    getTimetable,
    addWorkingHours,
    updateWorkingHours,
    deleteStaff,
    addUSerByEmail,
    getTimetableByStaff,
    getTimetableStaffs
};

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

    return fetch(`${config.apiUrl}/staffs`, requestOptions)
        .then(handleResponse)
        .then(staff => {
            return staff;
        })
}

function addUSerByEmail(params) {
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

    return fetch(`${config.apiUrl}/staffs/email`, requestOptions)
        .then(handleResponse)
            .then(staff => {
                return staff;
            })
}

function addWorkingHours(timing, id) {
    const requestOptions = {
        method: 'POST',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: timing
    };

    return fetch(`${config.apiUrl}/staffs/${id}/timetables`, requestOptions)
        .then(handleResponse)
        .then(timing => {
            return timing;
        });
}

function updateWorkingHours(timing, id) {
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: timing
    };

    return fetch(`${config.apiUrl}/staffs/${id}/timetables`, requestOptions)
        .then(handleResponse)
        .then(timing => {
            return timing;
        });
}

function update(params) {
    const requestOptions = {
        method: 'PATCH',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: params
    };

    return fetch(`${config.apiUrlv2}/staffs`, requestOptions)
        .then(handleResponse)
        .then(staff => {
            return staff;
        });
}


function updateAccess(params) {
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

    return fetch(`${config.apiUrl}/permissions`, requestOptions)
        .then(handleResponse)
        .then(access => {
            return access;
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

    return fetch(`${config.apiUrl}/staffs`, requestOptions).then(handleResponse);
}

function getClosedDates() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/closeddates`, requestOptions).then(handleResponse);
}


function getTimetable(from, to) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/timetables?dateFrom=${from}&dateTo=${to}`, requestOptions).then(handleResponse);
}

function getTimetableByStaff(staff, from, to) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/${staff.staffId}/availabletimes?dateFrom=${from}&dateTo=${to}`, requestOptions).then(handleResponse);
}

function getTimetableStaffs(from, to) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/availabletimes?dateFrom=${from}&dateTo=${to}`, requestOptions).then(handleResponse);
}

function addClosedDates(params) {
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

    return fetch(`${config.apiUrl}/closeddates`, requestOptions)
        .then(handleResponse)
        .then(closedDates => {
            return closedDates;
        });
}

function deleteClosedDates(id) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/closeddates/${id}`, requestOptions).then(handleResponse);
}

function deleteWorkingHours(id, start, end) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/${id}/timetables?dateFrom=${start}&dateTo=${end}`, requestOptions).then(handleResponse);
}

function deleteStaff(id) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/${id}`, requestOptions).then(handleResponse);
}

function getAccess() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/permissions`, requestOptions).then(handleResponse);
}