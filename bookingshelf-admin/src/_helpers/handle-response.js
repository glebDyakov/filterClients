export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            let error = (data && data.message) || response.statusText;

            if (response.status === 401 && localStorage.getItem('user')) {
                localStorage.removeItem('user');
                localStorage.removeItem('menu');
                localStorage.clear();
                location.reload(true);
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