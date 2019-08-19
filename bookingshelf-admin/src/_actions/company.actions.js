import {companyConstants, userConstants} from '../_constants';
import {companyService} from '../_services';
import { alertActions } from './';

export const companyActions = {
    add,
    get,
    getBookingInfo,
    getNewAppointments,
    updateBookingInfo,
    getAppointmentsCountMarkerIncrement,
    getMovedAppointmentsCountMarkerIncrement,
    getAppointmentsCountMarkerDecrement,
};

function add(companyInfo, menu, profile) {
    return dispatch => {
        companyService.add(companyInfo)
            .then(
                company => {
                    dispatch(success(companyInfo, menu, profile));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )

    };

    function success(company, menu, profile) { return { type: userConstants.UPDATE_COMPANY_SUCCESS, company, menu, profile } }
}

function get() {
    return dispatch => {
        companyService.get()
            .then(
                settings => dispatch(success(settings)),
            );
    };

    function success(settings) { return { type: companyConstants.GET_COMPANY_SUCCESS, settings } }
}

function getBookingInfo() {
    return dispatch => {
        companyService.getBookingInfo()
            .then(
                booking => dispatch(success(booking)),
            );
    };

    function success(booking) { return { type: companyConstants.GET_BOOKING_SUCCESS, booking } }
}

function getNewAppointments() {
    return dispatch => {
        companyService.getNewAppointments()
            .then(
                count => dispatch(success(count)),
            );
    };

    function success(count) { return { type: companyConstants.GET_NEW_APPOINMENTS_SUCCESS, count } }
}

function getAppointmentsCountMarkerIncrement() {
    return { type: companyConstants.GET_NEW_APPOINMENTS_MARKER_INCR  }
}
function getMovedAppointmentsCountMarkerIncrement() {
    return { type: companyConstants.GET_MOVED_APPOINMENTS_MARKER_INCR  }
}
function getAppointmentsCountMarkerDecrement() {
    return { type: companyConstants.GET_NEW_APPOINMENTS_MARKER_DECR  }
}


function updateBookingInfo(params) {
    return dispatch => {
        companyService.updateBookingInfo(params)
            .then(
                booking => dispatch(success(booking)),
            );
    };

    function success(booking) { return booking }
}
