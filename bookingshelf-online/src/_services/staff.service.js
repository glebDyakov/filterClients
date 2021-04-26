import config from 'config';
import { handleResponse, origin } from '../_helpers';
import {requestConstants} from '../_constants';
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
    return fetch(`${origin}${config.apiUrl}/${id}/staffs`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getServices(id) {
    return fetch(`${origin}${config.apiUrl}/${id}/services`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getInfo(id) {
    return fetch(`${origin}${config.apiUrl}/${id}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}
function getInfoSocial(id) {
    return fetch(`${origin}${config.apiUrl}/${id}/socialnetwork`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getStaffComments(companyId, staffId, pageNum = 1) {
    return fetch(`${origin}${config.apiUrl}/${companyId}/staffs/${staffId}/feedback?pageNum=${pageNum}&pageSize=10`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getServiceGroups(id) {
    return fetch(`${origin}${config.apiUrl}/${id}/servicegroups`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getSubcompanies(id) {
    return fetch(`${origin}${config.apiUrl}/${id}/subcompanies`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getNearestTime(id) {
    return fetch(`${origin}${config.apiUrl}/${id}/staffs/firstavailabletimes?dateFrom=${moment().utc().format('x')}&dateTo=${moment().add(3,'days').utc().format('x')}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getTimetable(id, date1, date2) {
    return fetch(`${origin}${config.apiUrl}/${id}/timetables?dateFrom=${date1}&dateTo=${date2}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function getClientAppointments(id, clientId, pageNum) {
  
    return fetch(`${origin}${config.apiUrl}/${id}/clients/${clientId}/appointments?dateFrom=${moment().subtract(1, 'year').format('x')}&dateTo=${moment().add(6, 'month').endOf('month').format('x')}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);

    //return fetch(`${origin}${config.apiUrl}/${id}/clients/${clientId}/appointments?pageNum=${pageNum}&pageSize=10&dateFrom=${moment().subtract(1, 'year')}&dateTo=${moment().add(6, 'month').endOf('month').format('x')}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
    //return fetch(`${origin}${config.apiUrl}/${id}/appointments/clients?dateFrom=1&dateTo=${moment().add(6, 'month').endOf('month').format('x')}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}


function getTimetableAvailable(id, staffId, date1, date2, service, appointmentsIdList, staffsIdList) {
      const minDateFrom = moment().format('x');

    if (date1 < minDateFrom) {
        date1 = minDateFrom
    }

    return fetch(`${origin}${config.apiUrl}/${id}/${staffId ? `staffs/${staffId}${!!staffsIdList ? staffsIdList : ''}/` : ''}services/${service}/${!!appointmentsIdList ? ('appointments/' + appointmentsIdList + '/') : ''}availabletimes?dateFrom=${date1}&dateTo=${date2}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}

function add(id, staff, service, params) {

    return fetch(`${origin}${config.apiUrl}/${id}/staffs/${staff}/appointments`, requestConstants.DEFAULT_REQUEST_OPTIONS_POST(params)).then(handleResponse);
}

function createComment(companyId, staffId, params) {

    return fetch(`${origin}${config.apiUrl}/${companyId}/staffs/${staffId}/feedback`, requestConstants.DEFAULT_REQUEST_OPTIONS_POST_JSON(params)).then(handleResponse);
}

function clientLogin(companyId, params) {

    return fetch(`${origin}${config.apiUrl}/${companyId}/clients/feedback`, requestConstants.DEFAULT_REQUEST_OPTIONS_POST_JSON(params)).then(handleResponse);
}

function _move(appointment, time, staffId, companyId, coStaffs) {
    return fetch(`${origin}${config.apiUrl}/${companyId}/appointments/${appointment[0].appointmentId}`, requestConstants.DEFAULT_REQUEST_OPTIONS_PATCH(time,staffId,coStaffs)).then(handleResponse);
}


function _delete(id) {
    return fetch(`${origin}/rest/visits/v1/${id}`, requestConstants.DEFAULT_REQUEST_OPTIONS_DELETE).then(handleResponse);
}


function getByCustomId(id) {
    return fetch(`${origin}/rest/visits/v1/${id}`, requestConstants.DEFAULT_REQUEST_OPTIONS_GET).then(handleResponse);
}
