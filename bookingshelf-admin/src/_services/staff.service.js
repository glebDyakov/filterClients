import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import {alertActions} from "../_actions";

export const staffService = {
    add,
    update,
    get,
    getFeedback,
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
        .then((data) => handleResponse(data, requestOptions))
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
        .then((data) => handleResponse(data, requestOptions))
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
        .then((data) => handleResponse(data, requestOptions))
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
        .then((data) => handleResponse(data, requestOptions))
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
        .then((data) => handleResponse(data, requestOptions))
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
        .then((data) => handleResponse(data, requestOptions))
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

    return fetch(`${config.apiUrl}/staffs`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function getFeedback(currentPage) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/feedback?pageNum=${currentPage}&pageSize=5`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/closeddates`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/staffs/timetables?dateFrom=${from}&dateTo=${to}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/staffs/${staff.staffId}/availabletimes?dateFrom=${from}&dateTo=${to}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/staffs/availabletimes?dateFrom=${from}&dateTo=${to}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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
        .then((data) => handleResponse(data, requestOptions))
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

    return fetch(`${config.apiUrl}/closeddates/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function deleteWorkingHours(id, start, end, staffTimetableId) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/${id}/timetables${staffTimetableId ? `/${staffTimetableId}`: ''}?dateFrom=${start}&dateTo=${end}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/staffs/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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

    return fetch(`${config.apiUrl}/permissions`, requestOptions).then((data) => handleResponse(data, requestOptions));
}