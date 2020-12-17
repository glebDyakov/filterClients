import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const analiticsService = {
  getStaff,
  getRecordsAndClientsCount,
  getFinancialAnalyticChart,
  getStaffsAnalytic,
  getStaffsAnalyticForAll,
  getStaffsReturning,
};

function getStaff() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}/staffs/115/image?v=15555020690000`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
function getRecordsAndClientsCount(daySelected, dayLast) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };
  return fetch(`${origin}${config.apiUrl}/analytics/company?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getStaffsReturning(dateFrom, dateTo) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };
  return fetch(`${origin}${config.apiUrl}/analytics/staff?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getStaffsAnalytic(staffId, daySelected, dayLast) {
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
    `${origin}${config.apiUrl}/analytics/time/staffs/${staffId}?dateFrom=${daySelected}&dateTo=${dayLast}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}
function getStaffsAnalyticForAll(daySelected, dayLast) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };
  return fetch(`${origin}${config.apiUrl}/analytics/time?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getFinancialAnalyticChart(daySelected, dayLast) {
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
    `${origin}${config.apiUrl}/financial/analytics?dateFrom=${daySelected}&dateTo=${dayLast}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}
