import {calendarConstants, clientConstants, userConstants} from '../_constants';
import {calendarService, clientService} from '../_services';
import {alertActions, companyActions, staffActions} from './';
import moment from "moment";

export const calendarActions = {
    addAppointment,
    getAppointments,
    getAppointmentsCount,
    editAppointment,
    editAppointmentTime,
    approveAppointment,
    deleteAppointment,
    getReservedTime,
    addReservedTime,
    deleteReservedTime
};

function addAppointment(params, serviceId, staffId, clientId, time1, time2) {
    return dispatch => {
        dispatch(request(true));


        calendarService.addAppointment(params, serviceId, staffId, clientId)
            .then(
                appointment => {
                    dispatch(success(appointment, staffId));
                    setTimeout(()=>dispatch(successTime(1)), 500)
                    dispatch(staffActions.getTimetableStaffs(time1, time2));
                    dispatch(getAppointmentsCount(moment().startOf('day').format('x'), moment().add(1, 'month').endOf('month').format('x')));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
    function request(appointment) { return { type: calendarConstants.ADD_APPOINTMENT_REQUEST, appointment } }
    function success(appointment, staffId) { return { type: calendarConstants.ADD_APPOINTMENT_SUCCESS, appointment, staffId } }
    function successTime(id) { return { type: calendarConstants.ADD_APPOINTMENT_SUCCESS_TIME, id } }
    function failure(error) { return { type: calendarConstants.ADD_APPOINTMENT_FAILURE, error } }
}

function addReservedTime(params, staffId) {
    return dispatch => {
        dispatch(request(true));

        calendarService.addReservedTime(params, staffId)
            .then(
                reservedTime => {
                    dispatch(success(reservedTime, staffId));
                    setTimeout(()=>dispatch(successTime(1)), 100)

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(reservedTime) { return { type: calendarConstants.ADD_RESERVED_TIME_REQUEST, reservedTime } }
    function success(reservedTime, staffId) { return { type: calendarConstants.ADD_RESERVED_TIME_SUCCESS, reservedTime, staffId } }
    function successTime(id) { return { type: calendarConstants.ADD_RESERVED_TIME_SUCCESS_TIME, id } }
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

function editAppointmentTime(params, time1, time2) {
    return dispatch => {
        calendarService.editAppointment(params)
            .then(
                appointment => {
                    dispatch(success(appointment));
                    dispatch(staffActions.getTimetableStaffs(time1, time2));
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

function getAppointments(dateFrom, dateTo) {
    return dispatch => {
        calendarService.getAppointments(dateFrom, dateTo)
            .then(
                appointments => dispatch(success(appointments)),
            );
    };

    function success(appointments) { return { type: calendarConstants.GET_APPOINTMENT_SUCCESS, appointments } }
}


function getAppointmentsCount(dateFrom, dateTo) {
    return dispatch => {
        calendarService.getAppointments(dateFrom, dateTo)
            .then(
                appointments => dispatch(success(appointments)),
            );
    };

    function success(appointments) { return { type: calendarConstants.GET_APPOINTMENT_SUCCESS_COUNT, appointments } }
}

function getReservedTime(dateFrom, dateTo) {
    return dispatch => {
        calendarService.getReservedTime(dateFrom, dateTo)
            .then(
                reservedTime => dispatch(success(reservedTime)),
            );
    };

    function success(reservedTime) { return { type: calendarConstants.GET_RESERVED_TIME_SUCCESS, reservedTime } }
}

function deleteAppointment(id, time1, time2) {
    return dispatch => {
        calendarService.deleteAppointment(id)
            .then(
                client => {
                    dispatch(success(id))
                    dispatch(staffActions.getTimetableStaffs(time1, time2));

                },

                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(id) { return { type: calendarConstants.DELETE_APPOINTMENT_SUCCESS, id } }
    function failure(error) { return { type: calendarConstants.DELETE_APPOINTMENT_FAILURE, error } }
}

function deleteReservedTime(id, reservedTimeId, time1, time2) {
    return dispatch => {
        calendarService.deleteReservedTime(id, reservedTimeId)
            .then(
                client => {dispatch(success(reservedTimeId))
                    dispatch(staffActions.getTimetableStaffs(time1, time2));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(reservedTimeId) { return { type: calendarConstants.DELETE_RESERVED_TIME_SUCCESS, reservedTimeId } }
    function failure(error) { return { type: calendarConstants.DELETE_RESERVED_TIME_FAILURE, error } }
}

function approveAppointment(id) {
    return dispatch => {
        calendarService.approveAppointment(id)
            .then(
                client => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            )
            .then(dispatch(companyActions.getNewAppointments()));
    };

    function success(id) { return { type: calendarConstants.APPROVE_APPOINTMENT_SUCCESS, id } }
    function failure(error) { return { type: calendarConstants.APPROVE_APPOINTMENT_FAILURE, error } }
}