import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const payrollService = {
  getPayoutTypes,
  getPayoutAnalytic,
  getPercents,
  getAnalyticByPeriod,
  updatePayoutType,
  updatePercents
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

function getPercents(staffId, type) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };
  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/${type}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function updatePercents(staffId, type, params) {
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
  return fetch(`${origin}/salary${config.apiUrl}/staffs/${staffId}/${type}`, requestOptions)
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


function getAnalyticByPeriod(staffId, dateFrom, dateTo) {
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

function updatePayoutType(staffId, params) {
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
