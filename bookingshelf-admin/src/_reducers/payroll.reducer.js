import { payrollConstants } from '../_constants';

const initialState = {
  payoutTypes: [],
  payoutByPeriod: [],
  analytic: {
    companyRevenue: 0,
    productsCost: 0,
    productsCount: 0,
    servicesCost: 0,
    servicesCount: 0,
    staffRevenue: 0,
    workedDays: 0,
    workedHours: 0,
  },

  isLoadingPayoutStats: false,
  isLoadingPeriod: false,

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

    case payrollConstants.GET_PAYOUT_BY_PERIOD_SUCCESS:
      return {
        ...state,
        isLoadingPeriod: false,
        payoutByPeriod: action.payload.payoutByPeriod,
      };

    case payrollConstants.GET_PAYOUT_BY_PERIOD_FAILURE:
      return {
        ...state,
        isLoadingPeriod: false,
        payoutByPeriod: [],
      };

    case payrollConstants.GET_PAYOUT_BY_PERIOD_REQUEST:
      return {
        ...state,
        isLoadingPeriod: true,
        payoutByPeriod: [],
      };


    case payrollConstants.ADD_PAYOUT_TYPES_SUCCESS:
      return {
        ...state,
        // payoutTypes: biggerTArray.map(bsg => lesserTArray.find(lsg => lsg.staffPayoutTypeId === bsg.staffPayoutTypeId) || bsg),
      };

    case payrollConstants.GET_PAYOUT_STATS_SUCCESS:
      return {
        ...state,
        isLoadingPayoutStats: false,
        analytic: action.payload.payoutAnalytic,
      };

    case payrollConstants.GET_PAYOUT_STATS_REQUEST:
      return {
        ...state,
        isLoadingPayoutStats: true,
      };

    case payrollConstants.GET_PAYOUT_STATS_FAILURE:
      return {
        ...state,
        isLoadingPayoutStats: false,
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
      // TODO:

      return {
        ...state,
      };

    case payrollConstants.UPDATE_PERCENT_SERVICE_GROUPS_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_PERCENT_SERVICES_SUCCESS:

      return {
        ...state,
      };

    case payrollConstants.UPDATE_PERCENT_SERVICES_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_PERCENT_PRODUCTS_SUCCESS:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_PERCENT_PRODUCTS_FAILURE:
      return {
        ...state,
      };


    case payrollConstants.UPDATE_ONE_SERVICE_SUCCESS:
      return {
        ...state,
        percentServices: state.percentServices.flatMap(ps => action.payload.percentService.map(aps => ps.serviceId === aps.serviceId ? aps : ps)),
      };
    case payrollConstants.UPDATE_ONE_PRODUCT_SUCCESS:
      return {
        ...state,
        percentProducts: state.percentProducts.flatMap(pp => action.payload.percentProduct.map(app => pp.productId === app.productId ? app : pp)),
      };
    case payrollConstants.UPDATE_ONE_SERVICE_GROUP_SUCCESS:
      return {
        ...state,
        percentServiceGroups: state.percentProducts.flatMap(psg => action.payload.serviceGroup.map(apsg => psg.serviceGroupId === apsg.serviceGroupId ? apsg : psg)),
      };
    default:
      return state;
  }
}
