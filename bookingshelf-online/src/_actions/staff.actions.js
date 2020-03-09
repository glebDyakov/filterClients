import {staffConstants} from '../_constants';
import {staffService} from '../_services';
import { alertActions } from './';

export const staffActions = {
    get,
    add,
    _delete,
    _move,
    getInfo,
    getServiceGroups,
    getSubcompanies,
    getStaffComments,
    createComment,
    clearStaff,
    getServices,
    getTimetable,
    getClientAppointments,
    getByCustomId,
    toggleStartMovingVisit,
    toggleMovedVisitSuccess,
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
function clearStaff() {
    return dispatch => {
        dispatch(success());

    };

    function success() { return { type: staffConstants.CLEAR_STAFF_SUCCESS } }
}

function _move(appointment, time, staffId, companyId, coStaffs) {
    return dispatch => {
        dispatch(request())
        staffService._move(appointment, time, staffId, companyId, coStaffs)
            .then(
                movingVisit => dispatch(success(movingVisit)),
                (err) => dispatch(failure()));
    };

    function request() { return { type: staffConstants.MOVE_VISIT } }
    function success(movingVisit) { return { type: staffConstants.MOVE_VISIT_SUCCESS, movingVisit } }
    function failure() { return { type: staffConstants.MOVE_VISIT_FAILURE} }
}

function toggleStartMovingVisit(isStartMovingVisit, movingVisit = [], fromVisitPage) {
    return dispatch => {
        dispatch(success(isStartMovingVisit));

    };

    function success(isStartMovingVisit) { return { type: staffConstants.TOGGLE_START_MOVING_VISIT, isStartMovingVisit, movingVisit, fromVisitPage } }
}

function toggleMovedVisitSuccess(movedVisitSuccess) {
    return dispatch => {
        dispatch(success(movedVisitSuccess));

    };

    function success(movedVisitSuccess) { return { type: staffConstants.TOGGLE_MOVED_VISIT, movedVisitSuccess } }
}

function getInfo(id, loaded) {
    return dispatch => {
        dispatch(request());
        staffService.getInfo(id)
            .then(
                info => dispatch(success(info)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_INFO } }
    function success(info) { return { type: staffConstants.GET_INFO_SUCCESS, info, loaded } }
    function failure() { return { type: staffConstants.GET_INFO_FAILURE } }
}


function getStaffComments(companyId, staff, currentPage) {
    return dispatch => {
        dispatch(request());
        staffService.getStaffComments(companyId, staff.staffId, currentPage)
            .then(
                staffCommentsInfo => dispatch(success(staffCommentsInfo)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_STAFF_COMMENTS } }
    function success(staffCommentsInfo) { return { type: staffConstants.GET_STAFF_COMMENTS_SUCCESS, staffCommentsInfo, staffCommentsStaff: staff } }
    function failure() { return { type: staffConstants.GET_STAFF_COMMENTS_FAILURE } }
}

function getServiceGroups(id) {
    return dispatch => {
        dispatch(request());
        staffService.getServiceGroups(id)
            .then(
                serviceGroups => dispatch(success(serviceGroups)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_SERVICE_GROUPS } }
    function success(serviceGroups) { return { type: staffConstants.GET_SERVICE_GROUPS_SUCCESS, serviceGroups } }
    function failure() { return { type: staffConstants.GET_SERVICE_GROUPS_FAILURE } }
}

function getSubcompanies(id) {
    return dispatch => {
        dispatch(request());
        staffService.getSubcompanies(id)
            .then(
                subcompanies => dispatch(success(subcompanies)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_SUBCOMPANIES } }
    function success(subcompanies) { return { type: staffConstants.GET_SUBCOMPANIES_SUCCESS, subcompanies } }
    function failure() { return { type: staffConstants.GET_SUBCOMPANIES_FAILURE } }
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
                result => {
                    if(result.length) {
                        dispatch(success({
                            newAppointment: result,
                            clientActivationId: null,
                            clientVerificationCode: null,
                            enteredCodeError: false
                        }))
                    } else if (result.clientActivationId) {
                        dispatch(success(result))
                    } else {
                        dispatch(failure({ error: 'Извините, это время недоступно для записи' }));
                    }
                },
                (err) => {
                    let errorPayload;
                    if (err === 'client in blacklist') {
                        errorPayload = { error: 'Извините, ваша запись не может быть создана. Пожалуйста, свяжитесь с администратором заведения.' };
                    } else if (err === 'incorrect activation code') {
                        errorPayload = { enteredCodeError: true }
                    } else {
                        errorPayload = { error: 'Извините, это время недоступно для записи' };
                    }
                    dispatch(failure(errorPayload));
                }
            );
    };

    function request() { return { type: staffConstants.ADD_APPOINTMENT } }
    function success(payload) { return { type: staffConstants.ADD_APPOINTMENT_SUCCESS, payload } }
    function failure(payload) { return { type: staffConstants.ADD_APPOINTMENT_FAILURE, payload } }
}

function createComment(companyId, staffId, params) {
    return dispatch => {
        dispatch(request());
        staffService.createComment(companyId, staffId, params)
            .then(
                result => {
                    if(result) {
                        dispatch(success(result))
                    }
                },
                (err) => {
                    let errorPayload;
                    if (err === 'client in blacklist') {
                        errorPayload = { error: 'Извините, ваша запись не может быть создана. Пожалуйста, свяжитесь с администратором заведения.' };
                    } else if (err === 'incorrect activation code') {
                        errorPayload = { enteredCodeError: true }
                    } else {
                        errorPayload = { error: 'Извините, это время недоступно для записи' };
                    }
                    dispatch(failure(errorPayload));
                }
            );
    };

    function request() { return { type: staffConstants.CREATE_COMMENT } }
    function success(comment) { return { type: staffConstants.CREATE_COMMENT_SUCCESS, comment } }
    function failure(payload) { return { type: staffConstants.CREATE_COMMENT_FAILURE, payload } }
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
                () => dispatch(failure())
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

function getClientAppointments(company, clientId, pageNum) {
    return dispatch => {
        dispatch(request());
        staffService.getClientAppointments(company, clientId, pageNum)
            .then(
                clientAppointments => dispatch(success(clientAppointments)),
                () => failure()
            );
    };

    function request() { return { type: staffConstants.GET_CLIENT_APPOINTMENTS } }
    function success(clientAppointments) { return { type: staffConstants.GET_CLIENT_APPOINTMENTS_SUCCESS, clientAppointments } }
    function failure() { return { type: staffConstants.GET_CLIENT_APPOINTMENTS_FAILURE } }
}


function getTimetableAvailable(company, staffId, date1, date2, service, appointmentsIdList, staffsIdList) {
    return dispatch => {
        dispatch(request());
        staffService.getTimetableAvailable(company, staffId, date1, date2, service, appointmentsIdList, staffsIdList)
            .then(
                timetableAvailable => dispatch(success(timetableAvailable)),
                () => dispatch(failure())
            );
    };

    function request() { return { type: staffConstants.GET_TIMETABLE_AVAILABLE } }
    function success(timetableAvailable) { return { type: staffConstants.GET_TIMETABLE_AVAILABLE_SUCCESS, timetableAvailable } }
    function failure() { return { type: staffConstants.GET_TIMETABLE_AVAILABLE_FAILURE } }
}
