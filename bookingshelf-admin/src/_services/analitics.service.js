import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import moment from 'moment';

export const analiticsService = {
    getStaff,
    getRecordsAndClientsCount,
    getStaffsAnalytic
};

function getStaff() {
        const requestOptions = {
            method: 'GET',
            crossDomain: true,
            credentials: 'include',
            xhrFields: {
                withCredentials: true
            },
            headers: authHeader()
        };

        return fetch(`${config.apiUrlimg}/staffs/115/image?v=15555020690000`, requestOptions).then(handleResponse);
}
function getRecordsAndClientsCount(daySelected,dayLast) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/analytics?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions).then(handleResponse);
}

function getStaffsAnalytic(staffId, daySelected, dayLast) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/analytics/staff/${staffId}?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions).then(handleResponse);
}