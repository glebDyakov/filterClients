import { cellConstants } from '../_constants';

const initialState = {
    selectedDays: []
}

export function cell(state = initialState, action) {
    switch (action.type) {
        case cellConstants.CELL_TOGGLE_BY_KEY:
            return {
                ...state,
                ...action.payload
            }

        default:
            return state
    }
}