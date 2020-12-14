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
  percentServiceGroups: [],
  percentServices: [],
  percentProducts: [],
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

    case payrollConstants.GET_PERCENT_SERVICE_GROUPS_SUCCESS:
      return {
        ...state,
        percentServiceGroups: action.payload.percentServiceGroups,
      };

    case payrollConstants.GET_PERCENT_SERVICE_GROUPS_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.GET_PERCENT_SERVICES_SUCCESS:
      return {
        ...state,
        percentServices: action.payload.percentServices,
      };

    case payrollConstants.GET_PERCENT_SERVICES_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.GET_PERCENT_PRODUCTS_SUCCESS:
      return {
        ...state,
        percentProducts: action.payload.percentProducts,
      };

    case payrollConstants.GET_PERCENT_PRODUCTS_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.ADD_PERCENT_SERVICE_GROUP_SUCCESS:
      return {
        ...state,
      };

    case payrollConstants.ADD_PERCENT_SERVICE_GROUP_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.ADD_PERCENT_SERVICE_SUCCESS:
      return {
        ...state,
      };

    case payrollConstants.ADD_PERCENT_SERVICE_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.ADD_PERCENT_PRODUCT_SUCCESS:
      return {
        ...state,
      };

    case payrollConstants.ADD_PERCENT_PRODUCT_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
}
