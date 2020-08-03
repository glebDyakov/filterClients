import config from 'config';
import { authHeader, handleResponse, origin } from '../_helpers';

export const userService = {
    login,
    checkLogin,
    logout,
    register,
    getAll,
    getById,
    forgotPass,
    update,
    updateProfile,
    delete: _delete,
    activate,
    activateStaff
};

function login(login, password) {
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
    };

    return fetch(`${origin}${config.apiUrl}/login`,  requestOptions)
        .then((data) => handleResponse(data, requestOptions))
        .then(user => {
            // login successful if there's a jwt token in the response
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}


function checkLogin() {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    };
    const companyId = localStorage.getItem('companyId') ? localStorage.getItem('companyId') : null

    return fetch(`${origin}${config.apiUrl}/login/check${companyId ? `?companyId=${companyId}` : ''}`,  requestOptions)
        .then((data) => handleResponse(data, requestOptions))
        .then(user => {
            // login successful if there's a jwt token in the response
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function activate(activationCode) {
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/activation/company/${activationCode}`,  requestOptions)
        .then((data) => handleResponse(data, requestOptions))
        .then(user => {
            // login successful if there's a jwt token in the response
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function activateStaff(activationCode) {
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${origin}${config.apiUrl}/activation/staff/${activationCode}`,  requestOptions)
        .then((data) => handleResponse(data, requestOptions))
        .then(user => {
            // login successful if there's a jwt token in the response
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('menu');
    localStorage.clear();
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: {'Content-Type': 'application/json'}
    };

    return fetch(`${origin}${config.apiUrl}/logout`, requestOptions)
        .then((data) => handleResponse(data, requestOptions));

}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${origin}${config.apiUrl}/users`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${origin}${config.apiUrl}/users/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        crossDomain: true,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };


    return fetch(`${origin}${config.apiUrl}/signup`, requestOptions).then((data) => handleResponse(data, requestOptions)).then(user => {
        // login successful if there's a jwt token in the response
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('user', JSON.stringify(user));
        return user;
    });
}

function forgotPass(email) {
    const requestOptions = {
        method: 'PUT',

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email)
    };

    return fetch(`${origin}${config.apiUrl}/resetpassword`, requestOptions).then((data) => handleResponse(data, requestOptions)).then(email => {
        return email;
    });;
}


function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${origin}${config.apiUrl}/users/${user.id}`, requestOptions).then((data) => handleResponse(data, requestOptions));;
}

function updateProfile(user) {
    const requestOptions = {
        method: 'PUT',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${origin}${config.apiUrl}/profile`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${origin}${config.apiUrl}/users/${id}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}