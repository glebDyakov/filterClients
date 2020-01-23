import {companyConstants, userConstants} from '../_constants';
import {companyService} from '../_services';
import { alertActions } from './';

export const companyActions = {
    add,
    updateServiceIntervalOn,
    addSubcompany,
    updateSubcompany,
    switchSubcompany,
    get,
    getSubcompanies,
    getBookingInfo,
    getNewAppointments,
    updateBookingInfo,
    getAppointmentsCountMarkerIncrement,
    getMovedAppointmentsCountMarkerIncrement,
    getAppointmentsCountMarkerDecrement,
};

function add(companyInfo) {
    const menu = JSON.parse(localStorage.getItem('user')).menu
    const profile = JSON.parse(localStorage.getItem('user')).profile
    return dispatch => {
        companyService.add(companyInfo)
            .then(
                company => {
                    dispatch(success(companyInfo, menu, profile));
                },
                error => {
                    // dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )

    };

    function success(company, menu, profile) { return { type: userConstants.UPDATE_COMPANY_SUCCESS, company, menu, profile } }
}

function updateServiceIntervalOn(companyInfo) {
    const menu = JSON.parse(localStorage.getItem('user')).menu
    const profile = JSON.parse(localStorage.getItem('user')).profile
    return dispatch => {
        dispatch(request())
        companyService.add(companyInfo)
            .then(
                company => {
                    dispatch(success(companyInfo, menu, profile));
                },
                error => {
                    dispatch(failure(error));
                }
            )

    };

    function request() { return { type: companyConstants.UPDATE_SERVICE_INTERVAL_REQUEST } }
    function success(company, menu, profile) { return { type: companyConstants.UPDATE_SERVICE_INTERVAL_SUCCESS, company, menu, profile } }
    function failure(error) { return { type: companyConstants.UPDATE_SERVICE_INTERVAL_FAILURE, error } }
}

function addSubcompany(companyInfo) {
    return dispatch => {
        companyService.addSubcompany(companyInfo)
            .then(
                company => {
                    dispatch(success(company));
                },
                error => {
                    // dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )

    };

    function success(company, menu, profile) { return { type: companyConstants.ADD_SUBCOMPANY_SUCCESS, company } }
}

function updateSubcompany(companyInfo) {
    return dispatch => {
        companyService.updateSubcompany(companyInfo)
            .then(
                company => {
                    dispatch(success(company));
                },
                error => {
                    // dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )

    };

    function success(company) { return { type: companyConstants.UPDATE_SUBCOMPANY_SUCCESS, company } }
}
function switchSubcompany(companyInfo) {
    const menu = JSON.parse(localStorage.getItem('user')).menu
    const profile = JSON.parse(localStorage.getItem('user')).profile
    return dispatch => {
        companyService.switchSubcompany(companyInfo)
            .then(
                () => {
                    dispatch(success());
                    localStorage.setItem('companyId', companyInfo.companyId)
                    location.reload()
                },
                error => {
                    // dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )

    };

    function success() { return { type: companyConstants.SWITCH_SUBCOMPANY_SUCCESS, company: companyInfo, menu, profile } }
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

function getSubcompanies() {
    return dispatch => {
        companyService.getSubcompanies()
            .then(
                subcompanies => dispatch(success(subcompanies)),
            );
    };

    function success(subcompanies) { return { type: companyConstants.GET_SUBCOMPANIES_SUCCESS, subcompanies } }
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
