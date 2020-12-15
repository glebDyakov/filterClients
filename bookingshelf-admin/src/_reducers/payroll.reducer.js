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

    case payrollConstants.ADD_PAYOUT_TYPES_SUCCESS:
      return {
        ...state,
        payoutTypes: [...state.payoutTypes, action.payload.payoutType],
      };

    case payrollConstants.GET_PAYOUT_STATS_SUCCESS:
      return {
        ...state,
        analytic: action.payload.payoutAnalytic,
      };

    case payrollConstants.ADD_PAYOUT_TYPES_FAILURE:
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

    case payrollConstants.UPDATE_PERCENT_SERVICE_GROUPS_SUCCESS:
      const biggerSGArray = action.payload.percentServiceGroups.length > state.percentServiceGroups.length
        ? action.payload.percentServiceGroups
        : state.percentServiceGroups;

      const lesserSGArray = action.payload.percentServiceGroups.length <= state.percentServiceGroups.length
        ? action.payload.percentServiceGroups
        : state.percentServiceGroups;

      return {
        ...state,
        percentServiceGroups: biggerSGArray.map(bsg => lesserSGArray.find(lsg => lsg.serviceGroupId === bsg.serviceGroupId) || bsg),
      };

    case payrollConstants.UPDATE_PERCENT_SERVICE_GROUPS_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_PERCENT_SERVICES_SUCCESS:
      const biggerSArray = action.payload.percentServices.length > state.percentServices.length
        ? action.payload.percentServices
        : state.percentServices;

      const lesserSArray = action.payload.percentServices.length <= state.percentServices.length
        ? action.payload.percentServices
        : state.percentServices;

      return {
        ...state,
        percentServices: biggerSArray.map(bsg => lesserSArray.find(lsg => lsg.serviceId === bsg.serviceId) || bsg),
      };

    case payrollConstants.UPDATE_PERCENT_SERVICES_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_PERCENT_PRODUCTS_SUCCESS:
      const biggerPArray = action.payload.percentProducts.length > state.percentProducts.length
        ? action.payload.percentProducts
        : state.percentProducts;

      const lesserPArray = action.payload.percentProducts.length <= state.percentProducts.length
        ? action.payload.percentProducts
        : state.percentProducts;

      return {
        ...state,
        percentProducts: biggerPArray.map(bsg => lesserPArray.find(lsg => lsg.serviceId === bsg.serviceId) || bsg),
      };

    case payrollConstants.UPDATE_PERCENT_PRODUCTS_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
}
