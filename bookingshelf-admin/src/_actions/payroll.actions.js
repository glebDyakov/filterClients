import { payrollService } from '../_services';
import { payrollConstants } from '../_constants';
import { staff } from '../_reducers/staff.reducer';


export const payrollActions = {
  getPayoutTypes,
  addPayoutTypes,
  getPayoutAnalytic,
  getPercentServiceGroups,
  getPercentServices,
  getPercentProducts,
  getPayoutByPeriod,

  updatePercentProducts,
  updatePercentServices,
  updatePercentServiceGroups,


  updateOneServicePercent,
  updateOneProductPercent,
  updateOneServiceGroupPercent,
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
    return { type: payrollConstants.GET_PAYOUT_STATS_SUCCESS, payload: { payoutAnalytic } };
  }

  function failure() {
    return { type: payrollConstants.GET_PAYOUT_STATS_FAILURE };
  }

  function request() {
    return { type: payrollConstants.GET_PAYOUT_STATS_REQUEST };
  }
}

function addPayoutTypes(staffId, payout) {
  return (dispatch) => {
    payrollService.addPayoutTypes(staffId, payout)
      .then(
        (payoutTypes) => {
          dispatch(payrollActions.getPayoutTypes(staffId));
          dispatch(success());
          setTimeout(() => {
            dispatch(success_time());
          }, 500)
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutTypes) {
    return { type: payrollConstants.ADD_PAYOUT_TYPES_SUCCESS };
  }

  function success_time(payoutTypes) {
    return { type: payrollConstants.ADD_PAYOUT_TYPES_SUCCESS_TIME };
  }

  function failure() {
    return { type: payrollConstants.ADD_PAYOUT_TYPES_FAILURE };
  }

  function request() {
    return { type: payrollConstants.ADD_PAYOUT_TYPES_REQUEST };
  }
}

//   getPercentServices,
//   getPercentProducts,

function getPercentServiceGroups(staffId) {
  return (dispatch) => {
    dispatch(request());
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

  function request() {
    return { type: payrollConstants.GET_PERCENT_SERVICE_GROUPS_REQUEST };
  }
}

function getPercentServices(staffId) {
  return (dispatch) => {
    dispatch(request());
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

  function request() {
    return { type: payrollConstants.GET_PERCENT_SERVICES_REQUEST };
  }
}

function getPercentProducts(staffId) {
  return (dispatch) => {
    dispatch(request());
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

  function request() {
    return { type: payrollConstants.GET_PERCENT_PRODUCTS_REQUEST };
  }
}

function getPayoutByPeriod(staffId, dateFrom, dateTo) {
  return (dispatch) => {
    dispatch(request());
    payrollService.getPayoutByPeriod(staffId, dateFrom, dateTo)
      .then(
        (payoutByPeriod) => {
          dispatch(success(payoutByPeriod));
        },
        () => dispatch(failure()),
      );
  };

  function success(payoutByPeriod) {
    return { type: payrollConstants.GET_PAYOUT_BY_PERIOD_SUCCESS, payload: { payoutByPeriod } };
  }

  function failure() {
    return { type: payrollConstants.GET_PAYOUT_BY_PERIOD_FAILURE };
  }

  function request() {
    return { type: payrollConstants.GET_PAYOUT_BY_PERIOD_REQUEST };
  }
}

function updatePercentProducts(staffId, percentProducts) {
  return (dispatch) => {
    dispatch(request());
    payrollService.updatePercentProducts(staffId, percentProducts)
      .then(
        (percentProducts) => {
          // dispatch(success(percentProducts));
          dispatch(payrollActions.getPercentProducts(staffId));
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

  function request() {
    return { type: payrollConstants.UPDATE_PERCENT_PRODUCTS_REQUEST };
  }
}

function updatePercentServices(staffId, percentServices) {
  return (dispatch) => {
    dispatch(request());
    payrollService.updatePercentServices(staffId, percentServices)
      .then(
        (percentServices) => {
          // dispatch(success(percentServices));
          dispatch(payrollActions.getPercentServices(staffId));

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

  function request() {
    return { type: payrollConstants.UPDATE_PERCENT_SERVICES_REQUEST };
  }
}

function updatePercentServiceGroups(staffId, percentServiceGroups) {
  return (dispatch) => {
    dispatch(request());
    payrollService.updatePercentServiceGroups(staffId, percentServiceGroups)
      .then(
        (percentServiceGroups) => {
          // dispatch(success(percentServiceGroups));
          dispatch(payrollActions.getPercentServiceGroups(staffId));
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

  function request() {
    return { type: payrollConstants.UPDATE_PERCENT_SERVICE_GROUPS_REQUEST };
  }
}

function updateOneServicePercent(staffId, percentService) {
  return (dispatch) => {
    payrollService.updatePercentServices(staffId, percentService)
      .then(
        (percentService) => {
          dispatch(success(percentService));
        },
      );
  };

  function success(percentService) {
    return { type: payrollConstants.UPDATE_ONE_SERVICE_SUCCESS, payload: { percentService } };
  }
}

function updateOneProductPercent(staffId, percentProduct) {
  return (dispatch) => {
    payrollService.updatePercentProducts(staffId, percentProduct)
      .then(
        (percentProduct) => {
          dispatch(success(percentProduct));
        },
      );
  };

  function success(percentProduct) {
    return { type: payrollConstants.UPDATE_ONE_PRODUCT_SUCCESS, payload: { percentProduct } };
  }
}

function updateOneServiceGroupPercent(staffId, serviceGroup) {
  return (dispatch) => {
    payrollService.updatePercentServiceGroups(staffId, serviceGroup)
      .then(
        (serviceGroup) => {
          dispatch(success(serviceGroup));
        },
      );
  };

  function success(serviceGroup) {
    return { type: payrollConstants.UPDATE_ONE_SERVICE_GROUP_SUCCESS, payload: { serviceGroup } };
  }
}
