import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const payrollService = {
  getPayoutTypes,
  getPayoutAnalytic,
  getAnalyticByPeriod,
  updatePayoutType
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
