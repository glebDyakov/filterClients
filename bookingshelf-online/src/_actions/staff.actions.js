import {staffConstants} from '../_constants';
import {staffService} from '../_services';
import { alertActions } from './';

export const staffActions = {
    get,
    add,
    _delete,
    getInfo,
    getServices,
    getTimetable,
    getByCustomId,
    getNearestTime,
    getTimetableAvailable
};


function get(id) {
    return dispatch => {
        staffService.get(id)
            .then(
                staff => dispatch(success(staff)),
            );
    };

    function success(staff) { return { type: staffConstants.GET_SUCCESS, staff } }
}

function getInfo(id) {
    return dispatch => {
        staffService.getInfo(id)
            .then(
                info => dispatch(success(info)),
            );
    };

    function success(info) { return { type: staffConstants.GET_INFO_SUCCESS, info } }
}

function getServices(id) {
    return dispatch => {
        staffService.getServices(id)
            .then(
                services => dispatch(success(services)),
            );
    };

    function success(services) { return { type: staffConstants.GET_SERVICES_SUCCESS, services } }
}

function getNearestTime(id) {
    return dispatch => {
        staffService.getNearestTime(id)
            .then(
                nearestTime => dispatch(success(nearestTime)),
            );
    };

    function success(nearestTime) { return { type: staffConstants.GET_NEAREST_TIME_SUCCESS, nearestTime } }
}

function add(id, staff, service, params) {
    return dispatch => {
        staffService.add(id, staff, service, params)
            .then(
                appointment => dispatch(success(appointment)),
            );
    };

    function success(appointment) { return { type: staffConstants.ADD_APPOINTMENT_SUCCESS, appointment } }
}

function _delete(id) {
    return dispatch => {
        staffService._delete(id)
            .then(
                id => dispatch(success(id)),
            );
    };

    function success(id) { return { type: staffConstants.DELETE_APPOINTMENT_SUCCESS, id } }
}

function getByCustomId(id) {
    return dispatch => {
        staffService.getByCustomId(id)
            .then(
                appointment => dispatch(success(appointment)),
            );
    };

    function success(appointment) { return { type: staffConstants.GET_APPOINTMENT_CUSTOM_SUCCESS, appointment } }
}

function getTimetable(company, date1, date2) {
    return dispatch => {
        staffService.getTimetable(company, date1, date2)
            .then(
                timetable => dispatch(success(timetable)),
            );
    };

    function success(timetable) { return { type: staffConstants.GET_TIMETABLE_SUCCESS, timetable } }
}

function getTimetableAvailable(company, staffId, date1, date2, service) {
    return dispatch => {
        staffService.getTimetableAvailable(company, staffId, date1, date2, service)
            .then(
                timetableAvailable => dispatch(success(timetableAvailable)),
            );
    };

    function success(timetableAvailable) { return { type: staffConstants.GET_TIMETABLE_AVAILABLE_SUCCESS, timetableAvailable } }
}
