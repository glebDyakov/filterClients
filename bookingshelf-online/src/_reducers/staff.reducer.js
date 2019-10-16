import {staffConstants} from '../_constants';

const initialState = {
    error: '',
    isLoading: false
}

export function staff(state= initialState, action) {
    switch (action.type) {

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
        case staffConstants.DELETE_APPOINTMENT:
            return {
                ...state,
                isLoading: true
            };
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
