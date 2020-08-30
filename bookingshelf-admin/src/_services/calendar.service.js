import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';
import moment from 'moment';

export const calendarService = {
  addAppointment,
  editCalendarAppointment,
  editAppointment,
  editAppointment2,
  getAppointments,
  getAppointmentsV1,
  getAppointmentsCanceled,
  approveAppointment,
  approveAllAppointment,
  approveMovedAppointment,
  deleteAppointment,
  deleteReservedTime,
  updateAppointment,
  getReservedTime,
  addReservedTime,
  addManager,
  sendMessage,
  getManagers,
};

function addAppointment(params, serviceId, staffId, clientId, coStaffs) {
  const requestOptions = {
    method: 'POST',
    body: params,
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  let extraStaffIds = '';

  coStaffs.forEach((item) => {
    extraStaffIds +=`,${item.staffId}`;
  });

  return fetch(`${origin}${config.apiUrl}/staffs/${staffId}${extraStaffIds}/appointments`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function editCalendarAppointment(params, mainAppointmentId, staffId, clientId, withoutNotify) {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(
    `${origin}${config.apiUrl}/staffs/${staffId}/${!!clientId ? `clients/${clientId}/` : ''}` +
    `appointments/${mainAppointmentId}${withoutNotify ? '?notify=false' : ''}`,
    requestOptions).then((data) => handleResponse(data, requestOptions));
}

function addReservedTime(params, staffId) {
  const requestOptions = {
    method: 'POST',
    body: params,
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrl}/staffs/${staffId}/reservedtimes`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function editAppointment(params) {
  const requestOptions = {
    method: 'PUT',
    body: params,
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrl}/appointments`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function editAppointment2(params, id) {
  const requestOptions = {
    method: 'PATCH',
    body: params,
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrlv2}/appointments/${id}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function approveAppointment(appointmentId, params) {
  const requestOptions = {
    method: 'PATCH',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrl}/appointments/${appointmentId}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function updateAppointment(appointmentId, params, withoutNotify) {
  const requestOptions = {
    method: 'PATCH',
    body: params,
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(
    `${origin}${config.apiUrl}/appointments/${appointmentId}${withoutNotify ? '?notify=false' : ''}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}
function approveAllAppointment(approved, canceled, params) {
  const requestOptions = {
    method: 'PATCH',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  const dateFrom = moment('2018-01-01', 'YYYY-MMMM-DD').format('x');
  const dateTo = moment().add(7, 'month').endOf('month').format('x');
  return fetch(
    `${origin}${config.apiUrl}/appointments?dateFrom=${dateFrom}&dateTo=${dateTo}&canceled=${canceled}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}

function approveMovedAppointment(params) {
  const requestOptions = {
    method: 'PATCH',
    body: JSON.stringify(params),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  const dateFrom = moment('2018-01-01', 'YYYY-MMMM-DD').format('x');
  const dateTo = moment().add(7, 'month').endOf('month').format('x');
  return fetch(`${origin}${config.apiUrl}/appointments/moved?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function deleteAppointment(appointmentId, withoutNotify) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(
    `${origin}${config.apiUrl}/appointments/${appointmentId}${withoutNotify ? '?notify=false' : ''}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}

function deleteReservedTime(staffId, reservedTimeId) {
  const requestOptions = {
    method: 'DELETE',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/staffs/${staffId}/reservedtimes/${reservedTimeId}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getAppointments(dateFrom, dateTo) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrlv2}/appointments/staffs?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getAppointmentsV1(dateFrom, dateTo) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/appointments/staffs?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function getAppointmentsCanceled(dateFrom, dateTo, id) {
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
    `${origin}${config.apiUrl}/staffs/${id}/appointments/canceled?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    requestOptions,
  ).then((data) => handleResponse(data, requestOptions));
}

function getReservedTime(dateFrom, dateTo) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/reservedtimes/staffs?dateFrom=${dateFrom}&dateTo=${dateTo}`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

// function addManager(manager) {
//     const requestOptions = {
//         method: 'POST',
//         body: manager,
//         crossDomain: true,
//         credentials: 'include',
//         xhrFields: {
//             withCredentials: true
//         },
//         headers: {...authHeader(), 'Content-Type': 'application/json'}
//     };
//
//     return fetch(`${origin}${config.apiUrl}/managers`, requestOptions)
//         .then((data) => handleResponse(data, requestOptions));
// }

// function getManagers(dateFrom, dateTo) {
//     const requestOptions = {
//         method: 'GET',
//         crossDomain: true,
//         credentials: 'include',
//         xhrFields: {
//             withCredentials: true
//         },
//         headers: authHeader()
//     };
//
//     return fetch(`${origin}${config.apiUrl}/managers`, requestOptions)
//     .then((data) => handleResponse(data, requestOptions));
// }

function addManager(manager) {
  const requestOptions = {
    method: 'POST',
    body: manager,
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrl}/managers`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

function sendMessage(message) {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(message),
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  return fetch(`${origin}${config.apiUrl}/messages/management`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}


function getManagers(dateFrom, dateTo) {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/managers`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}

