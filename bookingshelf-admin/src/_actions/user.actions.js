import {clientConstants, menuConstants, userConstants} from '../_constants';
import {clientService, companyService, userService} from '../_services';
import {alertActions, companyActions, socketActions, staffActions} from './';
import {clearStorage, history} from '../_helpers';
import {staffConstants} from "../_constants/staff.constants";
import {func} from "prop-types";

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
    clearErrors,
    activateStaff,
    updateTheme
};

function login(login, password) {
    return dispatch => {
        dispatch(request({login}));

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

    function request(user) {
        return {type: userConstants.LOGIN_REQUEST, payload: {user}}
    }

    function success(user) {
        return {type: userConstants.LOGIN_SUCCESS, payload: {user}}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, payload: {error}}
    }
}

function updateTheme(user, isLightTheme) {
    return dispatch => {
        companyService.updateCompany({
            ...user,
            lightTheme: isLightTheme
        })
            .then(
                result => {
                    localStorage.setItem('isLightTheme', result.lightTheme);
                    dispatch(success(result));
                },
                error => {

                })
    };

    function success(user) {
        return {type: userConstants.CHANGE_THEME_SUCCESS, payload: {user}}
    }

    function failture(error) {
        return {type: userConstants.CHANGE_THEME_FAILTURE, payload: {error}}
    }
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
                        clearStorage()
                        history.push('/login');
                        dispatch(failure(error || 'error'));
                        dispatch(alertActions.error(error || 'error'));
                    }
                );
        } else {

            dispatch(failure());
        }
    };

    function success(user) {
        return {type: userConstants.CHECK_LOGIN_SUCCESS, payload: {user, loginChecked: true}}
    }

    function failure(error) {
        return {type: userConstants.CHECK_LOGIN_FAILURE, payload: {error, loginChecked: true}}
    }
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

    function success(user) {
        return {type: userConstants.LOGIN_SUCCESS, payload: {user}}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, payload: {error}}
    }
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

    function success(user) {
        return {type: userConstants.LOGIN_SUCCESS, user}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
}


function updateProfile(userProfile) {
    return dispatch => {
        dispatch(request(0));

        userService.updateProfile(userProfile)
            .then(
                user => {
                    dispatch(companyActions.getSubcompanies());
                    dispatch(success(userProfile, user));
                    dispatch(successUser({
                        staffId: user.staffId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        imageBase64: user.imageBase64
                    }));
                    dispatch(successTime(0))
                },
                error => {
                    dispatch(failure(error));

                }
            );
    };

    function request(id) {
        return {type: userConstants.UPDATE_PROFILE_REQUEST, id}
    }

    function successTime(id) {
        return {type: userConstants.UPDATE_PROFILE_SUCCESS_TIME, id}
    }

    function success(user, error) {
        return {type: userConstants.UPDATE_PROFILE_SUCCESS, user, error}
    }

    function successUser(staff) {
        return {type: staffConstants.UPDATE_USER_SUCCESS, staff}
    }

    function failure(error) {
        return {type: userConstants.UPDATE_PROFILE_FAILURE, error}
    }
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

    function request(email) {
        return {type: userConstants.FORGOT_PASS_REQUEST, email}
    }

    function success(email) {
        return {type: userConstants.FORGOT_PASS_SUCCESS, email}
    }

    function failure(error) {
        return {type: userConstants.FORGOT_PASS_FAILURE, error}
    }

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

    function hideMenu() {
        return {type: userConstants.HIDE_MENU}
    }

    function success() {
        return {type: userConstants.LOGOUT}
    }
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

    function request() {
        return {type: userConstants.REGISTER_REQUEST}
    }

    function success() {
        return {type: userConstants.REGISTER_SUCCESS}
    }

    function failure(error) {
        return {type: userConstants.REGISTER_FAILURE, error}
    }
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

    function request() {
        return {type: userConstants.GETALL_REQUEST}
    }

    function success(users) {
        return {type: userConstants.GETALL_SUCCESS, users}
    }

    function failure(error) {
        return {type: userConstants.GETALL_FAILURE, error}
    }
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

    function request(id) {
        return {type: userConstants.DELETE_REQUEST, id}
    }

    function success(id) {
        return {type: userConstants.DELETE_SUCCESS, id}
    }

    function failure(id, error) {
        return {type: userConstants.DELETE_FAILURE, id, error}
    }
}


function clearErrors() {
    return dispatch => {
        dispatch(clearErrors());
    };

    function clearErrors() {
        return {type: userConstants.CLEAR_ERRORS}
    }
}