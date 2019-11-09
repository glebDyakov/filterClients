import {staffConstants} from '../_constants';

const initialState = {
    error: '',
    isLoading: false,
    subcompanies: [],
    serviceGroups: [],
    superCompany: true
}

export function staff(state = initialState, action) {
    switch (action.type) {
        case staffConstants.CLEAR_STAFF_SUCCESS:
            return {
                ...state,
                staff: []
            }
        case staffConstants.GET_SUBCOMPANIES_SUCCESS:

            let newState = {}
            if (action.subcompanies) {
                newState.subcompanies = state.subcompanies.concat(action.subcompanies);
            } else {
                newState.superCompany = false
            }

            return {
                ...state,
                ...newState
            }
        case staffConstants.GET_SERVICE_GROUPS_SUCCESS:
            return {
                ...state,
                serviceGroups: action.serviceGroups
            }
        case staffConstants.GET_SUCCESS:
            return {
                ...state,
                staff: action.staff,
                isLoading: false
            };
        case staffConstants.GET_SERVICES_SUCCESS:
            return {
                ...state,
                services: action.services,
                isLoading: false
            };
        case staffConstants.GET_INFO_SUCCESS:
            let ownerCompany = {
                ...action.info,
                bookingPage: '000' + action.info.companyId,
                companyName: action.info.companyName
            }

            let isOwnerCompanyAdded = state.subcompanies.find(item => item.companyId === action.info.companyId)
            if (!isOwnerCompanyAdded) {
                state.subcompanies.unshift(ownerCompany)
            }
            return {
                ...state,
                info: action.info,
                isLoading: false
            };
        case staffConstants.GET:
        case staffConstants.GET_INFO:
        case staffConstants.GET_SERVICES:
        case staffConstants.GET_NEAREST_TIME:
        case staffConstants.GET_APPOINTMENT_CUSTOM:
        case staffConstants.GET_TIMETABLE:
        case staffConstants.GET_TIMETABLE_AVAILABLE:
        case staffConstants.MOVE_VISIT:
        case staffConstants.DELETE_APPOINTMENT:
            return {
                ...state,
                isLoading: true
            };
        case staffConstants.GET_CLIENT_APPOINTMENTS_SUCCESS:
            return {
                ...state,
                clients: action.clients
            }
        case staffConstants.GET_TIMETABLE_SUCCESS:
            return {
                ...state,
                timetable: action.timetable,
                isLoading: false
            };
        case staffConstants.GET_TIMETABLE_AVAILABLE_SUCCESS:
            return {
                ...state,
                timetableAvailable: action.timetableAvailable,
                isLoading: false
            };
        case staffConstants.GET_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: 'Онлайн-запись отключена. Пожалуйста, свяжитесь с администратором. Приносим извинения за доставленные неудобства.'
            }
        case staffConstants.TOGGLE_MOVED_VISIT:
            return {
                ...state,
                movedVisitSuccess: action.movedVisitSuccess
            }
        case staffConstants.TOGGLE_START_MOVING_VISIT:
            return {
                ...state,
                isStartMovingVisit: action.isStartMovingVisit,
                movingVisit: action.movingVisit,
            }
        case staffConstants.GET_INFO_FAILURE:
        case staffConstants.GET_SERVICES_FAILURE:
        case staffConstants.GET_NEAREST_TIME_FAILURE:
        case staffConstants.GET_APPOINTMENT_CUSTOM_FAILURE:
        case staffConstants.GET_TIMETABLE_FAILURE:
        case staffConstants.GET_TIMETABLE_AVAILABLE_FAILURE:
        case staffConstants.DELETE_APPOINTMENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                deleted: false
            }
        case staffConstants.MOVE_VISIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                deleted: false,
                error: 'Извините, это время недоступно для записи'
            }
        case staffConstants.ADD_APPOINTMENT:
            return {
                ...state,
                isLoading: true
            }
        case staffConstants.ADD_APPOINTMENT_SUCCESS:
            return {
                ...state,
                ...action.payload,
                error: '',
                isLoading: false
            };
        case staffConstants.ADD_APPOINTMENT_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case staffConstants.DELETE_APPOINTMENT_SUCCESS:
            return {
                ...state,
                deleted: true,
                isLoading: false
            };
        case staffConstants.GET_APPOINTMENT_CUSTOM_SUCCESS:
            return {
                ...state,
                appointment: action.appointment,
                isLoading: false
            };
        case staffConstants.MOVE_VISIT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isStartMovingVisit: false,
                movedVisitSuccess: true,
                movingVisit: action.movingVisit
            }
        case staffConstants.GET_NEAREST_TIME_SUCCESS:
            return {
                ...state,
                nearestTime: action.nearestTime,
                isLoading: false
            };
        default:
            return state
    }
}
