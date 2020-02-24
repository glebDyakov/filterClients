import {analiticsConstants, menuConstants, staffConstants, userConstants} from '../_constants';
import { staffService } from '../_services';
import { alertActions } from './';
import {store} from "../_helpers";
import moment from 'moment';


export const staffActions = {
    add,
    update,
    get,
    getAccess,
    getAccessList,
    updateAccess,
    addClosedDates,
    getClosedDates,
    deleteClosedDates,
    getTimetable,
    addWorkingHours,
    updateWorkingHours,
    deleteWorkingHours,
    deleteStaff,
    addUSerByEmail,
    getTimetableByStaff,
    getTimetableStaffs
};

function add(params) {
    return dispatch => {
        dispatch(request(0));

        staffService.add(params)
            .then(
                staff => {
                    dispatch(success(staff));
                    setTimeout(()=>dispatch(successTime(0)), 10000);
                    dispatch(staffActions.get());

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    setTimeout(()=>dispatch(failureTime(0)), 10000);
                }
            );
    };
    function request(id) { return { type: staffConstants.STAFF_REQUEST, id } }
    function successTime(id) { return { type: staffConstants.STAFF_SUCCESS_TIME, id } }
    function failureTime(id) { return { type: staffConstants.STAFF_FAILURE_TIME, id } }

    function success(staff) { return { type: staffConstants.ADD_SUCCESS, staff } }
    function failure(error) { return { type: staffConstants.ADD_FAILURE, error } }
}

function addUSerByEmail(params) {
    return dispatch => {
        dispatch(request(0));

        staffService.addUSerByEmail(params)
            .then(
                staff => {
                    dispatch(success(staff));
                    setTimeout(()=>dispatch(successTime(0)), 10000);
                    dispatch(staffActions.get());

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    setTimeout(()=>dispatch(failureTime(0)), 10000);

                }
            );
    };
    function request(id) { return { type: staffConstants.STAFF_REQUEST, id } }
    function successTime(id) { return { type: staffConstants.STAFF_SUCCESS_TIME, id } }
    function failureTime(id) { return { type: staffConstants.STAFF_FAILURE_TIME, id } }
    function success(staff) { return { type: staffConstants.ADD_SUCCESS, staff } }
    function failure(error) { return { type: staffConstants.ADD_FAILURE, error } }
}

function addWorkingHours(timing, id) {
    return dispatch => {
        dispatch(request(0));

        staffService.addWorkingHours(timing, id)
            .then(
                timing => {
                    dispatch(success(timing, id));
                    setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    setTimeout(()=>dispatch(failureTime(0)), 500);
                }
            );
    };

    function request(id) { return { type: staffConstants.STAFF_REQUEST, id } }
    function successTime(id) { return { type: staffConstants.STAFF_SUCCESS_TIME, id } }
    function failureTime(id) { return { type: staffConstants.STAFF_FAILURE_TIME, id } }
    function success(timing, id) { return { type: staffConstants.ADD_WORKING_HOURS_SUCCESS, timing, id } }
    function failure(error) { return { type: staffConstants.ADD_WORKING_HOURS_FAILURE, error } }
}

function updateWorkingHours(timing, id) {
    return dispatch => {
        dispatch(request(0));

        staffService.updateWorkingHours(timing, id)
            .then(
                timing => {
                    dispatch(success(timing, id));
                    setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    setTimeout(()=>dispatch(failureTime(0)), 500);
                }
            );
    };

    function request(id) { return { type: staffConstants.STAFF_REQUEST, id } }
    function successTime(id) { return { type: staffConstants.STAFF_SUCCESS_TIME, id } }
    function failureTime(id) { return { type: staffConstants.STAFF_FAILURE_TIME, id } }
    function success(timing, id) { return { type: staffConstants.UPDATE_WORKING_HOURS_SUCCESS, timing, id } }
    function failure(error) { return { type: staffConstants.UPDATE_WORKING_HOURS_FAILURE, error } }
}

function update(params, staffId) {
    return dispatch => {
        dispatch(request(0));

        staffService.update(params, staffId)
            .then(
                staff => {
                    dispatch(success(staff));
                    let profile = store.getState().authentication.user;

                    if(profile.profile.staffId===staff.staffId) {
                        let user = store.getState().authentication.user

                        user.profile.firstName=staff.firstName
                        user.profile.lastName=staff.lastName
                        user.profile.phone=staff.phone

                        dispatch(successUser(user.profile));
                    }

                    setTimeout(()=>dispatch(successTime(0)), 10000);
                    dispatch(staffActions.get());

                },
                error => {
                    try {
                        dispatch(failure(JSON.parse(error)));

                    } catch (e) {
                        dispatch(failure(error.toString()));
                    }
                }
            );
    };
    function request(id) { return { type: staffConstants.UPDATE_REQUEST, id } }
    function successTime(id) { return { type: staffConstants.STAFF_SUCCESS_TIME, id } }
    function success(staff) { return { type: staffConstants.UPDATE_SUCCESS, staff } }
    function successUser(user) { return { type: userConstants.UPDATE_PROFILE_SUCCESS, user } }
    function failure(error) { return { type: staffConstants.UPDATE_FAILURE, error } }
}

