import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const payrollService = {
  getPayoutTypes,
  addPayoutTypes,
  getPayoutAnalytic,
  getPercentServiceGroups,
  getPercentServices,
  getPercentProducts,
  getPayoutByPeriod,


  updatePercentProducts,
  updatePercentServices,
  updatePercentServiceGroups,

};

function getPayoutTypes(staffId) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/payouttypes`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function addPayoutTypes(staffId, params) {
  console.log(params);
  const requestOptions = {
    method: 'PUT',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    body: JSON.stringify(params),
    headers: { ...authHeader(), 'Content-Type': 'application/json' },

  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/payouttypes`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getPayoutAnalytic(staffId, dateFrom, dateTo) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getPercentServiceGroups(staffId) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/servicegroups`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getPayoutByPeriod(staffId, dateFrom, dateTo) {

  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/days?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getPercentServices(staffId) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/services`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getPercentProducts(staffId) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/products`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function updatePercentProducts(staffId, percentProducts) {
  const requestOptions = {
    method: 'PUT',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    body: JSON.stringify(percentProducts),
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/products`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function updatePercentServices(staffId, percentServices) {
  const requestOptions = {
    method: 'PUT',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    body: JSON.stringify(percentServices),
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/services`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function updatePercentServiceGroups(staffId, percentServiceGroups) {
  const requestOptions = {
    method: 'PUT',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    body: JSON.stringify(percentServiceGroups),
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/servicegroups`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
