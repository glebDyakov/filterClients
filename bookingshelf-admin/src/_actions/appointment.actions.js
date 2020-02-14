import { appointmentConstants } from '../_constants';
import moment from "moment";
import {calendarActions} from "./calendar.actions";

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
        const { appointments, timetable, movingVisit, movingVisitDuration, movingVisitStaffId, movingVisitMillis, prevVisitStaffId } = data

        let shouldMove = false

        const startDay = moment(movingVisitMillis, 'x').format('D')
        const endDay = moment((movingVisitMillis + (movingVisitDuration * 1000)), 'x').format('D')
        if (startDay !== endDay) {
            shouldMove = false
        }

        if (!shouldMove) {
            const movingVisitEndTime = movingVisitMillis + (movingVisitDuration * 1000);

            const timetableItems = timetable
                .filter(item => item.staffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === item.staffId)))


            const intervals = []

            for (let i = movingVisitMillis; i < movingVisitEndTime; i += 15 * 60000) {
                intervals.push(i)
            }

            timetableItems.forEach(timetableItem => {
                const newStaff = appointments && appointments.find(item => (item.staff && item.staff.staffId) === timetableItem.staffId)

                timetableItem.timetables.forEach(time => {

                    const isFreeInterval = intervals.every(i => {
                        const isIncludedInTimetable = time.startTimeMillis <= i && time.endTimeMillis > i;
                        const isOnAnotherVisit = newStaff && newStaff.appointments
                            .some(appointment => appointment.appointmentTimeMillis <= i && (appointment.appointmentTimeMillis + (appointment.duration * 1000)) > i)

                        const isOnMovingVisit = (
                            (prevVisitStaffId === movingVisitStaffId || (movingVisit.coStaffs && movingVisit.coStaffs.some(coStaff => coStaff.staffId === newStaff.staff.staffId))) &&
                            movingVisit.appointmentTimeMillis <= i && (movingVisit.appointmentTimeMillis + (movingVisitDuration * 1000)) > i
                        );
                        return ((isIncludedInTimetable && !isOnAnotherVisit) || isOnMovingVisit)
                    });
                    if (isFreeInterval) {
                        shouldMove = true
                    }
                })
            })
        }

        if (shouldMove) {
            dispatch(calendarActions.makeVisualMove({ ...movingVisit, staffId: prevVisitStaffId }, movingVisitStaffId, movingVisitMillis))
            let coStaffs;
            if (movingVisit.coStaffs && prevVisitStaffId !== movingVisitStaffId) {
                const updatedCoStaff = appointments.find(item => (item.staff && item.staff.staffId) === prevVisitStaffId)
                const oldStaffIndex = movingVisit.coStaffs.findIndex(item => item.staffId === movingVisitStaffId)

                let coStaffsWithRemoved = JSON.parse(JSON.stringify(movingVisit.coStaffs))
                coStaffs = [
                    ...coStaffsWithRemoved,
                ]
                if (oldStaffIndex !== -1) {
                    coStaffsWithRemoved.splice(oldStaffIndex, 1)
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
