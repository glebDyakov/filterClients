import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import moment from 'moment';

export const calendarService = {
    addAppointment,
    editCalendarAppointment,
    editAppointment,
    editAppointment2,
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

    return fetch(`${config.apiUrl}/staffs/${staffId}/${!!clientId ? `clients/${clientId}/` : ''}appointments`, requestOptions)
        .then(handleResponse)
        .then(appointment => {
            return appointment;
        });
}

function editCalendarAppointment(params, mainAppointmentId, staffId, clientId, withoutNotify) {
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

    return fetch(`${config.apiUrl}/staffs/${staffId}/${!!clientId ? `clients/${clientId}/` : ''}appointments/${mainAppointmentId}${withoutNotify ? '?notify=false' : ''}`, requestOptions)
        .then(handleResponse)
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
}

function editAppointment2(params, id) {
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

    return fetch(`${config.apiUrlv2}/appointments/${id}`, requestOptions)
        .then(handleResponse)
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
}

function updateAppointment(appointmentId, params, withoutNotify) {
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

    return fetch(`${config.apiUrl}/appointments/${appointmentId}${withoutNotify ? '?notify=false' : ''}`, requestOptions)
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

    const dateFrom = moment('2018-01-01', 'YYYY-MMMM-DD').format('x')
    const dateTo = moment().add(7, 'month').endOf('month').format('x')
    return fetch(`${config.apiUrl}/appointments?dateFrom=${dateFrom}&dateTo=${dateTo}&canceled=${canceled}`, requestOptions)
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

    const dateFrom = moment('2018-01-01', 'YYYY-MMMM-DD').format('x')
    const dateTo = moment().add(7, 'month').endOf('month').format('x')
    return fetch(`${config.apiUrl}/appointments/moved?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
        .then(handleResponse)
}

function deleteAppointment(appointmentId, withoutNotify) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/appointments/${appointmentId}${withoutNotify ? '?notify=false' : ''}`, requestOptions).then(handleResponse);
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

