import config from 'config';
import { handleResponse, origin } from '../_helpers';

import moment from "moment";

export const staffService = {
    get,
    add,
    getServices,
    getServiceGroups,
    getSubcompanies,
    getInfo,
    getInfoSocial,
    getStaffComments,
    clientLogin,
    createComment,
    getTimetable,
    getClientAppointments,
    _delete,
    _move,
    getByCustomId,
    getTimetableAvailable,
    getNearestTime
};

function get(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/staffs`, requestOptions).then(handleResponse);
}

function getServices(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/services`, requestOptions).then(handleResponse);
}

function getInfo(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}`, requestOptions).then(handleResponse);
}
function getInfoSocial(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/socialnetwork`, requestOptions).then(handleResponse);
}

function getStaffComments(companyId, staffId, pageNum = 1) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${companyId}/staffs/${staffId}/feedback?pageNum=${pageNum}&pageSize=10`, requestOptions).then(handleResponse);
}

function getServiceGroups(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/servicegroups`, requestOptions).then(handleResponse);
}

function getSubcompanies(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/subcompanies`, requestOptions).then(handleResponse);
}

function getNearestTime(id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/staffs/firstavailabletimes?dateFrom=${moment().utc().format('x')}&dateTo=${moment().add(2,'week').utc().format('x')}`, requestOptions).then(handleResponse);
}

function getTimetable(id, date1, date2) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/timetables?dateFrom=${date1}&dateTo=${date2}`, requestOptions).then(handleResponse);
}

function getClientAppointments(id, clientId, pageNum) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/${id}/clients/${clientId}/appointments?dateFrom=${moment().subtract(1, 'year').format('x')}&dateTo=${moment().add(6, 'month').endOf('month').format('x')}`, requestOptions).then(handleResponse);

    //return fetch(`${origin}${config.apiUrl}/${id}/clients/${clientId}/appointments?pageNum=${pageNum}&pageSize=10&dateFrom=${moment().subtract(1, 'year')}&dateTo=${moment().add(6, 'month').endOf('month').format('x')}`, requestOptions).then(handleResponse);
    //return fetch(`${origin}${config.apiUrl}/${id}/appointments/clients?dateFrom=1&dateTo=${moment().add(6, 'month').endOf('month').format('x')}`, requestOptions).then(handleResponse);
}


function getTimetableAvailable(id, staffId, date1, date2, service, appointmentsIdList, staffsIdList) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    const minDateFrom = moment().format('x');

    if (date1 < minDateFrom) {
        date1 = minDateFrom
    }

    return fetch(`${origin}${config.apiUrl}/${id}/${staffId ? `staffs/${staffId}${!!staffsIdList ? staffsIdList : ''}/` : ''}services/${service}/${!!appointmentsIdList ? ('appointments/' + appointmentsIdList + '/') : ''}availabletimes?dateFrom=${date1}&dateTo=${date2}`, requestOptions).then(handleResponse);
}

function add(id, staff, service, params) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: params
    };

    return fetch(`${origin}${config.apiUrl}/${id}/staffs/${staff}/appointments`, requestOptions).then(handleResponse);
}

function createComment(companyId, staffId, params) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    };

    return fetch(`${origin}${config.apiUrl}/${companyId}/staffs/${staffId}/feedback`, requestOptions).then(handleResponse);
}

function clientLogin(companyId, params) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    };

    return fetch(`${origin}${config.apiUrl}/${companyId}/clients/feedback`, requestOptions).then(handleResponse);
}

function _move(appointment, time, staffId, companyId, coStaffs) {
    const requestOptions = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
            coStaffs,
            appointmentTimeMillis: time,
            staffId,
            adminApproved: true,
            adminMoved: true,
            approved: true,
            moved: true,
            movedOnline: true
        }),
        withCredentials: true
    };

    return fetch(`${origin}${config.apiUrl}/${companyId}/appointments/${appointment[0].appointmentId}`, requestOptions).then(handleResponse);
}


function _delete(id) {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetch(`${origin}/rest/visits/v1/${id}`, requestOptions).then(handleResponse);
}


function getByCustomId(id) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json' }
    };
    return fetch(`${origin}/rest/visits/v1/${id}`, requestOptions).then(handleResponse);
}
