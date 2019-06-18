import {analiticsConstants} from '../_constants';
import {analiticsService} from '../_services';


export const analiticsActions = {
    getStaff,
    getRecordsAndClientsCount,
    getRecordsAndClientsChartCount,
    getStaffsAnalytic,
    getStaffsAnalyticForAll,
    getStaffsAnalyticChart,
    getStaffsAnalyticForAllChart,
    updateChartStatsFor
};

function getStaff() {
    return dispatch => {

        analiticsService.getStaff()
            .then(
                staffs => dispatch(success(staffs)),
            );
    };

    function success(staffs) { return { type: analiticsConstants.GET_STAFFS_SUCCESS, staffs }}
}
function getRecordsAndClientsCount(daySelected,dayLast) {
    return dispatch => {
        analiticsService.getRecordsAndClientsCount(daySelected,dayLast)
            .then(
                count => dispatch(success(count)),
            );
    };

    function success(count) { return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_SUCCESS, count } }
}
function updateChartStatsFor(charStatsFor ) {
    return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_UPDATE_CHART, charStatsFor }
}

function getRecordsAndClientsChartCount(daySelected,dayLast) {
    return dispatch => {
        analiticsService.getRecordsAndClientsCount(daySelected,dayLast)
            .then(
                count => dispatch(success(count)),
            );
    };

    function success(count) { return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_CHART_SUCCESS, count } }
}
function getStaffsAnalytic(staffId, daySelected, dayLast) {
    return dispatch => {
        analiticsService.getStaffsAnalytic(staffId, daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
            );
    };

    function success(count) { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_SUCCESS, count } }
}
function getStaffsAnalyticForAll(daySelected, dayLast) {
    return dispatch => {
        analiticsService.getStaffsAnalyticForAll(daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
            );
    };

    function success(count) { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_SUCCESS, count } }
}

function getStaffsAnalyticChart(staffId, daySelected, dayLast) {
    return dispatch => {
        analiticsService.getStaffsAnalytic(staffId, daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
            );
    };


    function success(count) { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_CHART_SUCCESS, count } }
}

function getStaffsAnalyticForAllChart(daySelected, dayLast) {
    return dispatch => {
        analiticsService.getStaffsAnalyticForAll(daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
            );
    };

    function success(count) { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_CHART_SUCCESS, count } }
}

