import { payrollConstants } from '../_constants';

const initialState = {
  payoutTypes: [],
  payoutByPeriod: [],
  payoutAnalytic: {},

  isLoadingAnalytic: false,
  isLoadingPeriod: false,
  isLoadingTypes: false,

  updatePayoutTypeStatus: 0,

  percentServiceGroups: [],
  percentServices: [],
  percentProducts: [],
};

export function payroll(state = initialState, action) {
  switch (action.type) {
    case payrollConstants.GET_ANALYTIC_SUCCESS:
      return {
        ...state,
        payoutAnalytic: action.payload.payoutAnalytic,
        isLoadingAnalytic: false,
      };
    case payrollConstants.GET_ANALYTIC_FAILURE:
      return {
        ...state,
        isLoadingAnalytic: false,
      };
    case payrollConstants.GET_ANALYTIC_REQUEST:
      return {
        ...state,
        isLoadingAnalytic: true,
      };
    case payrollConstants.GET_ANALYTIC_BY_PERIOD_SUCCESS:
      return {
        ...state,
        payoutByPeriod: action.payload.payoutByPeriod,
        isLoadingPeriod: false,
      };
    case payrollConstants.GET_ANALYTIC_BY_PERIOD_FAILURE:
      return {
        ...state,
        isLoadingPeriod: false,
      };
    case payrollConstants.GET_ANALYTIC_BY_PERIOD_REQUEST:
      return {
        ...state,
        isLoadingPeriod: true,
      };

    case payrollConstants.GET_PAYOUT_TYPES_SUCCESS:
      return {
        ...state,
        payoutTypes: action.payload.payoutTypes,
        isLoadingTypes: false,
      };
    case payrollConstants.GET_PAYOUT_TYPES_FAILURE:
      return {
        ...state,
        isLoadingTypes: false,
      };
    case payrollConstants.GET_PAYOUT_TYPES_REQUEST:
      return {
        ...state,
        isLoadingTypes: true,
      };


    case payrollConstants.UPDATE_PAYOUT_TYPE_SUCCESS:
      return {
        ...state,
        payoutTypes: state.payoutTypes.map((payoutType) =>
          action.payload.payoutType[0].staffPayoutTypeId === payoutType.staffPayoutTypeId
            ? action.payload.payoutType[0]
            : payoutType,
        ),
        updatePayoutTypeStatus: 200,
      };

    case payrollConstants.UPDATE_PAYOUT_TYPE_SUCCESS_TIME:
      return {
        ...state,
        updatePayoutTypeStatus: 0,
      };
    case payrollConstants.UPDATE_PAYOUT_TYPE_FAILURE:
      return {
        ...state,
        updatePayoutTypeStatus: 400,
      };
    case payrollConstants.UPDATE_PAYOUT_TYPE_REQUEST:
      return {
        ...state,
        updatePayoutTypeStatus: 0,
      };
    default:
      return state;
  }
}
