import {clientConstants, menuConstants, userConstants} from '../_constants';
import {clientService, userService} from '../_services';
import {alertActions, socketActions, staffActions} from './';
import { history } from '../_helpers';
import moment from "moment";

export const userActions = {
    login,
    checkLogin,
    logout,
    register,
    getAll,
    forgotPass,
    delete: _delete,
    updateProfile,
    activate,
    activateStaff
};

function login(login, password) {
    return dispatch => {
        dispatch(request({ login }));

        userService.login(login, password)
            .then(
                user => {
                    localStorage.removeItem('companyId');
                    dispatch(success(user));
                    history.push('/calendar');
                },
                error => {

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, payload: {user} } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, payload: {user} } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, payload: {error} } }
}

function checkLogin(localStorageUser) {
    return dispatch => {
        if (localStorageUser) {
            userService.checkLogin()
                .then(
                    (user) => {
                        dispatch(success(user));
                    },
                    error => {

                        dispatch(failure(error || 'error'));
                        dispatch(alertActions.error(error || 'error'));
                    }
                );
        } else {

            dispatch(failure());
        }
    };

    function success(user) { return { type: userConstants.CHECK_LOGIN_SUCCESS, payload: {user, loginChecked: true} } }
    function failure(error) { return { type: userConstants.CHECK_LOGIN_FAILURE, payload: {error, loginChecked: true} } }
}


function activate(id) {
    return dispatch => {
        userService.logout()
        userService.activate(id)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/calendar');
                },
                error => {

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(user) { return { type: userConstants.LOGIN_SUCCESS, payload: {user} } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, payload: {error} } }
}

function activateStaff(id) {
    localStorage.removeItem('user');
    localStorage.removeItem('menu');
    localStorage.clear();
    return dispatch => {
        userService.activateStaff(id)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/calendar');
                },
                error => {

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function updateProfile(userProfile) {
    return dispatch => {
        dispatch(request(0));

        userService.updateProfile(userProfile)
            .then(
                user => {
                    dispatch(success(JSON.parse(userProfile), user));
                    dispatch(staffActions.get());
                    dispatch(staffActions.getTimetable(moment().startOf('day').format('x'), moment().add('7').endOf('day').format('x')));
                    setTimeout(()=>dispatch(successTime(0)), 3000);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    setTimeout(()=>dispatch(successTime(0)), 3000);

                }
            );
    };

    function request(id) { return { type: userConstants.UPDATE_PROFILE_REQUEST, id } }
    function successTime(id) { return { type: userConstants.UPDATE_PROFILE_SUCCESS_TIME, id } }

    function success(user, error) { return { type: userConstants.UPDATE_PROFILE_SUCCESS, user, error } }
    function failure(error) { return { type: userConstants.UPDATE_PROFILE_FAILURE, error } }
}

function forgotPass(emailReset) {

    return dispatch => {
        dispatch(request(emailReset));

        userService.forgotPass(emailReset)
            .then(
                email => dispatch(success(emailReset.email)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(email) { return { type: userConstants.FORGOT_PASS_REQUEST, email } }
    function success(email) { return { type: userConstants.FORGOT_PASS_SUCCESS, email } }
    function failure(error) { return { type: userConstants.FORGOT_PASS_FAILURE, error } }

}

function logout() {
    return dispatch => {
        dispatch(hideMenu())
        dispatch(socketActions.alertSocketMessage(null))
        userService.logout()
            .then(() => {
                dispatch(success())
            });
    }
    function hideMenu() { return { type: userConstants.HIDE_MENU } }
    function success() { return { type: userConstants.LOGOUT } }
}

function register(user) {
    return dispatch => {
        dispatch(request());

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.REGISTER_REQUEST } }
    function success() { return { type: userConstants.REGISTER_SUCCESS } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}