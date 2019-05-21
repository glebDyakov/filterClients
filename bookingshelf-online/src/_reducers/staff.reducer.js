import {staffConstants} from '../_constants';

export function staff(state= {}, action) {
    switch (action.type) {

        case staffConstants.GET_SUCCESS:
            return {
                ...state,
                staff: action.staff
            };
        case staffConstants.GET_SERVICES_SUCCESS:
            return {
                ...state,
                services: action.services
            };
        case staffConstants.GET_INFO_SUCCESS:
            return {
                ...state,
                info: action.info
            };
        case staffConstants.GET_TIMETABLE_SUCCESS:
            return {
                ...state,
                timetable: action.timetable
            };
        case staffConstants.GET_TIMETABLE_AVAILABLE_SUCCESS:
            return {
                ...state,
                timetableAvailable: action.timetableAvailable
            };
        case staffConstants.ADD_APPOINTMENT_SUCCESS:
            return {
                ...state,
                newAppointment: action.appointment
            };
        case staffConstants.DELETE_APPOINTMENT_SUCCESS:
            return {
                ...state,
                deleted: true
            };
        case staffConstants.GET_APPOINTMENT_CUSTOM_SUCCESS:
            return {
                ...state,
                appointment: action.appointment
            };
        case staffConstants.GET_NEAREST_TIME_SUCCESS:
            return {
                ...state,
                nearestTime: action.nearestTime
            };
        default:
            return state
    }
}