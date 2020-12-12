import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const payrollService = {
  getPayoutTypes,
  addPayoutType,
  getPayoutAnalytic
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

function addPayoutType(params) {
  const requestOptions = {
    method: params.staffPayoutTypeId ? 'PUT' : 'POST',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    body: JSON.stringify(params),
    headers: { ...authHeader(), 'Content-Type': 'application/json' },

  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs${params.staffPayoutTypeId ? '/' + params.staffPayoutTypeId : ''}/payouttypes`, requestOptions)
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
