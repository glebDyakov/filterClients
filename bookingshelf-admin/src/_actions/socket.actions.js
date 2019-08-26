import { socketConstants } from '../_constants';

export const socketActions = {
    alertSocketMessage,
    error,
    clear
};

function alertSocketMessage(appointmentSocketMessage) {
    return { type: socketConstants.SUCCESS, appointmentSocketMessage };
}

function error(message) {
    return { type: socketConstants.ERROR, message };
}

function clear() {
    return { type: socketConstants.CLEAR };
}