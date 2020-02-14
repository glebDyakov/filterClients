import { appointmentConstants } from '../_constants';

export const appointmentActions = {
    toggleSelectedNote,
    toggleBlickedClientId,
};

function toggleSelectedNote(selectedNote) {
    return { type: appointmentConstants.TOGGLE_SELECTED_NOTE, payload: { selectedNote } };
}

function toggleBlickedClientId(blickClientId) {
    return { type: appointmentConstants.TOGGLE_BLICKED_CLIENTID, payload: { blickClientId } };
}
