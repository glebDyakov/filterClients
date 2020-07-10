import { materialService } from "../_services/material.service";
import { materialConstants } from "../_constants/material.constants";
import { clientConstants } from "../_constants";

export const materialActions = {
    toggleCategory,
    getCategories,
    deleteCategory,
    toggleBrand,
    getBrands,
    deleteBrand,
    toggleSupplier,
    getSuppliers,
    deleteSupplier,
    toggleProduct,
    getProducts,
    deleteProduct,
    toggleUnit,
    getUnits,
    deleteUnit,
    expenditureProduct,
    storehouseProduct,
    toggleStoreHouse,
    getStoreHouses,
    deleteStoreHouse,
    getStoreHouseProducts,
    getExpenditureProducts,
    deleteMovement

};

function toggleCategory(params, edit) {
    return dispatch => {
        dispatch(request())
        materialService.toggleCategory(params, edit)
            .then(
                category => {
                    dispatch(success(category))
                    setTimeout(()=>dispatch(successTime(category)), 500);
                    dispatch(materialActions.getCategories());

                },
            );
    };

    function request(category) { return { type: materialConstants.TOGGLE_CATEGORY, category } }
    function success(category) { return { type: materialConstants.TOGGLE_CATEGORY_SUCCESS, category } }
    function successTime(category) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, category } }
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
                brand => {
                    dispatch(success(brand));
                    setTimeout(()=>dispatch(successTime(brand)), 500);
                    dispatch(materialActions.getBrands());

                },
            );
    };

    function request(brand) { return { type: materialConstants.TOGGLE_BRAND, brand } }
    function success(brand) { return { type: materialConstants.TOGGLE_BRAND_SUCCESS, brand } }
    function successTime(brand) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, brand } }
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
                supplier => {
                    dispatch(success(supplier));
                    setTimeout(()=>dispatch(successTime(supplier)), 500);
                    dispatch(materialActions.getSuppliers());
                },
            );
    };

    function request(supplier) { return { type: materialConstants.TOGGLE_SUPPLIER, supplier } }
    function success(supplier) { return { type: materialConstants.TOGGLE_SUPPLIER_SUCCESS, supplier } }
    function successTime(supplier) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, supplier } }
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

function toggleProduct(params, edit) {

    return dispatch => {
        dispatch(request())
        materialService.toggleProduct(params, edit)
            .then(
                product => {
                    dispatch(success(product))
                    setTimeout(()=>dispatch(successTime(product)), 500);
                    dispatch(materialActions.getProducts());
                },
            );
    };

    function request(product) { return { type: materialConstants.TOGGLE_PRODUCT, product } }
    function success(product) { return { type: materialConstants.TOGGLE_PRODUCT_SUCCESS, product } }
    function successTime(product) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, product } }
}

function getProducts(pageNum = 1) {
    return dispatch => {
        dispatch(request())
        materialService.getProducts(pageNum)
            .then(
                products => dispatch(success(products)),
            );
    };

    function request(products) { return { type: materialConstants.GET_PRODUCT, products } }
    function success(products) { return { type: materialConstants.GET_PRODUCT_SUCCESS, products } }
}

