import config from 'config';
import { authHeader, handleResponse } from '../_helpers';

export const materialService = {
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
    const requestOptions = {
        method: edit ? 'PUT' : 'POST',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.warehouseApiUrl}/categories${edit ? `/${params.categoryId}` : ''}`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function getCategories() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },

        headers: authHeader()
    };

    return fetch(`${config.warehouseApiUrl}/categories`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function deleteCategory(id) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.warehouseApiUrl}/categories/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function toggleBrand(params, edit) {
    const requestOptions = {
        method: edit ? 'PUT' : 'POST',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.warehouseApiUrl}/brands${edit ? `/${params.brandId}` : ''}`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function getBrands() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },

        headers: authHeader()
    };

    return fetch(`${config.warehouseApiUrl}/brands`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function deleteBrand(id) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.warehouseApiUrl}/brands/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function toggleSupplier(params, edit) {
    const requestOptions = {
        method: edit ? 'PUT' : 'POST',
        body: JSON.stringify(params),
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.warehouseApiUrl}/suppliers${edit ? `/${params.supplierId}` : ''}`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function getSuppliers() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },

        headers: authHeader()
    };

    return fetch(`${config.warehouseApiUrl}/suppliers`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));
}

function deleteSupplier(id) {
    const requestOptions = {
        method: 'DELETE',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };

    return fetch(`${config.warehouseApiUrl}/suppliers/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}
