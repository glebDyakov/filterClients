import {companyConstants, userConstants} from '../_constants';
import {companyService} from '../_services';
import { alertActions } from './';

export const companyActions = {
    add,
    updateCompanySettings,
    addSubcompany,
    updateSaved,
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
    changeTheme
};

function add(companyInfo) {
    const menu = JSON.parse(localStorage.getItem('user')).menu
    const profile = JSON.parse(localStorage.getItem('user')).profile
    return dispatch => {
        companyService.add(companyInfo)
            .then(
                company => {
                    const localStorageUser = JSON.parse(localStorage.getItem('user'))
                    dispatch(success({...localStorageUser, ...companyInfo }, menu, profile));
                },
                error => {
                    // dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )

    };

    function success(company, menu, profile) { return { type: userConstants.UPDATE_COMPANY_SUCCESS, company, menu, profile } }
}

function changeTheme(isLightTheme) {
    return {type: companyConstants.CHANGE_THEME, isLightTheme};
}

function updateSaved(saved) {
    return dispatch => {
        dispatch(success())
    };
    function success() { return { type: companyConstants.UPDATE_SAVED, saved } }
}

function updateCompanySettings(companyInfo, loadingKey, saved) {
    const menu = JSON.parse(localStorage.getItem('user')).menu
    const profile = JSON.parse(localStorage.getItem('user')).profile
    return dispatch => {
        dispatch(request())
        companyService.add(companyInfo)
            .then(
                company => {
                    dispatch(success(companyInfo, menu, profile, saved));
                },
                error => {
                    dispatch(failure(error));
                }
            )

    };

    function request() { return { type: companyConstants.UPDATE_COMPANY_SETTINGS_REQUEST, loadingKey } }
    function success(company, menu, profile) { return { type: companyConstants.UPDATE_COMPANY_SETTINGS_SUCCESS, company, menu, profile, loadingKey, saved } }
    function failure(error) { return { type: companyConstants.UPDATE_COMPANY_SETTINGS_FAILURE, error, loadingKey } }
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
                    dispatch(companyActions.get());
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
        dispatch(request())
        companyService.getBookingInfo()
            .then(
                booking => dispatch(success(booking)),
                error => dispatch(failure(error))
            );
    };


    function request() { return { type: companyConstants.GET_BOOKING_REQUEST } }
    function success(booking) { return { type: companyConstants.GET_BOOKING_SUCCESS, booking } }
    function failure(error) { return { type: companyConstants.GET_BOOKING_FAILURE, error } }
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


function updateBookingInfo(params, isBookingInfoLoading) {
    return dispatch => {
        dispatch(request())
        companyService.updateBookingInfo(params)
            .then(
                booking => dispatch(success(booking)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: companyConstants.UPDATE_BOOKING_INFO_REQUEST, isBookingInfoLoading } }
    function success(booking) { return { type: companyConstants.UPDATE_BOOKING_INFO_SUCCESS, booking } }
    function failure(error) { return { type: companyConstants.UPDATE_BOOKING_INFO_FAILURE, error } }
}
