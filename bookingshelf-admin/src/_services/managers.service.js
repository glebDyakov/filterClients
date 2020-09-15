import config from 'config';
import { authHeader, handleResponse } from '../_helpers';

export const managersService = {
  getAllManagers,
};


function getAllManagers() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${config.apiUrl}/managers`, requestOptions).then((data) => handleResponse(data, requestOptions));
}
