import config from 'config';
import { authHeader, handleResponse } from '../_helpers';
import moment from 'moment';

export const analiticsService = {
    getStaff,
    getRecordsAndClientsCount,
    getFinancialAnalyticChart,
    getStaffsAnalytic,
    getStaffsAnalyticForAll
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

        return fetch(`${config.baseUrl}/staffs/115/image?v=15555020690000`, requestOptions).then((data) => handleResponse(data, requestOptions));
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
    return fetch(`${config.apiUrl}/analytics/staffs?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions).then((data) => handleResponse(data, requestOptions));
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
    return fetch(`${config.apiUrl}/analytics/time/staffs/${staffId}?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}
function getStaffsAnalyticForAll(daySelected, dayLast) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/analytics/time?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}

function getFinancialAnalyticChart(daySelected, dayLast) {
    const requestOptions = {
        method: 'GET',
        crossDomain: true,
        credentials: 'include',
        xhrFields: {
            withCredentials: true
        },
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/financial/analytics?dateFrom=${daySelected}&dateTo=${dayLast}`, requestOptions).then((data) => handleResponse(data, requestOptions));
}
