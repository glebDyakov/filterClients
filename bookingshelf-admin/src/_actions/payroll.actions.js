import { payrollService } from '../_services';
import { payrollConstants } from '../_constants';


export const payrollActions = {
  getPayoutTypes,
  getPayoutAnalytic,
  getPeriodAnalytic,
  updatePayoutType,
  getServicesPercent,
  getProductsPercent,
  getServiceGroupsPercent,
  updateProductsPercent,
  updateServicesPercent
};

function getPayoutTypes(staffId) {
  return (dispatch) => {
    dispatch(request());
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

  function request() {
    return { type: payrollConstants.GET_PAYOUT_TYPES_REQUEST };
  }
}

function getPayoutAnalytic(staffId, dateFrom, dateTo) {
  return (dispatch) => {
    dispatch(request());
    payrollService.getPayoutAnalytic(staffId, dateFrom, dateTo)
      .then(
        (payoutAnalytic) => {
          dispatch(success(payoutAnalytic));
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutAnalytic) {
    return { type: payrollConstants.GET_ANALYTIC_SUCCESS, payload: { payoutAnalytic } };
  }

  function failure() {
    return { type: payrollConstants.GET_ANALYTIC_FAILURE };
  }

  function request() {
    return { type: payrollConstants.GET_ANALYTIC_REQUEST };
  }
}

function getPeriodAnalytic(staffId, dateFrom, dateTo) {
  return (dispatch) => {
    dispatch(request());
    payrollService.getAnalyticByPeriod(staffId, dateFrom, dateTo)
      .then(
        (payoutByPeriod) => {
          dispatch(success(payoutByPeriod));
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutByPeriod) {
    return { type: payrollConstants.GET_ANALYTIC_BY_PERIOD_SUCCESS, payload: { payoutByPeriod } };
  }

  function failure() {
    return { type: payrollConstants.GET_ANALYTIC_BY_PERIOD_FAILURE };
  }

  function request() {
    return { type: payrollConstants.GET_ANALYTIC_BY_PERIOD_REQUEST };
  }
}

function updatePayoutType(staffId, payoutType) {
  return (dispatch) => {
    dispatch(request());
    payrollService.updatePayoutType(staffId, [payoutType])
      .then(
        (payoutType) => {
          dispatch(success(payoutType));
          setTimeout(() => {
            dispatch(success_time());
          }, 500);
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutType) {
    return { type: payrollConstants.UPDATE_PAYOUT_TYPE_SUCCESS, payload: { payoutType } };
  }

  function success_time(payoutType) {
    return { type: payrollConstants.UPDATE_PAYOUT_TYPE_SUCCESS_TIME, payload: { payoutType } };
  }

  function failure() {
    return { type: payrollConstants.UPDATE_PAYOUT_TYPE_FAILURE };
  }

  function request() {
    return { type: payrollConstants.UPDATE_PAYOUT_TYPE_REQUEST };
  }
}

function getServicesPercent(staffId) {
  return (dispatch) => {
    dispatch(request());
    payrollService.getPercents(staffId, 'services')
      .then(
        (servicesPercent) => {
          dispatch(success(servicesPercent));
        },
        () => dispatch(failure()),
      );
  };

  function success(servicesPercent) {
    return { type: payrollConstants.GET_SERVICES_PERCENT_SUCCESS, payload: { servicesPercent } };
  }

  function failure() {
    return { type: payrollConstants.GET_SERVICES_PERCENT_FAILURE };
  }

  function request() {
    return { type: payrollConstants.GET_SERVICES_PERCENT_REQUEST };
  }
}

function getProductsPercent(staffId) {
  return (dispatch) => {
    dispatch(request());
    payrollService.getPercents(staffId, 'products')
      .then(
        (productsPercent) => {
          dispatch(success(productsPercent));
        },
        () => dispatch(failure()),
      );
  };

  function success(productsPercent) {
    return { type: payrollConstants.GET_PRODUCTS_PERCENT_SUCCESS, payload: { productsPercent } };
  }

  function failure() {
    return { type: payrollConstants.GET_PRODUCTS_PERCENT_FAILURE };
  }

  function request() {
    return { type: payrollConstants.GET_PRODUCTS_PERCENT_REQUEST };
  }
}

function getServiceGroupsPercent(staffId) {
  return (dispatch) => {
    dispatch(request());
    payrollService.getPercents(staffId, 'servicegroups')
      .then(
        (serviceGroupsPercent) => {
          dispatch(success(serviceGroupsPercent));
        },
        () => dispatch(failure()),
      );
  };

  function success(serviceGroupsPercent) {
    return { type: payrollConstants.GET_SERVICE_GROUPS_PERCENT_SUCCESS, payload: { serviceGroupsPercent } };
  }

  function failure() {
    return { type: payrollConstants.GET_SERVICE_GROUPS_PERCENT_FAILURE };
  }

  function request() {
    return { type: payrollConstants.GET_SERVICE_GROUPS_PERCENT_REQUEST };
  }
}


function updateProductsPercent(staffId, productsPercent) {
  return (dispatch) => {
    dispatch(request());
    payrollService.updatePercents(staffId, 'products', productsPercent)
      .then(
        (productsPercent) => {
          dispatch(success(productsPercent));
          dispatch(payrollActions.getProductsPercent(staffId));
          setTimeout(() => {
            dispatch(success_time());
          }, 500);
        },
        () => dispatch(failure()),
      );
  };

  function success(productsPercent) {
    return { type: payrollConstants.UPDATE_PRODUCTS_PERCENT_SUCCESS, payload: { productsPercent } };
  }

  function success_time() {
    return { type: payrollConstants.UPDATE_PRODUCTS_PERCENT_SUCCESS_TIME };
  }

  function failure() {
    return { type: payrollConstants.UPDATE_PRODUCTS_PERCENT_FAILURE };
  }

  function request() {
    return { type: payrollConstants.UPDATE_PRODUCTS_PERCENT_REQUEST };
  }
}

function updateServicesPercent(staffId, servicesPercent) {
  return (dispatch) => {
    dispatch(request());
    payrollService.updatePercents(staffId, 'services', servicesPercent)
      .then(
        (servicesPercent) => {
          dispatch(payrollActions.getServicesPercent(staffId));
          setTimeout(() => {
            dispatch(success_time());
          }, 500);
        },
        () => dispatch(failure()),
      );
  };

  function success(servicesPercent) {
    return { type: payrollConstants.UPDATE_SERVICES_PERCENT_SUCCESS, payload: { servicesPercent } };
  }

  function success_time() {
    return { type: payrollConstants.UPDATE_SERVICES_PERCENT_SUCCESS_TIME };
  }

  function failure() {
    return { type: payrollConstants.UPDATE_SERVICES_PERCENT_FAILURE };
  }

  function request() {
    return { type: payrollConstants.UPDATE_SERVICES_PERCENT_REQUEST };
  }
}
