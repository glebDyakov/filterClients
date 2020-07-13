import {clientConstants, servicesConstants} from '../_constants';
import {servicesService} from '../_services';
import { alertActions } from './';

export const servicesActions = {
    add,
    update,
    updateServiceGroups,
    updateServices,
    get,
    _delete,
    getService,
    getServiceList,
    addService,
    updateService,
    deleteService,
    getServices,
    createServiceProducts,
    getServiceProducts,
    updateServiceProduct,
    deleteServiceProduct
};

function get() {
    return dispatch => {
        dispatch(request());
        servicesService.get()
            .then(
                services => dispatch(success(services)),
                err => dispatch(failure(err))
            );
    };

    function request() { return { type: servicesConstants.GET_GROUP } }
    function success(services) { return { type: servicesConstants.GET_GROUP_SUCCESS, services } }
    function failure(err) { return { type: servicesConstants.GET_GROUP_FAILURE, err } }
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

function updateServiceGroups(params) {
    return dispatch => {
        dispatch(request(0));

        servicesService.updateServiceGroups(params)
            .then(
                services => {

                    dispatch(success(services));

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: servicesConstants.UPDATE_SERVICE_GROUPS_REQUEST, id } }
    function success(services) { return { type: servicesConstants.UPDATE_SERVICE_GROUPS_SUCCESS, services } }
    function failure(error) { return { type: servicesConstants.UPDATE_SERVICE_GROUPS_FAILURE, error } }
}

function updateServices(params) {
    return dispatch => {
        dispatch(request(0));

        servicesService.updateServices(params)
            .then(
                services => {

                    dispatch(success(services));

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: servicesConstants.UPDATE_SERVICES_REQUEST, id } }
    function success(services) { return { type: servicesConstants.UPDATE_SERVICES_SUCCESS, services } }
    function failure(error) { return { type: servicesConstants.UPDATE_SERVICES_FAILURE, error } }
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
                    dispatch(createServiceProducts(params.serviceProducts.map(item => ({...item, serviceId: servicesFromGroup.serviceId }))))
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

function createServiceProducts(params) {
    return dispatch => {
        dispatch(request());

        servicesService.createServiceProducts(params)
            .then(
                serviceProducts => {
                    dispatch(success(serviceProducts));
                    // setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: servicesConstants.CREATE_SERVICE_PRODUCTS_REQUEST } }
    // function successTime(id) { return { type: servicesConstants.SERVICE_SUCCESS_TIME, id } }
    function success(serviceProducts) { return { type: servicesConstants.CREATE_SERVICE_PRODUCTS_SUCCESS, serviceProducts } }
    function failure(error) { return { type: servicesConstants.CREATE_SERVICE_PRODUCTS_FAILURE, error } }
}

function getServiceProducts(searchValue) {
    return dispatch => {
        dispatch(request());
        servicesService.getServiceProducts(searchValue)
            .then(
                serviceProducts => dispatch(success(serviceProducts)),
                err => dispatch(failure(err))
            );
    };

    function request() { return { type: servicesConstants.GET_SERVICE_PRODUCTS_REQUEST } }
    function success(serviceProducts) { return { type: servicesConstants.GET_SERVICE_PRODUCTS_SUCCESS, serviceProducts } }
    function failure(err) { return { type: servicesConstants.GET_SERVICE_PRODUCTS_FAILURE, err } }
}

function updateServiceProduct(params, serviceProductId) {
    return dispatch => {
        dispatch(request());

        servicesService.updateServiceProduct(params, serviceProductId)
            .then(
                serviceProduct => {

                    dispatch(success(serviceProduct));
                    // setTimeout(()=>dispatch(successTime(0)), 500);

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: servicesConstants.UPDATE_SERVICE_PRODUCT_REQUEST, id } }
    // function successTime(id) { return { type: servicesConstants.GROUP_SUCCESS_TIME, id } }
    function success(serviceProduct) { return { type: servicesConstants.UPDATE_SERVICE_PRODUCT_SUCCESS, serviceProduct } }
    function failure(error) { return { type: servicesConstants.UPDATE_SERVICE_PRODUCT_FAILURE, error } }
}

function deleteServiceProduct(serviceProductId) {
    return dispatch => {
        servicesService.deleteServiceProduct(serviceProductId)
            .then(
                serviceProductId => dispatch(success(serviceProductId)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function success(serviceProductId) { return { type: servicesConstants.DELETE_SERVICE_PRODUCT_SUCCESS, serviceProductId } }
    function failure(error) { return { type: servicesConstants.DELETE_SERVICE_PRODUCT_FAILURE, error } }
}