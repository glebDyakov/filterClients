import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';
import FileSaver from 'file-saver';
import moment from 'moment';

export const clientService = {
  addClient,
  updateClient,
  getClient,
  deleteClient,
  getClientWithInfo,
  getClientV2,
  getActiveClient,
  getActiveClientAppointments,
  downloadFile,
  uploadFile,
};

function addClient(params) {
  const requestOptions = {
    method: 'POST',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: params,
  };

  return fetch(`${origin}${config.apiUrl}/clients`, requestOptions)
    .then((data) => handleResponse(data, requestOptions))
    .then((client) => {
      return client;
    });
}

function updateClient(params) {
  delete params.appointments;
  const requestOptions = {
    method: 'PUT',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: params,
  };

  return fetch(`${origin}${config.apiUrl}/clients`, requestOptions)
    .then((data) => handleResponse(data, requestOptions))
    .then((client) => {
      return client;
    });
}


function getClient() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/clients`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function uploadFile(uploadFile) {
  const requestOptions = {
    method: 'POST',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
    body: uploadFile,
  };

  return fetch(`${origin}${config.apiUrl}/clients/upload`, requestOptions);
}

function downloadFile() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/clients/download`, requestOptions).then(function(response) {
    return response.blob();
  }).then(function(blob) {
    FileSaver.saveAs(blob, 'clients.csv');
  });
}

function getClientWithInfo() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  const dateFrom = moment().subtract(1, 'year');
  const dateTo = moment().add(6, 'month').endOf('month').format('x');

  return fetch(`${origin}${config.apiUrl}/appointments/clients?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getClientV2(pageNum, searchValue, blacklisted, pageSize = 10) {
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
    `${origin}${config.apiUrlv2}/clients?pageNum=${pageNum}&pageSize=${pageSize}` +
    `${blacklisted ? '&blacklisted=true' : ''}${searchValue ? `&searchValue=${searchValue}` : ''}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}

function getActiveClientAppointments(clientId, pageNum) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  const dateFrom = moment().subtract(1, 'year').format('x');
  const dateTo = moment().add(6, 'month').endOf('month').format('x');

  console.log(dateFrom, dateTo)

  return fetch(
    `${origin}${config.apiUrl}/clients/${clientId}/appointments?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
  // return fetch(
  // `${origin}${config.apiUrlv2}/clients/${clientId}/appointments?pageNum=${pageNum}` +
  // `&pageSize=5&dateFrom=${dateFrom}&dateTo=${dateTo}`,
  // requestOptions,
  // ).then((data) => handleResponse(data, requestOptions));
}

function getActiveClient(clientId) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/clients/${clientId}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteClient(id) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/clients/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
