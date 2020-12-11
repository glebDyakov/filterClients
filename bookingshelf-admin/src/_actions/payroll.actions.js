import { payrollService } from '../_services';
import { payrollConstants } from '../_constants';


export const payrollActions = {
  getPayoutTypes,
  addPayoutType
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
