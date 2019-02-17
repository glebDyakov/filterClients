import {clientConstants} from '../_constants';
import {clientService} from '../_services';
import { alertActions } from './';

export const clientActions = {
    addClient,
    updateClient,
    getClient,
    deleteClient,
    getClientWithInfo
};

function addClient(params) {
    return dispatch => {
        dispatch(request(0));
        clientService.addClient(params)
            .then(
                client => {
                    dispatch(success(client));
                    setTimeout(()=>dispatch(successTime(0)), 3000);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: clientConstants.CLIENT_REQUEST, id } }
    function success(client) { return { type: clientConstants.ADD_CLIENT_SUCCESS, client } }
    function successTime(client) { return { type: clientConstants.CLIENT_SUCCESS_TIME, client } }
    function failure(error) { return { type: clientConstants.ADD_CLIENT_FAILURE, error } }
}

function updateClient(params) {
    return dispatch => {
        dispatch(request(0));

        clientService.updateClient(params)
            .then(
                client => {
                    dispatch(success(client));
                    setTimeout(()=>dispatch(successTime(client)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: clientConstants.CLIENT_REQUEST, id } }
    function success(client) { return { type: clientConstants.UPDATE_CLIENT_SUCCESS, client } }
    function successTime(client) { return { type: clientConstants.CLIENT_SUCCESS_TIME, client } }
    function failure(error) { return { type: clientConstants.UPDATE_CLIENT_FAILURE, error } }
}

function getClient() {
    return dispatch => {
        clientService.getClient()
            .then(
                client => dispatch(success(client)),
            );
    };

    function success(client) { return { type: clientConstants.GET_CLIENT_SUCCESS, client } }
}

function getClientWithInfo() {
    return dispatch => {
        clientService.getClientWithInfo()
            .then(
                client => dispatch(success(client)),
            );
    };

    function success(client) { return { type: clientConstants.GET_CLIENT_SUCCESS, client } }
}

function deleteClient(clientId) {
    return dispatch => {
        clientService.deleteClient(clientId)
            .then(
                client => dispatch(success(clientId)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(clientId) { return { type: clientConstants.DELETE_CLIENT_SUCCESS, clientId } }
    function failure(error) { return { type: clientConstants.DELETE_CLIENT_FAILURE, error } }
}