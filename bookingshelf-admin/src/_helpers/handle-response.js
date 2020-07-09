import {userService} from "../_services";

export const clearStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('menu');
    localStorage.clear();
    location.reload(true);
}

export const hostname = (location.hostname === 'localhost') ? 'staging.online-zapis.com' : location.hostname;

export const origin = (location.hostname === 'localhost') ? 'https://staging.admin.online-zapis.com' : location.origin;

export function handleResponse(response, requestOptions, repeat = true) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            let error = (data && data.message) || response.statusText;

            if (response.status === 401 && localStorage.getItem('user')) {
                if (!response.url.includes('/login/check')) {
                    if (repeat) {
                        return userService.checkLogin()
                            .then(
                                () => fetch(response.url, requestOptions)
                                    .then((data) => handleResponse(data, null, false)),
                                () => fetch(response.url, requestOptions)
                                    .then((data) => handleResponse(data, null, false)),
                            );
                    } else {
                        clearStorage()
                    }
                }
            }

            error=JSON.stringify(data.length>1 ? data : data[0]);

            if (response.status === 401 && !localStorage.getItem('user')) {
                error=JSON.stringify({"code":6,"messageKey":"wrong.credentials"});
            }

            return Promise.reject(error);
        }

        return data;
    });
}
