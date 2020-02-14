import { appointmentConstants } from '../_constants';

const initialState = {
    blickClientId: null
}

export function appointment(state = initialState, action) {
    switch (action.type) {
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