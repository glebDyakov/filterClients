import { socketConstants } from '../_constants';

export function socket(state = {}, action) {
    switch (action.type) {
        case socketConstants.SUCCESS:
            return {
                ...state,
                appointmentSocketMessage: action.appointmentSocketMessage
            };
        default:
            return state
    }
}