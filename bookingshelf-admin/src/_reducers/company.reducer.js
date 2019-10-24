import {companyConstants, userConstants} from '../_constants';
const initialState = {
    subcompanies: []
}

export function company(state = initialState, action) {
    switch (action.type) {
        case companyConstants.ADD_COMPANY_SUCCESS:
            localStorage.setItem('user', action.company);

            return {
                ...state,
                status: 200,
                settings: action.company
            };
        case companyConstants.ADD_COMPANY_FAILURE:
            return {...state};
        case companyConstants.GET_SUBCOMPANIES_SUCCESS:
            return {
                ...state,
                subcompanies: action.subcompanies.sort((a, b) => a.companyId - b.companyId)
            }
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
        case companyConstants.GET_MOVED_APPOINMENTS_MARKER_INCR:
            newCount = state.count.moved.count + 1;
            return {
                ...state,
                count: {
                    ...state.count,
                    moved: {
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
        case companyConstants.SWITCH_SUBCOMPANY_SUCCESS:
            let companyAllInfo = {...action.company, menu: action.menu, profile: action.profile};
            return {
                ...state,
                settings: companyAllInfo

            }
        case companyConstants.UPDATE_SUBCOMPANY_SUCCESS:
            return {
                ...state,
                status: 'saved.settings'
            }
        case userConstants.UPDATE_COMPANY_SUCCESS:
            companyAllInfo = {...action.company, menu: action.menu, profile: action.profile};

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