function updateAccess(params) {
    return dispatch => {
        dispatch(request());
        staffService.updateAccess(params)
            .then(
                access => {
                    dispatch(success(access));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
    function request() { return { type: staffConstants.UPDATE_ACCESS_REQUEST} }
    function success(access) { return { type: staffConstants.UPDATE_ACCESS_SUCCESS, access } }
    function failure(error) { return { type: staffConstants.UPDATE_ACCESS_FAILURE, error } }
}

function get() {
    return dispatch => {
        dispatch(request())
        staffService.get()
            .then(
                staff => dispatch(success(staff, staff)),
                () => dispatch(failure())
            );
    };

    function request(staff, st) { return { type: staffConstants.GET, staff, st } }
    function success(staff, st) { return { type: staffConstants.GET_SUCCESS, staff, st } }
    function failure() { return { type: staffConstants.GET_FAILURE } }
}

function getAccessList() {
     return { type: staffConstants.GET_ACCESS_LIST_NAMES_SUCCESS }
}

function getAccess() {
    return dispatch => {
        staffService.getAccess()
            .then(
                access => dispatch(success(access)),
            );
    };

    function success(access) { return { type: staffConstants.GET_ACCESS_SUCCESS, access } }
}

function getClosedDates() {
    return dispatch => {
        staffService.getClosedDates()
            .then(
                closedDates => dispatch(success(closedDates)),
            );
    };

    function success(closedDates) { return { type: staffConstants.GET_CLOSED_DATES_SUCCESS, closedDates } }
}

function getTimetable(from, to) {
    return dispatch => {
        dispatch(request());
        staffService.getTimetable(from, to)
            .then(
                timetable => dispatch(success(timetable)),
                () => dispatch(failure())
            );
    };
    function request() { return { type: staffConstants.GET_TIMETABLE_REQUEST} }
    function success(timetable) { return { type: staffConstants.GET_TIMETABLE_SUCCESS, timetable } }
    function failure() { return { type: staffConstants.GET_TIMETABLE_FAILURE } }
}


function getTimetableByStaff(id, from, to) {
    return dispatch => {
        staffService.getTimetableByStaff(id, from, to)
            .then(
                timetableAvailableByStaff => dispatch(success(timetableAvailableByStaff)),
            );
    };

    function success(timetableAvailableByStaff) { return { type: staffConstants.GET_AVAILABLE_TIMETABLE_BY_STAFF_SUCCESS, timetableAvailableByStaff } }
}

function getTimetableStaffs(from, to, isAvailableTimesChecked, isLoading = true) {
    // let a = moment(from).format('x');
    // let b = moment(String(from)).format('x');
    // let c = moment(parseInt(from)).format('dd MM hh:ss');
    let normalViewTimeFrom = moment(parseInt(from)).format('hh:ss');
    if(normalViewTimeFrom==='03:00'){
        from = parseInt(from) - (3600 * 1000 * 3);
        to = parseInt(to) - (3600 * 1000 * 3);
    }
    return dispatch => {
        dispatch(request(isLoading));
        staffService.getTimetableStaffs(from, to)
            .then(
                timetable => dispatch(success(timetable)),
                () => dispatch(failure())
            );
    };
    function request(isLoading) { return { type: staffConstants.GET_AVAILABLE_TIMETABLE_REQUEST, isLoading } }
    function success(timetable) { return { type: staffConstants.GET_AVAILABLE_TIMETABLE_SUCCESS, payload : {timetable, isAvailableTimesChecked } } }
    function failure() { return { type: staffConstants.GET_AVAILABLE_TIMETABLE_FAILURE } }
}

function addClosedDates(params) {
    return dispatch => {
        staffService.addClosedDates(params)
            .then(
                closedDates => {
                    dispatch(success(closedDates));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(closedDates) { return { type: staffConstants.ADD_CLOSED_DATES_SUCCESS, closedDates } }
    function failure(error) { return { type: staffConstants.ADD_CLOSED_DATES_FAILURE, error } }
}

function deleteClosedDates(id) {
    return dispatch => {
        staffService.deleteClosedDates(id)
            .then(
                closedDates => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(id) { return { type: staffConstants.DELETE_CLOSED_DATES_SUCCESS, id } }
    function failure(error) { return { type: staffConstants.DELETE_CLOSED_DATES_FAILURE, error } }
}

function deleteWorkingHours(id, startTime, endTime, from, to) {
    return dispatch => {
        staffService.deleteWorkingHours(id, startTime, endTime)
            .then(
                closedDates => dispatch(staffActions.getTimetable(from, to))
            );
    };

    function success(id, startTime, endTime) { return { type: staffConstants.DELETE_WORKING_HOURS_SUCCESS, id, startTime, endTime } }
    function failure(error) { return { type: staffConstants.DELETE_WORKING_HOURS_FAILURE, error } }
}

function deleteStaff(id) {
    return dispatch => {
        staffService.deleteStaff(id)
            .then(
                closedDates => {dispatch(success(id))
                    dispatch(staffActions.get());

                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(id) { return { type: staffConstants.DELETE_STAFF_SUCCESS, id } }
    function failure(error) { return { type: staffConstants.DELETE_STAFF_FAILURE, error } }
}
