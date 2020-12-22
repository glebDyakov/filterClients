import { payrollConstants } from '../_constants';

const initialState = {
  payoutTypes: [],
  payoutByPeriod: [],
  payoutAnalytic: {},

  isLoadingAnalytic: false,
  isLoadingPeriod: false,
  isLoadingTypes: false,

  isLoadingServicesPercent: false,
  isLoadingServiceGroupsPercent: false,
  isLoadingProductsPercent: false,

  productsSaveStatus: 0,
  servicesSaveStatus: 0,
  serviceGroupsSaveStatus: 0,

  updatePayoutTypeStatus: 0,

  servicesPercent: [],
  serviceGroupsPercent: [],
  productsPercent: [],
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


    case payrollConstants.GET_SERVICES_PERCENT_SUCCESS:
      return {
        ...state,
        isLoadingServicesPercent: false,
        servicesPercent: action.payload.servicesPercent,
      };

    case payrollConstants.GET_SERVICES_PERCENT_FAILURE:
      return {
        ...state,
        isLoadingServicesPercent: false,
      };

    case payrollConstants.GET_SERVICES_PERCENT_REQUEST:
      return {
        ...state,
        isLoadingServicesPercent: true,
      };

    case payrollConstants.GET_PRODUCTS_PERCENT_SUCCESS:
      return {
        ...state,
        isLoadingProductsPercent: false,
        productsPercent: action.payload.productsPercent,
      };

    case payrollConstants.GET_PRODUCTS_PERCENT_FAILURE:
      return {
        ...state,
        isLoadingProductsPercent: false,
      };

    case payrollConstants.GET_PRODUCTS_PERCENT_REQUEST:
      return {
        ...state,
        isLoadingProductsPercent: true,
      };

    case payrollConstants.GET_SERVICE_GROUPS_PERCENT_SUCCESS:
      return {
        ...state,
        isLoadingServiceGroupsPercent: false,
        serviceGroupsPercent: action.payload.serviceGroupsPercent,
      };

    case payrollConstants.GET_SERVICE_GROUPS_PERCENT_FAILURE:
      return {
        ...state,
        isLoadingServiceGroupsPercent: false,
      };

    case payrollConstants.GET_SERVICE_GROUPS_PERCENT_REQUEST:
      return {
        ...state,
        isLoadingServiceGroupsPercent: true,
      };


    case payrollConstants.UPDATE_PRODUCTS_PERCENT_SUCCESS:
      let newPArr = state.productsPercent;
      action.payload.productsPercent.map(productPercent => {
        newPArr = createOrUpdate(newPArr, productPercent, 'productId');
      });

      return {
        ...state,
        productsPercent: newPArr,
        productsSaveStatus: 200,
      };

    case payrollConstants.UPDATE_PRODUCTS_PERCENT_SUCCESS_TIME:
      return {
        ...state,
        productsSaveStatus: 0
      };

    case payrollConstants.UPDATE_PRODUCTS_PERCENT_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_PRODUCTS_PERCENT_REQUEST:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_SERVICES_PERCENT_SUCCESS:
      let newSArr = state.servicesPercent;
      action.payload.servicesPercent.map(servicePercent => {
        newSArr = createOrUpdate(newSArr, servicePercent, 'serviceId');
      });

      return {
        ...state,
        servicesPercent: newSArr,
        servicesSaveStatus: 200
      };

    case payrollConstants.UPDATE_SERVICES_PERCENT_SUCCESS_TIME:
      return {
        ...state,
        servicesSaveStatus: 0
      };

    case payrollConstants.UPDATE_SERVICES_PERCENT_FAILURE:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_SERVICES_PERCENT_REQUEST:
      return {
        ...state,
      };

    case payrollConstants.UPDATE_SERVICE_GROUPS_PERCENT_SUCCESS:
      let newSgArr = state.serviceGroupsPercent;
      action.payload.serviceGroupsPercent.map(serviceGroupPercent => {
        newSgArr = createOrUpdate(newSgArr, serviceGroupPercent, 'serviceGroupId');
      });

      return {
        ...state,
        serviceGroupsPercent: newSgArr,
        serviceGroupsSaveStatus: 200,
      };

    case payrollConstants.UPDATE_SERVICE_GROUPS_PERCENT_SUCCESS_TIME:
      return {
        ...state,
        serviceGroupsSaveStatus: 0,
      }
    default:
      return state;
  }
}

function createOrUpdate(prevArr, item, field) {
  console.log('prev', prevArr, 'item', item);
  const find = prevArr.find(i => i[field] === item[field]);
  if (find) {
    return prevArr.map(i => {
      if (i[field] === item[field]) console.log(i[field] === item[field] ? item : i);
      return i[field] === item[field] ? item : i;
    });
  } else {
    prevArr.push(item);
  }
  return prevArr;
}
