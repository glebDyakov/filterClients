import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const menuService = {
  getAll,
};


function getAll() {
  const requestOptions = {
    method: 'GET',
    crossDomain: true,
    credentials: 'include',
    xhrFields: {
      withCredentials: true,
    },
    headers: authHeader(),
  };

  return fetch(`${origin}${config.apiUrl}/menu`, requestOptions)
    .then((data) => handleResponse(data, requestOptions));
}
