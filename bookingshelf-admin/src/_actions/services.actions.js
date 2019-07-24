import {clientConstants, servicesConstants} from '../_constants';
import {servicesService} from '../_services';
import { alertActions } from './';

export const servicesActions = {
    add,
    update,
    get,
    _delete,
    getService,
    getServiceList,
    addService,
    updateService,
    deleteService,
    getServices
};

function get() {
    return dispatch => {
        servicesService.get()
            .then(
                services => dispatch(success(services)),
            );
    };

    function success(services) { return { type: servicesConstants.GET_GROUP_SUCCESS, services } }
}

function getServices() {
    return dispatch => {
        servicesService.getServices()
            .then(
                servicesList => dispatch(success(servicesList)),
            );
    };

    function success(servicesList) { return { type: servicesConstants.GET_SERVICES_SUCCESS, servicesList } }
}

function add(params) {
    return dispatch => {
        dispatch(request(0));

        servicesService.add(params)
            .then(
                services => {
                    dispatch(success(services));
                    setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: servicesConstants.SERVICE_REQUEST, id } }
    function successTime(id) { return { type: servicesConstants.GROUP_SUCCESS_TIME, id } }
    function success(services) { return { type: servicesConstants.ADD_GROUP_SUCCESS, services } }
    function failure(error) { return { type: servicesConstants.ADD_GROUP_FAILURE, error } }
}

function update(params) {
    return dispatch => {
        dispatch(request(0));

        servicesService.update(params)
            .then(
                services => {

                    dispatch(success(services));
                    setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: servicesConstants.SERVICE_REQUEST, id } }
    function successTime(id) { return { type: servicesConstants.GROUP_SUCCESS_TIME, id } }
    function success(services) { return { type: servicesConstants.UPDATE_GROUP_SUCCESS, services } }
    function failure(error) { return { type: servicesConstants.UPDATE_GROUP_FAILURE, error } }
}

function _delete(serviceId) {
    return dispatch => {
        servicesService._delete(serviceId)
            .then(
                services => dispatch(success(serviceId)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(serviceId) { return { type: servicesConstants.DELETE_GROUP_SUCCESS, serviceId } }
    function failure(error) { return { type: servicesConstants.DELETE_GROUP_FAILURE, error } }
}

function getServiceList(idGroup) {
    return dispatch => {
        servicesService.getServiceList(idGroup)
            .then(
                servicesFromGroup => dispatch(success(servicesFromGroup, idGroup)),
            );
    };

    function success(servicesFromGroup, idGroup) { return { type: servicesConstants.GET_SERVICE_LIST_SUCCESS, servicesFromGroup, idGroup } }
}

function getService(idGroup, idService) {
    return servicesService.get(idGroup, idService)

    // function success(servicesFromGroup, idGroup, idService) { return { type: servicesConstants.GET_SERVICE_SUCCESS, servicesFromGroup, idGroup, idService } }
}

function addService(params, serviceId) {
    return dispatch => {
        dispatch(request(0));

        servicesService.addService(params, serviceId)
            .then(
                servicesFromGroup => {
                    dispatch(success(servicesFromGroup, serviceId));
                    setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: servicesConstants.SERVICE_REQUEST, id } }
    function successTime(id) { return { type: servicesConstants.SERVICE_SUCCESS_TIME, id } }
    function success(servicesFromGroup, serviceId) { return { type: servicesConstants.ADD_SERVICE_SUCCESS, servicesFromGroup, serviceId } }
    function failure(error) { return { type: servicesConstants.ADD_SERVICE_FAILURE, error } }
}

function updateService(params, serviceId) {
    return dispatch => {
        dispatch(request(0));

        servicesService.updateService(params, serviceId)
            .then(
                servicesFromGroup => {
                    dispatch(success(servicesFromGroup, serviceId));
                    setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: servicesConstants.SERVICE_REQUEST, id } }
    function successTime(id) { return { type: servicesConstants.SERVICE_SUCCESS_TIME, id } }
    function success(servicesFromGroup, serviceId) { return { type: servicesConstants.UPDATE_SERVICE_SUCCESS, servicesFromGroup, serviceId } }
    function failure(error) { return { type: servicesConstants.UPDATE_SERVICE_FAILURE, error } }
}

function deleteService(serviceGroupId, serviceId) {
    return dispatch => {
        servicesService.deleteService(serviceGroupId, serviceId)
            .then(
                servicesFromGroup => dispatch(success(serviceId, serviceGroupId)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(serviceId, serviceGroupId) { return { type: servicesConstants.DELETE_SERVICE_SUCCESS, serviceId, serviceGroupId } }
    function failure(error) { return { type: servicesConstants.DELETE_SERVICE_FAILURE, error } }
}
