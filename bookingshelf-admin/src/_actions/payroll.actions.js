import { payrollService } from '../_services';
import { payrollConstants } from '../_constants';


export const payrollActions = {
  getPayoutTypes,
  addPayoutTypes,
  getPayoutAnalytic,
  getPercentServiceGroups,
  getPercentServices,
  getPercentProducts,

  updatePercentProducts,
  updatePercentServices,
  updatePercentServiceGroups
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

function addPayoutTypes(payout) {
  return (dispatch) => {
    payrollService.addPayoutTypes(payout)
      .then(
        (payoutTypes) => {
          dispatch(success(payoutTypes));
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutType) {
    return { type: payrollConstants.ADD_PAYOUT_TYPES_SUCCESS, payload: { payoutType } };
  }

  function failure() {
    return { type: payrollConstants.ADD_PAYOUT_TYPES_FAILURE };
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


















function updatePercentProducts(staffId, percentProducts) {
  return (dispatch) => {
    payrollService.updatePercentProducts(staffId, percentProducts)
      .then(
        (percentProducts) => {
          dispatch(success(percentProducts));
        },
        () => dispatch(failure()),
      );
  };

  function success(percentProducts) {
    return { type: payrollConstants.UPDATE_PERCENT_PRODUCTS_SUCCESS, payload: { percentProducts } };
  }

  function failure() {
    return { type: payrollConstants.UPDATE_PERCENT_PRODUCTS_FAILURE };
  }
}

function updatePercentServices(staffId, percentServices) {
  return (dispatch) => {
    payrollService.updatePercentServices(staffId, percentServices)
      .then(
        (percentServices) => {
          dispatch(success(percentServices));
        },
        () => dispatch(failure()),
      );
  };

  function success(percentServices) {
    return { type: payrollConstants.UPDATE_PERCENT_SERVICES_SUCCESS, payload: { percentServices } };
  }

  function failure() {
    return { type: payrollConstants.UPDATE_PERCENT_SERVICES_FAILURE };
  }
}

function updatePercentServiceGroups(staffId, percentServiceGroups) {
  return (dispatch) => {
    payrollService.updatePercentServiceGroups(staffId, percentServiceGroups)
      .then(
        (percentServiceGroups) => {
          dispatch(success(percentServiceGroups));
        },
        () => dispatch(failure()),
      );
  };

  function success(percentServiceGroups) {
    return { type: payrollConstants.UPDATE_PERCENT_SERVICE_GROUPS_SUCCESS, payload: { percentServiceGroups } };
  }

  function failure() {
    return { type: payrollConstants.UPDATE_PERCENT_SERVICE_GROUPS_FAILURE };
  }
}

