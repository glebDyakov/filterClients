import {analiticsConstants, calendarConstants} from '../_constants';
import {analiticsService} from '../_services';
import moment from 'moment';


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

    let timeTakenStart = moment(dayLast).format('dd');
    let timeNowStart = moment().format('dd');
    let momentMills = moment().format('x');

    return dispatch => {
        analiticsService.getRecordsAndClientsCount(daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
            ).then(() => {
            if(timeTakenStart===timeNowStart) {
                analiticsService.getRecordsAndClientsCount(daySelected, momentMills)
                    .then(
                        approvedCount => dispatch(successToday(approvedCount)),
                    );
            }
        });

    };

   function success(count) { return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_SUCCESS, count } }
    function successToday(count) { return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_TODAY_SUCCESS, approvedCount: count } }

}
function updateChartStatsFor(charStatsFor ) {
    return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_UPDATE_CHART, charStatsFor }
}

function getRecordsAndClientsChartCount(daySelected,dayLast) {
    return dispatch => {
        dispatch(request());
        analiticsService.getRecordsAndClientsCount(daySelected,dayLast)
            .then(
                count => dispatch(success(count)),
                () => dispatch(failure())
            );
    };

    function success(count) { return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_CHART_SUCCESS, count } }
    function request() { return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_CHART_REQUEST} }
    function failure() { return { type: analiticsConstants.GET_RECORDS_AND_CLIENTS_CHART_FAILURE } }
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
        dispatch(request());
        analiticsService.getStaffsAnalytic(staffId, daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
                () => dispatch(failure())
            );
    };


    function success(count) { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_CHART_SUCCESS, count } }
    function request() { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_CHART_REQUEST} }
    function failure() { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_CHART_FAILURE } }
}

function getStaffsAnalyticForAllChart(daySelected, dayLast) {
    return dispatch => {
        dispatch(request());
        analiticsService.getStaffsAnalyticForAll(daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
                () => dispatch(failure())
            );
    };

    function success(count) { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_CHART_SUCCESS, count } }
    function request() { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_CHART_REQUEST} }
    function failure() { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_FOR_ALL_CHART_FAILURE } }
}

