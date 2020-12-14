import { payrollService } from '../_services';
import { payrollConstants } from '../_constants';


export const payrollActions = {
  getPayoutTypes,
  addPayoutType,
  getPayoutAnalytic,
  getPercentServiceGroups,
  getPercentServices,
  getPercentProducts,
};

function getPayoutTypes(staffId) {
  return (dispatch) => {
    payrollService.getPayoutTypes(staffId)
      .then(
        (payoutTypes) => {
          dispatch(success(payoutTypes));
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutTypes) {
    return { type: payrollConstants.GET_PAYOUT_TYPES_SUCCESS, payload: { payoutTypes } };
  }

  function failure() {
    return { type: payrollConstants.GET_PAYOUT_TYPES_FAILURE };
  }
}

function getPayoutAnalytic(staffId, dateFrom, dateTo) {
  return (dispatch) => {
    payrollService.getPayoutAnalytic(staffId, dateFrom, dateTo)
      .then(
        (payoutAnalytic) => {
          dispatch(success(payoutAnalytic));
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutAnalytic) {
    return { type: payrollConstants.GET_PAYOUT_STATS_SUCCESS, payload: { payoutAnalytic } };
  }

  function failure() {
    return { type: payrollConstants.GET_PAYOUT_STATS_FAILURE };
  }
}

function addPayoutType(payout) {
  return (dispatch) => {
    payrollService.addPayoutType(payout)
      .then(
        (payoutType) => {
          dispatch(success(payoutType));
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutType) {
    return { type: payrollConstants.ADD_PAYOUT_TYPE_SUCCESS, payload: { payoutType } };
  }

  function failure() {
    return { type: payrollConstants.ADD_PAYOUT_TYPE_FAILURE };
  }
}

//   getPercentServices,
//   getPercentProducts,

function getPercentServiceGroups(staffId) {
  return (dispatch) => {
    payrollService.getPercentServiceGroups(staffId)
      .then(
        (percentServiceGroups) => {
          dispatch(success(percentServiceGroups));
        },
        () => dispatch(failure()),
      );
  };

  function success(percentServiceGroups) {
    return { type: payrollConstants.GET_PERCENT_SERVICE_GROUPS_SUCCESS, payload: { percentServiceGroups } };
  }

  function failure() {
    return { type: payrollConstants.GET_PERCENT_SERVICE_GROUPS_FAILURE };
  }
}

function getPercentServices(staffId) {
  return (dispatch) => {
    payrollService.getPercentServices(staffId)
      .then(
        (percentServices) => {
          dispatch(success(percentServices));
        },
        () => dispatch(failure()),
      );
  };

  function success(percentServices) {
    return { type: payrollConstants.GET_PERCENT_SERVICES_SUCCESS, payload: { percentServices } };
  }

  function failure() {
    return { type: payrollConstants.GET_PERCENT_SERVICES_FAILURE };
  }
}

function getPercentProducts(staffId) {
  return (dispatch) => {
    payrollService.getPercentProducts(staffId)
      .then(
        (percentProducts) => {
          dispatch(success(percentProducts));
        },
        () => dispatch(failure()),
      );
  };

  function success(percentProducts) {
    return { type: payrollConstants.GET_PERCENT_PRODUCTS_SUCCESS, payload: { percentProducts } };
  }

  function failure() {
    return { type: payrollConstants.GET_PERCENT_PRODUCTS_FAILURE };
  }
}
