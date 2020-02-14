import { appointmentConstants } from '../_constants';

const initialState = {
    blickClientId: null,
    movingVisit: null,
    movingVisitDuration: 0,
    movingVisitMillis: 0,
    movingVisitStaffId: null,
    prevVisitStaffId: null,
}

export function appointment(state = initialState, action) {
    switch (action.type) {
        case appointmentConstants.START_MOVING_VISIT_SUCCESS:
        case appointmentConstants.APPOINTMENT_TOGGLE_BY_KEY:
        case appointmentConstants.MOVE_VISIT_SUCCESS:
        case appointmentConstants.TOGGLE_BLICKED_CLIENTID:
        case appointmentConstants.TOGGLE_SELECTED_NOTE:
            return {
                ...state,
                ...action.payload
            }

        default:
            return state
    }
}