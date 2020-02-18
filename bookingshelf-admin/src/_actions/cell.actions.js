import { cellConstants } from '../_constants';

export const cellActions = {
    togglePayload,
};

function togglePayload(payload) {
    return { type: cellConstants.CELL_TOGGLE_BY_KEY, payload };
}
