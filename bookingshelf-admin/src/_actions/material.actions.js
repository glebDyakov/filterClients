import { materialService } from "../_services/material.service";
import { materialConstants } from "../_constants/material.constants";

export const materialActions = {
    toggleCategory,
    getCategories,
    deleteCategory,
    toggleBrand,
    getBrands,
    deleteBrand,
    toggleSupplier,
    getSuppliers,
    deleteSupplier
};

function toggleCategory(params, edit) {
    return dispatch => {
        dispatch(request())
        materialService.toggleCategory(params, edit)
            .then(
                category => {
                    dispatch(success(category))
                    dispatch(materialActions.getCategories());
                },
            );
    };

    function request(category) { return { type: materialConstants.TOGGLE_CATEGORY, category } }
    function success(category) { return { type: materialConstants.TOGGLE_CATEGORY_SUCCESS, category } }
}


function getCategories() {
    return dispatch => {
        dispatch(request())
        materialService.getCategories()
            .then(
                category => dispatch(success(category)),
            );
    };

    function request(categories) { return { type: materialConstants.GET_CATEGORIES, categories } }
    function success(categories) { return { type: materialConstants.GET_CATEGORIES_SUCCESS, categories } }
}

function deleteCategory(id) {
    return dispatch => {
        materialService.deleteCategory(id)
            .then(
                closedDates => {
                    dispatch(materialActions.getCategories());
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(id) { return { type: materialConstants.DELETE_CATEGORY_SUCCESS, id } }
    function failure(error) { return { type: materialConstants.DELETE_CATEGORY_FAILURE, error } }
}

function toggleBrand(params, edit) {
    return dispatch => {
        dispatch(request())
        materialService.toggleBrand(params, edit)
            .then(
                category => {
                    dispatch(success(category))
                    dispatch(materialActions.getBrands());
                },
            );
    };

    function request(category) { return { type: materialConstants.TOGGLE_BRAND, category } }
    function success(category) { return { type: materialConstants.TOGGLE_BRAND_SUCCESS, category } }
}


function getBrands() {
    return dispatch => {
        dispatch(request())
        materialService.getBrands()
            .then(
                category => dispatch(success(category)),
            );
    };

    function request(brands) { return { type: materialConstants.GET_BRANDS, brands } }
    function success(brands) { return { type: materialConstants.GET_BRANDS_SUCCESS, brands } }
}

function deleteBrand(id) {
    return dispatch => {
        materialService.deleteBrand(id)
            .then(
                closedDates => {
                    dispatch(materialActions.getBrands());
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(id) { return { type: materialConstants.DELETE_BRAND_SUCCESS, id } }
    function failure(error) { return { type: materialConstants.DELETE_BRAND_FAILURE, error } }
}


function toggleSupplier(params, edit) {
    return dispatch => {
        dispatch(request())
        materialService.toggleSupplier(params, edit)
            .then(
                category => {
                    dispatch(success(category))
                    dispatch(materialActions.getSuppliers());
                },
            );
    };

    function request(category) { return { type: materialConstants.TOGGLE_SUPPLIER, category } }
    function success(category) { return { type: materialConstants.TOGGLE_SUPPLIER_SUCCESS, category } }
}


function getSuppliers() {
    return dispatch => {
        dispatch(request())
        materialService.getSuppliers()
            .then(
                category => dispatch(success(category)),
            );
    };

    function request(suppliers) { return { type: materialConstants.GET_SUPPLIERS, suppliers } }
    function success(suppliers) { return { type: materialConstants.GET_SUPPLIERS_SUCCESS, suppliers } }
}

function deleteSupplier(id) {
    return dispatch => {
        materialService.deleteSupplier(id)
            .then(
                closedDates => {
                    dispatch(materialActions.getSuppliers());
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(id) { return { type: materialConstants.DELETE_SUPPLIER_SUCCESS, id } }
    function failure(error) { return { type: materialConstants.DELETE_SUPPLIER_FAILURE, error } }
}