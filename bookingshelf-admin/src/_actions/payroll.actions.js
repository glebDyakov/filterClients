import { payrollService } from '../_services';
import { payrollConstants } from '../_constants';


export const payrollActions = {
  getPayoutTypes,
  getPayoutAnalytic,
  getPeriodAnalytic,
  updatePayoutType,
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
