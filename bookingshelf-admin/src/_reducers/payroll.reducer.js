import { payrollConstants } from '../_constants';

const initialState = {
  payoutTypes: [],
};

export function payroll(state = initialState, action) {
  switch (action.type) {
    case payrollConstants.GET_PAYOUT_TYPES_SUCCESS:
      return {
        payoutTypes: action.payload.payoutTypes,
      };

    case payrollConstants.GET_PAYOUT_TYPES_FAILURE:
      return state;

    case payrollConstants.ADD_PAYOUT_TYPE_SUCCESS:
      return {
        payoutTypes: [...state.payoutTypes, action.payload.payoutType],
      };

    case payrollConstants.ADD_PAYOUT_TYPE_FAILURE:
      return state;
    default:
      return state;
  }
}
