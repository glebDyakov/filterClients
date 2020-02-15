import { appointmentConstants } from '../_constants';
import moment from "moment";
import {calendarActions} from "./calendar.actions";
import {isAvailableTime} from "../_helpers/available-time";

export const appointmentActions = {
    togglePayload,
    toggleSelectedNote,
    toggleBlickedClientId,
    toggleMoveVisit,
    toggleStartMovingVisit,
    makeMovingVisitQuery
};

function toggleSelectedNote(selectedNote) {
    return { type: appointmentConstants.TOGGLE_SELECTED_NOTE, payload: { selectedNote } };
}

function toggleBlickedClientId(blickClientId) {
    return { type: appointmentConstants.TOGGLE_BLICKED_CLIENTID, payload: { blickClientId } };
}


function toggleMoveVisit(isMoveVisit) {
    return dispatch => {
        dispatch(success(isMoveVisit))
    }
    function success(isMoveVisit) { return { type: appointmentConstants.MOVE_VISIT_SUCCESS, payload: { isMoveVisit } } }
}

function toggleStartMovingVisit(isStartMovingVisit) {
    return dispatch => {
        dispatch(success(isStartMovingVisit))
    }
    function success(isStartMovingVisit) { return { type: appointmentConstants.START_MOVING_VISIT_SUCCESS, payload: { isStartMovingVisit } } }
}

function togglePayload(payload) {
    return { type: appointmentConstants.APPOINTMENT_TOGGLE_BY_KEY, payload };
}

function makeMovingVisitQuery(data) {
    return dispatch => {
        const { appointments, reservedTimes, timetable, movingVisit, movingVisitDuration, movingVisitStaffId, movingVisitMillis, prevVisitStaffId } = data

        let shouldMove = true

        const startDay = moment(movingVisitMillis, 'x').format('D')
        const endDay = moment((movingVisitMillis + (movingVisitDuration * 1000)), 'x').format('D')
        if (startDay !== endDay) {
            shouldMove = false
        }

        if (shouldMove) {
            shouldMove = false;

            const movingVisitEndTime = movingVisitMillis + (movingVisitDuration * 1000);

            const timetableItems = timetable
                .filter(item => item.staffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === item.staffId)))


            const intervals = []

            for (let i = movingVisitMillis; i < movingVisitEndTime; i += 15 * 60000) {
                intervals.push(i)
            }



            timetableItems.forEach(timetableItem => {
                const checkOnMovingVisit = i => (
                    (prevVisitStaffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === timetableItem.staffId))) &&
                    movingVisit.appointmentTimeMillis <= i && (movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000)) > i
                );

                const isFreeInterval = isAvailableTime(movingVisitMillis, movingVisitEndTime, timetableItem, appointments, reservedTimes, checkOnMovingVisit)

                if (isFreeInterval) {
                    shouldMove = true
                }
            })
        }

        if (shouldMove) {
            dispatch(calendarActions.makeVisualMove({ ...movingVisit, staffId: prevVisitStaffId }, movingVisitStaffId, movingVisitMillis))
            let coStaffs = movingVisit.coStaffs;
            if (coStaffs && prevVisitStaffId !== movingVisitStaffId) {
                const updatedCoStaff = appointments.find(item => (item.staff && item.staff.staffId) === prevVisitStaffId)
                const oldStaffIndex = coStaffs.findIndex(item => item.staffId === movingVisitStaffId)

                if (oldStaffIndex !== -1) {
                    coStaffs.splice(oldStaffIndex, 1)
                    coStaffs.push(updatedCoStaff.staff)
                }

            }
            dispatch(calendarActions.updateAppointment(
                movingVisit.appointmentId,
                JSON.stringify({
                    appointmentTimeMillis: movingVisitMillis,
                    staffId: movingVisitStaffId,
                    coStaffs,
                    adminApproved: true,
                    approved: true,
                    moved: true,
                    adminMoved: true,
                    movedOnline: false
                }),
                false,
                false,
                false
                )
            );
        }
        dispatch(
            appointmentActions.togglePayload({
                isMoveVisit: false,
                isStartMovingVisit: false,
                movingVisit: null,
                movingVisitDuration: 0,
                movingVisitMillis: 0,
                movingVisitStaffId: null,
                prevVisitStaffId: null
            })
        );
    }
}
