import {analiticsConstants} from '../_constants';
import {analiticsService} from '../_services';


export const analiticsActions = {
    getStaff,
    getRecordsAndClientsCount,
    getStaffsAnalytic
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
function getStaffsAnalytic(staffId, daySelected, dayLast) {
    return dispatch => {
        analiticsService.getStaffsAnalytic(staffId, daySelected, dayLast)
            .then(
                count => dispatch(success(count)),
            );
    };

    function success(count) { return { type: analiticsConstants.GET_STAFFS_ANALYTICS_SUCCESS, count } }
}
