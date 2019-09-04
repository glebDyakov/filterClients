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
        dispatch(request());
        staffService.get(id)
            .then(
                staff => dispatch(success(staff)),
                () => dispatch(failure())
            );
    };

    function request() { return { type: staffConstants.GET } }
    function success(staff) { return { type: staffConstants.GET_SUCCESS, staff, } }
    function failure() { return { type: staffConstants.GET_FAILURE } }
}

function getInfo(id) {
    return dispatch => {
        dispatch(request());
        staffService.getInfo(id)
            .then(
                info => dispatch(success(info)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_INFO } }
    function success(info) { return { type: staffConstants.GET_INFO_SUCCESS, info } }
    function failure() { return { type: staffConstants.GET_INFO_FAILURE } }
}

function getServices(id) {
    return dispatch => {
        dispatch(request());
        staffService.getServices(id)
            .then(
                services => dispatch(success(services)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_SERVICES } }
    function success(services) { return { type: staffConstants.GET_SERVICES_SUCCESS, services } }
    function failure() { return { type: staffConstants.GET_SERVICES_FAILURE } }
}

function getNearestTime(id) {
    return dispatch => {
        dispatch(request());
        staffService.getNearestTime(id)
            .then(
                nearestTime => dispatch(success(nearestTime)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_NEAREST_TIME } }
    function success(nearestTime) { return { type: staffConstants.GET_NEAREST_TIME_SUCCESS, nearestTime } }
    function failure() { return { type: staffConstants.GET_NEAREST_TIME_FAILURE } }
}

function add(id, staff, service, params) {
    return dispatch => {
        dispatch(request());
        staffService.add(id, staff, service, params)
            .then(
                appointment => {
                    if(appointment.length) {
                        dispatch(success(appointment))
                    } else {
                        dispatch(failure());
                    }
                },
                () => {
                    dispatch(failure());
                }
            );
    };

    function request() { return { type: staffConstants.ADD_APPOINTMENT } }
    function success(appointment) { return { type: staffConstants.ADD_APPOINTMENT_SUCCESS, appointment } }
    function failure() { return { type: staffConstants.ADD_APPOINTMENT_FAILURE } }
}

function _delete(id) {
    return dispatch => {
        dispatch(request());
        staffService._delete(id)
            .then(
                id => dispatch(success(id)),
                () => dispatch(failure())
            );
    };

    function request() { return { type: staffConstants.DELETE_APPOINTMENT } }
    function success(id) { return { type: staffConstants.DELETE_APPOINTMENT_SUCCESS, id } }
    function failure() { return { type: staffConstants.DELETE_APPOINTMENT_FAILURE } }
}

function getByCustomId(id) {
    return dispatch => {
        dispatch(request());
        staffService.getByCustomId(id)
            .then(
                appointment => dispatch(success(appointment)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_APPOINTMENT_CUSTOM } }
    function success(appointment) { return { type: staffConstants.GET_APPOINTMENT_CUSTOM_SUCCESS, appointment } }
    function failure() { return { type: staffConstants.GET_APPOINTMENT_CUSTOM_FAILURE } }
}

function getTimetable(company, date1, date2) {
    return dispatch => {
        dispatch(request());
        staffService.getTimetable(company, date1, date2)
            .then(
                timetable => dispatch(success(timetable)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_TIMETABLE } }
    function success(timetable) { return { type: staffConstants.GET_TIMETABLE_SUCCESS, timetable } }
    function failure() { return { type: staffConstants.GET_TIMETABLE_FAILURE } }
}

function getTimetableAvailable(company, staffId, date1, date2, service) {
    return dispatch => {
        dispatch(request());
        staffService.getTimetableAvailable(company, staffId, date1, date2, service)
            .then(
                timetableAvailable => dispatch(success(timetableAvailable)),
                () => dispatch(failure())
            );
    };

    function request() { return { type: staffConstants.GET_TIMETABLE_AVAILABLE } }
    function success(timetableAvailable) { return { type: staffConstants.GET_TIMETABLE_AVAILABLE_SUCCESS, timetableAvailable } }
    function failure() { return { type: staffConstants.GET_TIMETABLE_AVAILABLE_FAILURE } }
}
