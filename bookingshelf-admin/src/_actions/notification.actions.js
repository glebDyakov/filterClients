import {notificationConstants} from '../_constants';
import {notificationService} from '../_services';

export const notificationActions = {
    getSMS_EMAIL,
    updateSMS_EMAIL,
    updateSubcompanySMS_EMAIL,
    setSMS,
    getClientAmount,
    getHistorySms,
    getBalance
};

function getSMS_EMAIL() {
    return dispatch => {
        notificationService.getSMS_EMAIL()
            .then(
                notification => dispatch(success(notification)),
            );
    };

    function success(notification) { return { type: notificationConstants.GET_SMS_RECORD_SUCCESS, notification } }
}


function getBalance() {
    return dispatch => {
        notificationService.getBalance()
            .then(
                balance => {
                    dispatch(success(balance));
                }
            );
    };

    function success(balance) { return { type: notificationConstants.GET_SMS_EMAIL_BALANCE, balance } }
}

function getHistorySms(currentPage, searchValue) {
    return dispatch => {
        notificationService.getHistorySms(currentPage, searchValue)
            .then(
                history => {
                    dispatch(success(history));
                }
            );
    };

    function success(history) { return { type: notificationConstants.GET_HISTORY_SMS_SUCCESS, history } }
}

function getClientAmount() {
    return dispatch => {
        notificationService.getClientAmount()
            .then(
                info => {
                    dispatch(success(info));
                }
            );
    };

    function success(info) { return { type: notificationConstants.GET_CLIENT_AMOUNT_SUCCESS, info } }
}

function updateSMS_EMAIL(params) {
    return dispatch => {
        notificationService.updateSMS_EMAIL(params)
            .then(
                notification => dispatch(success(notification)),
            );
    };

    function success(notification) { return notification }
}

function updateSubcompanySMS_EMAIL(params, id) {
    return dispatch => {
        notificationService.updateSubcompanySMS_EMAIL(params, id)
            .then(
                notification => dispatch(success(notification)),
            );
    };

    function success(notification) { return notification }
}


function setSMS(params) {

    return dispatch => {
        dispatch(request(0))
        notificationService.setSMS(params)
            .then(
                notification => dispatch(success(notification)),
                setTimeout(()=>dispatch(success_time(0)), 2000),
                dispatch(notificationActions.getBalance())
    );
    };

    function request(notification) { return { type: notificationConstants.SMS_LETTER_REQUEST, notification } }
    function success(notification) { return { type: notificationConstants.SMS_LETTER_SUCCESS, notification } }
    function success_time(notification) { return { type: notificationConstants.SMS_LETTER_SUCCESS_TIME, notification } }
}