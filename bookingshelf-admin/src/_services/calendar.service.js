import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import moment from 'moment';

export const calendarService = {
    addAppointment,
    editAppointment,
    getAppointments,
    getAppointmentsCanceled,
    approveAppointment,
    approveAllAppointment,
    approveMovedAppointment,
    deleteAppointment,
    deleteReservedTime,
    updateAppointment,
    getReservedTime,
    addReservedTime
};

function addAppointment(params, serviceId, staffId, clientId) {
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

    return fetch(`${config.apiUrl}/staffs/${staffId}/clients/${clientId}/appointments`, requestOptions)
        .then(handleResponse)
        .then(appointment => {
            return appointment;
        });
}

function addReservedTime(params, staffId) {
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

    return fetch(`${config.apiUrl}/staffs/${staffId}/reservedtimes`, requestOptions)
        .then(handleResponse)
        .then(reservedTime => {
            return reservedTime;
        });
}

function editAppointment(params) {
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

    return fetch(`${config.apiUrl}/appointments`, requestOptions)
        .then(handleResponse)
        .then(appointment => {
            return appointment;
        });
}

function approveAppointment(appointmentId, params) {
    const requestOptions = {
        method: 'PATCH',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/appointments/${appointmentId}`, requestOptions)
        .then(handleResponse)
        .then(appointment => {
            return appointment;
        });
}

function updateAppointment(appointmentId, params) {
    const requestOptions = {
        method: 'PATCH',
        body: params,
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.apiUrl}/appointments/${appointmentId}`, requestOptions)
        .then(handleResponse)
        .then(appointment => {
            return appointment;
        });
}
function approveAllAppointment(approved, canceled, params) {
    const requestOptions = {
        method: 'PATCH',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    const dateTo = moment().endOf('year').format('x')
    return fetch(`${config.apiUrl}/appointments?dateFrom=1&dateTo=${dateTo}&canceled=${canceled}`, requestOptions)
        .then(handleResponse)
}

function approveMovedAppointment(params) {
    const requestOptions = {
        method: 'PATCH',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    const dateTo = moment().endOf('year').format('x')
    return fetch(`${config.apiUrl}/appointments/moved?dateFrom=1&dateTo=${dateTo}`, requestOptions)
        .then(handleResponse)
}

function deleteAppointment(appointmentId) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/appointments/${appointmentId}`, requestOptions).then(handleResponse);
}

function deleteReservedTime(staffId, reservedTimeId) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/${staffId}/reservedtimes/${reservedTimeId}`, requestOptions).then(handleResponse);
}

function getAppointments(dateFrom, dateTo) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/appointments/staffs?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions).then(handleResponse);
}

function getAppointmentsCanceled(dateFrom, dateTo, id) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/staffs/${id}/appointments/canceled?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions).then(handleResponse);
}

function getReservedTime(dateFrom, dateTo) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/reservedtimes/staffs?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions).then(handleResponse);
}

