import { modalsConstants } from '../_constants';

export const modalsActions = {
  togglePayload,
};

function togglePayload(payload) {
  return { type: modalsConstants.MODALS_TOGGLE_BY_KEY, payload };
}
