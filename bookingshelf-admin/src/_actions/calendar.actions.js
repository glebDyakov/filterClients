import {calendarConstants, clientConstants, companyConstants, userConstants} from '../_constants';
import {calendarService, clientService} from '../_services';
import {alertActions, companyActions, staffActions} from './';
import moment from "moment";

export const calendarActions = {
    addAppointment,
    editCalendarAppointment,
    getAppointments,
    setScrollableAppointment,
    getAppointmentsCount,
    getAppointmentsCanceled,
    toggleRefreshAvailableTimes,
    editAppointment,
    editAppointment2,
    editAppointmentTime,
    approveAppointment,
    approveAllAppointment,
    approveMovedAppointment,
    deleteAppointment,
    getReservedTime,
    addReservedTime,
    deleteReservedTime,
    makeVisualMove,
    getAppointmentsNewSocket,
    moveAppointmentsNewSocket,
    updateAppointment,
    updateAppointmentCheckbox,
    updateAppointmentFinish,
    deleteAppointmentsNewSocket
};

function addAppointment(params, serviceId, staffId, clientId, time1, time2, coStaffs) {
    return dispatch => {
        dispatch(request(true));

        calendarService.addAppointment(params, serviceId, staffId, clientId, coStaffs)
            .then(
                appointment => {
                    dispatch(success(appointment, staffId));
                    setTimeout(()=>dispatch(successTime(1)), 500);
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };
    function request(appointment) { return { type: calendarConstants.ADD_APPOINTMENT_REQUEST, appointment, isLoading: false } }
    function success(appointment, staffId) { return { type: calendarConstants.ADD_APPOINTMENT_SUCCESS, appointment, staffId } }
    function successTime(id) { return { type: calendarConstants.ADD_APPOINTMENT_SUCCESS_TIME, id } }
    function failure(error) { return { type: calendarConstants.ADD_APPOINTMENT_FAILURE, error } }
}

function makeVisualMove(movingVisit, movingVisitStaffId, movingVisitMillis, coStaffs) {
    return dispatch => {
        dispatch(success());

        function success() { return { type: calendarConstants.MAKE_VISUAL_MOVE, movingVisit, movingVisitStaffId, movingVisitMillis, coStaffs } }
    }
}

function editCalendarAppointment(params, mainAppointmentId, staffId, clientId, withoutNotify) {
    return dispatch => {
        dispatch(request());

        calendarService.editCalendarAppointment(params, mainAppointmentId, staffId, clientId, withoutNotify)
            .then(
                appointment => {
                    dispatch(success());
                    dispatch(successTime(1))
                    //dispatch(staffActions.getTimetableStaffs(time1, time2));
                    // dispatch(getAppointments(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
                    // dispatch(getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')))
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
    function request(appointment) { return { type: calendarConstants.EDIT_CALENDAR_APPOINTMENT_REQUEST } }
    function success(appointment, staffId) { return { type: calendarConstants.EDIT_CALENDAR_APPOINTMENT_SUCCESS, appointment, staffId } }
    function successTime(id) { return { type: calendarConstants.ADD_APPOINTMENT_SUCCESS_TIME, id } }
    function failure(error) { return { type: calendarConstants.EDIT_CALENDAR_APPOINTMENT_FAILURE, error } }
}


function setScrollableAppointment(id) {
    return dispatch => {
        dispatch(success(id));
    };

    function success(id) { return { type: calendarConstants.SET_SCROLLABLE_APPOINTMENT, id } }
}

function addReservedTime(params, staffId) {
    return dispatch => {
        dispatch(request(true));

        calendarService.addReservedTime(params, staffId)
            .then(
                reservedTime => {
                    dispatch(success(reservedTime, staffId));
                    // dispatch(staffActions.getTimetableStaffs(time1, time2));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(reservedTime) { return { type: calendarConstants.ADD_RESERVED_TIME_REQUEST, reservedTime } }
    function success(reservedTime, staffId) { return { type: calendarConstants.ADD_RESERVED_TIME_SUCCESS, reservedTime, staffId } }
    function failure(error) { return { type: calendarConstants.ADD_RESERVED_TIME_FAILURE, error } }
}

function editAppointment(params) {
    return dispatch => {
        calendarService.editAppointment(params)
            .then(
                appointment => {
                    dispatch(success(appointment));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(appointment) { return { type: calendarConstants.EDIT_APPOINTMENT_SUCCESS, appointment } }
    function failure(error) { return { type: calendarConstants.EDIT_APPOINTMENT_FAILURE, error } }
}

function editAppointment2(params, id,) {
    return dispatch => {
        dispatch(request());
        calendarService.editAppointment2(params, id)
            .then(
                appointment => {
                    dispatch(success(appointment));
                    setTimeout(()=>dispatch(successTime(1)), 100)
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: calendarConstants.EDIT_APPOINTMENT_2_REQUEST, } }
    function success(appointment) { return { type: calendarConstants.EDIT_APPOINTMENT_2_SUCCESS, appointment } }
    function successTime(id) { return { type: calendarConstants.ADD_RESERVED_TIME_SUCCESS_TIME, id } }
    function failure(error) { return { type: calendarConstants.EDIT_APPOINTMENT_2_FAILURE, error } }
}

function updateAppointment(id, params, withoutNotify, isAppointmentUpdated) {
    return dispatch => {
        dispatch(request());
        calendarService.updateAppointment(id, params, withoutNotify)
            .then(
                appointment => {
                    dispatch(success());
                    //dispatch(companyActions.getNewAppointments())

                    dispatch(clearVisualVisit())
                },
                error => {
                    dispatch(failure(error));
                    dispatch(returnVisualVisit())
                    // dispatch(alertActions.error(error.toString()));
                }
            );
    };
    function request() { return { type: calendarConstants.UPDATE_APPOINTMENT } }

    function success() { return { type: calendarConstants.UPDATE_APPOINTMENT_SUCCESS, isAppointmentUpdated } }
    function failure(error) { return { type: calendarConstants.UPDATE_APPOINTMENT_FAILURE, error } }
    function returnVisualVisit() { return { type: calendarConstants.CANCEL_VISUAL_MOVE } }
    function clearVisualVisit() { return { type: calendarConstants.CLEAR_VISUAL_MOVE } }
}

function updateAppointmentCheckbox(id, params, withoutNotify) {
    return dispatch => {
        dispatch(request());
        calendarService.updateAppointment(id, params, withoutNotify)
            .then(
                appointment => {
                    dispatch(success(appointment));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };
    function request() { return { type: calendarConstants.UPDATE_APPOINTMENT_CHECKBOX } }
    function success(appointment) { return { type: calendarConstants.UPDATE_APPOINTMENT_CHECKBOX_SUCCESS, appointment } }
    function failure(error) { return { type: calendarConstants.UPDATE_APPOINTMENT_CHECKBOX_FAILURE, error } }
}

function updateAppointmentFinish(id, params) {
    return dispatch => {
        dispatch(success());
    };

    function success() { return { type: calendarConstants.UPDATE_APPOINTMENT_SUCCESS, isAppointmentUpdated: false } }
    // function failure(error) { return { type: calendarConstants.EDIT_APPOINTMENT_FAILURE, error } }
}

function editAppointmentTime(params, time1, time2) {
    return dispatch => {
        calendarService.editAppointment(params)
            .then(
                appointment => {
                    dispatch(success(appointment));
                    // dispatch(staffActions.getTimetableStaffs(time1, time2));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(appointment) {return { type: calendarConstants.EDIT_APPOINTMENT_SUCCESS, appointment } }
    function failure(error) { return { type: calendarConstants.EDIT_APPOINTMENT_FAILURE, error } }
}

function getAppointments(dateFrom, dateTo, isLoading = true) {

    let normalViewTime = moment(parseInt(dateFrom)).format('hh:ss');
    if(normalViewTime==='03:00'){
        dateFrom = parseInt(dateFrom) - (3600 * 1000 * 3);
    }

    return dispatch => {
        dispatch(request(isLoading));
        calendarService.getAppointments(dateFrom, dateTo)
            .then(
                appointments => dispatch(success(appointments)),
                () => dispatch(failure())
            );
    };
    function request(isLoading) { return { type: calendarConstants.GET_APPOINTMENT_REQUEST, isLoading } }
    function success(appointments) { return { type: calendarConstants.GET_APPOINTMENT_SUCCESS, appointments } }
    function failure() { return { type: calendarConstants.GET_APPOINTMENT_FAILURE } }
}
function getAppointmentsNewSocket(payload) {
    return { type: calendarConstants.GET_APPOINTMENT_NEW_SOCKET, payload }
}
function moveAppointmentsNewSocket(payload) {
    return { type: calendarConstants.MOVE_APPOINTMENT_NEW_SOCKET, payload }
}
function deleteAppointmentsNewSocket(payload) {
    return { type: calendarConstants.DELETE_APPOINTMENT_NEW_SOCKET, payload }
}

function toggleRefreshAvailableTimes(refreshAvailableTimes) {
    return { type: calendarConstants.TOGGLE_REFRESH_AVAILABLE_TIMES, refreshAvailableTimes }
}
function getAppointmentsCount(dateFrom, dateTo) {
    return dispatch => {
        dispatch(request());
        calendarService.getAppointmentsV1(dateFrom, dateTo)
            .then(
                appointments => dispatch(success(appointments)),
                () => dispatch(failure())
            );
    };
    function request() { return { type: calendarConstants.GET_APPOINTMENT_REQUEST_COUNT} }
    function success(appointments) { return { type: calendarConstants.GET_APPOINTMENT_SUCCESS_COUNT, appointments } }
    function failure() { return { type: calendarConstants.GET_APPOINTMENT_FAILURE_COUNT } }
}


function getAppointmentsCanceled(dateFrom, dateTo) {


    return dispatch => {
        dispatch(request());
        calendarService.getAppointmentsCanceled(dateFrom, dateTo, JSON.parse(localStorage.getItem('user')).profile.staffId)
            .then(
                appointments => dispatch(success(appointments)),
                () => dispatch(failure())
            );
    };
    function request() { return { type: calendarConstants.GET_APPOINTMENT_REQUEST__CANCELED} }
    function success(appointments) { return { type: calendarConstants.GET_APPOINTMENT_SUCCESS_CANCELED, appointments } }
    function failure() { return { type: calendarConstants.GET_APPOINTMENT_FAILURE__CANCELED } }
}

function getReservedTime(dateFrom, dateTo) {

    let normalViewTime = moment(parseInt(dateFrom)).format('hh:ss');
    if(normalViewTime==='03:00'){
        dateFrom = parseInt(dateFrom) - (3600 * 1000 * 3);
    }

    return dispatch => {
        dispatch(request());
        calendarService.getReservedTime(dateFrom, dateTo)
            .then(
                reservedTime => dispatch(success(reservedTime)),
                () => dispatch(failure())
            );
    };
    function request() { return { type: calendarConstants.GET_RESERVED_TIME_REQUEST } }
    function success(reservedTime) { return { type: calendarConstants.GET_RESERVED_TIME_SUCCESS, reservedTime } }
    function failure() { return { type: calendarConstants.GET_RESERVED_TIME_FAILURE} }
}

function deleteAppointment(appointment, withoutNotify) {
    return dispatch => {
        dispatch(makeVisualDeleting())
        // dispatch(request())
        calendarService.deleteAppointment(appointment.appointmentId, withoutNotify)
            .then(
                () => {
                    dispatch(success())
                    dispatch(clearVisualDeleting())
                },
                error => {
                    dispatch(cancelVisualDeleting())
                    dispatch(failure(error))
                }
            );
    };

    function request() { return { type: calendarConstants.DELETE_APPOINTMENT } }
    function success() { return { type: calendarConstants.DELETE_APPOINTMENT_SUCCESS } }
    function failure(error) { return { type: calendarConstants.DELETE_APPOINTMENT_FAILURE, error } }
    function makeVisualDeleting(error) { return { type: calendarConstants.MAKE_VISUAL_DELETING, appointment } }
    function cancelVisualDeleting(error) { return { type: calendarConstants.CANCEL_VISUAL_DELETING, appointment } }
    function clearVisualDeleting(error) { return { type: calendarConstants.CLEAR_VISUAL_DELETING, appointment } }
}

function deleteReservedTime(id, reservedTimeId) {
    return dispatch => {
        calendarService.deleteReservedTime(id, reservedTimeId)
            .then(
                () => {
                    dispatch(success(reservedTimeId))
                    // dispatch(staffActions.getTimetableStaffs(time1, time2));
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(reservedTimeId) { return { type: calendarConstants.DELETE_RESERVED_TIME_SUCCESS, reservedTimeId } }
    function failure(error) { return { type: calendarConstants.DELETE_RESERVED_TIME_FAILURE, error } }
}

function approveAppointment(id, params) {
    return dispatch => {
        calendarService.approveAppointment(id, params)
            .then(
                client => {
                    dispatch(success(id))
                    dispatch(companyActions.getNewAppointments())

                    dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));

                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(id) { return { type: calendarConstants.APPROVE_APPOINTMENT_SUCCESS, id } }
    function failure(error) { return { type: calendarConstants.APPROVE_APPOINTMENT_FAILURE, error } }
}
function approveAllAppointment(approved, canceled, params) {
    return dispatch => {
        calendarService.approveAllAppointment(approved, canceled, params)
            .then(
                () => {
                    dispatch(companyActions.getNewAppointments())
                    dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
                    dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));

                },
            )
    };
}

function approveMovedAppointment(params) {
    return dispatch => {
        calendarService.approveMovedAppointment(params)
            .then(
                () => {
                    dispatch(companyActions.getNewAppointments())
                    dispatch(calendarActions.getAppointmentsCount(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));
                    dispatch(calendarActions.getAppointmentsCanceled(moment().startOf('day').format('x'), moment().add(7, 'month').endOf('month').format('x')));

                },
            )
    };
}
