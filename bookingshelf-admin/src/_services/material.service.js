import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const materialService = {
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
  toggleStoreHouse,
  getStoreHouses,
  deleteStoreHouse,
  storehouseProduct,
  expenditureProduct,
  getStoreHouseProducts,
  getExpenditureProducts,
  deleteMovement,

};

function toggleCategory(params, edit) {
  const requestOptions = {
    method: edit ? 'PUT' : 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.warehouseApiUrl}/categories${edit ? `/${params.categoryId}` : ''}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getCategories() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/categories`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteCategory(id) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/categories/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function toggleBrand(params, edit) {
  const requestOptions = {
    method: edit ? 'PUT' : 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.warehouseApiUrl}/brands${edit ? `/${params.brandId}` : ''}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getBrands() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/brands`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteBrand(id) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/brands/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function toggleSupplier(params, edit) {
  const requestOptions = {
    method: edit ? 'PUT' : 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.warehouseApiUrl}/suppliers${edit ? `/${params.supplierId}` : ''}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getSuppliers() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/suppliers`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteSupplier(id) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/suppliers/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function toggleProduct(params, edit) {
  params.minAmount = parseInt(params.minAmount);
  const requestOptions = {
    method: edit ? 'PUT' : 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.warehouseApiUrl}/products${edit ? `/${params.productId}` : ''}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getProducts(pageNum, searchValue) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(
    // eslint-disable-next-line
    `${origin}${config.warehouseApiUrl}/products?pageNum=${pageNum}&pageSize=10${searchValue ? `&searchValue=${searchValue}` : ''}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}

function deleteProduct(id) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/products/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function toggleUnit(params, edit) {
  const requestOptions = {
    method: edit ? 'PUT' : 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.warehouseApiUrl}/units${edit ? `/${params.unitId}` : ''}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getUnits() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/units`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteUnit(id) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/units/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function toggleStoreHouse(params, edit) {
  if (typeof params === 'string') {
    const paramsNew = {
      storehouseName: params,
    };
    params = paramsNew;
  }

  const requestOptions = {
    method: edit ? 'PUT' : 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.warehouseApiUrl}/storehouses${edit ? `/${params.storehouseId}` : ''}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getStoreHouses() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/storehouses`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteStoreHouse(id) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/storehouses/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function expenditureProduct(params, edit) {
  const requestOptions = {
    method: edit? 'PUT': 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(
    // eslint-disable-next-line
    `${origin}${config.warehouseApiUrl}/storehouseproductexpenditures${edit ? `/${params.storehouseProductExpenditureId}`:''}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}

function storehouseProduct(params, edit) {
  const requestOptions = {
    method: edit? 'PUT': 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(
    `${origin}${config.warehouseApiUrl}/storehouseproducts${edit ? `/${params.storehouseProductId}` : ''}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}

function getStoreHouseProducts(pageNum = 1, pageSize = 10) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/storehouseproducts?pageNum=${pageNum}&pageSize=${pageSize}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getExpenditureProducts(pageNum = 1, pageSize = 10) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },

    headers: authHeader(),
  };

  return fetch(`${origin}${config.warehouseApiUrl}/storehouseproductexpenditures?pageNum=${pageNum}&pageSize=${pageSize}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteMovement(id, type) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };
  if (type) {
    return fetch(`${origin}${config.warehouseApiUrl}/storehouseproducts/${id}`, requestOptions)
      .then((data) => handleResponse(data, requestOptions));
  } else {
    return fetch(`${origin}${config.warehouseApiUrl}/storehouseproductexpenditures/${id}`, requestOptions)
      .then((data) => handleResponse(data, requestOptions));
  }
}
