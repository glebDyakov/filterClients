import config from 'config';
import { authHeader, handleResponse  } from '../_helpers';

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

    return fetch(`${config.apiUrl}/login`,  requestOptions)
        .then(handleResponse)
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

    return fetch(`${config.apiUrl}/login/check`,  requestOptions)
        .then(handleResponse)
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

    return fetch(`${config.apiUrl}/activation/company/${activationCode}`,  requestOptions)
        .then(handleResponse)
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

    return fetch(`${config.apiUrl}/activation/staff/${activationCode}`,  requestOptions)
        .then(handleResponse)
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
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        crossDomain: true,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };


    return fetch(`${config.apiUrl}/signup`, requestOptions).then(handleResponse).then(user => {
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

    return fetch(`${config.apiUrl}/resetpassword`, requestOptions).then(handleResponse).then(email => {
        return email;
    });;
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
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
        body: user
    };

    return fetch(`${config.apiUrl}/profile`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}