import { modalsConstants } from '../_constants';

const initialState = {};

export function modals(state = initialState, action) {
  switch (action.type) {
    case modalsConstants.MODALS_TOGGLE_BY_KEY:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