function deleteProduct(id) {
    return dispatch => {
        materialService.deleteProduct(id)
            .then(
                closedDates => {
                    dispatch(materialActions.getProducts());
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(id) { return { type: materialConstants.DELETE_PRODUCT_SUCCESS, id } }
    function failure(error) { return { type: materialConstants.DELETE_PRODUCT_FAILURE, error } }
}

function toggleUnit(params, edit) {
    return dispatch => {
        dispatch(request())
        materialService.toggleUnit(params, edit)
            .then(
                unit => {
                    dispatch(success(unit));
                    setTimeout(()=>dispatch(successTime(unit)), 500);
                    dispatch(materialActions.getUnits());
                },
            );
    };

    function request(unit) { return { type: materialConstants.TOGGLE_UNIT, unit } }
    function success(unit) { return { type: materialConstants.TOGGLE_UNIT_SUCCESS, unit } }
    function successTime(unit) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, unit } }
}

function getUnits() {
    return dispatch => {
        dispatch(request())
        materialService.getUnits()
            .then(
                units => dispatch(success(units)),
            );
    };

    function request(units) { return { type: materialConstants.GET_UNITS, units } }
    function success(units) { return { type: materialConstants.GET_UNITS_SUCCESS, units } }
}

function deleteUnit(id) {
    return dispatch => {
        materialService.deleteUnit(id)
            .then(
                closedDates => {
                    dispatch(materialActions.getUnits());
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(id) { return { type: materialConstants.DELETE_UNIT_SUCCESS, id } }
    function failure(error) { return { type: materialConstants.DELETE_UNIT_FAILURE, error } }
}

function expenditureProduct(params) {
    return dispatch => {
        dispatch(request())
        materialService.expenditureProduct(params)
            .then(
                exProd => {
                    dispatch(success(exProd))
                    setTimeout(()=>dispatch(successTime(exProd)), 500);
                    dispatch(materialActions.getExpenditureProducts());
                },
            );
    };

    function request(exProd) { return { type: materialConstants.EXPEND_PRODUCT, exProd } }
    function success(exProd) { return { type: materialConstants.EXPEND_PRODUCT_SUCCESS, exProd } }
    function successTime(exProd) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, exProd } }
}

function toggleStoreHouse(params, edit) {
    return dispatch => {
        dispatch(request())
        materialService.toggleStoreHouse(params, edit)
            .then(
                storeHouse => {
                    dispatch(success(storeHouse));
                    setTimeout(()=>dispatch(successTime(storeHouse)), 500);
                    dispatch(materialActions.getStoreHouses());
                },
            );
    };

    function request(storeHouse) { return { type: materialConstants.TOGGLE_STORE_HOUSE, storeHouse } }
    function success(storeHouse) { return { type: materialConstants.TOGGLE_STORE_HOUSE_SUCCESS, storeHouse } }
    function successTime(storeHouse) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, storeHouse } }
}

function getStoreHouses() {
    return dispatch => {
        dispatch(request())
        materialService.getStoreHouses()
            .then(
                storeHouses => dispatch(success(storeHouses)),
            );
    };

    function request(storeHouses) { return { type: materialConstants.GET_STORE_HOUSES, storeHouses } }
    function success(storeHouses) { return { type: materialConstants.GET_STORE_HOUSES_SUCCESS, storeHouses } }
}


function deleteStoreHouse(id) {
    return dispatch => {
        materialService.deleteStoreHouse(id)
            .then(
                closedDates => {
                    dispatch(materialActions.getStoreHouses());
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(id) { return { type: materialConstants.DELETE_STORE_HOUSE_SUCCESS, id } }
    function failure(error) { return { type: materialConstants.DELETE_STORE_HOUSE_FAILURE, error } }
}

function getStoreHouseProducts() {
    return dispatch => {
        dispatch(request())
        materialService.getStoreHouseProducts()
            .then(
                storeHouseProducts => dispatch(success(storeHouseProducts)),
            );
    };

    function request(storeHouseProducts) { return { type: materialConstants.GET_STORE_HOUSE_PRODUCTS, storeHouseProducts } }
    function success(storeHouseProducts) { return { type: materialConstants.GET_STORE_HOUSES_PRODUCTS_SUCCESS, storeHouseProducts } }
}

function getExpenditureProducts() {
    return dispatch => {
        dispatch(request())
        materialService.getExpenditureProducts()
            .then(
                expenditureProducts => dispatch(success(expenditureProducts)),
            );
    };

    function request(expenditureProducts) { return { type: materialConstants.GET_EXPENDITURE_PRODUCTS, expenditureProducts } }
    function success(expenditureProducts) { return { type: materialConstants.GET_EXPENDITURE_PRODUCTS_SUCCESS, expenditureProducts } }
}



function storehouseProduct(params) {
    return dispatch => {
        dispatch(request())
        materialService.storehouseProduct(params)
            .then(
                product => {
                    dispatch(success(product))
                    setTimeout(()=>dispatch(successTime(product)), 500);
                    dispatch(materialActions.getStoreHouseProducts());
                },
            );
    };

    function request(product) { return { type: materialConstants.STORE_HOUSE_PRODUCT, product } }
    function success(product) { return { type: materialConstants.STORE_HOUSE_PRODUCT_SUCCESS, product } }
    function successTime(product) { return { type: materialConstants.MATERIAL_SUCCESS_TIME, product } }
}

function deleteMovement(id, type) {
    return dispatch => {
        materialService.deleteMovement(id, type)
            .then(
                closedDates => {
                    dispatch(materialActions.getStoreHouseProducts());
                    dispatch(materialActions.getExpenditureProducts());
                },
                error => dispatch(failure(id, error))
            );
    };

    function success(id) { return { type: materialConstants.DELETE_MOVEMENT_SUCCESS, id } }
    function failure(error) { return { type: materialConstants.DELETE_MOVEMENT_FAILURE, error } }
}