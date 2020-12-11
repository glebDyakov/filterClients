import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const payrollService = {
  getPayoutTypes,
  addPayoutType,
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
    body: params,
    headers: authHeader(),
  };

  return fetch(`${origin}/salary${config.apiUrl}/staffs${params.staffPayoutTypeId ? '/' + params.staffPayoutTypeId : ''}/payouttypes`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
