import {companyConstants, userConstants} from '../_constants';

export function company(state = {}, action) {
    switch (action.type) {
        case companyConstants.ADD_COMPANY_SUCCESS:
            localStorage.setItem('user', action.company);

            return {
                ...state,
                status: 200,
                settings: action.company
            };
        case companyConstants.ADD_COMPANY_FAILURE:
            return {};
        case companyConstants.GET_COMPANY_SUCCESS:
            return {
                ...state,
                settings: action.settings
            };
        case companyConstants.GET_BOOKING_SUCCESS:
            return {
                ...state,
                booking: action.booking
            };
        case companyConstants.GET_NEW_APPOINMENTS_SUCCESS:
            return {
                ...state,
                count: action.count,
                random: Math.random(),
                status: ''
            };
        case companyConstants.GET_NEW_APPOINMENTS_MARKER_INCR:
            let newCount = state.count.appointments.count + 1;
            return {
                ...state,
                count: {
                    ...state.count,
                    appointments: {
                        count: newCount
                    }
                },
            };
        case companyConstants.GET_NEW_APPOINMENTS_MARKER_DECR:
            newCount = state.count.canceled.count + 1;
            return {
                ...state,
                count: {
                    ...state.count,
                    canceled: {
                        count: newCount
                    }
                },
            };
        case userConstants.UPDATE_COMPANY_SUCCESS:
            const companyAllInfo = {...action.company, menu: action.menu, profile: action.profile};

            // localStorage.setItem('user', JSON.stringify(companyAllInfo))

            return {
                ...state,
                settings: companyAllInfo,
                status: 'saved.settings'
            };
        default:
            return state
    }
}
