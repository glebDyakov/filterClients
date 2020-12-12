import { payrollConstants } from '../_constants';

const initialState = {
  payoutTypes: [],
  analytic: {
    companyRevenue: 0,
    productCount: 0,
    productsPricesAmount: 0,
    servicesAmount: 0,
    servicesCount: 0,
    staffRevenue: 0,
    workedDays: 0,
    workedHours: 0,
  },
};

export function payroll(state = initialState, action) {
  switch (action.type) {
    case payrollConstants.GET_PAYOUT_TYPES_SUCCESS:
      return {
        ...state,
        payoutTypes: action.payload.payoutTypes,
      };

    case payrollConstants.GET_PAYOUT_TYPES_FAILURE:
      return state;

    case payrollConstants.ADD_PAYOUT_TYPE_SUCCESS:
      return {
        ...state,
        payoutTypes: [...state.payoutTypes, action.payload.payoutType],
      };

    case payrollConstants.GET_PAYOUT_STATS_SUCCESS:
      return {
        ...state,
        analytic: action.payload.payoutAnalytic,
      };

    case payrollConstants.ADD_PAYOUT_TYPE_FAILURE:
      return state;
    default:
      return state;
  }
}
